import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { saveAs } from "file-saver";
declare var require: any
@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  //headers
  hourlyHeaders = ['HourlyAltimeterSetting',
    'HourlyDewPointTemperature',
    'HourlyDryBulbTemperature',
    'HourlyPrecipitation',
    'HourlyPresentWeatherType',
    'HourlyPressureChange',
    'HourlyPressureTendency',
    'HourlyRelativeHumidity',
    'HourlySkyConditions',
    'HourlySeaLevelPressure',
    'HourlyStationPressure',
    'HourlyVisibility',
    'HourlyWetBulbTemperature',
    'HourlyWindDirection',
    'HourlyWindGustSpeed',
    'HourlyWindSpeed'
    ]
  dailyHeaders = ['Sunrise',
    'Sunset',
    'DailyAverageDewPointTemperature',
    'DailyAverageDryBulbTemperature',
    'DailyAverageRelativeHumidity',
    'DailyAverageSeaLevelPressure',
    'DailyAverageStationPressure',
    'DailyAverageWetBulbTemperature',
    'DailyAverageWindSpeed',
    'DailyCoolingDegreeDays',
    'DailyDepartureFromNormalAverageTemperature',
    'DailyHeatingDegreeDays',
    'DailyMaximumDryBulbTemperature',
    'DailyMinimumDryBulbTemperature',
    'DailyPeakWindDirection',
    'DailyPeakWindSpeed',
    'DailyPrecipitation',
    'DailySnowDepth',
    'DailySnowfall',
    'DailySustainedWindDirection',
    'DailySustainedWindSpeed',
    'DailyWeather'
    ]
    monthlyHeaders = ['MonthlyAverageRH', 'MonthlyDaysWithGT001Precip', 'MonthlyDaysWithGT010Precip', 'MonthlyDaysWithGT32Temp', 'MonthlyDaysWithGT90Temp', 'MonthlyDaysWithLT0Temp', 'MonthlyDaysWithLT32Temp', 'MonthlyDepartureFromNormalAverageTemperature', 'MonthlyDepartureFromNormalCoolingDegreeDays', 'MonthlyDepartureFromNormalHeatingDegreeDays', 'MonthlyDepartureFromNormalMaximumTemperature', 'MonthlyDepartureFromNormalMinimumTemperature', 'MonthlyDepartureFromNormalPrecipitation', 'MonthlyDewpointTemperature', 'MonthlyGreatestPrecip', 'MonthlyGreatestPrecipDate', 'MonthlyGreatestSnowDepth', 'MonthlyGreatestSnowDepthDate', 'MonthlyGreatestSnowfall', 'MonthlyGreatestSnowfallDate', 'MonthlyMaxSeaLevelPressureValue', 'MonthlyMaxSeaLevelPressureValueDate', 'MonthlyMaxSeaLevelPressureValueTime', 'MonthlyMaximumTemperature', 'MonthlyMeanTemperature', 'MonthlyMinSeaLevelPressureValue', 'MonthlyMinSeaLevelPressureValueDate', 'MonthlyMinSeaLevelPressureValueTime', 'MonthlyMinimumTemperature', 'MonthlySeaLevelPressure', 'MonthlyStationPressure', 'MonthlyTotalLiquidPrecipitation', 'MonthlyTotalSnowfall', 'MonthlyWetBulb', 'AWND', 'CDSD', 'CLDD', 'DSNW', 'HDSD', 'HTDD', 'NormalsCoolingDegreeDay', 'NormalsHeatingDegreeDay']

  //page variables
  yearsObj: any[] = [];
  years: number = 0;
  stationID: any;
  startDate: any[] = [];
  endDate: any[] = [];
  heightIndex = 0
  dataTypeObj: any[] = [];
  displayIndex: number = 0;
  startStr:string = "";
  endStr:string = "";
  config: any;
  emptyAvail: boolean = true;
  public maxSize: number = 7;
  public directionLinks: boolean = true;
  public autoHide: boolean = false;
  public responsive: boolean = true;
  public labels: any = {
      previousLabel: '<--',
      nextLabel: '-->',
      screenReaderPaginationLabel: 'Pagination',
      screenReaderPageLabel: 'page',
      screenReaderCurrentLabel: `You're on page`
  };

  //declaring objects for data table display
  displayObj: any[] = [];
  dataObj: any[] = [];
  headers: any[] = [];
  headersStats: any = [];

  hourlyObj: any[] = [];
  dailyObj: any[] = [];
  monthlyObj: any[] = [];
  allObj: any[] = [];

  hourlyDataObj: any[] = [];
  dailyDataObj: any[] = [];
  monthlyDataObj: any[] = [];
  allDataObj: any[] = [];

  hourlyHeads: any[] = [];
  dailyHeads: any[] = [];
  monthlyHeads: any[] = [];
  allHeaders: any[] = [];

  hourlyHeadersStats: any[] = []
  dailyHeadersStats: any[] = []
  monthlyHeadersStats: any[] = []
  allHeadersStats: any[] = []



  //making boolean for loading spinner
  isLoading: boolean = true;

  constructor(private router: Router) {
    let state:any = this.router.getCurrentNavigation()!.extras.state;
      if(state) {
        this.startDate = state.startDate;
        this.endDate = state.endDate;
        this.stationID = state.stationID;
        this.years = state.years;
        this.startStr = state.startStr;
        this.endStr = state.endStr;
        this.dataTypeObj = state.dataTypes;
      }
      else {
        this.startDate = [];
        this.endDate = [];
        this.stationID = null;
      }
      this.config = {
        itemsPerPage: 10,
        currentPage: 1
      };
   }

  async ngOnInit() {

    if(this.stationID) {
      await this.checkYears();
    }

  }

  //checking the number of year
  async checkYears(){

    for(let k = 0; k < this.years; k++){
      this.yearsObj[k] = Number(this.startDate[0].year) + k;
    }
    //for multiple csv pulls of same station

    for(let i=0; i<this.stationID.length; i++) {
      console.log("Fetching Station Data for " + this.stationID[i]);
      let stationObj:any[] = [];
      let stationHObj:any[] = [];
      let stationDObj:any[] = [];
      let stationMObj:any[] = [];
      for(let j=0; j<this.years; j++) {
        await this.fetchCSV(this.yearsObj[j].toString(), Number(this.stationID[i]), i, stationObj, stationHObj, stationDObj, stationMObj);
        console.log(this.allDataObj)
      }
      this.hourlyObj.push(stationHObj);
      this.dailyObj.push(stationDObj);
      this.monthlyObj.push(stationMObj)
      this.allObj.push(stationObj);
      this.displayObj = this.allObj;
      this.dataObj = this.allDataObj;
    }
    console.log("Requested Data Retrieved Successfully");
    console.log(this.displayObj[this.displayIndex]);
    for(let i of this.allHeadersStats) {
      for(let j of i) {
        j['EMP_RATE'] = (j['EMPTY']/j['TOTAL']*100).toFixed(2)
        j['AVAIL_RATE'] = ((j['TOTAL']-j['EMPTY'])/j['TOTAL']*100).toFixed(2)
      }
    }
    for(let i of this.hourlyHeadersStats) {
      for(let j of i) {
        j['EMP_RATE'] = (j['EMPTY']/j['TOTAL']*100).toFixed(2)
        j['AVAIL_RATE'] = ((j['TOTAL']-j['EMPTY'])/j['TOTAL']*100).toFixed(2)
      }
    }
    for(let i of this.dailyHeadersStats) {
      for(let j of i) {
        j['EMP_RATE'] = (j['EMPTY']/j['TOTAL']*100).toFixed(2)
        j['AVAIL_RATE'] = ((j['TOTAL']-j['EMPTY'])/j['TOTAL']*100).toFixed(2)
      }
    }
    for(let i of this.monthlyHeadersStats) {
      for(let j of i) {
        j['EMP_RATE'] = (j['EMPTY']/j['TOTAL']*100).toFixed(2)
        j['AVAIL_RATE'] = ((j['TOTAL']-j['EMPTY'])/j['TOTAL']*100).toFixed(2)
      }
    }


    //sets loading spinner to false when the data is ready to be displayed
    this.isLoading = false;
  }

  //takes in station id and attaches it to the end of the http links to pull the required csv. then the csv data is received as text and is converted into json for and placed in an array for display/printing/download purposes.
  async fetchCSV(year:any, stationID:any, stationsInd:any, stationObj:any, stationHObj:any, stationDObj:any, stationMObj:any){
    await fetch(`https://www.ncei.noaa.gov/data/local-climatological-data/access/${year}/${stationID}.csv`)
    .then((res) => res.text())
    .then((data) =>{

      let csv = data
      let csvheaders = csv.substring(0, csv.search("\n")).replace(/['"]+/g, '').split(/,/); // Why use many line, when one line do trick

      // Only do this once
      if(this.allHeaders.length<1) {
        this.allHeaders = ["STATION", "DATE", "TIME", "LATITUDE", "LONGITUDE", "ELEVATION", "NAME", "REPORT_TYPE", "SOURCE"]
        // Copy initial headers into each array
        this.hourlyHeads = this.allHeaders.slice();
        this.dailyHeads = this.allHeaders.slice();
        this.monthlyHeads = this.allHeaders.slice();

        for(let i=0; i<this.dataTypeObj.length; i++) {
          this.allHeaders.push(this.dataTypeObj[i])
          if(this.hourlyHeaders.includes(this.dataTypeObj[i])){
            this.hourlyHeads.push(this.dataTypeObj[i])
          }
          if(this.dailyHeaders.includes(this.dataTypeObj[i])){
            this.dailyHeads.push(this.dataTypeObj[i])
          }
          if(this.monthlyHeaders.includes(this.dataTypeObj[i])){
            this.monthlyHeads.push(this.dataTypeObj[i])
          }
        }

        // Initialize Empty Stats Object
        for(let i=0; i<this.stationID.length; i++) {
          let tmpA = []
          let tmpH = []
          let tmpD = []
          let tmpM = []
          for(let j=0; j<this.dataTypeObj.length; j++) {
            tmpA.push({'TOTAL':0,'EMPTY':0,'RATE':-1})
            if(this.hourlyHeaders.includes(this.dataTypeObj[j])){
              tmpH.push({'TOTAL':0,'EMPTY':0,'RATE':-1})
            }
            if(this.dailyHeaders.includes(this.dataTypeObj[j])){
              tmpD.push({'TOTAL':0,'EMPTY':0,'RATE':-1})
            }
            if(this.monthlyHeaders.includes(this.dataTypeObj[j])){
              tmpM.push({'TOTAL':0,'EMPTY':0,'RATE':-1})
            }
          }
          this.allHeadersStats.push(tmpA)
          this.hourlyHeadersStats.push(tmpH)
          this.dailyHeadersStats.push(tmpD)
          this.monthlyHeadersStats.push(tmpM)
        }
      }

      //Remove "" that are automatically added
      csv = csv.replace(/['"]+/g, '')

      // Trim csv to only relevant dates
      csv = this.trimToDates(csv, year)

      //splitting csv into lines and splitting the headers element
      let lines = csv.split("\n")

      //adding "TIME" header
      csvheaders.splice(2,0,"TIME")

      // Get indices of data types to filter
      let desiredTypes: number[] = []
      let desiredHTypes: number[] = []
      let desiredDTypes: number[] = []
      let desiredMTypes: number[] = []


      let hourly: any[] = [];
      let daily: any[] = [];
      let monthly: any[] = [];

      //all types
      for(let i=0; i<csvheaders.length; i++) {
        if(this.dataTypeObj.includes(csvheaders[i])) {
          desiredTypes.push(i)
        }
      }

      //hourly types
      for(let i=0; i<this.hourlyHeaders.length; i++) {
        if(this.dataTypeObj.includes(this.hourlyHeaders[i])){
          hourly.push(this.hourlyHeaders[i])
        }
      }
      for(let i=0; i<csvheaders.length; i++) {
        if(hourly.includes(csvheaders[i])) {
          desiredHTypes.push(i)
        }
      }

      //daily types
      for(let i=0; i<this.dailyHeaders.length; i++) {
        if(this.dataTypeObj.includes(this.dailyHeaders[i])){
          daily.push(this.dailyHeaders[i])
        }
      }
      for(let i=0; i<csvheaders.length; i++) {
        if(daily.includes(csvheaders[i])) {
          desiredDTypes.push(i)
        }
      }

      //monthly types
      for(let i=0; i<this.monthlyHeaders.length; i++) {
        if(this.dataTypeObj.includes(this.monthlyHeaders[i])){
          monthly.push(this.monthlyHeaders[i])
        }
      }
      for(let i=0; i<csvheaders.length; i++) {
        if(monthly.includes(csvheaders[i])) {
          desiredMTypes.push(i)
        }
      }


      //loop for pushing csv data into array for processing

      for(let i = 1; i < lines.length-1; i++) {
        // Data accumulators
        let dObj: any = [];
        let dHObj: any = [];
        let dDObj: any = [];
        let dMObj: any = [];


        // Display accumulators
        let obj: any = [];
        let hObj: any = [];
        let dayObj: any = [];
        let mObj: any = [];
        let currLine = lines[i].split(",")

        //seperating the date element into date and time elements
        let a = currLine[1].replace("T", " ")
        let b = a.split(" ")
        currLine.splice(1,0, "")

        //pushing the station ID, date, and time into the currLine postitions to match headers.
        currLine[1] = b[0];
        currLine[2] = b[1];

        //begin pushing lines into elements of array.
        if(currLine[1] >= `${this.startDate[0].year}-${this.startDate[0].month}-${this.startDate[0].day}` && currLine[1] <= `${this.endDate[0].year}-${this.endDate[0].month}-${this.endDate[0].day}`){
          //station id through elevation.
          for(let j = 0; j < 6; j++) {
            obj[j] = currLine[j];
            hObj[j] = currLine[j];
            dayObj[j] = currLine[j];
            mObj[j] = currLine[j];

            dObj[csvheaders[j]] = currLine[j];
            dHObj[csvheaders[j]] = currLine[j];
            dDObj[csvheaders[j]] = currLine[j];
            dMObj[csvheaders[j]] = currLine[j];

          }

          //for some reason the names gets split twice for had to add to parts of the line to one element of the array
          obj[6] = currLine[6] + currLine[7];
          hObj[6] = currLine[6] + currLine[7];
          dayObj[6] = currLine[6] + currLine[7];
          mObj[6] = currLine[6] + currLine[7];

          dObj[csvheaders[6]] = currLine[6] + currLine[7];
          dHObj[csvheaders[6]] = currLine[6] + currLine[7];
          dDObj[csvheaders[6]] = currLine[6] + currLine[7];
          dMObj[csvheaders[6]] = currLine[6] + currLine[7];


          //pushing Report Type and Source.
          for(let j = 7; j < 9; j++) {
            obj[j] = currLine[j+1];
            dObj[this.allHeaders[j]] = currLine[j+1];

            if(currLine[8] == "FM-15" || "FM-12" || "FM-16"){
              hObj[j] = currLine[j+1];
              dHObj[this.hourlyHeads[j]] = currLine[j+1];
            }
            if(currLine[8] == "SOD  "){
              dayObj[j] = currLine[j+1];
              dDObj[this.dailyHeads[j]] = currLine[j+1];
            }
            if(currLine[8] == "SOM  "){
              mObj[j] = currLine[j+1];
              dMObj[this.monthlyHeads[j]] = currLine[j+1];
            }
          }

          let ind = 9, indH = 9, indD = 9, indM = 9;
          let statsInd = -1, statsIndH = 0, statsIndD = 0, statsIndM = 0;
          // Yes, the parse & stringify is actually needed
          let tmpStatsH = JSON.parse(JSON.stringify(this.hourlyHeadersStats[stationsInd])),
              tmpStatsD = JSON.parse(JSON.stringify(this.dailyHeadersStats[stationsInd])),
              tmpStatsM = JSON.parse(JSON.stringify(this.monthlyHeadersStats[stationsInd])),
              tmpStatsA = JSON.parse(JSON.stringify(this.allHeadersStats[stationsInd]));

          //pushing the rest.
          for(let j = 9; j < csvheaders.length; j++) {
            if(desiredTypes.includes(j)) {
              obj[ind++] = currLine[j+1];
              dObj[csvheaders[j]] = currLine[j+1];

              statsInd++;
            }
            if((hObj[7] == "FM-15" && desiredHTypes.includes(j)) || (hObj[7] == "FM-12" && desiredHTypes.includes(j)) || (hObj[7] == "FM-16" && desiredHTypes.includes(j))){
              hObj[indH] = currLine[j+1];
              dHObj[csvheaders[j]] = currLine[j+1];

              indH++
              tmpStatsH[statsIndH]['TOTAL'] += 1;
              if(!currLine[j+1]) {
                tmpStatsH[statsIndH]['EMPTY'] += 1;
              }

              statsIndH++;
              tmpStatsA[statsInd]['TOTAL'] += 1;
              if(!currLine[j+1]) {
                tmpStatsA[statsInd]['EMPTY'] += 1;
              }
            }
            else if(dayObj[7] == "SOD  " && desiredDTypes.includes(j)){
              dayObj[indD] = currLine[j+1];
              dDObj[csvheaders[j]] = currLine[j+1];

              indD++
              tmpStatsD[statsIndD]['TOTAL'] += 1;
              if(!currLine[j+1]) {
                tmpStatsD[statsIndD]['EMPTY'] += 1;
              }
              statsIndD++;
              tmpStatsA[statsInd]['TOTAL'] += 1;
              if(!currLine[j+1]) {
                tmpStatsA[statsInd]['EMPTY'] += 1;
              }
            }
            else if(mObj[7] == "SOM  " && desiredMTypes.includes(j)){
              mObj[indM] = currLine[j+1];
              dMObj[csvheaders[j]] = currLine[j+1];

              indM++
              tmpStatsM[statsIndM]['TOTAL'] += 1;
              if(!currLine[j+1]) {
                tmpStatsM[statsIndM]['EMPTY'] += 1;
              }
              statsIndM++;
              tmpStatsA[statsInd]['TOTAL'] += 1;
              if(!currLine[j+1]) {
                tmpStatsA[statsInd]['EMPTY'] += 1;
              }
            }
            // Data types without an Hourly/Daily/Monthly designation are calculated as if from any report type
            else if(desiredTypes.includes(j) && !desiredHTypes.includes(j) && !desiredDTypes.includes(j) && !desiredMTypes.includes(j)) {
              tmpStatsA[statsInd]['TOTAL'] += 1;
              if(!currLine[j+1]) {
                tmpStatsA[statsInd]['EMPTY'] += 1;
              }
            }

          }
          if(hObj.slice(9).length > 0){
            let tmp: string = "";
            for (let i of hObj.slice(9)) {
              tmp += i.toString().trim();
            } if(tmp) {
              stationHObj.push(hObj)
              this.hourlyDataObj.push(dHObj);
              this.hourlyHeadersStats[stationsInd] = tmpStatsH.slice()
            }
          }
          if(dayObj.slice(9).length > 0){
            let tmp: string = "";
            for (let i of dayObj.slice(9)) {
              tmp += i.toString().trim();
            } if(tmp) {
              stationDObj.push(dayObj)
              this.dailyDataObj.push(dDObj);
              this.dailyHeadersStats[stationsInd] = tmpStatsD.slice()
            }
          }
          if(mObj.slice(9).length > 0){
            let tmp: string = "";
            for (let i of mObj.slice(9)) {
              tmp += i.toString().trim();
            } if(tmp) {
              stationMObj.push(mObj)
              this.monthlyDataObj.push(dMObj);
              this.monthlyHeadersStats[stationsInd] = tmpStatsM.slice()
            }
          }

          if(obj.slice(9).length > 0){
            let tmp: string = "";
            for (let i of obj.slice(9)) {
              tmp += i.toString().trim();
            } if(tmp) {
              stationObj.push(obj);
              this.allDataObj.push(dObj);
              this.allHeadersStats[stationsInd] = tmpStatsA.slice()
            }
          }
        }
      }
    })
    this.headers = this.allHeaders;
    this.headersStats = this.allHeadersStats;
  }

  //triggers download of array data into a csv to users computer.
  downloadCSV(){
    let filename = "NCEI_Weather_Data";

    var options = {
      fieldSeparator: ',',
      showLabels: true,
      headers: this.headers
    };

    new ngxCsv(this.dataObj, filename, options);
  }

  emptyValues(obj: any){
    let checking: Boolean = true;

  }

  pageChanged(event: any){
    this.config.currentPage = event;
  }

  onChange(e: any){
    this.config.itemsPerPage = e.target.value;
  }
  onChangeType(e: any){
    if(e.target.value == "Hourly"){
      this.displayObj = this.hourlyObj;
      this.dataObj = this.hourlyDataObj;
      this.headers = this.hourlyHeads;
      this.headersStats = this.hourlyHeadersStats;
      this.config.currentPage = 1;
      console.log(this.dataObj)
    }
    if(e.target.value == "Daily"){
      this.displayObj = this.dailyObj;
      this.dataObj = this.dailyDataObj;
      this.headers = this.dailyHeads;
      this.headersStats = this.dailyHeadersStats;
      this.config.currentPage = 1;
      console.log(this.dataObj)
    }
    if(e.target.value == "Monthly"){
      this.displayObj = this.monthlyObj;
      this.dataObj = this.monthlyDataObj;
      this.headers = this.monthlyHeads;
      this.headersStats = this.monthlyHeadersStats;
      this.config.currentPage = 1;
      console.log(this.dataObj)
    }
    if(e.target.value == "All"){
      this.displayObj = this.allObj;
      this.dataObj = this.allDataObj;
      this.headers = this.allHeaders;
      this.headersStats = this.allHeadersStats;
      this.config.currentPage = 1;
    }
  }

  async exportTojson() {
    const { convertArrayToCSV } = require('convert-array-to-csv');
    const converter = require('convert-array-to-csv');

    let filename = "NCEI_Weather_Data";
    let header = this.headers;
    var temp: string = "";
    for(let i = 0; i < this.allObj.length; i++){
      var csvFromArrayOfArrays: string = convertArrayToCSV(this.allObj[i], {
        header,
        separator: ','
      });
      temp += csvFromArrayOfArrays
    }
    temp = temp.substring(0, temp.length-2)

    let exportData = JSON.parse(await this.CSVtoJSON(temp))
    return saveAs(
      new Blob([JSON.stringify(exportData, null, 2)], { type: 'JSON' }), `${filename}.json`
    );
  }

  async CSVtoJSON(val: string):Promise<string> {
    let path: string = val
    let jsonFile: any = []

    let csv = val
    //Remove "" that are automatically added
    csv = csv.replace(/['"]+/g, '')

    let lines = csv.split("\n")
    let headers = lines[0].split(",")
    for(let i=1; i<lines.length; i++) {
      let obj: any = {}
      let currLine = lines[i].split(",")
      for(let j=0; j<headers.length; j++) {
        obj[headers[j]] = currLine[j];
      }
      jsonFile.push(obj)
    };
    return JSON.stringify(jsonFile)
  }

  trimToDates(csv:string, year:string) {
    let tempStartDateObj = new Date(+this.startDate[0].year, +this.startDate[0].month-1, this.startDate[0].day)
    let ind = -1
    let minDate = new Date(+this.startDate[0].year, 0, 1)
    let maxDate = new Date(+this.endDate[0].year, 11, 31)

    while(year == this.startDate[0].year && ind==-1 && tempStartDateObj>=minDate) {
      let start = tempStartDateObj.getFullYear() + '-' + ("0"+(tempStartDateObj.getMonth()+1)).slice(-2) + '-' + ("0" + tempStartDateObj.getDate()).slice(-2)
      let startRegex = new RegExp(`[\n][0-9]*[,]*${start}`)
      ind = csv.search(startRegex)
      if(ind!=-1) {
        csv = csv.slice(ind);
      }
      else{
        tempStartDateObj.setDate(tempStartDateObj.getDate()-1);
      }
    }

    let tempEndDateObj = new Date(+this.endDate[0].year, +this.endDate[0].month-1, this.endDate[0].day)
    ind = -1
    while(year == this.endDate[0].year && ind==-1 && tempEndDateObj<=maxDate) {
      let end = tempEndDateObj.getFullYear() + '-' + ("0"+(tempEndDateObj.getMonth()+1)).slice(-2) + '-' + ("0" + tempEndDateObj.getDate()).slice(-2)
      ind = csv.search(end)
      if(ind!=-1) {
        csv = csv.slice(0, csv.indexOf("\n", csv.lastIndexOf(end))+1)
      }
      else{
        tempEndDateObj.setDate(tempEndDateObj.getDate()+1);
      }
    }
    return csv
  }

  changeStation(id:any) {
    this.displayIndex = this.stationID.indexOf(id)
    let tab:any = document.getElementById(id)
    let allTabs:any = document.getElementsByClassName("tab")
    this.config.currentPage = 1;
    for(let i=0; i<allTabs.length; i++) {
      allTabs[i].style.backgroundColor=null;
    }
    tab.style.backgroundColor="#839c7c";
  }

  toggleEmptyAvail() {
    this.emptyAvail = !this.emptyAvail;
  }

  stationDataDisplayEmpty() {
    if(this.headersStats[this.displayIndex]) {
      for(let row of this.headersStats[this.displayIndex]) {
        if(row['TOTAL']>0) {
          return false;
        }
      }
    }
    return true;
  }

  goBack(){
    this.router.navigate(["/data"])
  }
}
