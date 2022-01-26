import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  //Declare required variables
  lat: any
  long: any
  stationID: string = ""
  errors: string = ""
  private stationsJSON: any
  private zipJSON: any;
  startDate: any;
  endDate: any;

  ngOnInit(): void{
    
  }
  //checking if value input into box is a zip code or a station ID
  zipOrStation(val: any){
    if(val.length <= 5){
      this.getCoords(val);
    }

    if(val.length > 5){
      console.log("great than 5");
    }
  }

  //converts the zip code given by user to geolocation coordinates
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