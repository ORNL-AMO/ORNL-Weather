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
  zip: any;
  stationID: string = ""
  startDate: any[] = [];
  endDate: any[] = [];
  numYears: number = 0;
  
  //other variables
  errors: string = ""
  sError: string = ""
  eError: string = ""
  zError: string = ""
  dError: string = ""
  

  isError: boolean = false;
  private stationsJSON: any
  private zipJSON: any;
  
  

   constructor(private router: Router) {
    this.lat = null
    this.long = null
    this.stationID = ""
    this.errors = ""
    this.stationsJSON = []
    this.zipJSON = []
    
  }

  async ngOnInit() {
    //Preload Zip Code and Station data into memory

    //Load zip code JSON
    await fetch("assets/ZipCodes.json")
    .then((res) => res.json())
    .then((data) =>{
        this.zipJSON = data
    })
    if(this.zipJSON.length > 0) {
      console.log("Zip code data loaded")
      console.log(this.zipJSON)
    }

    //Fetch newest station list data from NOAA
    this.stationsJSON = JSON.parse(await this.CSVtoJSON("https://www1.ncdc.noaa.gov/pub/data/noaa/isd-history.csv"))

    //If fetch failed, fall back to older list
    //Note: may need to set flag to correctly filter by date if requesting data newer than included file
    if(this.stationsJSON.length == 0) {
      console.log("Unable to fetch current station list. Using older data set.")
      await fetch("assets/isd-history.json")
      .then((res) => res.json())
      .then((data) =>{
          this.stationsJSON = data
      })
    }
    else if(this.stationsJSON.length > 0) {
      console.log("Up-to-date station list fetched successfully")
    }
    console.log(this.stationsJSON)
  }

  //accepts the variables being entered. converts date into a usable array for month, day and year. Also passes zip code or station id on to next function for processing. Also checks for input errors
  acceptVariables(val: any, dist: any, SD: any, ED: any){
    console.log(val);
    console.log(dist);
    console.log(SD);
    console.log(ED);
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
    console.log(this.numYears);
    //passing station ID or zip code 
    this.getCoords(val);
    }
    
  }
  
  //Validate input and check if Zip or Station ID
  getCoords(val: any) {
    var num: string = val
    this.lat = null
    this.long = null
    this.stationID = ""
    this.errors = ""
    getStations()
    //Ensure user input is a 5 or 11 digit number
    if(isNaN(+num)) {
      console.log("Input is NaN")
      this.errors = this.errors + "Please enter a number."
      let context = this;
      setTimeout(function(){
        context.errors = ""
      }, 3000)
    }
    else {
      console.log("Input: " + num);
      if(num.length == 5) {
        this.getCoordsZip(num)
      }
      else if(num.length == 11) {
        this.getStationID(num)
      }
      else {
        console.log("Invalid format for zip code or station ID")
        this.errors = this.errors + "Invalid format for a zip code or station ID. Please enter a 5 or 11 digit number."
        let context = this;
        setTimeout(function(){
          context.errors = ""
        }, 3000)
      }
    }
    
  }

  //Get coordinates for center of input zip code
  getCoordsZip(zip: any){
    var num: string = zip
    this.zipJSON.forEach((zipcode: any) => {
      if(zipcode.ZIPCODE == num){
        this.lat = zipcode.LAT
        this.long = zipcode.LONG
      }
    })

    //Check if input zip code found
    if(this.lat == null) {
      console.log("Invalid zip code")
      this.errors = this.errors + "Zip code entered does not exist. Please enter a valid zip code."
      let context = this;
      setTimeout(function(){
        context.errors = ""
      }, 3000)
    }
    else {
      console.log("Lat: " + this.lat + " Lon: " + this.long)
    }
  }

  //Check if input station ID valid
  getStationID(val: any){
    var num: string = val
    this.stationsJSON.forEach((station: any) => {
      if(station.USAF.concat(station.WBAN) == num){           //Each Station ID consists of a USAF + WBAN code
        this.stationID = station.USAF.concat(station.WBAN)
        this.lat = station.LAT
        this.long = station.LON
      }
    })

    //Check if input station ID found in stations list
    if (this.stationID == "") {
      console.log("Station not found")
      this.errors = this.errors + "Station not found. Please enter a zip code or valid station ID."
      let context = this;
      setTimeout(function(){
        context.errors = ""
      }, 3000)
    }
    else {
      console.log("Station found")
      console.log("Station ID: " + this.stationID + " Lat: " + this.lat + " Lon: " + this.long)
    }
  }



  //Utility Functions

  //Converts updated isd-history.csv to JSON for processing
  //Call using var = JSON.parse(await this.CSVtoJSON(filepath))
  //Note: DO NOT use as-is for final data output
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

  //Change input text box background color depending on validity of input
  checkInput() {
    let zipcode = document.getElementById("zipcode") as HTMLInputElement
    let val = zipcode.value.toString()
    if(val.length == 0) {
      zipcode.style.backgroundColor="initial"
    }
    else if(isNaN(+val) || (val.length != 5 && val.length != 11)) {
      zipcode.style.backgroundColor="#ff9191"
    }
    else if(val.length == 5 || val.length == 11){
      zipcode.style.backgroundColor="#82ed80"
    }
    else {
      zipcode.style.backgroundColor="initial"
    }
  }

  getYears(){
    if(this.startDate[0].year != this.endDate[0].year){
      this.numYears = this.endDate[0].year - this.startDate[0].year + 1;
    }
    else{
      this.numYears = 1;
    }
  }

  //error checks for empty field for zip, distance, and dates
  checkZErrors(){
    this.isError = true;
    this.zError = "This is a required input"

    let context = this;
    context.isError = true;
    setTimeout(function(){
      context.isError = false;
      context.zError = ""
    }, 3000)
  }
  checkSErrors(){
    this.isError = true;
    this.sError = "This is a required input"

    let context = this;
    context.isError = true;
    setTimeout(function(){
      context.isError = false;
      context.sError = ""
    }, 3000)
  }
  checkEErrors(){
    this.isError = true;
    this.eError = "This is a required input"

    let context = this;
    context.isError = true;
    setTimeout(function(){
      context.isError = false;
      context.eError = ""
    }, 3000)
  }
  checkDErrors(){
    this.isError = true;
    this.dError = "This is a required input"

    let context = this;
    context.isError = true;
    setTimeout(function(){
      context.isError = false;
      context.dError = ""
    }, 3000)
  }

}

function getStations(){}
