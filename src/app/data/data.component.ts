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
  isLoading: boolean = false;

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
        {id:1,value:'HourlyAltimeterSetting',isSelected:false,title:'Hourly Altimeter Setting'},
        {id:2,value:'HourlyDewPointTemperature',isSelected:true,title:'Hourly Dew Point Temperature'},
        {id:3,value:'HourlyDryBulbTemperature',isSelected:true,title:'Hourly Dry Bulb Temperature'},
        {id:4,value:'HourlyPrecipitation',isSelected:false,title:'Hourly Precipitation'},
        {id:5,value:'HourlyPresentWeatherType',isSelected:false,title:'Hourly Present Weather Type'},
        {id:6,value:'HourlyPressureChange',isSelected:false,title:'Hourly Pressure Change'},
        {id:7,value:'HourlyPressureTendency',isSelected:false,title:'Hourly Pressure Tendency'},
        {id:8,value:'HourlyRelativeHumidity',isSelected:true,title:'Hourly Relative Humidity'},
        {id:9,value:'HourlySkyConditions',isSelected:false,title:'Hourly Sky Conditions'},
        {id:10,value:'HourlySeaLevelPressure',isSelected:false,title:'Hourly Sea Level Pressure'},
        {id:11,value:'HourlyStationPressure',isSelected:false,title:'Hourly Station Pressure'},
        {id:12,value:'HourlyVisibility',isSelected:false,title:'Hourly Visibility'},
        {id:13,value:'HourlyWetBulbTemperature',isSelected:true,title:'Hourly Wet Bulb Temperature'},
        {id:14,value:'HourlyWindDirection',isSelected:false,title:'Hourly Wind Direction'},
        {id:15,value:'HourlyWindGustSpeed',isSelected:false,title:'Hourly WindGust Speed'},
        {id:16,value:'HourlyWindSpeed',isSelected:true,title:'Hourly Wind Speed'},
        {id:17,value:'Sunrise',isSelected:false,title:'Sunrise'},
        {id:18,value:'Sunset',isSelected:false,title:'Sunset'},
        {id:19,value:'DailyAverageDewPointTemperature',isSelected:true,title:'Daily Average Dew Point Temperature'},
        {id:20,value:'DailyAverageDryBulbTemperature',isSelected:true,title:'Daily Average Dry Bulb Temperature'},
        {id:21,value:'DailyAverageRelativeHumidity',isSelected:true,title:'Daily Average Relative Humidity'},
        {id:22,value:'DailyAverageSeaLevelPressure',isSelected:false,title:'Daily Average Sea Level Pressure'},
        {id:23,value:'DailyAverageStationPressure',isSelected:false,title:'Daily Average Station Pressure'},
        {id:24,value:'DailyAverageWetBulbTemperature',isSelected:true,title:'Daily Average Wet Bulb Temperature'},
        {id:25,value:'DailyAverageWindSpeed',isSelected:false,title:'Daily Average Wind Speed'},
        {id:26,value:'DailyCoolingDegreeDays',isSelected:false,title:'Daily Cooling Degree Days'},
        {id:27,value:'DailyDepartureFromNormalAverageTemperature',isSelected:false,title:'Daily Departure From Normal Average Temperature'},
        {id:28,value:'DailyHeatingDegreeDays',isSelected:false,title:'Daily Heating Degree Days'},
        {id:29,value:'DailyMaximumDryBulbTemperature',isSelected:false,title:'Daily Maximum Dry Bulb Temperature'},
        {id:30,value:'DailyMinimumDryBulbTemperature',isSelected:false,title:'Daily Minimum Dry Bulb Temperature'},
        {id:31,value:'DailyPeakWindDirection',isSelected:false,title:'Daily Peak Wind Direction'},
        {id:32,value:'DailyPeakWindSpeed',isSelected:false,title:'Daily Peak Wind Speed'},
        {id:33,value:'DailyPrecipitation',isSelected:false,title:'Daily Precipitation'},
        {id:34,value:'DailySnowDepth',isSelected:false,title:'Daily Snow Depth'},
        {id:35,value:'DailySnowfall',isSelected:false,title:'Daily Snowfall'},
        {id:36,value:'DailySustainedWindDirection',isSelected:false,title:'Daily Sustained Wind Direction'},
        {id:37,value:'DailySustainedWindSpeed',isSelected:false,title:'Daily Sustained WindSpeed'},
        {id:38,value:'DailyWeather',isSelected:false,title:'Daily Weather'},
        {id:39,value:'MonthlyAverageRH',isSelected:false,title:'Monthly Average Relative Humidity'},
        {id:40,value:'MonthlyDaysWithGT001Precip',isSelected:false,title:'Monthly Days With >0.001" Precipitation'},
        {id:41,value:'MonthlyDaysWithGT010Precip',isSelected:false,title:'Monthly Days With >0.010" Precipitation'},
        {id:42,value:'MonthlyDaysWithGT32Temp',isSelected:false,title:'Monthly Days With >32°F Temp'},
        {id:43,value:'MonthlyDaysWithGT90Temp',isSelected:false,title:'Monthly Days With >90°F Temp'},
        {id:44,value:'MonthlyDaysWithLT0Temp',isSelected:false,title:'Monthly Days With <0°F Temp'},
        {id:45,value:'MonthlyDaysWithLT32Temp',isSelected:false,title:'Monthly Days With <32°F Temp'},
        {id:46,value:'MonthlyDepartureFromNormalAverageTemperature',isSelected:false,title:'Monthly Departure From Normal Average Temperature'},
        {id:47,value:'MonthlyDepartureFromNormalCoolingDegreeDays',isSelected:false,title:'Monthly Departure From Normal Cooling Degree Days'},
        {id:48,value:'MonthlyDepartureFromNormalHeatingDegreeDays',isSelected:false,title:'Monthly Departure From Normal Heating Degree Days'},
        {id:49,value:'MonthlyDepartureFromNormalMaximumTemperature',isSelected:false,title:'Monthly Departure From Normal Maximum Temperature'},
        {id:50,value:'MonthlyDepartureFromNormalMinimumTemperature',isSelected:false,title:'Monthly Departure From Normal Minimum Temperature'},
        {id:51,value:'MonthlyDepartureFromNormalPrecipitation',isSelected:false,title:'Monthly Departure From Normal Precipitation'},
        {id:52,value:'MonthlyDewpointTemperature',isSelected:false,title:'Monthly Average Dew Point Temperature'},
        {id:53,value:'MonthlyGreatestPrecip',isSelected:false,title:'Monthly Greatest Precipitation'},
        {id:54,value:'MonthlyGreatestPrecipDate',isSelected:false,title:'Monthly Greatest Precipitation Date'},
        {id:55,value:'MonthlyGreatestSnowDepth',isSelected:false,title:'Monthly Greatest Snow Depth'},
        {id:56,value:'MonthlyGreatestSnowDepthDate',isSelected:false,title:'Monthly Greatest Snow Depth Date'},
        {id:57,value:'MonthlyGreatestSnowfall',isSelected:false,title:'Monthly Greatest Snowfall'},
        {id:58,value:'MonthlyGreatestSnowfallDate',isSelected:false,title:'Monthly Greatest Snowfall Date'},
        {id:59,value:'MonthlyMaxSeaLevelPressureValue',isSelected:false,title:'Monthly Max Sea Level Pressure Value'},
        {id:60,value:'MonthlyMaxSeaLevelPressureValueDate',isSelected:false,title:'Monthly Max Sea Level Pressure Value Date'},
        {id:61,value:'MonthlyMaxSeaLevelPressureValueTime',isSelected:false,title:'Monthly Max Sea Level Pressure Value Time'},
        {id:62,value:'MonthlyMaximumTemperature',isSelected:true,title:'Monthly Maximum Temperature'},
        {id:63,value:'MonthlyMeanTemperature',isSelected:true,title:'Monthly Mean Temperature'},
        {id:64,value:'MonthlyMinSeaLevelPressureValue',isSelected:false,title:'Monthly Minimum Sea Level Pressure Value'},
        {id:65,value:'MonthlyMinSeaLevelPressureValueDate',isSelected:false,title:'Monthly Minimum Sea Level Pressure Value Date'},
        {id:66,value:'MonthlyMinSeaLevelPressureValueTime',isSelected:false,title:'Monthly Minimum Sea Level Pressure Value Time'},
        {id:67,value:'MonthlyMinimumTemperature',isSelected:true,title:'Monthly Minimum Temperature'},
        {id:68,value:'MonthlySeaLevelPressure',isSelected:false,title:'Monthly Sea Level Pressure'},
        {id:69,value:'MonthlyStationPressure',isSelected:false,title:'Monthly Station Pressure'},
        {id:70,value:'MonthlyTotalLiquidPrecipitation',isSelected:false,title:'Monthly Total Liquid Precipitation'},
        {id:71,value:'MonthlyTotalSnowfall',isSelected:false,title:'Monthly Total Snowfall'},
        {id:72,value:'MonthlyWetBulb',isSelected:false,title:'Monthly Average Wet Bulb Temperature'},
        {id:73,value:'AWND',isSelected:false,title:'AWND - Average Daily Wind Speed'},
        {id:74,value:'CDSD',isSelected:false,title:'CDSD - Cloud Droplet Size Distribution'},
        {id:75,value:'CLDD',isSelected:true,title:'CLDD - Cooling Degree Days'},
        {id:76,value:'DSNW',isSelected:false,title:'DSNW - Days With Snow Depth >1"'},
        {id:77,value:'HDSD',isSelected:false,title:'HDSD - Heating Degree Days (Season to Date)'},
        {id:78,value:'HTDD',isSelected:true,title:'HDD - Heating Degree Days'},
        {id:79,value:'NormalsCoolingDegreeDay',isSelected:false,title:'Normals Cooling Degree Day'},
        {id:80,value:'NormalsHeatingDegreeDay',isSelected:false,title:'Normals Heating Degree Day'},
        {id:81,value:'ShortDurationEndDate005',isSelected:false,title:'Short Duration End Date 005'},
        {id:82,value:'ShortDurationEndDate010',isSelected:false,title:'Short Duration End Date 010'},
        {id:83,value:'ShortDurationEndDate015',isSelected:false,title:'Short Duration End Date 015'},
        {id:84,value:'ShortDurationEndDate020',isSelected:false,title:'Short Duration End Date 020'},
        {id:85,value:'ShortDurationEndDate030',isSelected:false,title:'Short Duration End Date 030'},
        {id:86,value:'ShortDurationEndDate045',isSelected:false,title:'Short Duration End Date 045'},
        {id:87,value:'ShortDurationEndDate060',isSelected:false,title:'Short Duration End Date 060'},
        {id:88,value:'ShortDurationEndDate080',isSelected:false,title:'Short Duration End Date 080'},
        {id:89,value:'ShortDurationEndDate100',isSelected:false,title:'Short Duration End Date 100'},
        {id:90,value:'ShortDurationEndDate120',isSelected:false,title:'Short Duration End Date 120'},
        {id:91,value:'ShortDurationEndDate150',isSelected:false,title:'Short Duration End Date 150'},
        {id:93,value:'ShortDurationEndDate180',isSelected:false,title:'Short Duration End Date 180'},
        {id:94,value:'ShortDurationPrecipitationValue005',isSelected:false,title:'Short Duration Precipitation Value 005'},
        {id:95,value:'ShortDurationPrecipitationValue010',isSelected:false,title:'Short Duration Precipitation Value 010'},
        {id:96,value:'ShortDurationPrecipitationValue015',isSelected:false,title:'Short Duration Precipitation Value 015'},
        {id:97,value:'ShortDurationPrecipitationValue020',isSelected:false,title:'Short Duration Precipitation Value 020'},
        {id:98,value:'ShortDurationPrecipitationValue030',isSelected:false,title:'Short Duration Precipitation Value 030'},
        {id:99,value:'ShortDurationPrecipitationValue045',isSelected:false,title:'Short Duration Precipitation Value 045'},
        {id:100,value:'ShortDurationPrecipitationValue060',isSelected:false,title:'Short Duration Precipitation Value 060'},
        {id:101,value:'ShortDurationPrecipitationValue080',isSelected:false,title:'Short Duration Precipitation Value 080'},
        {id:102,value:'ShortDurationPrecipitationValue100',isSelected:false,title:'Short Duration Precipitation Value 100'},
        {id:103,value:'ShortDurationPrecipitationValue120',isSelected:false,title:'Short Duration Precipitation Value 120'},
        {id:104,value:'ShortDurationPrecipitationValue150',isSelected:false,title:'Short Duration Precipitation Value 150'},
        {id:105,value:'ShortDurationPrecipitationValue180',isSelected:false,title:'Short Duration Precipitation Value 180'},
        {id:106,value:'REM',isSelected:false,title:'REM - Remarks'},
        {id:107,value:'BackupDirection',isSelected:false,title:'Backup Direction'},
        {id:108,value:'BackupDistance',isSelected:false,title:'Backup Distance'},
        {id:109,value:'BackupDistanceUnit',isSelected:false,title:'Backup Distance Unit'},
        {id:110,value:'BackupElements',isSelected:false,title:'Backup Elements'},
        {id:111,value:'BackupElevation',isSelected:false,title:'Backup Elevation'},
        {id:112,value:'BackupEquipment',isSelected:false,title:'Backup Equipment'},
        {id:113,value:'BackupLatitude',isSelected:false,title:'Backup Latitude'},
        {id:114,value:'BackupLongitude',isSelected:false,title:'Backup Longitude'},
        {id:115,value:'BackupName',isSelected:false,title:'Backup Name'},
        {id:116,value:'WindEquipmentChangeDate',isSelected:false,title:'Wind Equipment Change Date'}

      ];
      if(this.stationID) {
        this.isLoading = true;
        await this.getStationDataTypes();
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
        let oneDayData = csv.substring(0, csv.indexOf('-01-02T')-15)
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

  sendToDisplay(){
    this.router.navigate(["/display"], {state: { stationID: this.stationID, startDate: this.startDate, endDate: this.endDate, years: this.years, startStr: this.startStr, endStr: this.endStr, dataTypes: this.checkedList}})

  }

  goBack(){
    this.router.navigate(["/stations"])
  }
}
