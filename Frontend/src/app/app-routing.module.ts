import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { AddDetailsComponent } from './add-details/add-details.component';
import { TariffGridComponent } from './tariff-grid/tariff-grid.component';
import { CompanystepsComponent } from './companysteps/companysteps.component';
import { ServicecontrolComponent } from './servicecontrol/servicecontrol.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './guards/AuthGuard';
import { LayoutComponent } from './layout/layout.component';
import { leaveRoute } from './guards/leave-route.guard';





const routes: Routes = [
  // {path:'companylist',component:CompanydetailsComponent,canDeactivate : [leaveRoute] },
  {path:'companylist',component:CompanydetailsComponent,canActivate: [AuthGuard],canDeactivate : [leaveRoute] },
  {path:'',redirectTo:'login',pathMatch:"full"},
  {path:'tariffGrid', component:TariffGridComponent,canActivate: [AuthGuard]},
  {path:'steps',component:CompanystepsComponent,canActivate: [AuthGuard]},
  {path:'serviceControl',component:ServicecontrolComponent,canActivate: [AuthGuard]},
  {path:'dashboard',component:DashboardComponent,canActivate: [AuthGuard]},
  {path:'login',component:LoginComponent},
  {path: 'iCom-Main', component : LayoutComponent,canActivate: [AuthGuard]},
 
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  
})
export class AppRoutingModule { }


// [(comp:AddDetailsComponent)=> {return comp.canExit();}]