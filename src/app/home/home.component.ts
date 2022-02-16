import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  //Declare required variables
  lat: any
  long: any
  dist: any;
  stationID: string = ""
  errors: string = ""
  private stationsJSON: any
  private zipJSON: any;
  startDate: any[] = [];
  endDate: any[] = [];
  currDate: string = ""

   constructor(private router: Router) {
    this.lat = null
    this.long = null
    this.dist = null;
    this.stationID = ""
    this.errors = ""
    this.stationsJSON = []
    this.zipJSON = []

    // Get current date
    // XXX: timezones?
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0')
    let mm = String(today.getMonth() + 1).padStart(2, '0')
    let yyyy = today.getFullYear()
    this.currDate = this.currDate.concat(String(yyyy), String(mm), String(dd))
  }

  async ngOnInit() {
    // FIXME: TESTING
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
      console.log("Zip code data loaded")
      console.log(this.zipJSON)
    }

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
    }
    else if(this.stationsJSON.length > 0) {
      console.log("Up-to-date station list fetched successfully")
    }
    console.log(this.stationsJSON)
  }

  acceptVariables(val: any, dist: any, SD: any, ED: any){
    this.lat = null
    this.long = null
    this.dist = null
    this.stationID = ""
    this.startDate = []
    this.endDate = []
    this.errors = ""

    sessionStorage.setItem('zipcode', val);
    sessionStorage.setItem('distance', dist);
    sessionStorage.setItem('start-date', SD);
    sessionStorage.setItem('end-date', ED);


    // Splitting start and end date values into separate elements
    let tempStart = SD.split("-");
    let tempEnd = ED.split("-");

    // Creating temp objs
    let tempHead: any[] = ['year', 'month', 'day']
    let sObj: any[] = []
    let eObj: any[] = []

    // Assigning month, day, year into to objects with respective value meanings
    for(let i = 0; i < 3; i++){
     sObj[tempHead[i]] = tempStart[i];
     eObj[tempHead[i]] = tempEnd[i];
    }

    // Pushing into start and end date objects
    this.startDate.push(sObj);
    this.endDate.push(eObj);
    this.dist = dist;
    this.getCoords(val);
  }

  // Validate input and check if Zip or Station ID
  getCoords(val: any) {
    let num: string = val;
    this.lat = null;
    this.long = null;
    this.stationID = "";
    this.errors = "";

    // Format dates for easier comparison
    let startStr:string = "";
    startStr = startStr.concat(String(this.startDate[0].year) + String(this.startDate[0].month) + String(this.startDate[0].day));
    let endStr:string = "";
    endStr = endStr.concat(String(this.endDate[0].year) + String(this.endDate[0].month) + String(this.endDate[0].day));

    //// Input Validation

    // Zip/S-ID should be a number
    if(isNaN(+num)) {
      console.log("Input is NaN")
      this.errors = this.errors + "Please enter a valid Zip Code or 11-digit Station ID."
    }
    // Start date should be prior to end date
    else if(startStr>endStr) {
      console.log("Start Date cannot be later than End Date")
      this.errors = this.errors + "Start Date cannot be later than End Date."
    }
    // Start and end dates should be numbers
    else if(isNaN(Number(startStr)) || isNaN(Number(endStr))) {
      console.log("Date(s) missing")
      this.errors = this.errors + "Please enter a valid date range."
    }
    // Distance should be selected if searching by zip code
    else if(num.length == 5 && !this.dist) {
      console.log("Distance missing for zip")
      this.errors = this.errors + "Please select a distance when using a zip code."
    }
    // Dates shouldn't be in the future
    else if(startStr>this.currDate || endStr>this.currDate) {
      console.log("Future dates selected")
      this.errors = this.errors + "Please enter a valid date range."
    }

    else {
      console.log("Input: " + num);
      // Evaluate input as zip code
      if(num.length == 5) {
        this.getCoordsZip(num)
      }
      // Evaluate input as station id
      else if(num.length == 11) {
        this.getStationID(num, startStr, endStr)
      }
      // Incorrect input length
      else {
        console.log("Invalid format for zip code or station ID")
        this.errors = this.errors + "Invalid format for a zip code or station ID. Please enter a 5 or 11 digit number."
      }
      // Pass data to stations page if no errors
      if(this.errors == "") {
        this.router.navigate(["/stations"], {state: { dataLat: this.lat, dataLong: this.long, dataDist: this.dist, dataStationID: this.stationID, dataStartDate: this.startDate, dataEndDate: this.endDate, dataStationsJSON: this.stationsJSON}})
      }
    }
  }

  // Get coordinates for center of input zip code
  getCoordsZip(zip: any){
    var num: string = zip
    this.zipJSON.forEach((zipcode: any) => {
      if(zipcode.ZIPCODE == num){
        this.lat = zipcode.LAT
        this.long = zipcode.LONG
      }
    })

    // Check if input zip code found
    if(this.lat == null) {
      console.log("Invalid zip code")
      this.errors = this.errors + "Zip code entered does not exist. Please enter a valid zip code."
    }
    else {
      console.log("Lat: " + this.lat + " Lon: " + this.long)
    }
  }

  // Check if input station ID valid
  getStationID(val: any, startStr: string, endStr: string){
    var num: string = val
    this.stationsJSON.every((station: any) => {
      if(station.USAF.concat(station.WBAN) == num){     // Each Station ID consists of a USAF + WBAN code
        if((station.BEGIN<=startStr) && (station.END>=endStr)) {
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

    if (this.stationID == "" && this.errors == "") {    // Error if no matching station found for given ID
      console.log("Station ID not found")
      this.errors = this.errors + "Station ID not found. Please enter a zip code or a different station ID."
    }
    else {
      console.log("Station ID: " + this.stationID + " Lat: " + this.lat + " Lon: " + this.long)
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
    let zipcode = document.getElementById("zipcode") as HTMLInputElement
    let val = zipcode.value.toString()
    if(val.length == 0) {
      zipcode.style.backgroundColor="white"
    }
    else if(isNaN(+val) || (val.length != 5 && val.length != 11)) {
      zipcode.style.backgroundColor="#ff9191"
    }
    else if(val.length == 5 || val.length == 11){
      zipcode.style.backgroundColor="#82ed80"
    }
    else {
      zipcode.style.backgroundColor="white"
    }
  }

  getFormData(str:any) {
    if(sessionStorage.getItem(str) != null) {
      let a:any = document.getElementById(str) as HTMLInputElement
      a.value = sessionStorage.getItem(str);
    }
  }

}
