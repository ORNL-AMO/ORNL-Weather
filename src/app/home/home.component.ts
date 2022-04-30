import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  //Declare required variables

  //variables to be transfered to other components
  lat: any;
  long: any;
  dist: any;
  stationID = "";
  state = "";
  startDate: any;
  startStr = "";
  endDate: any;
  endStr = "";
  numYears = 0;
  matchList: string[] = [];
  distDropdown = false;
  multiInputs: any[] = [];

  //other variables
  errors = "";
  sError = "";
  eError = "";
  zError = "";
  dError = "";

  hasError = false;
  dispError = false;
  dataLoaded = false;
  stationsErr = false;
  private stationsJSON: any;
  private zipJSON: any;
  private statesJSON: any;
  private citiesJSON: any;
  currDate: string = "";
  lastDbUpdateDate: any;

  constructor(private router: Router) {
    this.lat = null;
    this.long = null;
    this.dist = null;
    this.stationID = "";
    this.state = "";
    this.errors = "";
    this.stationsJSON = [];
    this.zipJSON = [];
    this.statesJSON = [];
    this.citiesJSON = [];
    this.distDropdown = false;
    this.stationsErr = false;

    // Get current date
    // XXX: timezones?
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    this.currDate = this.currDate.concat(String(yyyy), String(mm), String(dd));

    // Print error if returning from empty stations dataset
    let state: any = null;
    try {
      state = this.router.getCurrentNavigation()!.extras.state;
      if (state) {
        if (state.err) {
          this.stationsErr = true;
          this.errors = state.err;
          // if(this.errors.contains("Try"))
          const context = this;
          setTimeout(function () {
            context.errors = "";
          }, 5000);
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

  async ngOnInit() {
    // Load previous input if applicable
    this.getFormData("zipcode");
    this.getFormData("distance");
    this.getFormData("start-date");
    this.getFormData("end-date");
    this.checkInput();

    // Set max dates for date selection boxes
    let tmpDate: any;
    let maxDate: string = "";
    try {
      await fetch("https://www.ncei.noaa.gov/data/local-climatological-data/")
      .then((res) => res.text())
      .then((data) => {
        data = data.slice(data.indexOf("access"));
        data = data.substring(0, data.indexOf(":"));
        const dateRegex = new RegExp(`[0-9]{4}-[0-9]{2}-[0-9]{2}`);
        tmpDate = data.match(dateRegex);
        sessionStorage.setItem("lastDbUpdate", tmpDate[0])
        tmpDate = tmpDate[0].split('-');
        tmpDate = new Date(tmpDate[0], tmpDate[1]-1, tmpDate[2]);
        console.log(tmpDate.toISOString());
      });
      this.lastDbUpdateDate = tmpDate.toLocaleString('en-us', {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      maxDate = tmpDate.toISOString().split("T")[0];
    } catch (error) {
      this.lastDbUpdateDate = "error";
      maxDate = new Date().toISOString().split("T")[0];
    }
    document.getElementsByName("start-date")[0].setAttribute("max", maxDate);
    document.getElementsByName("end-date")[0].setAttribute("max", maxDate);

    // Preload Zip Code and Station data into memory

    // Load States JSON
    await fetch("assets/States.json")
      .then((res) => res.json())
      .then((data) => {
        this.statesJSON = data;
      });
    if (this.statesJSON.length > 0) {
      console.log(this.statesJSON);
      console.log("States data loaded");
    }

    // Load zip code JSON
    await fetch("assets/ZipCodes.json")
      .then((res) => res.json())
      .then((data) => {
        this.zipJSON = data;
      });
    if (this.zipJSON.length > 0) {
      console.log(this.zipJSON);
      console.log("Zip code data loaded");
    }

    // Load Cities JSON
    await fetch("assets/Cities.json")
      .then((res) => res.json())
      .then((data) => {
        this.citiesJSON = data;
      });
    if (this.citiesJSON.length > 0) {
      console.log(this.citiesJSON);
      console.log("Cities data loaded");
    }
    this.dataLoaded = true;

    // Fetch newest station list data from NOAA
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

  //accepts the variables being entered. converts date into a usable array for month, day and year. Also passes zip code or station id on to next function for processing. Also checks for input errors
  acceptVariables() {
    let tmp: any = document.getElementById("zipcode") as HTMLInputElement;
    const val: string = tmp.value.toString();
    tmp = document.getElementById("distance") as HTMLInputElement;
    const dist: any = tmp.value;
    tmp = document.getElementById("start-date") as HTMLInputElement;
    const SD: any = tmp.value;
    tmp = document.getElementById("end-date") as HTMLInputElement;
    const ED: any = tmp.value;

    this.hasError = false;
    this.dispError = false;
    this.lat = null;
    this.long = null;
    this.dist = dist;
    this.stationID = "";
    this.startDate = [];
    this.endDate = [];
    this.errors = "";
    this.dError = "";
    this.zError = "";
    this.sError = "";
    this.eError = "";
    this.distDropdown = false;
    this.startStr = "";
    this.endStr = "";

    sessionStorage.setItem("zipcode", val);
    sessionStorage.setItem("distance", dist);
    sessionStorage.setItem("start-date", SD);
    sessionStorage.setItem("end-date", ED);

    console.log("Input: " + val);
    console.log("Distance: " + dist);
    console.log("Start Date: " + SD);
    console.log("End Date: " + ED);

    if (val == "") {
      this.checkZErrors("*This is a required input");
      this.hasError = true;
    }
    if (SD == "") {
      this.checkSErrors("*This is a required input");
      this.hasError = true;
    }
    if (ED == "") {
      this.checkEErrors("*This is a required input");
      this.hasError = true;
    }
    if (!this.hasError) {
      //splitting start and end date values into separate elements
      const tempStart = SD.split("-");
      const tempEnd = ED.split("-");

      //creating temp objs
      const tempHead: any[] = ["year", "month", "day"];
      const sObj: any[] = [];
      const eObj: any[] = [];

      //assigning month, day, year into to objects with respective value meanings
      for (let i = 0; i < 3; i++) {
        sObj[tempHead[i]] = tempStart[i];
        eObj[tempHead[i]] = tempEnd[i];
      }
      this.startDate = Object.assign({}, sObj);
      this.endDate = Object.assign({}, eObj);
      sessionStorage.setItem("startDate", JSON.stringify(this.startDate));
      sessionStorage.setItem("endDate", JSON.stringify(this.endDate));

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
    this.startStr = this.startStr.concat(
      String(this.startDate.year) +
        String(this.startDate.month) +
        String(this.startDate.day)
    );
    this.endStr = this.endStr.concat(
      String(this.endDate.year) +
        String(this.endDate.month) +
        String(this.endDate.day)
    );

    if (!this.dataLoaded) {
      this.hasError = true;
      this.errors =
        "Data has not finished loading. Please try again momentarily.";
      const context = this;
      setTimeout(function () {
        context.errors = "";
      }, 8000);
    } else {
      //// Input Validation

      // Check for input formatting or missing distance value errors
      if (val.includes(";")) {
        // Multi-Input
        val = val
          .replace(/([\s]+)/gm, " ")
          .replace(/([\s]*[;]+[\s]*)/gm, ";")
          .replace(/([;]+$)|(^[;]+)/gm, "");
        const valsArr = val.split(";");
        for (const val of valsArr) {
          this.checkForInputErrors(val);
          if (this.hasError) {
            break;
          }
        }
      } else {
        // Single Input
        this.checkForInputErrors(val);
      }
      // Check for Date-related Errors
      // Start date should be prior to end date
      if (this.startStr > this.endStr) {
        this.hasError = true;
        console.log("Start Date cannot be later than End Date");
        this.errors = "Start Date cannot be later than End Date.";
        const context = this;
        setTimeout(function () {
          context.errors = "";
        }, 8000);
      }
      // Start and end dates should be numbers
      else if (isNaN(Number(this.startStr)) || isNaN(Number(this.endStr))) {
        this.hasError = true;
        console.log("Date(s) missing");
        this.errors = "Please enter a valid date range.";
        const context = this;
        setTimeout(function () {
          context.errors = "";
        }, 8000);
      }
      // Dates shouldn't be in the future
      else if (this.startStr > this.currDate || this.endStr > this.currDate) {
        this.hasError = true;
        console.log("Future dates selected");
        this.errors = "Please enter a valid date range.";
        const context = this;
        setTimeout(function () {
          context.errors = "";
        }, 8000);
      }
      // Valid Inputs
      if (!this.hasError) {
        // Replace multiple ; or whitespace with single ;, trim leading/trailing ;
        if (val.includes(";")) {
          // Multiple Inputs
          val = val
            .replace(/([\s]+)/gm, " ")
            .replace(/([\s]*[;]+[\s]*)/gm, ";")
            .replace(/([;]+$)|(^[;]+)/gm, "");
        }

        if (val.includes(";")) {
          // Multiple Inputs
          const inputArr = val.split(";");
          for (const value of inputArr) {
            if (value) {
              this.multiInputs.push(this.multiInputSearch(value));
            }
          }
          console.log(this.multiInputs);
        } else {
          // Single Input
          // Evaluate input as zip code
          if (this.isZip(val)) {
            let out: string[] = [];
            out = this.getCoordsZip(val);
            this.lat = out[0];
            this.long = out[1];
          }
          // Evaluate input as station id
          else if (this.isSID(val)) {
            this.stationID = this.getStationID(val);
          }
          // Parse as City or State
          else if (this.isStateFormat(val)) {
            this.state = this.getState(val)[0];
          } else if (this.isCity(val)) {
            let out: string[] = [];
            out = this.getCity(val);
            this.lat = out[0];
            this.long = out[1];
          }
          // Final Catch for Invalid Input
          else {
            this.hasError = true;
            console.log("Invalid format for input");
            this.errors =
              "Invalid format for input. Please enter a 5-digit zipcode, an 11-digit station ID, a state, or a city.";
            const context = this;
            setTimeout(function () {
              context.errors = "";
            }, 8000);
          }
        }
        // Pass data to stations page if no errors
        if (!this.hasError) {
          if (this.lat) {
            sessionStorage.setItem("lat", this.lat);
          }
          if (this.long) {
            sessionStorage.setItem("long", this.long);
          }
          if (this.stationID) {
            sessionStorage.setItem("stationID", this.stationID);
          }
          if (this.state) {
            sessionStorage.setItem("state", this.state);
          }
          if (this.numYears) {
            sessionStorage.setItem("numYears", this.numYears.toString());
          }
          if (this.startStr) {
            sessionStorage.setItem("startStr", this.startStr);
          }
          if (this.endStr) {
            sessionStorage.setItem("endStr", this.endStr);
          }
          if (this.multiInputs) {
            sessionStorage.setItem(
              "multiInputs",
              JSON.stringify(this.multiInputs)
            );
          }

          this.router.navigate(["/stations"], {
            state: { stationsJSON: this.stationsJSON },
          });
        }
      }
    }
  }

  // Get coordinates for center of input zip code
  getCoordsZip(zip: any) {
    const num: string = zip;
    const outArr: string[] = [];
    this.zipJSON.every((zipcode: any) => {
      if (zipcode.ZIPCODE == num) {
        outArr.push(zipcode.LAT, zipcode.LONG, num);
        return false;
      }
      return true;
    });
    // Check if input zip code found
    if (outArr.length == 0) {
      console.log("Invalid zip code");
      this.checkZErrors(`Zip code ${zip} not found. Please try again.`);
    } else {
      // console.log("Lat: " + this.lat + " Lon: " + this.long)
    }
    return outArr;
  }

  // Check if input station ID valid
  getStationID(val: any) {
    const num: string = val;
    let out = "";
    this.stationsJSON.every((station: any) => {
      if (station.USAF.concat(station.WBAN) == num) {
        // Each Station ID consists of a USAF + WBAN code
        if (station.BEGIN <= this.startStr && station.END >= this.endStr) {
          out = station.USAF.concat(station.WBAN);
        } else {
          // Error if station exists but invalid date range
          console.log("Station doesn't report data within the selected period");
          const tmpBegin =
            station.BEGIN.substr(0, 4) +
            "-" +
            station.BEGIN.substr(4, 2) +
            "-" +
            station.BEGIN.substr(6, 2);
          const tmpEnd =
            station.END.substr(0, 4) +
            "-" +
            station.END.substr(4, 2) +
            "-" +
            station.END.substr(6, 2);
          this.checkZErrors(
            `Station ${val} reporting period (${tmpBegin}, ${tmpEnd}) is not compatible with selected dates.`
          );
        }
        return false;
      }
      return true;
    });
    //Check if input station ID found in stations list
    if (out == "") {
      console.log("Station not found");
      this.checkZErrors(`Station ${val} not found. Please try again.`);
      const context = this;
      setTimeout(function () {
        context.errors = "";
      }, 8000);
    } else {
      console.log(
        "Station ID: " +
          this.stationID +
          " Lat: " +
          this.lat +
          " Lon: " +
          this.long
      );
    }
    return out;
  }

  getState(str: string) {
    const outArr: string[] = [];
    this.statesJSON.every((state: any) => {
      if (
        state.CODE.toUpperCase() == str.toUpperCase() ||
        state.STATE.toUpperCase() == str.toUpperCase()
      ) {
        outArr.push(state.CODE, state.STATE);
        return false;
      }
      return true;
    });
    if (outArr.length == 0) {
      console.log("State not found");
      this.checkZErrors(`State ${str} not found. Please try again.`);
      const context = this;
      setTimeout(function () {
        context.errors = "";
      }, 3000);
    } else {
      // console.log("State: " + out)
    }
    return outArr;
  }

  getCity(str: string) {
    const outArr: string[] = [];
    str = str.replace(/[\s]+/gi, " ");
    str = str.replace(/(^[\s]*[,]+)|([,]+[\s]*)/g, ", ");
    str = str.trim();
    console.log(str.toUpperCase());
    this.citiesJSON.every((city: any) => {
      const citystate: string =
        city.CITY.toUpperCase() + ", " + city.STATE.toUpperCase();
      if (str.toUpperCase() == citystate) {
        outArr.push(city.LAT, city.LONG, str);
        return false;
      }
      return true;
    });
    if (outArr.length == 0) {
      console.log("City not found");
      this.checkZErrors(
        `City ${str} not found. Please try again or select one from the dropdown.`
      );
      const context = this;
      setTimeout(function () {
        context.errors = "";
      }, 3000);
    } else {
      // console.log(console.log("Lat: " + this.lat + " Lon: " + this.long))
    }
    return outArr;
  }

  // Used to find data for multiple zip codes or station IDs separated by semicolons
  multiInputSearch(input: string) {
    let out: string[] = [];
    if (this.isZip(input)) {
      out = this.getCoordsZip(input);
    } else if (this.isSID(input)) {
      out.push(this.getStationID(input));
    } else if (this.isState(input)) {
      out = this.getState(input);
    } else if (this.isCity(input)) {
      out = this.getCity(input);
    }
    return out;
  }

  //// Utility Functions

  // Converts updated isd-history.csv to JSON for processing
  // Call using var = JSON.parse(await this.CSVtoJSON(filepath))
  // NOTE: DO NOT use as-is for final data output
  //      Needs to be reviewed for data containing , and ""
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

  updateCachedInputs() {
    const zip = (
      document.getElementById("zipcode") as HTMLInputElement
    ).value.toString();
    const dist = (document.getElementById("distance") as HTMLInputElement)
      .value;
    const start = (document.getElementById("start-date") as HTMLInputElement)
      .value;
    const end = (document.getElementById("end-date") as HTMLInputElement).value;

    if(this.stationsErr == true || (sessionStorage.getItem("zipcode") != zip || sessionStorage.getItem("distance") != dist || sessionStorage.getItem("start-date") != start || sessionStorage.getItem("end-date") != end)) {
      sessionStorage.removeItem("numYears")
    }

    sessionStorage.setItem("zipcode", zip);
    sessionStorage.setItem("distance", dist);
    sessionStorage.setItem("start-date", start);
    sessionStorage.setItem("end-date", end);
  }

  // Change input text box background color depending on validity of input
  checkInput() {
    this.updateCachedInputs();
    const zipcode = document.getElementById("zipcode") as HTMLInputElement;
    let val = zipcode.value.toString().trim();

    const dist = document.getElementById("distance") as HTMLInputElement;
    this.distDropdown = true;

    // Get Matching Cities List
    if (val.length >= 4 && !val.includes(";")) {
      this.matchList = [];
      this.listCities(val);
    } else if (val.includes(";")) {
      const lastVal = val.slice(val.lastIndexOf(";") + 1).trim();
      this.matchList = [];
      if (lastVal.length >= 4) {
        this.listCities(lastVal);
      }
    }

    if (val.includes(";")) {
      // Multi-Input
      val = val
        .replace(/([\s]+)/gm, " ")
        .replace(/([\s]*[;]+[\s]*)/gm, ";")
        .replace(/([;]+$)|(^[;]+)/gm, "");
      const inputs = val.split(";");
      let needsDist = false;
      let valid = true;
      for (const value of inputs) {
        if (
          !this.isCity(value) &&
          !this.isStateFormat(value) &&
          !this.isZip(value) &&
          !this.isSID(value)
        ) {
          valid = false;
          break;
        } else if (this.isCity(value) || this.isZip(value)) {
          needsDist = true;
        }
      }
      if (valid) {
        zipcode.style.backgroundColor = "#82ed80"; // Green
        if (needsDist) {
          dist.style.backgroundColor = "white";
          dist.disabled = false;
          dist.style.cursor = "pointer";
        } else {
          dist.style.backgroundColor = "#A9A9A9";
          dist.disabled = true;
          dist.style.cursor = "not-allowed";
        }
      } else {
        zipcode.style.backgroundColor = "#ff9191"; // Red
        dist.style.backgroundColor = "#A9A9A9";
        dist.disabled = true;
        dist.style.cursor = "not-allowed";
      }
    } else {
      // Single Input
      if (val.length == 0) {
        zipcode.style.backgroundColor = "white";
        dist.style.backgroundColor = "#A9A9A9";
        dist.disabled = true;
        dist.style.cursor = "not-allowed";
      } else if (this.isStateFormat(val)) {
        // State
        zipcode.style.backgroundColor = "#82ed80"; // Green
        dist.style.backgroundColor = "#A9A9A9";
        dist.disabled = true;
        dist.style.cursor = "not-allowed";
      } else if (this.isCity(val)) {
        // City
        zipcode.style.backgroundColor = "#82ed80"; // Green
        dist.style.backgroundColor = "white";
        dist.disabled = false;
        dist.style.cursor = "pointer";
      } else if (this.isZip(val)) {
        // Zip Code
        zipcode.style.backgroundColor = "#82ed80"; // Green
        dist.style.backgroundColor = "white";
        dist.disabled = false;
        dist.style.cursor = "pointer";
      } else if (this.isSID(val)) {
        // Station ID
        zipcode.style.backgroundColor = "#82ed80"; // Green
        dist.style.backgroundColor = "#A9A9A9";
        dist.disabled = true;
        dist.style.cursor = "not-allowed";
      } else {
        zipcode.style.backgroundColor = "#ff9191"; // Red
        dist.style.backgroundColor = "#A9A9A9";
        dist.disabled = true;
        dist.style.cursor = "not-allowed";
      }
    }
  }

  listCities(val: string) {
    this.citiesJSON.every((city: any) => {
      const citystate: string = city.CITY + ", " + city.STATE;
      if (citystate.toUpperCase().includes(val.toUpperCase())) {
        this.matchList.push(citystate);
      }
      return true;
    });
  }

  setCity(val: string) {
    const zipcode = document.getElementById("zipcode") as HTMLInputElement;
    if (zipcode.value.includes(";")) {
      zipcode.value =
        zipcode.value.substring(0, zipcode.value.lastIndexOf(";") + 1) +
        val +
        ";";
      this.checkInput();
    } else {
      zipcode.value = val;
      this.checkInput();
    }
    this.matchList = [];
    zipcode.focus();
    zipcode.setSelectionRange(zipcode.value.length, zipcode.value.length);
  }

  isCity(str: string) {
    return /[A-Za-z\s]+[,][\s]*[A-Za-z]{2}/i.test(str);
  }
  isState(str: string) {
    let isState = false;
    this.statesJSON.every((state: any) => {
      if (
        state.CODE.toUpperCase() == str.toUpperCase() ||
        state.STATE.toUpperCase() == str.toUpperCase()
      ) {
        isState = true;
        return false;
      }
      return true;
    });
    return isState;
  }
  isStateFormat(str: string) {
    return /^[A-Z\s]+$/i.test(str);
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
  isZip(str: string) {
    if (!isNaN(+str) && str.length == 5) {
      return true;
    }
    return false;
  }

  getYears() {
    if (this.startDate.year != this.endDate.year) {
      this.numYears = this.endDate.year - this.startDate.year + 1;
    } else {
      this.numYears = 1;
    }
    console.log("Number of Years: " + this.numYears);
  }

  //error checks for empty field for zip, distance, and dates
  checkZErrors(str: string) {
    this.hasError = true;
    this.dispError = true;
    this.zError = str;

    const context = this;
    context.dispError = true;
    setTimeout(function () {
      context.dispError = false;
      context.zError = "";
    }, 8000);
  }
  checkSErrors(str: string) {
    this.hasError = true;
    this.dispError = true;
    this.sError = str;

    const context = this;
    context.dispError = true;
    setTimeout(function () {
      context.dispError = false;
      context.sError = "";
    }, 8000);
  }
  checkEErrors(str: string) {
    this.hasError = true;
    this.dispError = true;
    this.eError = str;

    const context = this;
    context.dispError = true;
    setTimeout(function () {
      context.dispError = false;
      context.eError = "";
    }, 8000);
  }
  checkDErrors(str: string) {
    this.hasError = true;
    this.dispError = true;
    this.dError = str;

    const context = this;
    context.dispError = true;
    setTimeout(function () {
      context.dispError = false;
      context.dError = "";
    }, 8000);
  }

  checkForInputErrors(val: string) {
    if (
      !this.isZip(val) &&
      !this.isSID(val) &&
      !this.isState(val) &&
      !this.isCity(val)
    ) {
      console.log(val);

      console.log("Input format unknown");
      this.checkZErrors(
        "Please enter a valid City, State, Zip Code, or 11-digit Station ID."
      );
      const context = this;
      setTimeout(function () {
        context.errors = "";
      }, 8000);
    }
    // Distance should be selected if searching by zip code
    else if ((this.isZip(val) || this.isCity(val)) && this.dist == " ") {
      console.log("Distance missing for zip");
      this.checkDErrors(
        "Please select a distance when using a City or Zip Code."
      );
      const context = this;
      setTimeout(function () {
        context.errors = "";
      }, 8000);
    }
  }

  getFormData(str: any) {
    if (sessionStorage.getItem(str) != null) {
      const a: any = document.getElementById(str) as HTMLInputElement;
      a.value = sessionStorage.getItem(str);
    }
  }
}
