import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home";
import { StationsComponent } from "./stations/stations.component";


const routes: Routes = [
{path: '', component: HomeComponent},
{path: 'stations', component: StationsComponent},


{path: '**', redirectTo: ''}

];

export const appRoutingModule = RouterModule.forRoot(routes);