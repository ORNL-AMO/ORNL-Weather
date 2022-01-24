import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  //declaring lat and long variables
  lat: any;
  long: any;

  constructor() { }


  ngOnInit(): void {
  }

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