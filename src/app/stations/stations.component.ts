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
  lat:any = null;
  long:any = null;
  dist:any = null;
  stationID:any = "";
  state:any = "";
  startDate:any = null;
  startStr:string = "";
  endDate:any = null;
  endStr:string = "";
  stationsJSON:any = null;
  multiInputs: string[] = [];
  zipsList: string[] = [];
  stationsArray: any[] = [];
  selectedArray: any[] = [];
  sendingArray: any[] = [];
  numYears: any = null;
  headers: any;

  constructor(private router: Router) {
    // Get data from home page
      let state:any = this.router.getCurrentNavigation()!.extras.state;
      if(state) {
        this.stationsJSON = state.stationsJSON;
        // this.multiInputs = state.multiInputs;
      }
  }

  async ngOnInit() {
    if(this.getSessionStorageItem('lat')) {this.lat = this.getSessionStorageItem('lat')}
    if(this.getSessionStorageItem("long")) {this.long = this.getSessionStorageItem("long")}
    if(this.getSessionStorageItem("distance")) {this.dist = this.getSessionStorageItem("distance")}
    if(this.getSessionStorageItem("stationID")) {this.stationID = this.getSessionStorageItem("stationID")}
    if(this.getSessionStorageItem("state")) {this.state = this.getSessionStorageItem("state")}
    if(this.getSessionStorageItem("startDate")) {this.startDate = JSON.parse(this.getSessionStorageItem("startDate") as string)}
    if(this.getSessionStorageItem("endDate")) {this.endDate = JSON.parse(this.getSessionStorageItem("endDate") as string)}
    if(this.getSessionStorageItem("numYears")) {this.numYears = this.getSessionStorageItem("numYears")}
    if(this.getSessionStorageItem("startStr")) {this.startStr = this.getSessionStorageItem("startStr") as string}
    if(this.getSessionStorageItem("endStr")) {this.endStr = this.getSessionStorageItem("endStr") as string}
    if(this.getSessionStorageItem("multiInputs")) {this.multiInputs = JSON.parse(this.getSessionStorageItem("multiInputs") as string)}

    // this.multiInputs = this.getSSArrayItem("multiInputs")
    await this.getStations();
    // Load previous input data if exists
    try {
      let tmp = sessionStorage.getItem("selectedArrayStations");
      if(tmp) {
        this.selectedArray = JSON.parse(tmp)
        for(let i of this.selectedArray) {
          await this.checkUncheckDuplicates(i.ID.toString(), true)
        }
      }
    } catch (e) {}
  }

  getStations() {
    if(this.multiInputs.length>0) {   // Multi-Input Search
      let allStationIDs: boolean = true;
      for(let i in this.multiInputs) {
        if(this.multiInputs[i].length == 3){   // Lat, Lon, Zip or City
          this.getStationsZip(this.multiInputs[i][0], this.multiInputs[i][1]);
          this.zipsList.push(this.multiInputs[i][2])
          allStationIDs = false;
        }
        else if(this.multiInputs[i].length == 2) {  //  State
          if(this.isStateFormat(this.multiInputs[i][0])) {
            this.zipsList.push(this.multiInputs[i][1])
            this.getStationsState(this.multiInputs[i][0])
            allStationIDs = false;
          }
        }
        else if(this.multiInputs[i].length == 1) {
          if(this.isSID(this.multiInputs[i][0]) && !this.sendingArray.includes(this.multiInputs[i][0])) {
            this.sendingArray.push(this.multiInputs[i])
          }

        }
      }
      if(allStationIDs) {
        sessionStorage.setItem("sendingArrayStations", JSON.stringify(this.sendingArray))
        this.router.navigate(["/data"], {state: { stationsJSON: this.stationsJSON}})
      }
    }
    else {    // Single Input Search
      if(this.stationID){   // Go directly to data if provided station id
        this.sendingArray.push(this.stationID)
        console.log("Station:");
        console.log(this.sendingArray);
        sessionStorage.setItem("sendingArrayStations", JSON.stringify(this.sendingArray))
        this.router.navigate(["/data"], {state: { stationsJSON: this.stationsJSON}})
      }
      else if(this.lat && this.long) {
        this.getStationsZip(this.lat, this.long);  // Get local stations list
      }
      else if(this.state) {
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
        this.checkUncheckDuplicates(obj.ID.toString(), true);
        this.selectedArray.push(obj);
      }
      else{
        this.checkUncheckDuplicates(obj.ID.toString(), false);
        let el = this.selectedArray.find((itm) => itm.ID === val);
        if (el) this.selectedArray.splice(this.selectedArray.indexOf(el), 1);
      }
      sessionStorage.setItem('selectedArrayStations', JSON.stringify(this.selectedArray));
    }

    checkUncheckDuplicates(id:string, val:boolean) {
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
      sessionStorage.setItem("sendingArrayStations", JSON.stringify(this.sendingArray))
      this.router.navigate(["/data"], {state: { stationsJSON: this.stationsJSON}})
    }

    goBack(){
      // Clear Stations sessionstorage items
      sessionStorage.removeItem("selectedArrayStations")
      sessionStorage.removeItem("sendingArrayStations")

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

  getSessionStorageItem(str:string) {
    try {
      let tmp = sessionStorage.getItem(str);
      if(tmp) {
        return tmp
      }
    } catch (e) {}
    return null
  }
}
