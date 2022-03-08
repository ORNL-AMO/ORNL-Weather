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
  //page variables
  yearsObj: any[] = [];
  years: number = 0;
  stationID: any;
  startDate: any[] = [];
  endDate: any[] = [];
  displayIndex: number = 0;
  startStr:string = "";
  endStr:string = "";
  config: any;
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

  //declaring headers for data table display
  displayObj: any[] = [];
  dataObj: any[] = [];
  headers: any[] = [];
  
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

    await this.checkYears();
    // this.fetchCSV(2021, 72427053868);

  }

  //checking the number of year
  async checkYears(){
    for(let k = 0; k < this.years; k++){
      this.yearsObj[k] = Number(this.startDate[0].year) + k;
    }
    //for multiple csv pulls of same station
    for(let i=0; i<this.years; i++) {
      for(let j=0; j<this.stationID.length; j++) {
        await this.fetchCSV(this.yearsObj[i].toString(), Number(this.stationID[j]), j);
      }
    }
    //sets loading spinner to false when the data is ready to be displayed
    // this.displayObj = this.displayObj.slice(0, 100);  //TEST: Fake paging
    this.isLoading = false;
  }



  //takes in station id and attaches it to the end of the http links to pull the required csv. then the csv data is received as text and is converted into json for and placed in an array for display/printing/download purposes.
  async fetchCSV(year:any, stationID:any, ind:any){
    await fetch(`https://www.ncei.noaa.gov/data/local-climatological-data/access/${year}/${stationID}.csv`)
    .then((res) => res.text())
    .then((data) =>{

      let csv = data
      let headers = csv.substring(0, csv.search("\n")).replace(/['"]+/g, '').split(/,/); // Why use many line, when one line do trick

      //Remove "" that are automatically added
      csv = csv.replace(/['"]+/g, '')

      // Trim csv to only relevant dates
      if(year == this.startDate[0].year) {
        let startStr = this.startDate[0].year + '-' + this.startDate[0].month + '-' + this.startDate[0].day
        let startRegex = new RegExp(`[\n][0-9]*[,]*${startStr}`)
        csv = csv.slice(csv.search(startRegex));
      }
      if(year == this.endDate[0].year) {
        let endStr = this.endDate[0].year + '-' + this.endDate[0].month + '-' + this.endDate[0].day
        csv = csv.slice(0, csv.indexOf("\n", csv.lastIndexOf(endStr))+1);
      }

      //splitting csv into lines and splitting the headers element
      let lines = csv.split("\n")
      //adding "TIME" header
      headers.splice(2,0,"TIME")

      //making headers global
      this.headers = headers;

      let stationObj:any[] = [];
      //loop for pushing csv data into array for processing
      for(let i = 1; i < lines.length-1; i++) {
        let obj: any = [];
        let dObj: any = [];
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
            dObj[headers[j]] = currLine[j];
          }

          //for some reason the names gets split twice for had to add to parts of the line to one element of the array
          obj[6] = currLine[6] + currLine[7];
          dObj[headers[6]] = currLine[6] + currLine[7];

          //pushing the rest.
          for(let j = 7; j < headers.length; j++) {
            obj[j] = currLine[j+1];
            dObj[headers[j]] = currLine[j+1];
          }
          stationObj.push(obj);
          this.dataObj.push(dObj);
        }
      }
      this.displayObj.push(stationObj);
      console.log(this.dataObj)
    })
  }

  //triggers download of array data into a csv to users computer.
  downloadCSV(){
    let filename = this.dataObj[0].STATION;

    var options = {
      fieldSeparator: ',',
      showLabels: true,
      headers: this.headers
    };


    new ngxCsv(this.dataObj, `STATION_${filename}_DATA`, options);
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

  async exportTojson() {
    const { convertArrayToCSV } = require('convert-array-to-csv');
    const converter = require('convert-array-to-csv');
      
    let filename = this.dataObj[0].STATION;
    let header = this.headers;
    var csvFromArrayOfArrays = convertArrayToCSV(this.displayObj, {
      header,
      separator: ','
    });
    console.log(csvFromArrayOfArrays)
    let exportData = JSON.parse(await this.CSVtoJSON(csvFromArrayOfArrays))
    console.log(exportData)
    return saveAs(
      new Blob([JSON.stringify(exportData, null, "...")], { type: 'JSON' }), `STATION_${filename}_DATA.json`
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

  changeStation(id:any) {
    this.displayIndex = this.stationID.indexOf(id)
    let tab:any = document.getElementById(id)
    let allTabs:any = document.getElementsByClassName("tab")
    for(let i=0; i<allTabs.length; i++) {
      allTabs[i].style.backgroundColor=null;
    }
    tab.style.backgroundColor="#839c7c";
  }
}
