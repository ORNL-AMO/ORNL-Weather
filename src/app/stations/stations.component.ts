import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.css']
})
export class StationsComponent implements OnInit {

  headers = ['Station ID', 'Station Name', 'Distance(Miles)']

  constructor(private route: ActivatedRoute, private routerSelect: Router) {
  }
  goBack(){
    this.routerSelect.navigate(["/home"])
  }

  ngOnInit(): void {
  }

}






