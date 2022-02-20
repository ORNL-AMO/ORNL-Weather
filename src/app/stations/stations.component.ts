import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  startDate:any;
  endDate:any;
  stationsJSON:any;
  stationsArray: any[] = [];
  selectedArray: any[] = [];
  sendingArray: any[] = [];
  numYears: any;
  headers = ['', 'Station ID', 'Station Name', 'Distance(Miles)']

  constructor(private router: Router) {
    // Get data from home page
      let state:any = this.router.getCurrentNavigation()!.extras.state;
      if(state) {
        this.lat = state.dataLat;
        this.long = state.dataLong;
        this.dist = state.dataDist;
        this.stationID = state.dataStationID;
        this.startDate = state.dataStartDate;
        this.endDate = state.dataEndDate;
        this.stationsJSON = state.dataStationsJSON;
        this.numYears = state.years;
      }
      else {
        this.lat = null;
        this.long = null;
        this.dist = null;
        this.stationID = "";
        this.startDate = null;
        this.endDate = null;
        this.stationsJSON = null;
        this.numYears = null;
      }
  }

  async ngOnInit() {
    this.getStations();
  }

  getStations() {
    if(this.stationID != ""){   // Go directly to data if provided station id
      this.sendingArray.push(this.stationID)
      console.log(this.sendingArray);
      this.router.navigate(["/data"], {state: { stationID: this.sendingArray }})
    }
    else if(this.lat != null && this.long != null) {
      this.getStationsZip();  // Get local stations list
    }
    else {
      console.log("Required data missing.")
    }
  }

  getStationsZip() {
    // Check each station for distance, date range
    this.stationsJSON.forEach((station: any) => {
      // Get station distance from zip code coordinates
      let distance = this.Haversine(this.lat, this.long, station.LAT, station.LON)

      // Format dates for comparison
      let startStr:string = "";
      startStr = startStr.concat(String(this.startDate[0].year) + String(this.startDate[0].month) + String(this.startDate[0].day));
      let endStr:string = "";
      endStr = endStr.concat(String(this.endDate[0].year) + String(this.endDate[0].month) + String(this.endDate[0].day));

      // Store valid stations and data required for display
      if(distance<this.dist && startStr>station.BEGIN && endStr<station.END) {
        let tmp: any[] = []
        let headers: any[] = ['NAME', 'ID', 'DIST']
        let id:string = ""
        id = id.concat(String(station.USAF), String(station.WBAN))
        tmp[headers[0]] = station["STATION NAME"]
        tmp[headers[1]] = id
        tmp[headers[2]] = distance.toFixed(2)
        this.stationsArray.push(tmp)
      }
    });
    this.stationsArray.sort(this.sortJSON("DIST"))
    console.log(this.stationsArray)
    console.log(this.sendingArray)
  }

  //// Selection Functions
  getSelect(ev: any, val: String){
      let obj = {
        ID: val,
      };

      if(ev.target.checked){
        this.selectedArray.push(obj);
        console.log(this.selectedArray);
      }
      else{
        let el = this.selectedArray.find((itm) => itm.ID === val);
        if (el) this.selectedArray.splice(this.selectedArray.indexOf(el), 1);
        console.log(this.selectedArray);
      }

    }

    selectAll(ev: any){
      if(ev.target.checked){
        for(let index in this.stationsArray){
          this.getSelect(ev, index)
        }
      }
      else{
        for(let index in this.stationsArray){
          this.getSelect(ev, index)
        }
      }
    }

    sendToData(){
      console.log(this.selectedArray);
      for(let index in this.selectedArray){
        this.sendingArray.push(this.selectedArray[index].ID)
      }
      console.log(this.sendingArray);
      this.router.navigate(["/display"], {state: { stationID: this.sendingArray, startDate: this.startDate, endDate: this.endDate, years: this.numYears }})
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

  sortJSON(key:string) {
    return function(a:any, b:any) {
        if (a[key] > b[key]) {
            return 1;
        } else if (a[key] < b[key]) {
            return -1;
        }
        return 0;
    }
}
}
