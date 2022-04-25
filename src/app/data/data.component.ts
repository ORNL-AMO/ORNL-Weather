import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-data",
  templateUrl: "./data.component.html",
  styleUrls: ["./data.component.css"],
})
export class DataComponent implements OnInit {
  dataTypesArray: any[] = [];
  years = 0;
  stationIDArray: any;
  startDate: any = null;
  endDate: any = null;
  startStr = "";
  endStr = "";
  headers = ["Data Types"];
  // NOTE: masterSelected: [0]=display [1]=All, [2]=hourly, [3]=daily, [4]=monthly, [5]=misc
  masterSelected: boolean[] = [];
  checklist: any;
  checkedList: any;
  displayList: any[] = [];
  sendingDataList: string[] = [];
  stationDataTypes: string[] = [];
  stationDataObjs: any[] = [];
  isLoading = true;
  dispHeaders = false;
  stationsJSON: any = null;
  masterCheckedList: any[] = [];
  error = "";

  //page variables
  sendingArray: any[] = [];

  constructor(private router: Router) {
    const state: any = this.router.getCurrentNavigation()!.extras.state;
    if (state) {
      this.stationsJSON = state.stationsJSON;
    }
  }

  async ngOnInit() {
    if (this.getSessionStorageItem("startDate")) {
      this.startDate = JSON.parse(
        this.getSessionStorageItem("startDate") as string
      );
    }
    if (this.getSessionStorageItem("endDate")) {
      this.endDate = JSON.parse(
        this.getSessionStorageItem("endDate") as string
      );
    }
    if (this.getSessionStorageItem("sendingArrayStations")) {
      this.stationIDArray = JSON.parse(
        this.getSessionStorageItem("sendingArrayStations") as string
      );
    } else {
      this.goBack();
    }
    if (this.getSessionStorageItem("stationDataObjs")) {
      this.stationDataObjs = JSON.parse(
        this.getSessionStorageItem("stationDataObjs") as string
      );
    }
    if (this.getSessionStorageItem("masterCheckedList")) {
      this.masterCheckedList = JSON.parse(
        this.getSessionStorageItem("masterCheckedList") as string
      );
    }
    if (this.getSessionStorageItem("masterSelected")) {
      this.masterSelected = JSON.parse(
        this.getSessionStorageItem("masterSelected") as string
      );
    } else {
      this.masterSelected.fill(false, 0, 5);
    }
    if (this.getSessionStorageItem("numYears")) {
      this.years = +(<any>this.getSessionStorageItem("numYears"));
    }
    if (this.getSessionStorageItem("startStr")) {
      this.startStr = this.getSessionStorageItem("startStr") as string;
    }
    if (this.getSessionStorageItem("endStr")) {
      this.endStr = this.getSessionStorageItem("endStr") as string;
    }

    // https://docs.opendata.aws/noaa-ghcn-pds/readme.html
    // Helpful for finding descriptions and units of Data Types
    this.checklist = [
      {id:1,value:'HourlyAltimeterSetting',isSelected:false,title:'Hourly Altimeter Setting',tooltip:"", type: 'hourly'},
      {id:2,value:'HourlyDewPointTemperature',isSelected:true,title:'Hourly Dew Point Temperature',tooltip:"", type: 'hourly'},
      {id:3,value:'HourlyDryBulbTemperature',isSelected:true,title:'Hourly Dry Bulb Temperature',tooltip:"", type: 'hourly'},
      {id:4,value:'HourlyPrecipitation',isSelected:false,title:'Hourly Precipitation',tooltip:"", type: 'hourly'},
      {id:5,value:'HourlyPresentWeatherType',isSelected:false,title:'Hourly Present Weather Type',tooltip:"", type: 'hourly'},
      {id:6,value:'HourlyPressureChange',isSelected:false,title:'Hourly Pressure Change',tooltip:"", type: 'hourly'},
      {id:7,value:'HourlyPressureTendency',isSelected:false,title:'Hourly Pressure Tendency',tooltip:"", type: 'hourly'},
      {id:8,value:'HourlyRelativeHumidity',isSelected:true,title:'Hourly Relative Humidity',tooltip:"", type: 'hourly'},
      {id:9,value:'HourlySkyConditions',isSelected:false,title:'Hourly Sky Conditions',tooltip:"", type: 'hourly'},
      {id:10,value:'HourlySeaLevelPressure',isSelected:false,title:'Hourly Sea Level Pressure',tooltip:"", type: 'hourly'},
      {id:11,value:'HourlyStationPressure',isSelected:false,title:'Hourly Station Pressure',tooltip:"", type: 'hourly'},
      {id:12,value:'HourlyVisibility',isSelected:false,title:'Hourly Visibility',tooltip:"", type: 'hourly'},
      {id:13,value:'HourlyWetBulbTemperature',isSelected:true,title:'Hourly Wet Bulb Temperature',tooltip:"", type: 'hourly'},
      {id:14,value:'HourlyWindDirection',isSelected:false,title:'Hourly Wind Direction',tooltip:"", type: 'hourly'},
      {id:15,value:'HourlyWindGustSpeed',isSelected:false,title:'Hourly WindGust Speed',tooltip:"", type: 'hourly'},
      {id:16,value:'HourlyWindSpeed',isSelected:true,title:'Hourly Wind Speed',tooltip:"", type: 'hourly'},
      {id:17,value:'Sunrise',isSelected:false,title:'Sunrise',tooltip:"", type: 'daily'},
      {id:18,value:'Sunset',isSelected:false,title:'Sunset',tooltip:"", type: 'daily'},
      {id:19,value:'DailyAverageDewPointTemperature',isSelected:true,title:'Daily Average Dew Point Temperature',tooltip:"", type: 'daily'},
      {id:20,value:'DailyAverageDryBulbTemperature',isSelected:true,title:'Daily Average Dry Bulb Temperature',tooltip:"", type: 'daily'},
      {id:21,value:'DailyAverageRelativeHumidity',isSelected:true,title:'Daily Average Relative Humidity',tooltip:"", type: 'daily'},
      {id:22,value:'DailyAverageSeaLevelPressure',isSelected:false,title:'Daily Average Sea Level Pressure',tooltip:"", type: 'daily'},
      {id:23,value:'DailyAverageStationPressure',isSelected:false,title:'Daily Average Station Pressure',tooltip:"", type: 'daily'},
      {id:24,value:'DailyAverageWetBulbTemperature',isSelected:true,title:'Daily Average Wet Bulb Temperature',tooltip:"", type: 'daily'},
      {id:25,value:'DailyAverageWindSpeed',isSelected:false,title:'Daily Average Wind Speed',tooltip:"", type: 'daily'},
      {id:26,value:'DailyCoolingDegreeDays',isSelected:false,title:'Daily Cooling Degree Days',tooltip:"", type: 'daily'},
      {id:27,value:'DailyDepartureFromNormalAverageTemperature',isSelected:false,title:'Daily Departure From Normal Average Temperature',tooltip:"", type: 'daily'},
      {id:28,value:'DailyHeatingDegreeDays',isSelected:false,title:'Daily Heating Degree Days',tooltip:"", type: 'daily'},
      {id:29,value:'DailyMaximumDryBulbTemperature',isSelected:false,title:'Daily Maximum Dry Bulb Temperature',tooltip:"", type: 'daily'},
      {id:30,value:'DailyMinimumDryBulbTemperature',isSelected:false,title:'Daily Minimum Dry Bulb Temperature',tooltip:"", type: 'daily'},
      {id:31,value:'DailyPeakWindDirection',isSelected:false,title:'Daily Peak Wind Direction',tooltip:"", type: 'daily'},
      {id:32,value:'DailyPeakWindSpeed',isSelected:false,title:'Daily Peak Wind Speed',tooltip:"", type: 'daily'},
      {id:33,value:'DailyPrecipitation',isSelected:false,title:'Daily Precipitation',tooltip:"", type: 'daily'},
      {id:34,value:'DailySnowDepth',isSelected:false,title:'Daily Snow Depth',tooltip:"", type: 'daily'},
      {id:35,value:'DailySnowfall',isSelected:false,title:'Daily Snowfall',tooltip:"", type: 'daily'},
      {id:36,value:'DailySustainedWindDirection',isSelected:false,title:'Daily Sustained Wind Direction',tooltip:"", type: 'daily'},
      {id:37,value:'DailySustainedWindSpeed',isSelected:false,title:'Daily Sustained WindSpeed',tooltip:"", type: 'daily'},
      {id:38,value:'DailyWeather',isSelected:false,title:'Daily Weather',tooltip:"", type: 'daily'},
      {id:39,value:'MonthlyAverageRH',isSelected:false,title:'Monthly Average Relative Humidity',tooltip:"", type: 'monthly'},
      {id:40,value:'MonthlyDaysWithGT001Precip',isSelected:false,title:'Monthly Days With >0.001" Precipitation',tooltip:"", type: 'monthly'},
      {id:41,value:'MonthlyDaysWithGT010Precip',isSelected:false,title:'Monthly Days With >0.010" Precipitation',tooltip:"", type: 'monthly'},
      {id:42,value:'MonthlyDaysWithGT32Temp',isSelected:false,title:'Monthly Days With >32°F Temp',tooltip:"", type: 'monthly'},
      {id:43,value:'MonthlyDaysWithGT90Temp',isSelected:false,title:'Monthly Days With >90°F Temp',tooltip:"", type: 'monthly'},
      {id:44,value:'MonthlyDaysWithLT0Temp',isSelected:false,title:'Monthly Days With <0°F Temp',tooltip:"", type: 'monthly'},
      {id:45,value:'MonthlyDaysWithLT32Temp',isSelected:false,title:'Monthly Days With <32°F Temp',tooltip:"", type: 'monthly'},
      {id:46,value:'MonthlyDepartureFromNormalAverageTemperature',isSelected:false,title:'Monthly Departure From Normal Average Temperature',tooltip:"", type: 'monthly'},
      {id:47,value:'MonthlyDepartureFromNormalCoolingDegreeDays',isSelected:false,title:'Monthly Departure From Normal Cooling Degree Days',tooltip:"", type: 'monthly'},
      {id:48,value:'MonthlyDepartureFromNormalHeatingDegreeDays',isSelected:false,title:'Monthly Departure From Normal Heating Degree Days',tooltip:"", type: 'monthly'},
      {id:49,value:'MonthlyDepartureFromNormalMaximumTemperature',isSelected:false,title:'Monthly Departure From Normal Maximum Temperature',tooltip:"", type: 'monthly'},
      {id:50,value:'MonthlyDepartureFromNormalMinimumTemperature',isSelected:false,title:'Monthly Departure From Normal Minimum Temperature',tooltip:"", type: 'monthly'},
      {id:51,value:'MonthlyDepartureFromNormalPrecipitation',isSelected:false,title:'Monthly Departure From Normal Precipitation',tooltip:"", type: 'monthly'},
      {id:52,value:'MonthlyDewpointTemperature',isSelected:false,title:'Monthly Average Dew Point Temperature',tooltip:"", type: 'monthly'},
      {id:53,value:'MonthlyGreatestPrecip',isSelected:false,title:'Monthly Greatest Precipitation',tooltip:"", type: 'monthly'},
      {id:54,value:'MonthlyGreatestPrecipDate',isSelected:false,title:'Monthly Greatest Precipitation Date',tooltip:"", type: 'monthly'},
      {id:55,value:'MonthlyGreatestSnowDepth',isSelected:false,title:'Monthly Greatest Snow Depth',tooltip:"", type: 'monthly'},
      {id:56,value:'MonthlyGreatestSnowDepthDate',isSelected:false,title:'Monthly Greatest Snow Depth Date',tooltip:"", type: 'monthly'},
      {id:57,value:'MonthlyGreatestSnowfall',isSelected:false,title:'Monthly Greatest Snowfall',tooltip:"", type: 'monthly'},
      {id:58,value:'MonthlyGreatestSnowfallDate',isSelected:false,title:'Monthly Greatest Snowfall Date',tooltip:"", type: 'monthly'},
      {id:59,value:'MonthlyMaxSeaLevelPressureValue',isSelected:false,title:'Monthly Max Sea Level Pressure Value',tooltip:"", type: 'monthly'},
      {id:60,value:'MonthlyMaxSeaLevelPressureValueDate',isSelected:false,title:'Monthly Max Sea Level Pressure Value Date',tooltip:"", type: 'monthly'},
      {id:61,value:'MonthlyMaxSeaLevelPressureValueTime',isSelected:false,title:'Monthly Max Sea Level Pressure Value Time',tooltip:"", type: 'monthly'},
      {id:62,value:'MonthlyMaximumTemperature',isSelected:true,title:'Monthly Maximum Temperature',tooltip:"", type: 'monthly'},
      {id:63,value:'MonthlyMeanTemperature',isSelected:true,title:'Monthly Mean Temperature',tooltip:"", type: 'monthly'},
      {id:64,value:'MonthlyMinSeaLevelPressureValue',isSelected:false,title:'Monthly Minimum Sea Level Pressure Value',tooltip:"", type: 'monthly'},
      {id:65,value:'MonthlyMinSeaLevelPressureValueDate',isSelected:false,title:'Monthly Minimum Sea Level Pressure Value Date',tooltip:"", type: 'monthly'},
      {id:66,value:'MonthlyMinSeaLevelPressureValueTime',isSelected:false,title:'Monthly Minimum Sea Level Pressure Value Time',tooltip:"", type: 'monthly'},
      {id:67,value:'MonthlyMinimumTemperature',isSelected:true,title:'Monthly Minimum Temperature',tooltip:"", type: 'monthly'},
      {id:68,value:'MonthlySeaLevelPressure',isSelected:false,title:'Monthly Sea Level Pressure',tooltip:"", type: 'monthly'},
      {id:69,value:'MonthlyStationPressure',isSelected:false,title:'Monthly Station Pressure',tooltip:"", type: 'monthly'},
      {id:70,value:'MonthlyTotalLiquidPrecipitation',isSelected:false,title:'Monthly Total Liquid Precipitation',tooltip:"", type: 'monthly'},
      {id:71,value:'MonthlyTotalSnowfall',isSelected:false,title:'Monthly Total Snowfall',tooltip:"", type: 'monthly'},
      {id:72,value:'MonthlyWetBulb',isSelected:false,title:'Monthly Average Wet Bulb Temperature',tooltip:"", type: 'monthly'},
      {id:73,value:'AWND',isSelected:false,title:'AWND - Average Daily Wind Speed',tooltip:"", type: 'monthly'},
      {id:74,value:'CDSD',isSelected:false,title:'CDSD - Cloud Droplet Size Distribution',tooltip:"", type: 'monthly'},
      {id:75,value:'CLDD',isSelected:true,title:'CLDD - Cooling Degree Days',tooltip:"", type: 'monthly'},
      {id:76,value:'DSNW',isSelected:false,title:'DSNW - Days With Snow Depth >1"',tooltip:"", type: 'monthly'},
      {id:77,value:'HDSD',isSelected:false,title:'HDSD - Heating Degree Days (Season to Date)',tooltip:"", type: 'monthly'},
      {id:78,value:'HTDD',isSelected:true,title:'HDD - Heating Degree Days',tooltip:"", type: 'monthly'},
      {id:79,value:'NormalsCoolingDegreeDay',isSelected:false,title:'Normals Cooling Degree Day',tooltip:"", type: 'misc'},
      {id:80,value:'NormalsHeatingDegreeDay',isSelected:false,title:'Normals Heating Degree Day',tooltip:"", type: 'misc'},
      {id:81,value:'ShortDurationEndDate005',isSelected:false,title:'Short Duration End Date 005',tooltip:"", type: 'misc'},
      {id:82,value:'ShortDurationEndDate010',isSelected:false,title:'Short Duration End Date 010',tooltip:"", type: 'misc'},
      {id:83,value:'ShortDurationEndDate015',isSelected:false,title:'Short Duration End Date 015',tooltip:"", type: 'misc'},
      {id:84,value:'ShortDurationEndDate020',isSelected:false,title:'Short Duration End Date 020',tooltip:"", type: 'misc'},
      {id:85,value:'ShortDurationEndDate030',isSelected:false,title:'Short Duration End Date 030',tooltip:"", type: 'misc'},
      {id:86,value:'ShortDurationEndDate045',isSelected:false,title:'Short Duration End Date 045',tooltip:"", type: 'misc'},
      {id:87,value:'ShortDurationEndDate060',isSelected:false,title:'Short Duration End Date 060',tooltip:"", type: 'misc'},
      {id:88,value:'ShortDurationEndDate080',isSelected:false,title:'Short Duration End Date 080',tooltip:"", type: 'misc'},
      {id:89,value:'ShortDurationEndDate100',isSelected:false,title:'Short Duration End Date 100',tooltip:"", type: 'misc'},
      {id:90,value:'ShortDurationEndDate120',isSelected:false,title:'Short Duration End Date 120',tooltip:"", type: 'misc'},
      {id:91,value:'ShortDurationEndDate150',isSelected:false,title:'Short Duration End Date 150',tooltip:"", type: 'misc'},
      {id:93,value:'ShortDurationEndDate180',isSelected:false,title:'Short Duration End Date 180',tooltip:"", type: 'misc'},
      {id:94,value:'ShortDurationPrecipitationValue005',isSelected:false,title:'Short Duration Precipitation Value 005',tooltip:"", type: 'misc'},
      {id:95,value:'ShortDurationPrecipitationValue010',isSelected:false,title:'Short Duration Precipitation Value 010',tooltip:"", type: 'misc'},
      {id:96,value:'ShortDurationPrecipitationValue015',isSelected:false,title:'Short Duration Precipitation Value 015',tooltip:"", type: 'misc'},
      {id:97,value:'ShortDurationPrecipitationValue020',isSelected:false,title:'Short Duration Precipitation Value 020',tooltip:"", type: 'misc'},
      {id:98,value:'ShortDurationPrecipitationValue030',isSelected:false,title:'Short Duration Precipitation Value 030',tooltip:"", type: 'misc'},
      {id:99,value:'ShortDurationPrecipitationValue045',isSelected:false,title:'Short Duration Precipitation Value 045',tooltip:"", type: 'misc'},
      {id:100,value:'ShortDurationPrecipitationValue060',isSelected:false,title:'Short Duration Precipitation Value 060',tooltip:"", type: 'misc'},
      {id:101,value:'ShortDurationPrecipitationValue080',isSelected:false,title:'Short Duration Precipitation Value 080',tooltip:"", type: 'misc'},
      {id:102,value:'ShortDurationPrecipitationValue100',isSelected:false,title:'Short Duration Precipitation Value 100',tooltip:"", type: 'misc'},
      {id:103,value:'ShortDurationPrecipitationValue120',isSelected:false,title:'Short Duration Precipitation Value 120',tooltip:"", type: 'misc'},
      {id:104,value:'ShortDurationPrecipitationValue150',isSelected:false,title:'Short Duration Precipitation Value 150',tooltip:"", type: 'misc'},
      {id:105,value:'ShortDurationPrecipitationValue180',isSelected:false,title:'Short Duration Precipitation Value 180',tooltip:"", type: 'misc'},
      {id:106,value:'REM',isSelected:false,title:'REM - Remarks',tooltip:"", type: 'misc'},
      {id:107,value:'BackupDirection',isSelected:false,title:'Backup Direction',tooltip:"", type: 'misc'},
      {id:108,value:'BackupDistance',isSelected:false,title:'Backup Distance',tooltip:"", type: 'misc'},
      {id:109,value:'BackupDistanceUnit',isSelected:false,title:'Backup Distance Unit',tooltip:"", type: 'misc'},
      {id:110,value:'BackupElements',isSelected:false,title:'Backup Elements',tooltip:"", type: 'misc'},
      {id:111,value:'BackupElevation',isSelected:false,title:'Backup Elevation',tooltip:"", type: 'misc'},
      {id:112,value:'BackupEquipment',isSelected:false,title:'Backup Equipment',tooltip:"", type: 'misc'},
      {id:113,value:'BackupLatitude',isSelected:false,title:'Backup Latitude',tooltip:"", type: 'misc'},
      {id:114,value:'BackupLongitude',isSelected:false,title:'Backup Longitude',tooltip:"", type: 'misc'},
      {id:115,value:'BackupName',isSelected:false,title:'Backup Name',tooltip:"", type: 'misc'},
      {id:116,value:'WindEquipmentChangeDate',isSelected:false,title:'Wind Equipment Change Date',tooltip:"", type: 'misc'}
    ];


    if (this.stationDataObjs.length > 0) {
      this.isLoading = false;
      this.displayList = this.stationDataObjs.slice();
    }
    if (this.stationIDArray) {
      if (this.stationDataObjs.length == 0) {
        this.isLoading = true;
        await this.getStationDataTypes();
        fetch("assets/dataTypesList.json")
          .then((res) => res.json())
          .then((data) => {
            for (let i = 0; i < data.length; i++) {
              const array: any[] = [];
              if (data[i].DataTypes == this.checklist[i].value) {
                this.checklist[i].tooltip = data[i].Description;
              }
            }
          });
        this.isLoading = false;

        for (let i = 0; i < this.checklist.length; i++) {
          if (this.stationDataTypes.includes(this.checklist[i]["value"])) {
            this.stationDataObjs.push(this.checklist[i]);
          }
        }
        sessionStorage.setItem(
          "stationDataObjs",
          JSON.stringify(this.stationDataObjs)
        );
      }
    }
    // Set display to All
    const a: any = document.getElementById("typeValue") as HTMLInputElement;
    a.value = "All";
    this.displayList = this.stationDataObjs.slice();
    this.masterSelected[0] = this.masterSelected[1];
    this.isAllSelected();

    this.dispHeaders = true;
    this.getMasterList();
    this.getCheckedItemList();
    console.log("Available Data Types:");
    console.log(this.displayList);
  }

  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    const tmp: any = document.getElementById("typeValue") as HTMLInputElement;
    const category: string = tmp.value;
    for (let i = 0; i < this.displayList.length; i++) {
      this.displayList[i].isSelected = this.masterSelected[0];
    }

    switch (category) {
      case "All":
        this.masterSelected[1] = this.masterSelected[0];
        if (!this.masterSelected[0]) {
          this.masterCheckedList = [];
        }
        break;
      case "Hourly":
        this.masterSelected[2] = this.masterSelected[0];
        if (!this.masterSelected[0]) {
          this.masterCheckedList = this.masterCheckedList.filter(function (
            obj
          ) {
            return obj.type != "hourly";
          });
        }
        break;

      case "Daily":
        this.masterSelected[3] = this.masterSelected[0];
        if (!this.masterSelected[0]) {
          this.masterCheckedList = this.masterCheckedList.filter(function (
            obj
          ) {
            return obj.type != "daily";
          });
        }
        break;
      case "Monthly":
        this.masterSelected[4] = this.masterSelected[0];
        if (!this.masterSelected[0]) {
          this.masterCheckedList = this.masterCheckedList.filter(function (
            obj
          ) {
            return obj.type != "monthly";
          });
        }
        break;
      case "Misc":
        this.masterSelected[5] = this.masterSelected[0];
        if (!this.masterSelected[0]) {
          this.masterCheckedList = this.masterCheckedList.filter(function (
            obj
          ) {
            return obj.type != "misc";
          });
        }
        break;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected[0] = this.displayList.every(function (item: any) {
      return item.isSelected == true;
    });
    const tmp: any = document.getElementById("typeValue") as HTMLInputElement;
    const category: string = tmp.value;
    switch (category) {
      case "All":
        this.masterSelected[1] = this.masterSelected[0];
        break;
      case "Hourly":
        this.masterSelected[2] = this.masterSelected[0];
        break;
      case "Daily":
        this.masterSelected[3] = this.masterSelected[0];
        break;
      case "Monthly":
        this.masterSelected[4] = this.masterSelected[0];
        break;
      case "Misc":
        this.masterSelected[5] = this.masterSelected[0];
        break;
    }
    this.getCheckedItemList();
  }
  getMasterList() {
    for (let i = 0; i < this.displayList.length; i++) {
      if (this.displayList[i].isSelected)
        this.masterCheckedList.push(this.displayList[i]);
    }
  }
  // Get List of Checked Items
  getCheckedItemList() {
    let temp: any[] = [];
    for (var i = 0; i < this.masterCheckedList.length; i++) {
      temp.push(this.masterCheckedList[i]);
    }
    this.checkedList = [];
    for (var i = 0; i < this.displayList.length; i++) {
      if (this.displayList[i].isSelected) {
        this.checkedList.push(this.displayList[i]);
      }
    }

    for (var i = 0; i < this.checkedList.length; i++) {
      if (!temp.includes(this.checkedList[i])) {
        temp.push(this.checkedList[i]);
      }
    }

    temp = temp.filter(function (obj) {
      return obj.isSelected === true;
    });

    temp = temp.reduce((a, b) => {
      if (!a.find((data: { id: any }) => data.id === b.id)) {
        a.push(b);
      }
      return a;
    }, []);
    temp = temp.sort((a, b) => a.id - b.id);
    this.masterCheckedList = temp.slice();
    console.log(this.masterCheckedList);

    for (const displayType of this.displayList) {
      const tmpInd: any = this.stationDataObjs.findIndex((obj: any) => {
        return obj.id == displayType.id;
      });
      this.stationDataObjs[tmpInd].isSelected = displayType.isSelected;
    }
    sessionStorage.setItem(
      "masterSelected",
      JSON.stringify(this.masterSelected)
    );
    sessionStorage.setItem(
      "stationDataObjs",
      JSON.stringify(this.stationDataObjs)
    );
    sessionStorage.setItem(
      "masterCheckedList",
      JSON.stringify(this.masterCheckedList)
    );
  }

  async getStationDataTypes() {
    for (let i = 0; i < this.stationIDArray.length; i++) {
      await fetch(
        `https://www.ncei.noaa.gov/data/local-climatological-data/access/${this.startDate.year}/${this.stationIDArray[i]}.csv`
      )
        .then((res) => res.text())
        .then((data) => {
          console.log("Got Test CSV File for " + this.stationIDArray[i]);
          let csv = data;
          const csvheaders = csv
            .substring(0, csv.search("\n"))
            .replace(/['"]+/g, "")
            .split(/,/);
          csv = csv.replace(/['"]+/g, "");

          // Hourly
          const startDateObj = new Date(
            +this.startDate.year,
            +this.startDate.month - 1,
            this.startDate.day
          );
          const oneDayData = this.trimToDates(csv, startDateObj);
          const dayLines = oneDayData.split("\n");
          for (let j = 1; j < dayLines.length - 1; j++) {
            const currLine = dayLines[j].split(",");
            for (let k = 9; k < csvheaders.length; k++) {
              if (
                currLine[k] &&
                !this.stationDataTypes.includes(csvheaders[k - 1])
              ) {
                this.stationDataTypes.push(csvheaders[k - 1]);
              }
            }
          }

          // Daily
          let counter = 0;
          let sodInd = csv.indexOf(",SOD");
          while (counter < 10 && sodInd != -1) {
            const firstInd = csv.lastIndexOf("\n", sodInd);
            const dailyLine = csv
              .substring(firstInd, csv.indexOf("\n", firstInd + 1))
              .split(",");
            if (dailyLine.length > 0) {
              for (let k = 9; k < csvheaders.length; k++) {
                if (
                  dailyLine[k] &&
                  !this.stationDataTypes.includes(csvheaders[k - 1])
                ) {
                  this.stationDataTypes.push(csvheaders[k - 1]);
                }
              }
            }
            sodInd = csv.indexOf(",SOD", sodInd);
            counter++;
          }

          // Monthly
          counter = 0;
          let somInd = csv.indexOf(",SOM");
          while (counter < 10 && somInd != -1) {
            const firstInd = csv.lastIndexOf("\n", somInd);
            const dailyLine = csv
              .substring(firstInd, csv.indexOf("\n", firstInd + 1))
              .split(",");
            if (dailyLine.length > 0) {
              for (let k = 9; k < csvheaders.length; k++) {
                if (
                  dailyLine[k] &&
                  !this.stationDataTypes.includes(csvheaders[k - 1])
                ) {
                  this.stationDataTypes.push(csvheaders[k - 1]);
                }
              }
            }
            somInd = csv.indexOf(",SOM", sodInd);
            counter++;
          }

          console.log("Got Data Types for " + this.stationIDArray[i]);
        });
    }
  }

  trimToDates(csv: string, startDate: Date) {
    let ind = -1;
    // Cannot be last day of year
    const maxDate = new Date(+this.startDate.year, 11, 31);
    while (ind == -1 && startDate < maxDate) {
      const start =
        startDate.getFullYear() +
        "-" +
        ("0" + (startDate.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + startDate.getDate()).slice(-2);
      const startRegex = new RegExp(`[\n][0-9]*[,]*${start}`);
      ind = csv.search(startRegex);
      if (ind != -1) {
        csv = csv.slice(ind);
      }
      startDate.setDate(startDate.getDate() + 1);
    }

    // If start date is Dec 31, only one day will be in csv at this point
    if (!(startDate > maxDate)) {
      ind = -1;
      while (ind == -1 && startDate < maxDate) {
        const end =
          startDate.getFullYear() +
          "-" +
          ("0" + startDate.getMonth() + 1).slice(-2) +
          "-" +
          ("0" + startDate.getDate()).slice(-2);
        ind = csv.search(end);
        if (ind != -1) {
          csv = csv.slice(0, csv.indexOf("\n", csv.lastIndexOf(end)) + 1);
        } else {
          startDate.setDate(startDate.getDate() + 1);
        }
      }
    }

    return csv;
  }

  sendToDisplay() {
    if (this.masterCheckedList.length == 0) {
      this.error = "Please Select One or More Data Types";
      const context = this;
      setTimeout(function () {
        context.error = "";
      }, 5000);
    } else {
      for (const i of this.masterCheckedList) {
        this.sendingDataList.push(i.value);
      }
      sessionStorage.setItem(
        "masterSelected",
        JSON.stringify(this.masterSelected)
      );
      sessionStorage.setItem(
        "stationDataObjs",
        JSON.stringify(this.stationDataObjs)
      );
      sessionStorage.setItem(
        "masterCheckedList",
        JSON.stringify(this.masterCheckedList)
      );
      sessionStorage.setItem(
        "sendingDataList",
        JSON.stringify(this.sendingDataList)
      );
      this.router.navigate(["/display"], {
        state: { stationsJSON: this.stationsJSON },
      });
    }
  }

  goBack() {
    sessionStorage.removeItem("stationDataObjs");
    sessionStorage.removeItem("masterSelected");
    sessionStorage.removeItem("masterCheckedList");
    sessionStorage.removeItem("sendingDataList");
    if (!this.getSessionStorageItem("stationID")) {
      this.router.navigate(["/stations"], {
        state: { stationsJSON: this.stationsJSON },
      });
    } else {
      this.router.navigate(["/home"], {
        state: { stationsJSON: this.stationsJSON },
      });
    }
  }

  getSessionStorageItem(str: string) {
    try {
      const tmp = sessionStorage.getItem(str);
      if (tmp) {
        return tmp;
      }
    } catch (e) {}
    return null;
  }

  onChangeType(type: any) {
    if (type.target.value == "All") {
      this.displayList = this.stationDataObjs.slice();
      this.masterSelected[0] = this.masterSelected[1];
      this.isAllSelected();
    } else if (type.target.value == "Hourly") {
      this.masterSelected[0] = this.masterSelected[2];
      this.displayList = this.stationDataObjs.filter(function (obj: any) {
        return obj.type == "hourly";
      });
      this.isAllSelected();
    } else if (type.target.value == "Daily") {
      this.masterSelected[0] = this.masterSelected[3];
      this.displayList = this.stationDataObjs.filter(function (obj: any) {
        return obj.type == "daily";
      });
      this.isAllSelected();
    } else if (type.target.value == "Monthly") {
      this.masterSelected[0] = this.masterSelected[4];
      this.displayList = this.stationDataObjs.filter(function (obj: any) {
        return obj.type == "monthly";
      });
      this.isAllSelected();
    } else if (type.target.value == "Misc") {
      this.masterSelected[0] = this.masterSelected[5];
      this.displayList = this.stationDataObjs.filter(function (obj: any) {
        return obj.type == "misc";
      });
      this.isAllSelected();
    }
  }
}
