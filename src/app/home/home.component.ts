import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  //Declare required variables

  //variables to be transfered to other components
  lat: any
  long: any
  dist: any;
  stationID: string = ""
  state: string = ""
  startDate: any[] = [];
  startStr:string = "";
  endDate: any[] = [];
  endStr:string = "";
  numYears: number = 0;
  matchList: string[] = [];
  distDropdown: boolean = false;

  //other variables
  errors: string = ""
  sError: string = ""
  eError: string = ""
  zError: string = ""
  dError: string = ""
  stationsError: string = ""


  isError: boolean = false;
  dataLoaded: boolean = false;
  private stationsJSON: any
  private zipJSON: any;
  private statesJSON: any;
  private citiesJSON: any;
  currDate: string = ""

   constructor(private router: Router) {
    this.lat = null
    this.long = null
    this.dist = null;
    this.stationID = ""
    this.state = ""
    this.errors = ""
    this.stationsJSON = []
    this.zipJSON = []
    this.statesJSON = []
    this.citiesJSON = []
    this.distDropdown = false;

    // Get current date
    // XXX: timezones?
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0')
    let yyyy = today.getFullYear()
    this.currDate = this.currDate.concat(String(yyyy), String(mm), String(dd))

    // Print error if returning from empty stations dataset
    let state:any = null;
    try {
      state = this.router.getCurrentNavigation()!.extras.state
      if(state) {
        if(state.err){
          this.stationsError = state.err
          let context = this;
          setTimeout(function(){
            context.stationsError = ""
          }, 5000)
        }
      }
    } catch (e){}
  }

  async ngOnInit() {
    // Load previous input if applicable
    this.getFormData("zipcode")
    this.getFormData("distance")
    this.getFormData("start-date")
    this.getFormData("end-date")
    this.checkInput()

    // Set max dates for date selection boxes
    let today = new Date().toISOString().split('T')[0];
    document.getElementsByName("start-date")[0].setAttribute('max', today);
    document.getElementsByName("end-date")[0].setAttribute('max', today);

    // Preload Zip Code and Station data into memory

    // Load zip code JSON
    await fetch("assets/ZipCodes.json")
    .then((res) => res.json())
    .then((data) =>{
        this.zipJSON = data
    })
    if(this.zipJSON.length > 0) {
      console.log(this.zipJSON)
      console.log("Zip code data loaded")
    }

    // Load States JSON
    await fetch("assets/States.json")
    .then((res) => res.json())
    .then((data) =>{
        this.statesJSON = data
    })
    if(this.statesJSON.length > 0) {
      console.log(this.statesJSON)
      console.log("States data loaded")
    }

    // Load Cities JSON
    await fetch("assets/Cities.json")
    .then((res) => res.json())
    .then((data) =>{
        this.citiesJSON = data
    })
    if(this.citiesJSON.length > 0) {
      console.log(this.citiesJSON)
      console.log("Cities data loaded")
    }
    this.dataLoaded = true;


    // Fetch newest station list data from NOAA
    this.stationsJSON = JSON.parse(await this.CSVtoJSON("https://www1.ncdc.noaa.gov/pub/data/noaa/isd-history.csv"))

    // If fetch failed, fall back to older list
    // XXX: may need to set flag to correctly filter by date if requesting data newer than included file
    if(this.stationsJSON.length == 0) {
      console.log("Unable to fetch current station list. Using older data set.")
      await fetch("assets/isd-history.json")
      .then((res) => res.json())
      .then((data) =>{
          this.stationsJSON = data
      })
      console.log(this.stationsJSON)
      console.log("Cached stations list loaded")
    }
    else if(this.stationsJSON.length > 0) {
      console.log(this.stationsJSON)
      console.log("Current stations data loaded")
    }

  }

  //accepts the variables being entered. converts date into a usable array for month, day and year. Also passes zip code or station id on to next function for processing. Also checks for input errors
  acceptVariables(){
    let tmp:any = document.getElementById("zipcode") as HTMLInputElement;
    let val:string = tmp.value.toString();
    tmp = document.getElementById("distance") as HTMLInputElement;
    let dist:any = tmp.value;
    tmp = document.getElementById("start-date") as HTMLInputElement;
    let SD:any = tmp.value;
    tmp = document.getElementById("end-date") as HTMLInputElement;
    let ED:any = tmp.value;

    this.lat = null
    this.long = null
    this.dist = dist
    this.stationID = ""
    this.startDate = []
    this.endDate = []
    this.errors = ""
    this.distDropdown = false;

    sessionStorage.setItem('zipcode', val);
    sessionStorage.setItem('distance', dist);
    sessionStorage.setItem('start-date', SD);
    sessionStorage.setItem('end-date', ED);

    console.log("Input: " + val);
    console.log("Distance: " + dist);
    console.log("Start Date: " + SD);
    console.log("End Date: " + ED);

    if(val == ""){
      this.checkZErrors();
    }
    if(dist == " "){
      this.checkDErrors();
    }
    if(SD == ""){
      this.checkSErrors();
    }
    if(ED == ""){
      this.checkEErrors();
    }
    else{

      //splitting start and end date values into separate elements
      let tempStart = SD.split("-");
      let tempEnd = ED.split("-")

      //creating temp objs
      let tempHead: any[] = ['year', 'month', 'day']
      let sObj: any[] = []
      let eObj: any[] = []

      //assigning month, day, year into to objects with respective value meanings
      for(let i = 0; i < 3; i++){
        sObj[tempHead[i]] = tempStart[i];
        eObj[tempHead[i]] = tempEnd[i];
      }

      //pushing into start and end date objects
      this.startDate.push(sObj);
      this.endDate.push(eObj);

      this.getYears();
      //passing station ID or zip code
      this.getCoords(val);
    }

  }

  // Validate input and check if Zip or Station ID
  getCoords(input: any) {
    let val: string = input.trim();
    this.lat = null;
    this.long = null;
    this.stationID = "";
    this.errors = "";

    // Format dates for easier comparison
    this.startStr = this.startStr.concat(String(this.startDate[0].year) + String(this.startDate[0].month) + String(this.startDate[0].day));
    this.endStr = this.endStr.concat(String(this.endDate[0].year) + String(this.endDate[0].month) + String(this.endDate[0].day));

    //// Input Validation

    // Zip/S-ID should be a number
    if(isNaN(+val) && !this.isCity(val) && val[0]!='A') {
      console.log("Input format unknown")
      this.errors = this.errors + "Please enter a valid State, Zip Code, or 11-digit Station ID."
    }
    // Start date should be prior to end date
    else if(this.startStr>this.endStr) {
      console.log("Start Date cannot be later than End Date")
      this.errors = this.errors + "Start Date cannot be later than End Date."
    }
    // Start and end dates should be numbers
    else if(isNaN(Number(this.startStr)) || isNaN(Number(this.endStr))) {
      console.log("Date(s) missing")
      this.errors = this.errors + "Please enter a valid date range."
    }
    // Distance should be selected if searching by zip code
    else if(val.length == 5 && !this.dist) {
      console.log("Distance missing for zip")
      this.errors = this.errors + "Please select a distance when using a zip code."
    }
    // Dates shouldn't be in the future
    else if(this.startStr>this.currDate || this.endStr>this.currDate) {
      console.log("Future dates selected")
      this.errors = this.errors + "Please enter a valid date range."
    }

    // Valid Inputs
    else {
      // Evaluate input as zip code
      if(val.length == 5 && !isNaN(+val)) {
        this.getCoordsZip(val)
      }
      // Evaluate input as station id
      else if(val.length == 11 && !isNaN(+val)) {
        this.getStationID(val)
      }
      // Parse as City or State
      else if(this.isState(val)){
        this.getState(val)
      }
      else if(this.isCity(val)) {
        this.getCity(val)
      }
      // Incorrect input length
      else {
        console.log("Invalid format for zip code or station ID")
        this.errors = this.errors + "Invalid format for a zip code or station ID. Please enter a 5 or 11 digit number."
        let context = this;
        setTimeout(function(){
          context.errors = ""
        }, 8000)
      }

      if(!this.dataLoaded) {
        this.errors = "Data has not finished loading. Please try again momentarily."
        let context = this;
        setTimeout(function(){
          context.errors = ""
        }, 3000)
      }
      // Pass data to stations page if no errors
      if(this.errors == "") {
        this.router.navigate(["/stations"], {state: { dataLat: this.lat, dataLong: this.long, dataDist: this.dist, dataStationID: this.stationID, dataState: this.state, dataStartDate: this.startDate, dataEndDate: this.endDate, dataStationsJSON: this.stationsJSON, years: this.numYears, dataStartStr: this.startStr, dataEndStr: this.endStr}})
      }
    }

  }

  // Get coordinates for center of input zip code
  getCoordsZip(zip: any){
    var num: string = zip
    this.zipJSON.every((zipcode: any) => {
      if(zipcode.ZIPCODE == num){
        this.lat = zipcode.LAT
        this.long = zipcode.LONG
        return false
      }
      return true
    })
    // Check if input zip code found
    if(this.lat == null) {
      console.log("Invalid zip code")
      this.errors = this.errors + "Zip code not found. Please try again."
      let context = this;
      setTimeout(function(){
        context.errors = ""
      }, 8000)
    }
    else {
      console.log("Lat: " + this.lat + " Lon: " + this.long)
    }
  }

  // Check if input station ID valid
  getStationID(val: any){
    var num: string = val
    this.stationsJSON.every((station: any) => {
      if(station.USAF.concat(station.WBAN) == num){     // Each Station ID consists of a USAF + WBAN code
        if((station.BEGIN<=this.startStr) && (station.END>=this.endStr)) {
          this.stationID = station.USAF.concat(station.WBAN)
          // NOTE: below lat/long can be removed if not searching for stations near selected station
          this.lat = station.LAT
          this.long = station.LON
        }
        else {    // Error if station exists but invalid date range
          console.log("Station doesn't report data within the selected period")
          let tmpBegin = station.BEGIN.substr(0,4) + "-" + station.BEGIN.substr(4,2) + "-" + station.BEGIN.substr(6,2)
          let tmpEnd = station.END.substr(0,4) + "-" + station.END.substr(4,2) + "-" + station.END.substr(6,2)
          this.errors = this.errors + "Station reporting period (" + tmpBegin + ", " + tmpEnd + ") is not compatible with selected dates."
        }
        return false
      }
      return true
    })
    //Check if input station ID found in stations list
    if (this.stationID == "") {
      console.log("Station not found")
      this.errors = this.errors + "Station not found. Please try again."
      let context = this;
      setTimeout(function(){
        context.errors = ""
      }, 8000)
    }
    else {
      console.log("Station ID: " + this.stationID + " Lat: " + this.lat + " Lon: " + this.long)
    }
  }

  getState(str:string) {
    this.statesJSON.every((state: any) => {
      if(state.CODE.toUpperCase() == str.toUpperCase() || state.STATE.toUpperCase() == str.toUpperCase()){
        this.state = state.CODE;
        return false
      }
      return true
    })
    if(this.state=="") {
      console.log("State not found")
      this.errors = this.errors + "Input not found. Please try again."
      let context = this;
      setTimeout(function(){
        context.errors = ""
      }, 3000)
    }
    else {
      console.log("State: " + this.state)
    }
  }

  getCity(str:string) {
    this.citiesJSON.every((city: any) => {
      let citystate:string = city.CITY.toUpperCase() + ", " + city.STATE.toUpperCase()
      if(str.toUpperCase() == citystate){
        this.lat = city.LAT
        this.long = city.LONG
        return false
      }
      return true
    })
    if(this.lat==null) {
      console.log("City not found")
      this.errors = this.errors + "City not found. Please try again or select one from the dropdown."
      let context = this;
      setTimeout(function(){
        context.errors = ""
      }, 3000)
    }
    else {
      console.log(console.log("Lat: " + this.lat + " Lon: " + this.long))
    }
  }



  //// Utility Functions

  // Converts updated isd-history.csv to JSON for processing
  // Call using var = JSON.parse(await this.CSVtoJSON(filepath))
  // NOTE: DO NOT use as-is for final data output
  //      Needs to be reviewed for data containing , and ""
  async CSVtoJSON(val: string):Promise<string> {
    let path: string = val
    let jsonFile: any = []
    await fetch(path)
    .then((res) => res.text())
    .then((data) =>{
      let csv = data
      //Remove "" that are automatically added
      csv = csv.replace(/['"]+/g, '')

      let lines = csv.split("\n")
      let headers = lines[0].split(",")
      for(let i=1; i<lines.length; i++) {
        let obj: any = {}
        let currLine = lines[i].split(",")
        for(let j=0; j<headers.length; j++) {
          obj[headers[j]] = currLine[j];
        }
        jsonFile.push(obj)
      }
    });
    return JSON.stringify(jsonFile)
  }

  // Change input text box background color depending on validity of input
  checkInput() {
    this.zError = "*Invalid Input"

    let context = this;
    let zipcode = document.getElementById("zipcode") as HTMLInputElement
    let val = zipcode.value.toString().trim()
    let dist = document.getElementById("distance") as HTMLInputElement
    this.distDropdown = true;

    if(val.length >= 4) {
      this.matchList = []
      this.listCities(val)
    }

    if(val.length == 0) {
      zipcode.style.backgroundColor="white"
      dist.style.backgroundColor="#A9A9A9"
      dist.disabled = true;
    }
    else if(this.isState(val)) {  // City or State
      zipcode.style.backgroundColor="#82ed80" // Green
      dist.style.backgroundColor="#A9A9A9"
      dist.disabled = true;
    }
    else if(this.isCity(val)) {  // City or State
      zipcode.style.backgroundColor="#82ed80" // Green
      dist.style.backgroundColor="white"
      dist.disabled = false;
    }
    else if(!isNaN(+val) && (val.length == 5)){ // Zip Code
      zipcode.style.backgroundColor="#82ed80" // Green
      dist.style.backgroundColor="white"
      dist.disabled = false;
    }
    else if(val.length == 11 && !isNaN(+(val.substring(1))) && (val[0] == 'A' || val[0] == 'a' || !isNaN(+val[0]))) {  // Station ID
      zipcode.style.backgroundColor="#82ed80" // Green
      dist.style.backgroundColor="#A9A9A9"
      dist.disabled = true;
    }
    else {
      zipcode.style.backgroundColor="#ff9191" // Red
      dist.style.backgroundColor="#A9A9A9"
      dist.disabled = true;
    }
  }

  listCities(val:string) {
    this.citiesJSON.every((city: any) => {
      let citystate:string = city.CITY + ", " + city.STATE
      if(citystate.toUpperCase().includes(val.toUpperCase())) {
        this.matchList.push(citystate)
      }
      return true
    })
  }

  setCity(val:string) {
    let zipcode = document.getElementById("zipcode") as HTMLInputElement
    zipcode.value = val;
    this.checkInput();
  }

  isCity(str:string){
    return /^[A-Z\s,]+$/i.test(str);
  }
  isState(str:string){
    return /^[A-Z]+$/i.test(str);
  }

  getYears(){
    if(this.startDate[0].year != this.endDate[0].year){
      this.numYears = this.endDate[0].year - this.startDate[0].year + 1;
    }
    else{
      this.numYears = 1;
    }
    console.log("Number of Years: " + this.numYears)
  }

  //error checks for empty field for zip, distance, and dates
  checkZErrors(){
    this.isError = true;
    this.zError = "*This is a required input"

    let context = this;
    context.isError = true;
    setTimeout(function(){
      context.isError = false;
      context.zError = ""
    }, 8000)

  }
  checkSErrors(){
    this.isError = true;
    this.sError = "*This is a required input"

    let context = this;
    context.isError = true;
    setTimeout(function(){
      context.isError = false;
      context.sError = ""
    }, 8000)
  }
  checkEErrors(){
    this.isError = true;
    this.eError = "*This is a required input"

    let context = this;
    context.isError = true;
    setTimeout(function(){
      context.isError = false;
      context.eError = ""
    }, 8000)
  }
  checkDErrors(){
    this.isError = true;
    this.dError = "*This is a required input"

    let context = this;
    context.isError = true;
    setTimeout(function(){
      context.isError = false;
      context.dError = ""
    }, 8000)
  }

  getFormData(str:any) {
    if(sessionStorage.getItem(str) != null) {
      let a:any = document.getElementById(str) as HTMLInputElement
      a.value = sessionStorage.getItem(str);
    }
  }

}
