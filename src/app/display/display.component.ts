import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
    //page variables
    yearsObj: any[] = [];
    years: number = 0;
    stationId: any;
    startDate: any[] = [];
    endDate: any[] = [];

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
        this.stationId = state.stationID;
        this.years = state.years
      }
      else {
        this.startDate = [];
        this.endDate = [];
        this.stationId = null;
      }
   }

  


  ngOnInit(): void {

    this.checkYears();
    // this.fetchCSV(2021, 72427053868);
    
    
  }

  //checking the number of year
  checkYears(){
    for(let k = 0; k < this.years; k++){
      this.yearsObj[k] = Number(this.startDate[0].year) + k;
    }
    console.log(this.yearsObj)
    //for multiple csv pulls of same station
    if (this.years > 1){
      for (let i = 0; i < this.years; i++){
        this.fetchCSV(this.yearsObj[i].toString(), Number(this.stationId[0]));
      }
    }
    else{
      this.fetchCSV(this.yearsObj[0].toString(), Number(this.stationId[0]));
    }
  }

  
  //takes in station id and attaches it to the end of the http links to pull the required csv. then the csv data is received as text and is converted into json for and placed in an array for display/printing/download purposes.
  fetchCSV(year: any,stationID: any){
    console.log(year);
    console.log(stationID)
    console.log(`https://www.ncei.noaa.gov/data/local-climatological-data/access/${year}/${stationID}.csv`)
    fetch(`https://www.ncei.noaa.gov/data/local-climatological-data/access/${year}/${stationID}.csv`)
    .then((res) => res.text())
    .then((data) =>{

      let csv = data
      
      //Remove "" that are automatically added
      csv = csv.replace(/['"]+/g, '')

      //splitting csv into lines and splitting the headers element
      let lines = csv.split("\n")
      let headers = lines[0].split(/,/)

      //adding "TIME" header
      headers.splice(2,0,"TIME")

      //making headers global
      this.headers = headers;

      //loop for pushing csv data into array for processing
      for(let i = 1; i < lines.length-1; i++) {
        let obj: any = [];
        let dObj: any = [];
        let currLine = lines[i].split(",")
        
        //seperating the date element into date and time elements
        let a = currLine[1].replace("T", " ")
        let b = a.split(" ")
        currLine.splice(1,0, "")
        
        //pushing the station ID, dat, and time into the currLine postitions to match headers.
        currLine[1] = b[0];
        currLine[2] = b[1];

        //begin pushing lines into elements of array.
        if(currLine[1] >= `${this.startDate[0].year}-${this.startDate[0].month}-${this.startDate[0].day}` && currLine[1] <= `${this.endDate[0].year}-${this.endDate[0].month}-${this.endDate[0].day}`){
          //station id through elevation.
          for(let j = 0; j < 6; j++) {
            obj[j] = currLine[j];
            dObj[headers[j]] = currLine[j];
            console.log(obj)
          }

          //for some reason the names gets split twice for had to add to parts of the line to one element of the array
          obj[6] = currLine[6] + currLine[7];
          dObj[headers[6]] = currLine[6] + currLine[7];

          //pushing the rest.
          for(let j = 7; j < headers.length; j++) {
            obj[j] = currLine[j+1];
            dObj[headers[j]] = currLine[j+1];
          }
          this.displayObj.push(obj);
          console.log(this.displayObj)
          this.dataObj.push(dObj);
        }
      }
      this.isLoading = false;
      console.log(this.dataObj)

      //sets loading spinner to false when the data is ready to be displayed
      
      // this.filterByDate(this.startDate, this.endDate);
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

  
}
