import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* importing components */
import { AppComponent } from './app.component';
import { StationsComponent } from './stations/stations.component';
import { appRoutingModule } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';

import { CommonModule } from '@angular/common';

/* declaring components */
@NgModule({
  declarations: [
    AppComponent,
    StationsComponent,
    NavComponent,
    FooterComponent
  ],
  imports: [
    BrowserAnimationsModule,
    appRoutingModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
