import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  checklist:any;
  checkedList:any;

  constructor(
    private routeSelect: ActivatedRoute
    
    ) 
    {}

  ngOnInit(): void {
      this.routeSelect.queryParams.subscribe(params => {
          this.stationIdArray.push(params['data']);
          console.log(params);
      });
      this.masterSelected = false;
      this.checklist = [
        {id:1,value:'HourlyAltimeterSetting',isSelected:false},
        {id:2,value:'HourlyDewPointTemperature',isSelected:false},
        {id:3,value:'HourlyDryBulbTemperature',isSelected:false},
        {id:4,value:'HourlyPrecipitation',isSelected:false},
        {id:5,value:'HourlyPresentWeatherType',isSelected:false},
        {id:6,value:'HourlyPressureChange',isSelected:false},
        {id:7,value:'HourlyPressureTendency',isSelected:false},
        {id:8,value:'HourlyRelativeHumidity',isSelected:false},
        {id:9,value:'HourlySkyConditions',isSelected:false},
        {id:10,value:'HourlySeaLevelPressure',isSelected:false},
        {id:11,value:'HourlyStationPressure',isSelected:false},
        {id:12,value:'HourlyVisibility',isSelected:false},
        {id:13,value:'HourlyWetBulbTemperature',isSelected:false},
        {id:14,value:'HourlyWindDirection',isSelected:false},
        {id:15,value:'HourlyWindGustSpeed',isSelected:false},
        {id:16,value:'HourlyWindSpeed',isSelected:false},
        {id:17,value:'Sunrise',isSelected:false},
        {id:18,value:'Sunset',isSelected:false},
        {id:19,value:'DailyAverageDewPointTemperature',isSelected:false},
        {id:20,value:'DailyAverageDryBulbTemperature',isSelected:false},
        {id:21,value:'DailyAverageRelativeHumidity',isSelected:false},
        {id:22,value:'DailyAverageSeaLevelPressure',isSelected:false},
        {id:23,value:'DailyAverageStationPressure',isSelected:false},
        {id:24,value:'DailyAverageWetBulbTemperature',isSelected:false},
        {id:25,value:'DailyAverageWindSpeed',isSelected:false},
        {id:26,value:'DailyCoolingDegreeDays',isSelected:false},
        {id:27,value:'DailyDepartureFromNormalAverageTemperature',isSelected:false},
        {id:28,value:'DailyHeatingDegreeDays',isSelected:false},
        {id:29,value:'DailyMaximumDryBulbTemperature',isSelected:false},
        {id:30,value:'DailyMinimumDryBulbTemperature',isSelected:false},
        {id:31,value:'DailyPeakWindDirection',isSelected:false},
        {id:32,value:'DailyPeakWindSpeed',isSelected:false},
        {id:33,value:'DailyPrecipitation',isSelected:false},
        {id:34,value:'DailySnowDepth',isSelected:false},
        {id:35,value:'DailySnowfall',isSelected:false},
        {id:36,value:'DailySustainedWindDirection',isSelected:false},
        {id:37,value:'DailySustainedWindSpeed',isSelected:false},
        {id:38,value:'DailyWeather',isSelected:false},
        {id:39,value:'MonthlyAverageRH',isSelected:false},
        {id:40,value:'MonthlyDaysWithGT001Precip',isSelected:false},
        {id:41,value:'MonthlyDaysWithGT010Precip',isSelected:false},
        {id:42,value:'MonthlyDaysWithGT32Temp',isSelected:false},
        {id:43,value:'MonthlyDaysWithGT90Temp',isSelected:false},
        {id:44,value:'MonthlyDaysWithLT0Temp',isSelected:false},
        {id:45,value:'MonthlyDaysWithLT32Temp',isSelected:false},
        {id:46,value:'MonthlyDepartureFromNormalAverageTemperature',isSelected:false},
        {id:47,value:'MonthlyDepartureFromNormalCoolingDegreeDays',isSelected:false},
        {id:48,value:'MonthlyDepartureFromNormalHeatingDegreeDays',isSelected:false},
        {id:49,value:'MonthlyDepartureFromNormalMaximumTemperature',isSelected:false},
        {id:50,value:'MonthlyDepartureFromNormalMinimumTemperature',isSelected:false},
        {id:51,value:'MonthlyDepartureFromNormalPrecipitation',isSelected:false},
        {id:52,value:'MonthlyDewpointTemperature',isSelected:false},
        {id:53,value:'MonthlyGreatestPrecip',isSelected:false},
        {id:54,value:'MonthlyGreatestPrecipDate',isSelected:false},
        {id:55,value:'MonthlyGreatestSnowDepth',isSelected:false},
        {id:56,value:'MonthlyGreatestSnowDepthDate',isSelected:false},
        {id:57,value:'MonthlyGreatestSnowfall',isSelected:false},
        {id:58,value:'MonthlyGreatestSnowfallDate',isSelected:false},
        {id:59,value:'MonthlyMaxSeaLevelPressureValue',isSelected:false},
        {id:60,value:'MonthlyMaxSeaLevelPressureValueDate',isSelected:false},
        {id:61,value:'MonthlyMaxSeaLevelPressureValueTime',isSelected:false},
        {id:62,value:'MonthlyMaximumTemperature',isSelected:false},
        {id:63,value:'MonthlyMeanTemperature',isSelected:false},
        {id:64,value:'MonthlyMinSeaLevelPressureValue',isSelected:false},
        {id:65,value:'MonthlyMinSeaLevelPressureValueDate',isSelected:false},
        {id:66,value:'MonthlyMinSeaLevelPressureValueTime',isSelected:false},
        {id:67,value:'MonthlyMinimumTemperature',isSelected:false},
        {id:68,value:'MonthlySeaLevelPressure',isSelected:false},
        {id:69,value:'MonthlyStationPressure',isSelected:false},
        {id:70,value:'MonthlyTotalLiquidPrecipitation',isSelected:false},
        {id:71,value:'MonthlyTotalSnowfall',isSelected:false},
        {id:72,value:'MonthlyWetBulb',isSelected:false},
        {id:73,value:'AWND',isSelected:false},
        {id:74,value:'CDSD',isSelected:false},
        {id:75,value:'CLDD',isSelected:false},
        {id:76,value:'DSNW',isSelected:false},
        {id:77,value:'HDSD',isSelected:false},
        {id:78,value:'HTDD',isSelected:false},
        {id:79,value:'NormalsCoolingDegreeDay',isSelected:false},
        {id:80,value:'NormalsHeatingDegreeDay',isSelected:false},
        {id:81,value:'ShortDurationEndDate005',isSelected:false},
        {id:82,value:'ShortDurationEndDate010',isSelected:false},
        {id:83,value:'ShortDurationEndDate015',isSelected:false},
        {id:84,value:'ShortDurationEndDate020',isSelected:false},
        {id:85,value:'ShortDurationEndDate030',isSelected:false},
        {id:86,value:'ShortDurationEndDate045',isSelected:false},
        {id:87,value:'ShortDurationEndDate060',isSelected:false},
        {id:88,value:'ShortDurationEndDate080',isSelected:false},
        {id:89,value:'ShortDurationEndDate100',isSelected:false},
        {id:90,value:'ShortDurationEndDate120',isSelected:false},
        {id:91,value:'ShortDurationEndDate150',isSelected:false},
        {id:93,value:'ShortDurationEndDate180',isSelected:false},
        {id:94,value:'ShortDurationPrecipitationValue005',isSelected:false},
        {id:95,value:'ShortDurationPrecipitationValue010',isSelected:false},
        {id:96,value:'ShortDurationPrecipitationValue015',isSelected:false},
        {id:97,value:'ShortDurationPrecipitationValue020',isSelected:false},
        {id:98,value:'ShortDurationPrecipitationValue030',isSelected:false},
        {id:99,value:'ShortDurationPrecipitationValue045',isSelected:false},
        {id:100,value:'ShortDurationPrecipitationValue060',isSelected:false},
        {id:101,value:'ShortDurationPrecipitationValue080',isSelected:false},
        {id:102,value:'ShortDurationPrecipitationValue100',isSelected:false},
        {id:103,value:'ShortDurationPrecipitationValue120',isSelected:false},
        {id:104,value:'ShortDurationPrecipitationValue150',isSelected:false},
        {id:105,value:'ShortDurationPrecipitationValue180',isSelected:false},
        {id:106,value:'REM',isSelected:false},
        {id:107,value:'BackupDirection',isSelected:false},
        {id:108,value:'BackupDistance',isSelected:false},
        {id:109,value:'BackupDistanceUnit',isSelected:false},
        {id:110,value:'BackupElements',isSelected:false},
        {id:111,value:'BackupElevation',isSelected:false},
        {id:112,value:'BackupEquipment',isSelected:false},
        {id:113,value:'BackupLatitude',isSelected:false},
        {id:114,value:'BackupLongitude',isSelected:false},
        {id:115,value:'BackupName',isSelected:false},
        {id:116,value:'WindEquipmentChangeDate',isSelected:false},

      ];
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

}

