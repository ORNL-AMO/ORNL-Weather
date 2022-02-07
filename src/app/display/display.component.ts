import { Component, OnInit } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  constructor() { }

  //page variables
  yearsObj: any[] = [];
  stationsIdObj: any[] = [];


  ngOnInit(): void {
    
    this.fetchCSV(2010, 91772099999);
    this.fetchCSV(2011, 91772099999);

  }
  
  //declaring headers for data table display
  headers: any[]= [];
  displayObj: any[] = [];
  dataObj: any[] = [];
  filteredObj: any[] = [];

  //making boolean for loading spinner
  isLoading: boolean = true;

  //checking the number of year
  checkYears(){
    let len = this.yearsObj.length
    if (this.yearsObj[0].year == this.yearsObj[len-1].year){
      for (let i = 0; i < len; i++){
        this.fetchCSV(this.yearsObj[i], this.stationsIdObj[i]);
      }
    }
    else{
      this.fetchCSV(this.yearsObj[0].year, this.stationsIdObj[0]);
    }
  }

  //takes in station id and attaches it to the end of the http links to pull the required csv. then the csv data is received as text and is converted into json for and placed in an array for display/printing/download purposes. 
  fetchCSV(year: any,val: any){
    
    fetch(`https://www.ncei.noaa.gov/data/local-climatological-data/access/${year}/${val}.csv`)
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
        
        //pushing the station ID, dat, and time into the first three array elements
        currLine[1] = b[0];
        currLine[2] = b[1];
        console.log(currLine[5]);
        //now pushing the rest of the split data into remaining array
        for(let j = 0; j < 6; j++) {
          obj[j] = currLine[j];
          dObj[headers[j]] = currLine[j];
        }
        obj[6] = currLine[6] + currLine[7];
        dObj[headers[6]] = currLine[6] + currLine[7];
        for(let j = 7; j < headers.length; j++) {
          obj[j] = currLine[j+1];
          dObj[headers[j]] = currLine[j+1];
        }
        this.displayObj.push(obj);
        this.dataObj.push(dObj);
      }
      // this.dataObj.pop();
      
      console.log(this.dataObj)
      
      //sets loading spinner to false when the data is ready to be displayed
      this.isLoading = false; 
    })
  }

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
