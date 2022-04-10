import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    
    if(this.headers.includes("HourlyDryBulbTemperature")){
      for(let i = 0; i < this.hourlyDataObj.length; i++){
        let temp: any[] = [];
        let display: any[] = [];
        let heads = this.degreeHeaders;
        temp[heads[0]] = this.hourlyDataObj[i].STATION;
        this.hourlyDataObj[i].DATE = this.hourlyDataObj[i].DATE.replaceAll("-", "/")
        temp[heads[1]] = this.hourlyDataObj[i].DATE.concat(" " + this.hourlyDataObj[i].TIME)
        temp[heads[2]] = this.hourlyDataObj[i].HourlyDryBulbTemperature;
        display[0] = this.hourlyDataObj[i].STATION;
        display[1] = this.hourlyDataObj[i].DATE.concat(" " + this.hourlyDataObj[i].TIME)
        display[2] = this.hourlyDataObj[i].HourlyDryBulbTemperature;
        
        this.degreeDaysObj.push(temp)
        this.displayObj.push(display)
      }
      var dateStart = new Date(this.hourlyDataObj[0].DATE)
      console.log(dateStart)
      
      //HTDD
      for(let k = 0; k < this.displayObj.length; k++){
        let obj: any[] = [];
        let display;
        let heads = this.degreeHeaders;

        
        if(k == 0){
          if(this.displayObj[0][2] < 65.3){
            var date2 = new Date(this.displayObj[0][1]);
            let DF = ((date2.getTime() - dateStart.getTime())/60000)/(1440);
            let temp = 65.3 - this.displayObj[0][2];
            obj[heads[3]] = DF*temp;
            display = DF*temp;
          }
          else{
            obj[heads[3]] = 0
            display = 0
          }
        }
        else{
          if(this.displayObj[k][2] < 65.3){
            var date1 = new Date(this.displayObj[k-1][1]);
            var date2 = new Date(this.displayObj[k][1]);
            let DF = ((date2.getTime() - date1.getTime())/60000)/(1440);
            let temp = 65.3 - this.displayObj[k][2];
            obj[heads[3]] = DF*temp;
            display = DF*temp;
          }
          else{
            obj[heads[3]] = 0
            display = 0
          }
        }
        this.degreeDaysObj[k].push(obj)
        this.displayObj[k].push(display)
      }

      //CLDD
      for(let k = 0; k < this.displayObj.length; k++){
        let obj: any[] = [];
        let display;
        let heads = this.degreeHeaders;

        
        if(k == 0){
          if(this.displayObj[0][2] > 65.3){
            var date2 = new Date(this.displayObj[0][1]);
            let DF = ((date2.getTime() - dateStart.getTime())/60000)/(1440);
            let temp = this.displayObj[0][2] - 65.3;
            obj[heads[4]] = DF*temp;
            display = DF*temp;
          }
          else{
            obj[heads[4]] = 0
            display = 0
          }
        }
        else{
          if(this.displayObj[k][2] > 65.3){
            var date1 = new Date(this.displayObj[k-1][1]);
            var date2 = new Date(this.displayObj[k][1]);
            let DF = ((date2.getTime() - date1.getTime())/60000)/(1440);
            let temp = this.displayObj[k][2] - 65.3;
            obj[heads[4]] = DF*temp;
            display = DF*temp;
          }
          else{
            obj[heads[4]] = 0
            display = 0
          }
        }

        
        this.degreeDaysObj[k].push(obj)
        this.displayObj[k].push(display)
      }
      
      //THDH
      for(let k = 0; k < this.displayObj.length; k++){
        let obj: any[] = [];
        let display;
        let heads = this.degreeHeaders;
        
        obj[heads[5]] = this.displayObj[k][3] * 24
        display = this.displayObj[k][3] * 24
        
        this.degreeDaysObj[k].push(obj)
        this.displayObj[k].push(display)
      }
      //CLDH
      for(let k = 0; k < this.displayObj.length; k++){
        let obj: any[] = [];
        let display;
        let heads = this.degreeHeaders;
        
        obj[heads[6]] = this.displayObj[k][4] * 24
        display = this.displayObj[k][4] * 24
        
        this.degreeDaysObj[k].push(obj)
        this.displayObj[k].push(display)
      }
      // var date2 = new Date(this.displayObj[1][1])
      
      // console.log(((date2.getTime() - date1.getTime())/60000)/(1440))

      this.isLoading = false;
      this.isLoaded = true;
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
}
