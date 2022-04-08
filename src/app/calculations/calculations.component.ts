import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calculations',
  templateUrl: './calculations.component.html',
  styleUrls: ['./calculations.component.css']
})
export class CalculationsComponent implements OnInit {

  hourlyDataObj: any[] = [];
  isLoading: boolean = false;
  isStart: boolean = true;
  isDDError: boolean = false;
  config: any;

  constructor(private router: Router){
    let state:any = this.router.getCurrentNavigation()!.extras.state;
      if(state) {
        this.hourlyDataObj = state.hourlyDataObj;
      }
      this.config = {
        itemsPerPage: 10,
        currentPage: 1
      };
    }
    ngOnInit(): void {
  }

  degreeDays(){
    this.isLoading = false;
    this.isDDError = true;
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
    }
    
  }
}
