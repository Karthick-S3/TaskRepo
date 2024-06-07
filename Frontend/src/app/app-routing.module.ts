import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { AddDetailsComponent } from './add-details/add-details.component';
import { TariffGridComponent } from './tariff-grid/tariff-grid.component';
import { CompanystepsComponent } from './companysteps/companysteps.component';
import { ServicecontrolComponent } from './servicecontrol/servicecontrol.component';

const routes: Routes = [
  {path:'companylist',component:CompanydetailsComponent},
  {path:'',redirectTo:'companylist',pathMatch:"full"},
  {path:'tariffGrid', component:TariffGridComponent},
  {path:'steps',component:CompanystepsComponent},
  {path:'serviceControl',component:ServicecontrolComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
