import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { saveAs } from "file-saver";
declare var require: any

@Component({
  selector: 'app-calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.css']
})
export class CalculationsComponent implements OnInit {

  displayObj: any[] = [];
  hourlyDataObj: any[] = [];
  headers: any[] = [];
  degreeHeaders: any = ["STATION", "DATETIME", "HourlyDryBulbTemperature", "HTDD", "CLDD", "HTDH", "CLDH"]
  csvHeaders: any = ["STATION", "DATETIME", "HourlyDryBulbTemperature", "HTDD", "Total_HTDD", "CLDD", "Total_CLDD", "HTDH", "Total_HTDH", "CLDH", "Total_CLDH",]
  totalHTDD: number = 0;
  totalCLDD: number = 0;
  totalHTDH: number = 0;
  totalCLDH: number = 0;

  degreeDaysObj: any[] = [];
  isLoading: boolean = false;
  isLoaded: boolean = false;
  isStart: boolean = true;
  isDDError: boolean = false;
  config: any;

  constructor(private router: Router){
    let state:any = this.router.getCurrentNavigation()!.extras.state;
      if(state) {
        this.hourlyDataObj = state.hourlyData;
        this.headers = state.headers;
      }
      this.config = {
        itemsPerPage: 10,
        currentPage: 1
      };
    }
    ngOnInit(): void {
  }

  degreeDays(){
    let index: any[] = [];
    if(this.headers.includes("HourlyDryBulbTemperature")){

      //checking for NaN types in HourlyDryBulbTemperature and removing them
      // for(let i = 0; i < this.hourlyDataObj.length; i++){
      //   if (isNaN(this.hourlyDataObj[i].HourlyDryBulbTemperature)){
      //     index.push(i)
      //   }
      // }
      // console.log(index)
      // for(let i = 0; i < index.length; i++){
      //   this.hourlyDataObj.splice(index[i], 1)
      //   console.log(index[i])
      // }

      for(let i = 0; i < this.hourlyDataObj.length; i++){
        let temp: any[] = [];
        let display: any[] = [];
        let heads = this.csvHeaders;
        temp[heads[0]] = this.hourlyDataObj[i].STATION;
        this.hourlyDataObj[i].DATE = this.hourlyDataObj[i].DATE.replaceAll("-", "/")
        temp[heads[1]] = this.hourlyDataObj[i].DATE.concat(" " + this.hourlyDataObj[i].TIME)
        temp[heads[2]] = this.hourlyDataObj[i].HourlyDryBulbTemperature;
        temp[heads[3]] = ""
        temp[heads[4]] = ""
        temp[heads[5]] = ""
        temp[heads[6]] = ""
        temp[heads[7]] = ""
        temp[heads[8]] = ""
        temp[heads[9]] = ""
        temp[heads[10]] = ""

        display[0] = this.hourlyDataObj[i].STATION;
        display[1] = this.hourlyDataObj[i].DATE.concat(" " + this.hourlyDataObj[i].TIME)
        display[2] = this.hourlyDataObj[i].HourlyDryBulbTemperature;
        display[3] = ""
        display[4] = ""
        display[5] = ""
        display[6] = ""

        
        this.degreeDaysObj.push(temp)
        this.displayObj.push(display)
      }
      var dateStart = new Date(this.hourlyDataObj[0].DATE)
      console.log(dateStart)
      
      //HTDD
      for(let k = 0; k < this.displayObj.length; k++){
        if(k == 0){
          if(this.displayObj[0][2] < 65.3){
            var date2 = new Date(this.displayObj[0][1]);
            let DF = ((date2.getTime() - dateStart.getTime())/60000)/(1440);
            let temp = 65.3 - this.displayObj[0][2];
            this.degreeDaysObj[k].HTDD = DF*temp;
            this.displayObj[k][3] = DF*temp;
            this.totalHTDD += DF*temp;
          }
          else{
            this.degreeDaysObj[k].HTDD = 0;
            this.displayObj[k][3] = 0;
          }
        }
        else{
          if(this.displayObj[k][2] < 65.3){
            var date1 = new Date(this.displayObj[k-1][1]);
            var date2 = new Date(this.displayObj[k][1]);
            let DF = ((date2.getTime() - date1.getTime())/60000)/(1440);
            let temp = 65.3 - this.displayObj[k][2];
            this.degreeDaysObj[k].HTDD = DF*temp;
            this.displayObj[k][3] = DF*temp;
            this.totalHTDD += DF*temp;
          }
          else{
            this.degreeDaysObj[k].HTDD = 0;
            this.displayObj[k][3] = 0;
          }
        }
      }

      //CLDD
      for(let k = 0; k < this.displayObj.length; k++){
        if(k == 0){
          if(this.displayObj[0][2] > 65.3){
            var date2 = new Date(this.displayObj[0][1]);
            let DF = ((date2.getTime() - dateStart.getTime())/60000)/(1440);
            let temp = this.displayObj[0][2] - 65.3;
            this.degreeDaysObj[k].CLDD = DF*temp;
            this.displayObj[k][4] = DF*temp;
            this.totalCLDD += DF*temp;
          }
          else{
            this.degreeDaysObj[k].CLDD = 0;
            this.displayObj[k][4] = 0;
          }
        }
        else{
          if(this.displayObj[k][2] > 65.3){
            var date1 = new Date(this.displayObj[k-1][1]);
            var date2 = new Date(this.displayObj[k][1]);
            let DF = ((date2.getTime() - date1.getTime())/60000)/(1440);
            let temp = this.displayObj[k][2] - 65.3;
            this.degreeDaysObj[k].CLDD = DF*temp;
            this.displayObj[k][4] = DF*temp;
            this.totalCLDD += DF*temp;
          }
          else{
            this.degreeDaysObj[k].CLDD = 0;
            this.displayObj[k][4] = 0;
          }
        }
      }
      
      //HTDH
      for(let k = 0; k < this.displayObj.length; k++){
        this.degreeDaysObj[k].HTDH = this.displayObj[k][3] * 24
        this.displayObj[k][5] = this.displayObj[k][3] * 24
        this.totalHTDH += this.displayObj[k][3] * 24
      }

      //CLDH
      for(let k = 0; k < this.displayObj.length; k++){
        this.degreeDaysObj[k].CLDH = this.displayObj[k][4] * 24
        this.displayObj[k][6] = this.displayObj[k][4] * 24
        this.totalCLDH += this.displayObj[k][4] * 24

      }
      this.degreeDaysObj[0].Total_HTDD = this.totalHTDD;
      this.degreeDaysObj[0].Total_CLDD = this.totalCLDD;
      this.degreeDaysObj[0].Total_HTDH = this.totalHTDH;
      this.degreeDaysObj[0].Total_CLDH = this.totalCLDH;

      this.isLoading = false;
      this.isLoaded = true;

      console.log(this.degreeDaysObj)
    }
    else{
      this.isLoading = false;
      this.isDDError = true;
    }
    
  }

  goBack(){
    this.router.navigate(["/display"])
  }

  pageChanged(event: any){
    this.config.currentPage = event;
  }

  onChange(e: any){
    this.config.itemsPerPage = e.target.value;
  }
  onChangeCalc(e: any){
    if(e.target.value == 'DD'){
      this.isStart = false;
      this.isLoading = true;
      this.degreeDays();
    }
    else{
      this.isStart = true;
      this.isLoading = false;
      this.isDDError = false;
      this.isLoaded = false;
    }
    
  }

  async exportTojson() {
    const { convertArrayToCSV } = require('convert-array-to-csv');
    const converter = require('convert-array-to-csv');

    let filename = "NCEI_Degree_Days";
    let header = this.degreeHeaders;
    var temp: string = "";
    for(let i = 0; i < this.displayObj.length; i++){
      var csvFromArrayOfArrays: string = convertArrayToCSV(this.displayObj[i], {
        header,
        separator: ','
      });
      temp += csvFromArrayOfArrays
    }
    console.log(temp)
    temp = temp.substring(0, temp.length)
    console.log(temp)

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

  downloadCSV(){
    let filename = "NCEI_Degree_Days";

    var options = {
      fieldSeparator: ',',
      showLabels: true,
      headers: this.csvHeaders
    };

    new ngxCsv(this.degreeDaysObj, filename, options);
  }
}
