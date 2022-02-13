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

  stationsArray: any[] = [];

  constructor(private routerSelect: Router) {
    // Get data from home page
      let state:any = this.routerSelect.getCurrentNavigation()!.extras.state;
      if(state) {
        this.lat = state.dataLat;
        this.long = state.dataLong;
        this.dist = state.dataDist;
        this.stationID = state.dataStationID;
        this.startDate = state.dataStartDate;
        this.endDate = state.dataEndDate;
      }
      else {
        this.lat = null
        this.long = null
        this.dist = null
        this.stationID = null
        this.startDate = null
        this.endDate = null
      }
  }

  async ngOnInit() {
    // Get list of stations reporting LCD for endDate year
    // TODO: Try-Catch for empty state
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
    if(this.stationID != null){
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

  }

  getDistance() {

  }


}
