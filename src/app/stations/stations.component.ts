import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { Router } from "@angular/router";

export interface stationsElements {
  Station_ID: string;
  Station_Name: string;
  distance: number;
}

@Component({
  selector: "app-stations",
  templateUrl: "./stations.component.html",
  styleUrls: ["./stations.component.css"],
})
export class StationsComponent implements OnInit {
  lat: any = null;
  long: any = null;
  dist: any = null;
  stationID: any = "";
  state: any = "";
  startDate: any = null;
  startStr = "";
  endDate: any = null;
  endStr = "";
  endDateObj: any = null;
  stationsJSON: any = null;
  multiInputs: string[] = [];
  lastDbUpdateDate: any = null;
  zipsList: string[] = [];
  stationsArray: any[] = [];
  selectedArray: any[] = [];
  sendingArray: any[] = [];
  numYears: any = null;
  headers: any;
  error = "";

  @ViewChildren("stationsTable") stationsTable: QueryList<any>;

  constructor(private router: Router) {
    // Get data from home page
    const state: any = this.router.getCurrentNavigation()!.extras.state;
    if (state) {
      this.stationsJSON = state.stationsJSON;
      if (state.err) {
        this.error = state.err;
        const context = this;
        setTimeout(function () {
          context.error = "";
        }, 5000);
      }
    }
  }

  async ngOnInit() {
    if (!this.getSessionStorageItem("numYears")) {
      sessionStorage.removeItem("selectedArrayStations");
      sessionStorage.removeItem("sendingArrayStations");
      const error = "Please submit input using Station Select button.";
      this.router.navigate(["/home"], { state: { err: error } });
    }

    // Fetch newest station list data from NOAA
    if (!this.stationsJSON) {
      this.stationsJSON = JSON.parse(
        await this.CSVtoJSON(
          "https://www1.ncdc.noaa.gov/pub/data/noaa/isd-history.csv"
        )
      );
      // If fetch failed, fall back to older list
      // XXX: may need to set flag to correctly filter by date if requesting data newer than included file
      if (this.stationsJSON.length == 0) {
        console.log(
          "Unable to fetch current station list. Using older data set."
        );
        await fetch("assets/isd-history.json")
          .then((res) => res.json())
          .then((data) => {
            this.stationsJSON = data;
          });
        console.log(this.stationsJSON);
        console.log("Cached stations list loaded");
      } else if (this.stationsJSON.length > 0) {
        console.log(this.stationsJSON);
        console.log("Current stations data loaded");
      }
    }

    if (this.getSessionStorageItem("lat")) {
      this.lat = this.getSessionStorageItem("lat");
    }
    if (this.getSessionStorageItem("long")) {
      this.long = this.getSessionStorageItem("long");
    }
    if (this.getSessionStorageItem("distance")) {
      this.dist = this.getSessionStorageItem("distance");
    }
    if (this.getSessionStorageItem("stationID")) {
      this.stationID = this.getSessionStorageItem("stationID");
    }
    if (this.getSessionStorageItem("state")) {
      this.state = this.getSessionStorageItem("state");
    }
    if (this.getSessionStorageItem("startDate")) {
      this.startDate = JSON.parse(
        this.getSessionStorageItem("startDate") as string
      );
    }
    if (this.getSessionStorageItem("endDate")) {
      this.endDate = JSON.parse(
        this.getSessionStorageItem("endDate") as string
      );
      this.endDateObj = new Date(+this.endDate.year, this.endDate.month, this.endDate.day);
      this.endDateObj.setMonth(this.endDateObj.getMonth()-1);
    }
    if (this.getSessionStorageItem("numYears")) {
      this.numYears = this.getSessionStorageItem("numYears");
    } else {
      this.goBack();
    }
    if (this.getSessionStorageItem("startStr")) {
      this.startStr = this.getSessionStorageItem("startStr") as string;
    }
    if (this.getSessionStorageItem("endStr")) {
      this.endStr = this.getSessionStorageItem("endStr") as string;
    }
    if (this.getSessionStorageItem("multiInputs")) {
      this.multiInputs = JSON.parse(
        this.getSessionStorageItem("multiInputs") as string
      );
    }
    if (this.getSessionStorageItem("lastDbUpdate")) {
      const tmp = this.getSessionStorageItem("lastDbUpdate") as string;
      const tmpArr = tmp.split('-');
      this.lastDbUpdateDate = new Date(+tmpArr[0], +tmpArr[1]-1, +tmpArr[2]);
    }
    else {
      this.lastDbUpdateDate = new Date();
    }

    await this.getStations();

    // Load previous input data if exists
    try {
      const tmp = sessionStorage.getItem("selectedArrayStations");
      if (tmp) {
        this.selectedArray = JSON.parse(tmp);
        for (const i of this.selectedArray) {
          this.checkUncheckDuplicates(i.ID.toString(), true);
        }
      }
    } catch (e) {console.log(e);
    }
  }

  ngAfterViewInit() {
    this.stationsTable.changes.subscribe(() => {
      // Load previous input data if exists
      try {
        const tmp = sessionStorage.getItem("selectedArrayStations");
        if (tmp) {
          this.selectedArray = JSON.parse(tmp);
          for (const i of this.selectedArray) {
            this.checkUncheckDuplicates(i.ID.toString(), true);
          }
        }
      } catch (e) {console.log(e);
      }
    });
  }

  getStations() {
    if (this.multiInputs.length > 0) {
      // Multi-Input Search
      let allStationIDs = true;
      for (const i in this.multiInputs) {
        if (this.multiInputs[i].length == 3) {
          // Lat, Lon, Zip or City
          this.getStationsZip(this.multiInputs[i][0], this.multiInputs[i][1]);
          this.zipsList.push(this.multiInputs[i][2]);
          allStationIDs = false;
        } else if (this.multiInputs[i].length == 2) {
          //  State
          if (this.isStateFormat(this.multiInputs[i][0])) {
            this.zipsList.push(this.multiInputs[i][1]);
            this.getStationsState(this.multiInputs[i][0]);
            allStationIDs = false;
          }
        } else if (this.multiInputs[i].length == 1) {
          if (
            this.isSID(this.multiInputs[i][0]) &&
            !this.sendingArray.includes(this.multiInputs[i][0])
          ) {
            this.sendingArray.push(this.multiInputs[i]);
          }
        }
      }
      if (allStationIDs) {
        sessionStorage.setItem(
          "sendingArrayStations",
          JSON.stringify(this.sendingArray)
        );
        this.router.navigate(["/data"], {
          state: { stationsJSON: this.stationsJSON },
        });
      }
    } else {
      // Single Input Search
      if (this.stationID) {
        // Go directly to data if provided station id
        this.sendingArray.push(this.stationID);
        console.log("Station:");
        console.log(this.sendingArray);
        sessionStorage.setItem(
          "sendingArrayStations",
          JSON.stringify(this.sendingArray)
        );
        this.router.navigate(["/data"], {
          state: { stationsJSON: this.stationsJSON },
        });
      } else if (this.lat && this.long) {
        this.getStationsZip(this.lat, this.long); // Get local stations list
      } else if (this.state) {
        this.getStationsState(this.state);
      } else {
        console.log("Required data missing.");
      }
    }
    console.log(this.stationsArray);
  }

  getStationsZip(lat: string, long: string) {
    // Check each station for distance, date range
    const tmpStationsArr: any[] = [];
    this.stationsJSON.forEach((station: any) => {
      // Get station distance from zip code coordinates
      const distance = this.Haversine(lat, long, station.LAT, station.LON);

      // Store valid stations and data required for display
      if (
        distance < this.dist &&
        this.startStr > station.BEGIN &&
        this.endStr < station.END
      ) {
        const tmp: any[] = [];
        this.headers = ["", "Station ID", "Station Name", "Distance(Miles)"];
        const headers: any[] = ["NAME", "ID", "OTHER"];
        let id = "";
        id = id.concat(String(station.USAF), String(station.WBAN));
        tmp[headers[0]] = station["STATION NAME"];
        tmp[headers[1]] = id;
        tmp[headers[2]] = distance.toFixed(2);
        tmpStationsArr.push(tmp);
      }
    });
    tmpStationsArr.sort(function (a, b) {
      return a.OTHER - b.OTHER;
    });
    console.log("Matching Stations:");
    console.log(tmpStationsArr);
    if (tmpStationsArr.length == 0) {
      if(this.lastDbUpdateDate.getDate()-7 < this.endDateObj.getDate()) {
        const error = "No matching stations found. Try decreasing End Date or increasing Distance.";
        this.router.navigate(["/home"], { state: { err: error } });
      }
      else {
        const error = "No matching stations found. Try increasing distance.";
        this.router.navigate(["/home"], { state: { err: error } });
      }
    } else {
      this.stationsArray.push(tmpStationsArr);
    }
  }

  getStationsState(str: string) {
    const tmpStationsArr: any[] = [];
    this.stationsJSON.forEach((station: any) => {
      // Store valid stations and data required for display
      if (
        station.CTRY == "US" &&
        str == station.STATE &&
        this.startStr > station.BEGIN &&
        this.endStr < station.END
      ) {
        const tmp: any[] = [];
        this.headers = ["", "Station ID", "Station Name", "Coordinates"];
        const headers: any[] = ["NAME", "ID", "OTHER"];
        let id = "";
        id = id.concat(String(station.USAF), String(station.WBAN));
        let coords = "";
        coords = coords.concat(String(station.LAT), ", ", String(station.LON));
        tmp[headers[0]] = station["STATION NAME"];
        tmp[headers[1]] = id;
        tmp[headers[2]] = coords;
        tmpStationsArr.push(tmp);
      }
    });
    tmpStationsArr.sort((a, b) => a.NAME.localeCompare(b.NAME));
    console.log("Matching Stations:");
    console.log(tmpStationsArr);
    if (tmpStationsArr.length == 0) {
      if(this.lastDbUpdateDate.getDate()-7 < this.endDateObj.getDate()) {
        const error = "No matching stations found. Try decreasing End Date or increasing Distance.";
        this.router.navigate(["/home"], { state: { err: error } });
      }
      else {
        const error = "No matching stations found. Try another search method.";
        this.router.navigate(["/home"], { state: { err: error } });
      }

    } else {
      this.stationsArray.push(tmpStationsArr);
    }
  }

  //// Selection Functions
  getSelect(ev: any, val: string) {
    this.clearData();
    const obj = {
      ID: val,
    };

    if (ev.target.checked) {
      this.checkUncheckDuplicates(obj.ID.toString(), true);
      this.selectedArray.push(obj);
    } else {
      this.checkUncheckDuplicates(obj.ID.toString(), false);
      const el = this.selectedArray.find((itm) => itm.ID === val);
      if (el) this.selectedArray.splice(this.selectedArray.indexOf(el), 1);
    }
    sessionStorage.setItem(
      "selectedArrayStations",
      JSON.stringify(this.selectedArray)
    );
  }

  checkUncheckDuplicates(id: string, val: boolean) {
    const dupStations = <HTMLInputElement[]>(
      (<any>document.getElementsByName(id))
    );
    for (let i = 0; i < dupStations.length; i++) {
      dupStations[i].checked = val;
    }
  }

  sendToData() {
    if (this.selectedArray.length == 0) {
      this.error = "Please select one or more stations.";
      const context = this;
      setTimeout(function () {
        context.error = "";
      }, 5000);
    } else {
      for (const index in this.selectedArray) {
        if (!this.sendingArray.includes(this.selectedArray[index].ID))
          this.sendingArray.push(this.selectedArray[index].ID);
      }
      console.log("Selected Stations:");
      console.log(this.sendingArray);
      sessionStorage.setItem(
        "sendingArrayStations",
        JSON.stringify(this.sendingArray)
      );
      this.router.navigate(["/data"], {
        state: { stationsJSON: this.stationsJSON },
      });
    }
  }

  goBack() {
    // Clear Stations sessionstorage items
    sessionStorage.removeItem("selectedArrayStations");
    sessionStorage.removeItem("sendingArrayStations");
    this.router.navigate(["/home"]);
  }

  clearData() {
    sessionStorage.removeItem("sendingArrayStations");
    sessionStorage.removeItem("stationDataObjs");
    sessionStorage.removeItem("masterSelected");
    sessionStorage.removeItem("masterCheckedList");
    sessionStorage.removeItem("sendingDataList");
  }

  //// Utility Functions
  /// Haversine formula to calculate approximate distances between coordinate pairs
  Haversine(lat1: any, lon1: any, lat2: any, lon2: any) {
    let distance = -1;

    const R = 3958.8; // average radius of Earth in miles
    const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    distance = R * c;

    return distance;
  }

  isSID(str: string) {
    if (
      str.length == 11 &&
      !isNaN(+str.substring(1)) &&
      (str[0] == "A" || str[0] == "a" || !isNaN(+str[0]))
    ) {
      return true;
    }
    return false;
  }

  isStateFormat(str: string) {
    return /^[A-Z]+$/i.test(str);
  }

  getSessionStorageItem(str: string) {
    try {
      const tmp = sessionStorage.getItem(str);
      if (tmp) {
        return tmp;
      }
    } catch (e) {console.log(e);
    }
    return null;
  }

  async CSVtoJSON(val: string): Promise<string> {
    const path: string = val;
    const jsonFile: any = [];
    await fetch(path)
      .then((res) => res.text())
      .then((data) => {
        let csv = data;
        //Remove "" that are automatically added
        csv = csv.replace(/['"]+/g, "");

        const lines = csv.split("\n");
        const headers = lines[0].split(",");
        for (let i = 1; i < lines.length; i++) {
          const obj: any = {};
          const currLine = lines[i].split(",");
          for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currLine[j];
          }
          jsonFile.push(obj);
        }
      });
    return JSON.stringify(jsonFile);
  }
}
