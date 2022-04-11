import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})

export class DataComponent implements OnInit {
  stationIdArray: any[] = [];
  dataTypesArray: any[] = [];
  headers = ['Data Types']
  masterSelected:boolean;
  checklist:any;
  checkedList:any;

  //page variables
  yearsObj: any[] = [];
  stationId: any;
  sendingArray: any[] = [];

  constructor(private router: Router)
    {
      let state:any = this.router.getCurrentNavigation()!.extras.state;
      if(state) {
        this.startDate = state.startDate;
        this.endDate = state.endDate;
        this.stationID = state.stationID;
        this.years = state.years;
        this.startStr = state.startStr;
        this.endStr = state.endStr;
      }
      else {
        this.startDate = [];
        this.endDate = [];
        this.stationID = null;
      }
    }

  ngOnInit(): void {
      this.masterSelected = false;
      // https://docs.opendata.aws/noaa-ghcn-pds/readme.html
      // Helpful for finding descriptions and units of Data Types

      this.getCheckedItemList();
  }


  // The master checkbox will check/ uncheck all items
  checkUncheckAll() {
    for (var i = 0; i < this.checklist.length; i++) {
      this.checklist[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelected = this.checklist.every(function(item:any) {
        return item.isSelected == true;
      })
    this.getCheckedItemList();
  }

  // Get List of Checked Items
  getCheckedItemList(){
    this.checkedList = [];
    for (var i = 0; i < this.checklist.length; i++) {
      if(this.checklist[i].isSelected)
        this.checkedList.push(this.checklist[i].value);
    }
  }

  sendToDisplay(){
    this.router.navigate(["/display"], {state: { stationID: this.stationID, startDate: this.startDate, endDate: this.endDate, years: this.years, startStr: this.startStr, endStr: this.endStr, dataTypes: this.checkedList}})

  }

  goBack(){
    this.router.navigate(["/stations"])
  }
}
