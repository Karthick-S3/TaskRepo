import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { AddDetailsComponent } from './add-details/add-details.component';

const routes: Routes = [
  {path:'companylist',component:CompanydetailsComponent},
  {path:'',redirectTo:'companylist',pathMatch:"full"},
  {path:'adddetail', component:AddDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
