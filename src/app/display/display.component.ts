import { Component, OnInit } from '@angular/core';
import { ngxCsv } from 'ngx-csv/ngx-csv';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    
    this.fetchCSV(74795012867);
  }
  
  //declaring headers for data table display
  headers: any[]= [];
  displayObj: any[] = [];
  dataObj: any[] = [];
  filteredObj: any[] = [];

  //making boolean for loading spinner
  isLoading: boolean = true;

  //takes in station id and attaches it to the end of the http links to pull the required csv. then the csv data is received as text and is converted into json for and placed in an array for display/printing/download purposes. 
  fetchCSV(val: any){
    var object: any[] = [];
    fetch(`https://www.ncei.noaa.gov/data/local-climatological-data/access/2022/${val}.csv`)
    .then((res) => res.text())
    .then((data) =>{

      let csv = data
        //Remove "" that are automatically added
        csv = csv.replace(/['"]+/g, '')
  
        let lines = csv.split("\n")
        let headers = lines[0].split(/,/)
        this.headers = headers;
        for(let i = 1; i < lines.length; i++) {
          let obj: any = [];
          let dObj: any = [];
          let currLine = lines[i].split(",")
          currLine.splice(6, 1);
          for(let j = 0; j < headers.length; j++) {
            obj[j] = currLine[j];
            dObj[headers[j]] = currLine[j];
          }
          // obj[5] = currLine[5] + currLine[6];
          // dObj[headers[5]] = currLine[5] + currLine[6];
          // for(let j = 7; j < headers.length; j++) {
          //   obj[j] = currLine[j+1];
          //   dObj[headers[j]] = currLine[j+1];
          // }
          this.displayObj.push(obj);
          this.dataObj.push(dObj);
        }
        this.dataObj.pop();
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

}
