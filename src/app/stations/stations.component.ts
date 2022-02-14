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
  LCDStationsList:any;
  stationsJSON:any;

  stationsArray: any[] = [];

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
        this.stationsJSON = state.dataStationsJSON
      }
      else {
        // NOTE: See if would rather redirect away if no data from home or initialize with no data
        this.router.navigate(["/home"])
      }
  }

  async ngOnInit() {
    // Get list of stations reporting LCD for endDate year
    let fetchUrl:any = "https://www.ncei.noaa.gov/data/local-climatological-data/access/" + this.endDate[0].year + "/";
    console.log(fetchUrl);
    await fetch(fetchUrl)
    .then((res) => res.text())
    .then((data) =>{
      this.LCDStationsList = data;
    })
    console.log(this.LCDStationsList)
    this.getStations();
  }

  getStations() {
    if(this.stationID != ""){
      if(this.LCDStationsList.includes(this.stationID)) {
        // TODO: Route to data
      }
    }
    else if(this.lat != null && this.long != null) {
      this.getStationsZip();
    }
    else {
      // FIXME: Add error message, potentially route back to home
    }
  }

  getStationsZip() {
    this.stationsJSON.forEach((station: any) => {
      if(this.LCDStationsList.includes(this.stationID)) {
        let distance = this.Haversine(this.lat, this.long, station.LAT, station.LON)
        if(distance < this.dist) {
          station["dist"] = distance
          this.stationsArray.push(station)
        }
      }
    });
    console.log(this.stationsArray)
  }

  //Utility Functions
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
}
