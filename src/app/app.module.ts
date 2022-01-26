import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

/* importing components */
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { StationsComponent } from './stations/stations.component';
import { DataComponent } from './data/data.component';
import { DisplayComponent } from './display/display.component';
import { appRoutingModule } from './app.routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { CommonModule } from '@angular/common';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StationsComponent,
    DataComponent,
    DisplayComponent,
    NavComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    appRoutingModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
