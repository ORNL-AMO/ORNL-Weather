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
  stationIdArray: any[] = [];
  dataTypesArray: any[] = [];
  headers = ['Data Types']
  masterSelected:boolean;
  checkedList:any;
  dataList:any;

      checklist = [
        {id:1,value:'HourlyAltimeterSetting',isSelected:false,title:'Hourly Altimeter Setting',type:'Hourly'},
        {id:2,value:'HourlyDewPointTemperature',isSelected:true,title:'Hourly Dew Point Temperature',type:'Hourly'},
        {id:3,value:'HourlyDryBulbTemperature',isSelected:true,title:'Hourly Dry Bulb Temperature',type:'Hourly'},
        {id:4,value:'HourlyPrecipitation',isSelected:false,title:'Hourly Precipitation',type:'Hourly'},
        {id:5,value:'HourlyPresentWeatherType',isSelected:false,title:'Hourly Present Weather Type',type:'Hourly'},
        {id:6,value:'HourlyPressureChange',isSelected:false,title:'Hourly Pressure Change',type:'Hourly'},
        {id:7,value:'HourlyPressureTendency',isSelected:false,title:'Hourly Pressure Tendency',type:'Hourly'},
        {id:8,value:'HourlyRelativeHumidity',isSelected:true,title:'Hourly Relative Humidity',type:'Hourly'},
        {id:9,value:'HourlySkyConditions',isSelected:false,title:'Hourly Sky Conditions',type:'Hourly'},
        {id:10,value:'HourlySeaLevelPressure',isSelected:false,title:'Hourly Sea Level Pressure',type:'Hourly'},
        {id:11,value:'HourlyStationPressure',isSelected:false,title:'Hourly Station Pressure',type:'Hourly'},
        {id:12,value:'HourlyVisibility',isSelected:false,title:'Hourly Visibility',type:'Hourly'},
        {id:13,value:'HourlyWetBulbTemperature',isSelected:true,title:'Hourly Wet Bulb Temperature',type:'Hourly'},
        {id:14,value:'HourlyWindDirection',isSelected:false,title:'Hourly Wind Direction',type:'Hourly'},
        {id:15,value:'HourlyWindGustSpeed',isSelected:false,title:'Hourly WindGust Speed',type:'Hourly'},
        {id:16,value:'HourlyWindSpeed',isSelected:true,title:'Hourly Wind Speed',type:'Hourly'},
        {id:17,value:'Sunrise',isSelected:false,title:'Sunrise',type:'Daily'},
        {id:18,value:'Sunset',isSelected:false,title:'Sunset',type:'Daily'},
        {id:19,value:'DailyAverageDewPointTemperature',isSelected:true,title:'Daily Average Dew Point Temperature',type:'Daily'},
        {id:20,value:'DailyAverageDryBulbTemperature',isSelected:true,title:'Daily Average Dry Bulb Temperature',type:'Daily'},
        {id:21,value:'DailyAverageRelativeHumidity',isSelected:true,title:'Daily Average Relative Humidity',type:'Daily'},
        {id:22,value:'DailyAverageSeaLevelPressure',isSelected:false,title:'Daily Average Sea Level Pressure',type:'Daily'},
        {id:23,value:'DailyAverageStationPressure',isSelected:false,title:'Daily Average Station Pressure',type:'Daily'},
        {id:24,value:'DailyAverageWetBulbTemperature',isSelected:true,title:'Daily Average Wet Bulb Temperature',type:'Daily'},
        {id:25,value:'DailyAverageWindSpeed',isSelected:false,title:'Daily Average Wind Speed',type:'Daily'},
        {id:26,value:'DailyCoolingDegreeDays',isSelected:false,title:'Daily Cooling Degree Days',type:'Daily'},
        {id:27,value:'DailyDepartureFromNormalAverageTemperature',isSelected:false,title:'Daily Departure From Normal Average Temperature',type:'Daily'},
        {id:28,value:'DailyHeatingDegreeDays',isSelected:false,title:'Daily Heating Degree Days',type:'Daily'},
        {id:29,value:'DailyMaximumDryBulbTemperature',isSelected:false,title:'Daily Maximum Dry Bulb Temperature',type:'Daily'},
        {id:30,value:'DailyMinimumDryBulbTemperature',isSelected:false,title:'Daily Minimum Dry Bulb Temperature',type:'Daily'},
        {id:31,value:'DailyPeakWindDirection',isSelected:false,title:'Daily Peak Wind Direction',type:'Daily'},
        {id:32,value:'DailyPeakWindSpeed',isSelected:false,title:'Daily Peak Wind Speed',type:'Daily'},
        {id:33,value:'DailyPrecipitation',isSelected:false,title:'Daily Precipitation',type:'Daily'},
        {id:34,value:'DailySnowDepth',isSelected:false,title:'Daily Snow Depth',type:'Daily'},
        {id:35,value:'DailySnowfall',isSelected:false,title:'Daily Snowfall',type:'Daily'},
        {id:36,value:'DailySustainedWindDirection',isSelected:false,title:'Daily Sustained Wind Direction',type:'Daily'},
        {id:37,value:'DailySustainedWindSpeed',isSelected:false,title:'Daily Sustained WindSpeed',type:'Daily'},
        {id:38,value:'DailyWeather',isSelected:false,title:'Daily Weather',type:'Daily'},
        {id:39,value:'MonthlyAverageRH',isSelected:false,title:'Monthly Average Relative Humidity',type:'Monthly'},
        {id:40,value:'MonthlyDaysWithGT001Precip',isSelected:false,title:'Monthly Days With >0.001" Precipitation',type:'Monthly'},
        {id:41,value:'MonthlyDaysWithGT010Precip',isSelected:false,title:'Monthly Days With >0.010" Precipitation',type:'Monthly'},
        {id:42,value:'MonthlyDaysWithGT32Temp',isSelected:false,title:'Monthly Days With >32°F Temp',type:'Monthly'},
        {id:43,value:'MonthlyDaysWithGT90Temp',isSelected:false,title:'Monthly Days With >90°F Temp',type:'Monthly'},
        {id:44,value:'MonthlyDaysWithLT0Temp',isSelected:false,title:'Monthly Days With <0°F Temp',type:'Monthly'},
        {id:45,value:'MonthlyDaysWithLT32Temp',isSelected:false,title:'Monthly Days With <32°F Temp',type:'Monthly'},
        {id:46,value:'MonthlyDepartureFromNormalAverageTemperature',isSelected:false,title:'Monthly Departure From Normal Average Temperature',type:'Monthly'},
        {id:47,value:'MonthlyDepartureFromNormalCoolingDegreeDays',isSelected:false,title:'Monthly Departure From Normal Cooling Degree Days',type:'Monthly'},
        {id:48,value:'MonthlyDepartureFromNormalHeatingDegreeDays',isSelected:false,title:'Monthly Departure From Normal Heating Degree Days',type:'Monthly'},
        {id:49,value:'MonthlyDepartureFromNormalMaximumTemperature',isSelected:false,title:'Monthly Departure From Normal Maximum Temperature',type:'Monthly'},
        {id:50,value:'MonthlyDepartureFromNormalMinimumTemperature',isSelected:false,title:'Monthly Departure From Normal Minimum Temperature',type:'Monthly'},
        {id:51,value:'MonthlyDepartureFromNormalPrecipitation',isSelected:false,title:'Monthly Departure From Normal Precipitation',type:'Monthly'},
        {id:52,value:'MonthlyDewpointTemperature',isSelected:false,title:'Monthly Average Dew Point Temperature',type:'Monthly'},
        {id:53,value:'MonthlyGreatestPrecip',isSelected:false,title:'Monthly Greatest Precipitation',type:'Monthly'},
        {id:54,value:'MonthlyGreatestPrecipDate',isSelected:false,title:'Monthly Greatest Precipitation Date',type:'Monthly'},
        {id:55,value:'MonthlyGreatestSnowDepth',isSelected:false,title:'Monthly Greatest Snow Depth',type:'Monthly'},
        {id:56,value:'MonthlyGreatestSnowDepthDate',isSelected:false,title:'Monthly Greatest Snow Depth Date',type:'Monthly'},
        {id:57,value:'MonthlyGreatestSnowfall',isSelected:false,title:'Monthly Greatest Snowfall',type:'Monthly'},
        {id:58,value:'MonthlyGreatestSnowfallDate',isSelected:false,title:'Monthly Greatest Snowfall Date',type:'Monthly'},
        {id:59,value:'MonthlyMaxSeaLevelPressureValue',isSelected:false,title:'Monthly Max Sea Level Pressure Value',type:'Monthly'},
        {id:60,value:'MonthlyMaxSeaLevelPressureValueDate',isSelected:false,title:'Monthly Max Sea Level Pressure Value Date',type:'Monthly'},
        {id:61,value:'MonthlyMaxSeaLevelPressureValueTime',isSelected:false,title:'Monthly Max Sea Level Pressure Value Time',type:'Monthly'},
        {id:62,value:'MonthlyMaximumTemperature',isSelected:true,title:'Monthly Maximum Temperature',type:'Monthly'},
        {id:63,value:'MonthlyMeanTemperature',isSelected:true,title:'Monthly Mean Temperature',type:'Monthly'},
        {id:64,value:'MonthlyMinSeaLevelPressureValue',isSelected:false,title:'Monthly Minimum Sea Level Pressure Value',type:'Monthly'},
        {id:65,value:'MonthlyMinSeaLevelPressureValueDate',isSelected:false,title:'Monthly Minimum Sea Level Pressure Value Date',type:'Monthly'},
        {id:66,value:'MonthlyMinSeaLevelPressureValueTime',isSelected:false,title:'Monthly Minimum Sea Level Pressure Value Time',type:'Monthly'},
        {id:67,value:'MonthlyMinimumTemperature',isSelected:true,title:'Monthly Minimum Temperature',type:'Monthly'},
        {id:68,value:'MonthlySeaLevelPressure',isSelected:false,title:'Monthly Sea Level Pressure',type:'Monthly'},
        {id:69,value:'MonthlyStationPressure',isSelected:false,title:'Monthly Station Pressure',type:'Monthly'},
        {id:70,value:'MonthlyTotalLiquidPrecipitation',isSelected:false,title:'Monthly Total Liquid Precipitation',type:'Monthly'},
        {id:71,value:'MonthlyTotalSnowfall',isSelected:false,title:'Monthly Total Snowfall',type:'Monthly'},
        {id:72,value:'MonthlyWetBulb',isSelected:false,title:'Monthly Average Wet Bulb Temperature',type:'Monthly'},
        {id:73,value:'AWND',isSelected:false,title:'AWND - Average Daily Wind Speed',type:'Daily'},
        {id:74,value:'CDSD',isSelected:false,title:'CDSD - Cloud Droplet Size Distribution',type:'Monthly'},
        {id:75,value:'CLDD',isSelected:true,title:'CLDD - Cooling Degree Days',type:'Monthly'},
        {id:76,value:'DSNW',isSelected:false,title:'DSNW - Days With Snow Depth >1"',type:'Monthly'},
        {id:77,value:'HDSD',isSelected:false,title:'HDSD - Heating Degree Days (Season to Date)',type:'Monthly'},
        {id:78,value:'HTDD',isSelected:true,title:'HDD - Heating Degree Days',type:'Monthly'},
        {id:79,value:'NormalsCoolingDegreeDay',isSelected:false,title:'Normals Cooling Degree Day',type:'Misc'},
        {id:80,value:'NormalsHeatingDegreeDay',isSelected:false,title:'Normals Heating Degree Day',type:'Misc'},
        {id:81,value:'ShortDurationEndDate005',isSelected:false,title:'Short Duration End Date 005',type:'Misc'},
        {id:82,value:'ShortDurationEndDate010',isSelected:false,title:'Short Duration End Date 010',type:'Misc'},
        {id:83,value:'ShortDurationEndDate015',isSelected:false,title:'Short Duration End Date 015',type:'Misc'},
        {id:84,value:'ShortDurationEndDate020',isSelected:false,title:'Short Duration End Date 020',type:'Misc'},
        {id:85,value:'ShortDurationEndDate030',isSelected:false,title:'Short Duration End Date 030',type:'Misc'},
        {id:86,value:'ShortDurationEndDate045',isSelected:false,title:'Short Duration End Date 045',type:'Misc'},
        {id:87,value:'ShortDurationEndDate060',isSelected:false,title:'Short Duration End Date 060',type:'Misc'},
        {id:88,value:'ShortDurationEndDate080',isSelected:false,title:'Short Duration End Date 080',type:'Misc'},
        {id:89,value:'ShortDurationEndDate100',isSelected:false,title:'Short Duration End Date 100',type:'Misc'},
        {id:90,value:'ShortDurationEndDate120',isSelected:false,title:'Short Duration End Date 120',type:'Misc'},
        {id:91,value:'ShortDurationEndDate150',isSelected:false,title:'Short Duration End Date 150',type:'Misc'},
        {id:93,value:'ShortDurationEndDate180',isSelected:false,title:'Short Duration End Date 180',type:'Misc'},
        {id:94,value:'ShortDurationPrecipitationValue005',isSelected:false,title:'Short Duration Precipitation Value 005',type:'Misc'},
        {id:95,value:'ShortDurationPrecipitationValue010',isSelected:false,title:'Short Duration Precipitation Value 010',type:'Misc'},
        {id:96,value:'ShortDurationPrecipitationValue015',isSelected:false,title:'Short Duration Precipitation Value 015',type:'Misc'},
        {id:97,value:'ShortDurationPrecipitationValue020',isSelected:false,title:'Short Duration Precipitation Value 020',type:'Misc'},
        {id:98,value:'ShortDurationPrecipitationValue030',isSelected:false,title:'Short Duration Precipitation Value 030',type:'Misc'},
        {id:99,value:'ShortDurationPrecipitationValue045',isSelected:false,title:'Short Duration Precipitation Value 045',type:'Misc'},
        {id:100,value:'ShortDurationPrecipitationValue060',isSelected:false,title:'Short Duration Precipitation Value 060',type:'Misc'},
        {id:101,value:'ShortDurationPrecipitationValue080',isSelected:false,title:'Short Duration Precipitation Value 080',type:'Misc'},
        {id:102,value:'ShortDurationPrecipitationValue100',isSelected:false,title:'Short Duration Precipitation Value 100',type:'Misc'},
        {id:103,value:'ShortDurationPrecipitationValue120',isSelected:false,title:'Short Duration Precipitation Value 120',type:'Misc'},
        {id:104,value:'ShortDurationPrecipitationValue150',isSelected:false,title:'Short Duration Precipitation Value 150',type:'Misc'},
        {id:105,value:'ShortDurationPrecipitationValue180',isSelected:false,title:'Short Duration Precipitation Value 180',type:'Misc'},
        {id:106,value:'REM',isSelected:false,title:'REM - Remarks',type:'Misc'},
        {id:107,value:'BackupDirection',isSelected:false,title:'Backup Direction',type:'Misc'},
        {id:108,value:'BackupDistance',isSelected:false,title:'Backup Distance',type:'Misc'},
        {id:109,value:'BackupDistanceUnit',isSelected:false,title:'Backup Distance Unit',type:'Misc'},
        {id:110,value:'BackupElements',isSelected:false,title:'Backup Elements',type:'Misc'},
        {id:111,value:'BackupElevation',isSelected:false,title:'Backup Elevation',type:'Misc'},
        {id:112,value:'BackupEquipment',isSelected:false,title:'Backup Equipment',type:'Misc'},
        {id:113,value:'BackupLatitude',isSelected:false,title:'Backup Latitude',type:'Misc'},
        {id:114,value:'BackupLongitude',isSelected:false,title:'Backup Longitude',type:'Misc'},
        {id:115,value:'BackupName',isSelected:false,title:'Backup Name',type:'Misc'},
        {id:116,value:'WindEquipmentChangeDate',isSelected:false,title:'Wind Equipment Change Date',type:'Misc'}

      ];
  
  //page variables
  yearsObj: any[] = [];
  years: number = 0;
  stationId: any;
  startDate: any[] = [];
  endDate: any[] = [];
  sendingArray: any[] = [];
  selectedHeader = "Selected Data Types";
  displayList: any[] = [];

  constructor(
    private routeSelect: ActivatedRoute,
    private router: Router
    ) 
    {
      let state:any = this.router.getCurrentNavigation()!.extras.state;
      if(state) {
        this.startDate = state.startDate;
        this.endDate = state.endDate;
        this.stationId = state.stationID;
        this.years = state.years
      }
      else {
        this.startDate = [];
        this.endDate = [];
        this.stationId = null;
        this.years = 1;
      }
    }

  ngOnInit(): void {
      this.routeSelect.queryParams.subscribe(params => {
          this.stationIdArray.push(params['data']);
          console.log(params);
      });
      this.masterSelected = false;
      // https://docs.opendata.aws/noaa-ghcn-pds/readme.html
      // Helpful for finding descriptions and units of Data Types

      this.displayList = this.checklist;
      this.getCheckedItemList();
  }


  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].isSelected)
        this.checkedList.push(this.checklist[i]);
    }
    this.checkedList = JSON.stringify(this.checkedList);
    console.log(this.checkedList)
  }

  sendToDisplay(){
    this.getDataTypesList();
    console.log(this.dataList);
    this.router.navigate(["/display"], {state: { startDate: this.startDate, endDate: this.endDate, years: this.years, checkedList: this.checkedList }})
  }

  goBack(){
    this.router.navigate(["/stations"])
  }

  onChangeType(type: any){
    this.displayList = [];
    if(type.target.value == "All"){
      this.displayList = this.checklist;
    }
    else{
      for (var i = 0; i < this.checklist.length; i++) {
        if(this.checklist[i].type == type.target.value)
          this.displayList.push(this.checklist[i]);
      }
    }
  }
  getDataTypesList(){
    this.dataList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].isSelected)
        this.dataList.push(this.checklist[i].value);
    }
  }


}



