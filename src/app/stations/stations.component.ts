import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export interface stationsElements {
  Station_ID: string;
  Station_Name: string;
  distance: number;
}


@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})

export class StationsComponent implements OnInit {
  lat:any;
  long:any;
  dist:any;
  stationID:any;
  state:any;
  startDate:any;
  startStr:string;
  endDate:any;
  endStr:string;
  stationsJSON:any;
  multiInputs: string[] = [];
  zipsList: string[] = [];
  stationsArray: any[] = [];
  selectedArray: any[] = [];
  sendingArray: any[] = [];
  numYears: any;
  headers: any;

  constructor(private router: Router) {
    // Get data from home page
      let state:any = this.router.getCurrentNavigation()!.extras.state;
      if(state) {
        this.lat = state.dataLat;
        this.long = state.dataLong;
        this.dist = state.dataDist;
        this.stationID = state.dataStationID;
        this.state = state.dataState;
        this.startDate = state.dataStartDate;
        this.endDate = state.dataEndDate;
        this.stationsJSON = state.dataStationsJSON;
        this.numYears = state.years;
        this.startStr = state.dataStartStr;
        this.endStr = state.dataEndStr;
        this.multiInputs = state.multiInputs;
      }
      else {
        this.lat = null;
        this.long = null;
        this.dist = null;
        this.stationID = "";
        this.state = "";
        this.startDate = null;
        this.endDate = null;
        this.stationsJSON = null;
        this.numYears = null;
        this.startStr = "";
        this.endStr = "";
        this.multiInputs = [];
      }
  }

  async ngOnInit() {
    this.getStations();
  }

  getStations() {
    if(this.multiInputs.length>0) {   // Multi-Input Search
      let allStationIDs: boolean = true;
      for(let i in this.multiInputs) {
        if(this.multiInputs[i].length == 3){   // Lat, Lon, Zip
          this.getStationsZip(this.multiInputs[i][0], this.multiInputs[i][1]);
          this.zipsList.push(this.multiInputs[i][2])
          allStationIDs = false;
        }
        else if(this.multiInputs[i].length == 1) {
          if(this.isSID(this.multiInputs[i][0]) && !this.sendingArray.includes(this.multiInputs[i][0])) {
            this.sendingArray.push(this.multiInputs[i])
          }
          else if(this.isStateFormat(this.multiInputs[i][0])) {
            this.zipsList.push(this.multiInputs[i][0])
            this.getStationsState(this.multiInputs[i][0])
            allStationIDs = false;
          }
        }
      }
      if(allStationIDs) {
        this.router.navigate(["/data"], {state: { stationID: this.sendingArray, startDate: this.startDate, endDate: this.endDate, years: this.numYears, startStr: this.startStr, endStr: this.endStr}})
      }
    }
    else {    // Single Input Search
      if(this.stationID != ""){   // Go directly to data if provided station id
        this.sendingArray.push(this.stationID)
        console.log("Station:");
        console.log(this.sendingArray);
        this.router.navigate(["/data"], {state: { stationID: this.sendingArray, startDate: this.startDate, endDate: this.endDate, years: this.numYears, startStr: this.startStr, endStr: this.endStr}})
      }
      else if(this.lat != null && this.long != null) {
        this.getStationsZip(this.lat, this.long);  // Get local stations list
      }
      else if(this.state != "") {
        this.getStationsState(this.state);
      }
      else {
        console.log("Required data missing.")
      }
    }
    console.log(this.stationsArray);

  }

  getStationsZip(lat:string, long:string) {
    // Check each station for distance, date range
    let tmpStationsArr: any[] = []
    this.stationsJSON.forEach((station: any) => {
      // Get station distance from zip code coordinates
      let distance = this.Haversine(lat, long, station.LAT, station.LON)

      // Store valid stations and data required for display
      if(distance<this.dist && this.startStr>station.BEGIN && this.endStr<station.END) {
        let tmp: any[] = []
        this.headers = ['', 'Station ID', 'Station Name', 'Distance(Miles)']
        let headers: any[] = ['NAME', 'ID', 'OTHER']
        let id:string = ""
        id = id.concat(String(station.USAF), String(station.WBAN))
        tmp[headers[0]] = station["STATION NAME"]
        tmp[headers[1]] = id
        tmp[headers[2]] = distance.toFixed(2)
        tmpStationsArr.push(tmp)
      }
    });
    tmpStationsArr.sort(function(a,b) {
      return a.OTHER - b.OTHER
    });
    console.log("Matching Stations:");
    console.log(tmpStationsArr)
    if(tmpStationsArr.length == 0) {
      let error:string = "No matching stations found. Try increasing distance."
      this.router.navigate(["/home"], {state: {err: error}})
    }
    else {
      this.stationsArray.push(tmpStationsArr)
    }
  }

  getStationsState(str:string) {
    let tmpStationsArr: any[] = []
    this.stationsJSON.forEach((station: any) => {
      // Store valid stations and data required for display
      if(station.CTRY=="US" && str==station.STATE && this.startStr>station.BEGIN && this.endStr<station.END) {
        let tmp: any[] = []
        this.headers = ['', 'Station ID', 'Station Name', 'Coordinates']
        let headers: any[] = ['NAME', 'ID', 'OTHER']
        let id:string = ""
        id = id.concat(String(station.USAF), String(station.WBAN))
        let coords:string = ""
        coords = coords.concat(String(station.LAT), ", ", String(station.LON))
        tmp[headers[0]] = station["STATION NAME"]
        tmp[headers[1]] = id
        tmp[headers[2]] = coords
        tmpStationsArr.push(tmp)
      }
    });
    tmpStationsArr.sort((a, b) => a.NAME.localeCompare(b.NAME))
    console.log("Matching Stations:");
    console.log(tmpStationsArr)
    if(tmpStationsArr.length == 0) {
      let error:string = "No matching stations found. Try another search method"
      this.router.navigate(["/home"], {state: {err: error}})
    }
    else {
      this.stationsArray.push(tmpStationsArr)
    }
  }

  //// Selection Functions
  getSelect(ev: any, val: String){
      let obj = {
        ID: val,
      };

      if(ev.target.checked){
        this.checkUncheckAll(obj.ID.toString(), true);
        this.selectedArray.push(obj);
      }
      else{
        this.checkUncheckAll(obj.ID.toString(), false);
        let el = this.selectedArray.find((itm) => itm.ID === val);
        if (el) this.selectedArray.splice(this.selectedArray.indexOf(el), 1);
      }
    }

    checkUncheckAll(id:string, val:boolean) {
      var dupStations = <HTMLInputElement[]><any>document.getElementsByName(id);
      for(var i = 0; i < dupStations.length; i++) {
        dupStations[i].checked = val;
      }
    }

    sendToData(){
      for(let index in this.selectedArray){
        if(!this.sendingArray.includes(this.selectedArray[index].ID))
        this.sendingArray.push(this.selectedArray[index].ID)
      }
      console.log("Selected Stations:");
      console.log(this.sendingArray);
      this.router.navigate(["/data"], {state: { stationID: this.sendingArray, startDate: this.startDate, endDate: this.endDate, years: this.numYears, startStr: this.startStr, endStr: this.endStr}})
    }

    goBack(){
      this.router.navigate(["/home"])
    }



  //// Utility Functions
  /// Haversine formula to calculate approximate distances between coordinate pairs
  Haversine(lat1:any, lon1:any, lat2:any, lon2:any) {
    let distance = -1;

    const R = 3958.8; // average radius of Earth in miles
    const φ1 = lat1 * Math.PI/180; // φ, λ in radians
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    distance = R * c;

    return distance
  }

  isSID(str:string) {
    if(str.length == 11 && !isNaN(+(str.substring(1))) && (str[0] == 'A' || str[0] == 'a' || !isNaN(+str[0]))) {
      return true
    }
    return false
  }

  isStateFormat(str:string) {
    return /^[A-Z]+$/i.test(str);
  }
}
