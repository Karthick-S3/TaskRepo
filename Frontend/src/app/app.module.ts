import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CompanydetailsComponent } from './companydetails/companydetails.component';
import { HttpClientModule , HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroup, FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { AddDetailsComponent } from './add-details/add-details.component';
import { CardModule } from 'primeng/card';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputSwitchModule } from 'primeng/inputswitch';
import { DropdownModule } from 'primeng/dropdown';
import { BadgeModule } from 'primeng/badge';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TariffGridComponent } from './tariff-grid/tariff-grid.component';
import { AddbudgetComponent } from './addbudget/addbudget.component';
import { DialogModule } from 'primeng/dialog';
import { TreeModule } from 'primeng/tree';
import { NgxUploaderModule } from 'ngx-uploader';
import { CompanyserviceService } from './companyservice.service';
import { StepperModule } from 'primeng/stepper';
import { CompanystepsComponent } from './companysteps/companysteps.component';
import { ServicecontrolComponent } from './servicecontrol/servicecontrol.component';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedTableComponent } from './shared-table/shared-table.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { CustomInterceptor } from './custom.interceptor';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { Test1Component } from './test1/test1.component';
import { Test2Component } from './test2/test2.component';
import { Test3Component } from './test3/test3.component';









@NgModule({
  declarations: [
    AppComponent,
    CompanydetailsComponent,
    AddDetailsComponent,
    DashboardComponent,
    TariffGridComponent,
    AddbudgetComponent,
    CompanystepsComponent,
    ServicecontrolComponent,
    SharedTableComponent,
    LoginComponent,
    LayoutComponent,
    Test1Component,
    Test2Component,
    Test3Component,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule,
    BrowserAnimationsModule,
    FormsModule,
    MultiSelectModule,
    ReactiveFormsModule,
    ToastModule,
    TooltipModule,
    ButtonModule,
    CardModule,
    InputGroupModule,
    InputGroupAddonModule,
    InputSwitchModule,
    DropdownModule,
    BadgeModule,
    ConfirmDialogModule,
    KeyFilterModule,
    OverlayPanelModule,
    DialogModule,
    TreeModule,
    NgxUploaderModule,
    StepperModule,
    CalendarModule,
    CheckboxModule,
    NgxUiLoaderModule
   
  ],
  providers: [
    {
        provide: HTTP_INTERCEPTORS, useClass: CustomInterceptor,multi :true
    },
    provideClientHydration(),
    CompanyserviceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
