import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})

export class DataComponent implements OnInit {
  dataTypesArray: any[] = [];
  years: number = 0;
  stationID: any;
  startDate: any[] = [];
  endDate: any[] = [];
  startStr:string = "";
  endStr:string = "";
  headers = ['Data Types']
  masterSelected:boolean;
  checklist:any;
  checkedList:any;
  displayList:any[] = [];
  stationDataTypes:string[] = []
  isLoading: boolean = true;
  dispHeaders: boolean = false;

  //page variables
  sendingArray: any[] = [];

  constructor(private router: Router)
    {
      let state:any = this.router.getCurrentNavigation()!.extras.state;
      if(state) {
        this.startDate = state.startDate;
        this.endDate = state.endDate;
        this.stationID = state.stationID;
        this.years = state.years;
        this.startStr = state.startStr;
        this.endStr = state.endStr;
      }
      else {
        this.startDate = [];
        this.endDate = [];
        this.stationID = null;
      }
    }

  async ngOnInit() {
      this.masterSelected = false;
      // https://docs.opendata.aws/noaa-ghcn-pds/readme.html
      // Helpful for finding descriptions and units of Data Types
      this.checklist = [
        {id:1,value:'HourlyAltimeterSetting',isSelected:false,title:'Hourly Altimeter Setting',tooltip:""},
        {id:2,value:'HourlyDewPointTemperature',isSelected:true,title:'Hourly Dew Point Temperature',tooltip:""},
        {id:3,value:'HourlyDryBulbTemperature',isSelected:true,title:'Hourly Dry Bulb Temperature',tooltip:""},
        {id:4,value:'HourlyPrecipitation',isSelected:false,title:'Hourly Precipitation',tooltip:""},
        {id:5,value:'HourlyPresentWeatherType',isSelected:false,title:'Hourly Present Weather Type',tooltip:""},
        {id:6,value:'HourlyPressureChange',isSelected:false,title:'Hourly Pressure Change',tooltip:""},
        {id:7,value:'HourlyPressureTendency',isSelected:false,title:'Hourly Pressure Tendency',tooltip:""},
        {id:8,value:'HourlyRelativeHumidity',isSelected:true,title:'Hourly Relative Humidity',tooltip:""},
        {id:9,value:'HourlySkyConditions',isSelected:false,title:'Hourly Sky Conditions',tooltip:""},
        {id:10,value:'HourlySeaLevelPressure',isSelected:false,title:'Hourly Sea Level Pressure',tooltip:""},
        {id:11,value:'HourlyStationPressure',isSelected:false,title:'Hourly Station Pressure',tooltip:""},
        {id:12,value:'HourlyVisibility',isSelected:false,title:'Hourly Visibility',tooltip:""},
        {id:13,value:'HourlyWetBulbTemperature',isSelected:true,title:'Hourly Wet Bulb Temperature',tooltip:""},
        {id:14,value:'HourlyWindDirection',isSelected:false,title:'Hourly Wind Direction',tooltip:""},
        {id:15,value:'HourlyWindGustSpeed',isSelected:false,title:'Hourly WindGust Speed',tooltip:""},
        {id:16,value:'HourlyWindSpeed',isSelected:true,title:'Hourly Wind Speed',tooltip:""},
        {id:17,value:'Sunrise',isSelected:false,title:'Sunrise',tooltip:""},
        {id:18,value:'Sunset',isSelected:false,title:'Sunset',tooltip:""},
        {id:19,value:'DailyAverageDewPointTemperature',isSelected:true,title:'Daily Average Dew Point Temperature',tooltip:""},
        {id:20,value:'DailyAverageDryBulbTemperature',isSelected:true,title:'Daily Average Dry Bulb Temperature',tooltip:""},
        {id:21,value:'DailyAverageRelativeHumidity',isSelected:true,title:'Daily Average Relative Humidity',tooltip:""},
        {id:22,value:'DailyAverageSeaLevelPressure',isSelected:false,title:'Daily Average Sea Level Pressure',tooltip:""},
        {id:23,value:'DailyAverageStationPressure',isSelected:false,title:'Daily Average Station Pressure',tooltip:""},
        {id:24,value:'DailyAverageWetBulbTemperature',isSelected:true,title:'Daily Average Wet Bulb Temperature',tooltip:""},
        {id:25,value:'DailyAverageWindSpeed',isSelected:false,title:'Daily Average Wind Speed',tooltip:""},
        {id:26,value:'DailyCoolingDegreeDays',isSelected:false,title:'Daily Cooling Degree Days',tooltip:""},
        {id:27,value:'DailyDepartureFromNormalAverageTemperature',isSelected:false,title:'Daily Departure From Normal Average Temperature',tooltip:""},
        {id:28,value:'DailyHeatingDegreeDays',isSelected:false,title:'Daily Heating Degree Days',tooltip:""},
        {id:29,value:'DailyMaximumDryBulbTemperature',isSelected:false,title:'Daily Maximum Dry Bulb Temperature',tooltip:""},
        {id:30,value:'DailyMinimumDryBulbTemperature',isSelected:false,title:'Daily Minimum Dry Bulb Temperature',tooltip:""},
        {id:31,value:'DailyPeakWindDirection',isSelected:false,title:'Daily Peak Wind Direction',tooltip:""},
        {id:32,value:'DailyPeakWindSpeed',isSelected:false,title:'Daily Peak Wind Speed',tooltip:""},
        {id:33,value:'DailyPrecipitation',isSelected:false,title:'Daily Precipitation',tooltip:""},
        {id:34,value:'DailySnowDepth',isSelected:false,title:'Daily Snow Depth',tooltip:""},
        {id:35,value:'DailySnowfall',isSelected:false,title:'Daily Snowfall',tooltip:""},
        {id:36,value:'DailySustainedWindDirection',isSelected:false,title:'Daily Sustained Wind Direction',tooltip:""},
        {id:37,value:'DailySustainedWindSpeed',isSelected:false,title:'Daily Sustained WindSpeed',tooltip:""},
        {id:38,value:'DailyWeather',isSelected:false,title:'Daily Weather',tooltip:""},
        {id:39,value:'MonthlyAverageRH',isSelected:false,title:'Monthly Average Relative Humidity',tooltip:""},
        {id:40,value:'MonthlyDaysWithGT001Precip',isSelected:false,title:'Monthly Days With >0.001" Precipitation',tooltip:""},
        {id:41,value:'MonthlyDaysWithGT010Precip',isSelected:false,title:'Monthly Days With >0.010" Precipitation',tooltip:""},
        {id:42,value:'MonthlyDaysWithGT32Temp',isSelected:false,title:'Monthly Days With >32°F Temp',tooltip:""},
        {id:43,value:'MonthlyDaysWithGT90Temp',isSelected:false,title:'Monthly Days With >90°F Temp',tooltip:""},
        {id:44,value:'MonthlyDaysWithLT0Temp',isSelected:false,title:'Monthly Days With <0°F Temp',tooltip:""},
        {id:45,value:'MonthlyDaysWithLT32Temp',isSelected:false,title:'Monthly Days With <32°F Temp',tooltip:""},
        {id:46,value:'MonthlyDepartureFromNormalAverageTemperature',isSelected:false,title:'Monthly Departure From Normal Average Temperature',tooltip:""},
        {id:47,value:'MonthlyDepartureFromNormalCoolingDegreeDays',isSelected:false,title:'Monthly Departure From Normal Cooling Degree Days',tooltip:""},
        {id:48,value:'MonthlyDepartureFromNormalHeatingDegreeDays',isSelected:false,title:'Monthly Departure From Normal Heating Degree Days',tooltip:""},
        {id:49,value:'MonthlyDepartureFromNormalMaximumTemperature',isSelected:false,title:'Monthly Departure From Normal Maximum Temperature',tooltip:""},
        {id:50,value:'MonthlyDepartureFromNormalMinimumTemperature',isSelected:false,title:'Monthly Departure From Normal Minimum Temperature',tooltip:""},
        {id:51,value:'MonthlyDepartureFromNormalPrecipitation',isSelected:false,title:'Monthly Departure From Normal Precipitation',tooltip:""},
        {id:52,value:'MonthlyDewpointTemperature',isSelected:false,title:'Monthly Average Dew Point Temperature',tooltip:""},
        {id:53,value:'MonthlyGreatestPrecip',isSelected:false,title:'Monthly Greatest Precipitation',tooltip:""},
        {id:54,value:'MonthlyGreatestPrecipDate',isSelected:false,title:'Monthly Greatest Precipitation Date',tooltip:""},
        {id:55,value:'MonthlyGreatestSnowDepth',isSelected:false,title:'Monthly Greatest Snow Depth',tooltip:""},
        {id:56,value:'MonthlyGreatestSnowDepthDate',isSelected:false,title:'Monthly Greatest Snow Depth Date',tooltip:""},
        {id:57,value:'MonthlyGreatestSnowfall',isSelected:false,title:'Monthly Greatest Snowfall',tooltip:""},
        {id:58,value:'MonthlyGreatestSnowfallDate',isSelected:false,title:'Monthly Greatest Snowfall Date',tooltip:""},
        {id:59,value:'MonthlyMaxSeaLevelPressureValue',isSelected:false,title:'Monthly Max Sea Level Pressure Value',tooltip:""},
        {id:60,value:'MonthlyMaxSeaLevelPressureValueDate',isSelected:false,title:'Monthly Max Sea Level Pressure Value Date',tooltip:""},
        {id:61,value:'MonthlyMaxSeaLevelPressureValueTime',isSelected:false,title:'Monthly Max Sea Level Pressure Value Time',tooltip:""},
        {id:62,value:'MonthlyMaximumTemperature',isSelected:true,title:'Monthly Maximum Temperature',tooltip:""},
        {id:63,value:'MonthlyMeanTemperature',isSelected:true,title:'Monthly Mean Temperature',tooltip:""},
        {id:64,value:'MonthlyMinSeaLevelPressureValue',isSelected:false,title:'Monthly Minimum Sea Level Pressure Value',tooltip:""},
        {id:65,value:'MonthlyMinSeaLevelPressureValueDate',isSelected:false,title:'Monthly Minimum Sea Level Pressure Value Date',tooltip:""},
        {id:66,value:'MonthlyMinSeaLevelPressureValueTime',isSelected:false,title:'Monthly Minimum Sea Level Pressure Value Time',tooltip:""},
        {id:67,value:'MonthlyMinimumTemperature',isSelected:true,title:'Monthly Minimum Temperature',tooltip:""},
        {id:68,value:'MonthlySeaLevelPressure',isSelected:false,title:'Monthly Sea Level Pressure',tooltip:""},
        {id:69,value:'MonthlyStationPressure',isSelected:false,title:'Monthly Station Pressure',tooltip:""},
        {id:70,value:'MonthlyTotalLiquidPrecipitation',isSelected:false,title:'Monthly Total Liquid Precipitation',tooltip:""},
        {id:71,value:'MonthlyTotalSnowfall',isSelected:false,title:'Monthly Total Snowfall',tooltip:""},
        {id:72,value:'MonthlyWetBulb',isSelected:false,title:'Monthly Average Wet Bulb Temperature',tooltip:""},
        {id:73,value:'AWND',isSelected:false,title:'AWND - Average Daily Wind Speed',tooltip:""},
        {id:74,value:'CDSD',isSelected:false,title:'CDSD - Cloud Droplet Size Distribution',tooltip:""},
        {id:75,value:'CLDD',isSelected:true,title:'CLDD - Cooling Degree Days',tooltip:""},
        {id:76,value:'DSNW',isSelected:false,title:'DSNW - Days With Snow Depth >1"',tooltip:""},
        {id:77,value:'HDSD',isSelected:false,title:'HDSD - Heating Degree Days (Season to Date)',tooltip:""},
        {id:78,value:'HTDD',isSelected:true,title:'HDD - Heating Degree Days',tooltip:""},
        {id:79,value:'NormalsCoolingDegreeDay',isSelected:false,title:'Normals Cooling Degree Day',tooltip:""},
        {id:80,value:'NormalsHeatingDegreeDay',isSelected:false,title:'Normals Heating Degree Day',tooltip:""},
        {id:81,value:'ShortDurationEndDate005',isSelected:false,title:'Short Duration End Date 005',tooltip:""},
        {id:82,value:'ShortDurationEndDate010',isSelected:false,title:'Short Duration End Date 010',tooltip:""},
        {id:83,value:'ShortDurationEndDate015',isSelected:false,title:'Short Duration End Date 015',tooltip:""},
        {id:84,value:'ShortDurationEndDate020',isSelected:false,title:'Short Duration End Date 020',tooltip:""},
        {id:85,value:'ShortDurationEndDate030',isSelected:false,title:'Short Duration End Date 030',tooltip:""},
        {id:86,value:'ShortDurationEndDate045',isSelected:false,title:'Short Duration End Date 045',tooltip:""},
        {id:87,value:'ShortDurationEndDate060',isSelected:false,title:'Short Duration End Date 060',tooltip:""},
        {id:88,value:'ShortDurationEndDate080',isSelected:false,title:'Short Duration End Date 080',tooltip:""},
        {id:89,value:'ShortDurationEndDate100',isSelected:false,title:'Short Duration End Date 100',tooltip:""},
        {id:90,value:'ShortDurationEndDate120',isSelected:false,title:'Short Duration End Date 120',tooltip:""},
        {id:91,value:'ShortDurationEndDate150',isSelected:false,title:'Short Duration End Date 150',tooltip:""},
        {id:93,value:'ShortDurationEndDate180',isSelected:false,title:'Short Duration End Date 180',tooltip:""},
        {id:94,value:'ShortDurationPrecipitationValue005',isSelected:false,title:'Short Duration Precipitation Value 005',tooltip:""},
        {id:95,value:'ShortDurationPrecipitationValue010',isSelected:false,title:'Short Duration Precipitation Value 010',tooltip:""},
        {id:96,value:'ShortDurationPrecipitationValue015',isSelected:false,title:'Short Duration Precipitation Value 015',tooltip:""},
        {id:97,value:'ShortDurationPrecipitationValue020',isSelected:false,title:'Short Duration Precipitation Value 020',tooltip:""},
        {id:98,value:'ShortDurationPrecipitationValue030',isSelected:false,title:'Short Duration Precipitation Value 030',tooltip:""},
        {id:99,value:'ShortDurationPrecipitationValue045',isSelected:false,title:'Short Duration Precipitation Value 045',tooltip:""},
        {id:100,value:'ShortDurationPrecipitationValue060',isSelected:false,title:'Short Duration Precipitation Value 060',tooltip:""},
        {id:101,value:'ShortDurationPrecipitationValue080',isSelected:false,title:'Short Duration Precipitation Value 080',tooltip:""},
        {id:102,value:'ShortDurationPrecipitationValue100',isSelected:false,title:'Short Duration Precipitation Value 100',tooltip:""},
        {id:103,value:'ShortDurationPrecipitationValue120',isSelected:false,title:'Short Duration Precipitation Value 120',tooltip:""},
        {id:104,value:'ShortDurationPrecipitationValue150',isSelected:false,title:'Short Duration Precipitation Value 150',tooltip:""},
        {id:105,value:'ShortDurationPrecipitationValue180',isSelected:false,title:'Short Duration Precipitation Value 180',tooltip:""},
        {id:106,value:'REM',isSelected:false,title:'REM - Remarks',tooltip:""},
        {id:107,value:'BackupDirection',isSelected:false,title:'Backup Direction',tooltip:""},
        {id:108,value:'BackupDistance',isSelected:false,title:'Backup Distance',tooltip:""},
        {id:109,value:'BackupDistanceUnit',isSelected:false,title:'Backup Distance Unit',tooltip:""},
        {id:110,value:'BackupElements',isSelected:false,title:'Backup Elements',tooltip:""},
        {id:111,value:'BackupElevation',isSelected:false,title:'Backup Elevation',tooltip:""},
        {id:112,value:'BackupEquipment',isSelected:false,title:'Backup Equipment',tooltip:""},
        {id:113,value:'BackupLatitude',isSelected:false,title:'Backup Latitude',tooltip:""},
        {id:114,value:'BackupLongitude',isSelected:false,title:'Backup Longitude',tooltip:""},
        {id:115,value:'BackupName',isSelected:false,title:'Backup Name',tooltip:""},
        {id:116,value:'WindEquipmentChangeDate',isSelected:false,title:'Wind Equipment Change Date',tooltip:""}

      ];
      if(this.stationID) {
        this.isLoading = true;
        await this.getStationDataTypes();
        if(this.stationDataTypes.length>0) {
          this.dispHeaders = true;
        }
        fetch("assets/dataTypesList.json")
        .then((res) => res.json())
        .then((data) =>{
            for(let i = 0; i < data.length; i++){
              let array: any []= []
              if(data[i].DataTypes == this.checklist[i].value){
                this.checklist[i].tooltip = data[i].Description
              }
            }
        })
        this.isLoading = false;
        for(let i=0; i<this.checklist.length; i++) {
          if(this.stationDataTypes.includes(this.checklist[i]["value"])) {
            this.displayList.push(this.checklist[i])
          }
        }
        this.getCheckedItemList();
        console.log("Available Data Types:");
        console.log(this.displayList);
      }
      // this.fetchToolTip();
  }


  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (var i = 0; i < this.displayList.length; i++) {
      this.displayList[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.displayList.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.displayList.length; i++) {
      if(this.displayList[i].isSelected)
        this.checkedList.push(this.displayList[i].value);
    }
  }

  async getStationDataTypes(){
    for(let i=0; i<this.stationID.length; i++) {
      await fetch(`https://www.ncei.noaa.gov/data/local-climatological-data/access/${this.startDate[0].year}/${this.stationID[i]}.csv`)
      .then((res) => res.text())
      .then((data) =>{
        console.log("Got Test CSV File for " + this.stationID[i]);
        let csv = data;
        let csvheaders = csv.substring(0, csv.search("\n")).replace(/['"]+/g, '').split(/,/);
        csv = csv.replace(/['"]+/g, '')

        // Hourly
        let startDateObj = new Date(+this.startDate[0].year, +this.startDate[0].month-1, this.startDate[0].day)
        let oneDayData = this.trimToDates(csv, startDateObj)
        let dayLines = oneDayData.split("\n")
        for(let j = 1; j < dayLines.length-1; j++) {
          let currLine = dayLines[j].split(",")
          for(let k = 9; k < csvheaders.length; k++) {
            if(currLine[k] && !this.stationDataTypes.includes(csvheaders[k-1])) {
              this.stationDataTypes.push(csvheaders[k-1]);
            }
          }
        }

        // Daily
        let counter = 0;
        let sodInd = csv.indexOf(',SOD');
        while(counter<10 && sodInd != -1) {
          let firstInd = csv.lastIndexOf('\n', sodInd)
          let dailyLine = csv.substring(firstInd, csv.indexOf('\n', firstInd+1)).split(",")
          if(dailyLine.length>0) {
            for(let k = 9; k < csvheaders.length; k++) {
              if(dailyLine[k] && !this.stationDataTypes.includes(csvheaders[k-1])) {
                this.stationDataTypes.push(csvheaders[k-1]);
              }
            }
          }
          sodInd = csv.indexOf(',SOD', sodInd);
          counter++;
        }

        // Monthly
        counter = 0;
        let somInd = csv.indexOf(',SOM');
        while(counter<10 && somInd != -1) {
          let firstInd = csv.lastIndexOf('\n', somInd)
          let dailyLine = csv.substring(firstInd, csv.indexOf('\n', firstInd+1)).split(",")
          if(dailyLine.length>0) {
            for(let k = 9; k < csvheaders.length; k++) {
              if(dailyLine[k] && !this.stationDataTypes.includes(csvheaders[k-1])) {
                this.stationDataTypes.push(csvheaders[k-1]);
              }
            }
          }
          somInd = csv.indexOf(',SOM', sodInd);
          counter++;
        }

        console.log("Got Data Types for " + this.stationID[i]);
      })
    }
  }

  trimToDates(csv:string, startDate:Date) {
    let ind = -1
    // Cannot be last day of year
    let maxDate = new Date(+this.startDate[0].year, 11, 31)
    while(ind==-1 && startDate<maxDate) {
      let start = startDate.getFullYear() + '-' + ("0"+(startDate.getMonth()+1)).slice(-2) + '-' + ("0" + startDate.getDate()).slice(-2)
      let startRegex = new RegExp(`[\n][0-9]*[,]*${start}`)
      ind = csv.search(startRegex)
      if(ind!=-1) {
        csv = csv.slice(ind);
      }
      startDate.setDate(startDate.getDate()+1);
    }

    // If start date is Dec 31, only one day will be in csv at this point
    if(!(startDate>maxDate)) {
      ind = -1
      while(ind==-1 && startDate<maxDate) {
        let end = startDate.getFullYear() + '-' + ("0"+(startDate.getMonth())+1).slice(-2) + '-' + ("0" + startDate.getDate()).slice(-2)
        ind = csv.search(end)
        if(ind!=-1) {
          csv = csv.slice(0, csv.indexOf("\n", csv.lastIndexOf(end))+1)
        }
        else{
          startDate.setDate(startDate.getDate()+1);
        }
      }
    }

    return csv
  }

  sendToDisplay(){
    this.router.navigate(["/display"], {state: { stationID: this.stationID, startDate: this.startDate, endDate: this.endDate, years: this.years, startStr: this.startStr, endStr: this.endStr, dataTypes: this.checkedList}})

  }

  goBack(){
    this.router.navigate(["/stations"])
  }

  // fetchToolTip(){
    
  //   fetch("assets/dataTypesList.json")
  //   .then((res) => res.json())
  //   .then((data) =>{
  //       for(let i = 0; i < data.length; i++){
  //         let array: any []= []
  //         if(data[i].DataTypes == this.checklist[i].value){
  //           this.checklist[i].tooltip = data[i].Description
  //         }
  //       }
  //   })
  //   console.log(this.displayList)
  // }
}
