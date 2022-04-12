import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  ssClr(){sessionStorage.clear()}
  ssClrStationsFwd(){
    // Stations
    sessionStorage.removeItem("sendingArrayStations")
    // Data
    sessionStorage.removeItem("stationDataObjs")
    sessionStorage.removeItem("masterSelected")
    sessionStorage.removeItem("masterCheckedList")
    sessionStorage.removeItem("sendingDataList")
  }
  ssClrDataFwd(){
    // Data
    sessionStorage.removeItem("sendingDataList")
  }
  ssClrDisplayFwd(){}

}
