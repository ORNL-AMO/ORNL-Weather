import { Routes, RouterModule } from "@angular/router";
import { DataComponent } from "./data/data.component";
import { DisplayComponent } from "./display/display.component";
import { HomeComponent } from "./home/home.component";
import { StationsComponent } from "./stations/stations.component";

const routes: Routes = [
{path: '', component: HomeComponent},
{path: 'stations', component: StationsComponent},
{path: 'data', component: DataComponent},
{path: 'display', component: DisplayComponent},



{path: '**', redirectTo: ''}

];
export const appRoutingModule = RouterModule.forRoot(routes);

