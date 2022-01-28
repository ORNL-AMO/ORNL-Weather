import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  
  //declaring headers for data table display
  headers = ['STATION ', 'DATE ', 'LATITUDE ', 'LONGITUDE ', 'ELEVATION ', 'NAME ', 'REPORT_TYPE ', 'SOURCE ', 'HourlyAltimeterSetting ', 'HourlyDewPointTemperature ', 'HourlyDryBulbTemperature ', 'HourlyPrecipitation ', 'HourlyPresentWeatherType ', 'HourlyPressureChange ', 'HourlyPressureTendency ', 'HourlyRelativeHumidity ', 'HourlySkyConditions ', 'HourlySeaLevelPressure ', 'HourlyStationPressure ', 'HourlyVisibility ', 'HourlyWetBulbTemperature ', 'HourlyWindDirection ', 'HourlyWindGustSpeed ', 'HourlyWindSpeed ', 'Sunrise ', 'Sunset ', 'DailyAverageDewPointTemperature ', 'DailyAverageDryBulbTemperature ', 'DailyAverageRelativeHumidity ', 'DailyAverageSeaLevelPressure ', 'DailyAverageStationPressure ', 'DailyAverageWetBulbTemperature ', 'DailyAverageWindSpeed ', 'DailyCoolingDegreeDays ', 'DailyDepartureFromNormalAverageTemperature ', 'DailyHeatingDegreeDays ', 'DailyMaximumDryBulbTemperature ', 'DailyMinimumDryBulbTemperature ', 'DailyPeakWindDirection ', 'DailyPeakWindSpeed ', 'DailyPrecipitation ', 'DailySnowDepth ', 'DailySnowfall ', 'DailySustainedWindDirection ', 'DailySustainedWindSpeed ', 'DailyWeather ', 'MonthlyAverageRH ', 'MonthlyDaysWithGT001Precip ', 'MonthlyDaysWithGT010Precip ', 'MonthlyDaysWithGT32Temp ', 'MonthlyDaysWithGT90Temp ', 'MonthlyDaysWithLT0Temp ', 'MonthlyDaysWithLT32Temp ', 'MonthlyDepartureFromNormalAverageTemperature ', 'MonthlyDepartureFromNormalCoolingDegreeDays ', 'MonthlyDepartureFromNormalHeatingDegreeDays ', 'MonthlyDepartureFromNormalMaximumTemperature ', 'MonthlyDepartureFromNormalMinimumTemperature ', 'MonthlyDepartureFromNormalPrecipitation ', 'MonthlyDewpointTemperature ', 'MonthlyGreatestPrecip ', 'MonthlyGreatestPrecipDate ', 'MonthlyGreatestSnowDepth ', 'MonthlyGreatestSnowDepthDate ', 'MonthlyGreatestSnowfall ', 'MonthlyGreatestSnowfallDate ', 'MonthlyMaxSeaLevelPressureValue ', 'MonthlyMaxSeaLevelPressureValueDate ', 'MonthlyMaxSeaLevelPressureValueTime ', 'MonthlyMaximumTemperature ', 'MonthlyMeanTemperature ', 'MonthlyMinSeaLevelPressureValue ', 'MonthlyMinSeaLevelPressureValueDate ', 'MonthlyMinSeaLevelPressureValueTime ', 'MonthlyMinimumTemperature ', 'MonthlySeaLevelPressure ', 'MonthlyStationPressure ', 'MonthlyTotalLiquidPrecipitation ', 'MonthlyTotalSnowfall ', 'MonthlyWetBulb ', 'AWND ', 'CDSD ', 'CLDD ', 'DSNW ', 'HDSD ', 'HTDD ', 'DYTS ', 'DYHF ', 'NormalsCoolingDegreeDay ', 'NormalsHeatingDegreeDay ', 'ShortDurationEndDate005 ', 'ShortDurationEndDate010 ', 'ShortDurationEndDate015 ', 'ShortDurationEndDate020 ', 'ShortDurationEndDate030 ', 'ShortDurationEndDate045 ', 'ShortDurationEndDate060 ', 'ShortDurationEndDate080 ', 'ShortDurationEndDate100 ', 'ShortDurationEndDate120 ', 'ShortDurationEndDate150 ', 'ShortDurationEndDate180 ', 'ShortDurationPrecipitationValue005 ', 'ShortDurationPrecipitationValue010 ', 'ShortDurationPrecipitationValue015 ', 'ShortDurationPrecipitationValue020 ', 'ShortDurationPrecipitationValue030 ', 'ShortDurationPrecipitationValue045 ', 'ShortDurationPrecipitationValue060 ', 'ShortDurationPrecipitationValue080 ', 'ShortDurationPrecipitationValue100 ', 'ShortDurationPrecipitationValue120 ', 'ShortDurationPrecipitationValue150 ', 'ShortDurationPrecipitationValue180 ', 'REM ', 'BackupDirection ', 'BackupDistance ', 'BackupDistanceUnit ', 'BackupElements ', 'BackupElevation ', 'BackupEquipment ', 'BackupLatitude ', 'BackupLongitude ', 'BackupName ', 'WindEquipmentChangeDate']
  
  dataObj: any[] = [];

  //takes in station id and attaches it to the end of the http links to pull the required csv. then the csv data is received as text and is converted into json for and placed in an array for display/printing/download purposes. 
  fetchCSV(val: any){
    var object: any[] = [];
    fetch(`https://www.ncei.noaa.gov/data/local-climatological-data/access/2022/${val}.csv`)
    .then((res) => res.text())
    .then((data) =>{
      var jData = JSON.stringify(data);
      var pData = JSON.parse(jData);
      var list = pData.split("\n");
      list.forEach( (e: any) => {
        object.push(e);
      })

      for (let i = 1; i < object.length; i++){
        var tempObj: any[] = [];
        list = object[i].split(',');
        list.forEach( (e: any) => {
          
          tempObj.push(e)
          
      })
      this.dataObj.push(tempObj);
      }
    })
    }
}
