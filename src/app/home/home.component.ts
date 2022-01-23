import { Component, OnInit } from '@angular/core';

export interface dataElements {
  STATION: any;DATE: any;LATITUDE: any;LONGITUDE: any;ELEVATION: any;NAME: any;REPORT_TYPE: any;SOURCE: any;HourlyAltimeterSetting: any;HourlyDewPointTemperature: any;HourlyDryBulbTemperature: any;HourlyPrecipitation: any;HourlyPresentWeatherType: any;HourlyPressureChange: any;HourlyPressureTendency: any;HourlyRelativeHumidity: any;HourlySkyConditions: any;HourlySeaLevelPressure: any;HourlyStationPressure: any;HourlyVisibility: any;HourlyWetBulbTemperature: any;HourlyWindDirection: any;HourlyWindGustSpeed: any;HourlyWindSpeed: any;Sunrise: any;Sunset: any;DailyAverageDewPointTemperature: any;DailyAverageDryBulbTemperature: any;DailyAverageRelativeHumidity: any;DailyAverageSeaLevelPressure: any;DailyAverageStationPressure: any;DailyAverageWetBulbTemperature: any;DailyAverageWindSpeed: any;DailyCoolingDegreeDays: any;DailyDepartureFromNormalAverageTemperature: any;DailyHeatingDegreeDays: any;DailyMaximumDryBulbTemperature: any;DailyMinimumDryBulbTemperature: any;DailyPeakWindDirection: any;DailyPeakWindSpeed: any;DailyPrecipitation: any;DailySnowDepth: any;DailySnowfall: any;DailySustainedWindDirection: any;DailySustainedWindSpeed: any;DailyWeather: any;MonthlyAverageRH: any;MonthlyDaysWithGT001Precip: any;MonthlyDaysWithGT010Precip: any;MonthlyDaysWithGT32Temp: any;MonthlyDaysWithGT90Temp: any;MonthlyDaysWithLT0Temp: any;MonthlyDaysWithLT32Temp: any;MonthlyDepartureFromNormalAverageTemperature: any;MonthlyDepartureFromNormalCoolingDegreeDays: any;MonthlyDepartureFromNormalHeatingDegreeDays: any;MonthlyDepartureFromNormalMaximumTemperature: any;MonthlyDepartureFromNormalMinimumTemperature: any;MonthlyDepartureFromNormalPrecipitation: any;MonthlyDewpointTemperature: any;MonthlyGreatestPrecip: any;MonthlyGreatestPrecipDate: any;MonthlyGreatestSnowDepth: any;MonthlyGreatestSnowDepthDate: any;MonthlyGreatestSnowfall: any;MonthlyGreatestSnowfallDate: any;MonthlyMaxSeaLevelPressureValue: any;MonthlyMaxSeaLevelPressureValueDate: any;MonthlyMaxSeaLevelPressureValueTime: any;MonthlyMaximumTemperature: any;MonthlyMeanTemperature: any;MonthlyMinSeaLevelPressureValue: any;MonthlyMinSeaLevelPressureValueDate: any;MonthlyMinSeaLevelPressureValueTime: any;MonthlyMinimumTemperature: any;MonthlySeaLevelPressure: any;MonthlyStationPressure: any;MonthlyTotalLiquidPrecipitation: any;MonthlyTotalSnowfall: any;MonthlyWetBulb: any;AWND: any;CDSD: any;CLDD: any;DSNW: any;HDSD: any;HTDD: any;DYTS: any;DYHF: any;NormalsCoolingDegreeDay: any;NormalsHeatingDegreeDay: any;ShortDurationEndDate005: any;ShortDurationEndDate010: any;ShortDurationEndDate015: any;ShortDurationEndDate020: any;ShortDurationEndDate030: any;ShortDurationEndDate045: any;ShortDurationEndDate060: any;ShortDurationEndDate080: any;ShortDurationEndDate100: any;ShortDurationEndDate120: any;ShortDurationEndDate150: any;ShortDurationEndDate180: any;ShortDurationPrecipitationValue005: any;ShortDurationPrecipitationValue010: any;ShortDurationPrecipitationValue015: any;ShortDurationPrecipitationValue020: any;ShortDurationPrecipitationValue030: any;ShortDurationPrecipitationValue045: any;ShortDurationPrecipitationValue060: any;ShortDurationPrecipitationValue080: any;ShortDurationPrecipitationValue100: any;ShortDurationPrecipitationValue120: any;ShortDurationPrecipitationValue150: any;ShortDurationPrecipitationValue180: any;REM: any;BackupDirection: any;BackupDistance: any;BackupDistanceUnit: any;BackupElements: any;BackupElevation: any;BackupEquipment: any;BackupLatitude: any;BackupLongitude: any;BackupName: any;WindEquipmentChangeDate: any
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})




export class HomeComponent implements OnInit {

  //declaring lat, long, and dataObj variables
  lat: any;
  long: any;
  constructor() { }


  ngOnInit(): void{
    
  }
  //checking if value input into box is a zip code or a station ID
  zipOrStation(val: any){
    if(val.length <= 5){
      this.getCoords(val);
    }

    if(val.length > 5){
      console.log("great than 5");
    }
  }

  //converts the zip code given by user to geolocation coordinates
  getCoords(val: any){
    
    var num = Number(val)
    console.log(num);
    fetch("assets/ZipCodes.json")
    .then((res) => res.json())
    .then((data) =>{

          data.forEach((zipcode: any) => {
            if(zipcode.ZIPCODE == num){ 
              this.lat = zipcode.LAT;
              this.long = zipcode.LONG;
            }
          })
          console.log(this.lat);
          console.log(this.long);
          this.lat = null;
          this.long = null;
    });
  }
}