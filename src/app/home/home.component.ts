import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  //declaring relevant variables
  lat: any;
  long: any;
  startDate: any;
  endDate: any;

  constructor() { }


  ngOnInit(): void {
  }

  getCoordsAndDate(zip: any, SD: any, ED: any){
    this.startDate = SD;
    this.endDate = ED;
    console.log(this.startDate);
    console.log(this.endDate);
  

    var num = Number(zip)
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