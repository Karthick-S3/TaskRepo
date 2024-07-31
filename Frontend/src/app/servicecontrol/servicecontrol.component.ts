import { Component, OnInit } from '@angular/core';
import { CompanyserviceService } from '../companyservice.service';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { AppComponent } from '../app.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-servicecontrol',
  templateUrl: './servicecontrol.component.html',
  styleUrls: ['./servicecontrol.component.css'],
  providers: [MessageService]  
})
export class ServicecontrolComponent implements OnInit {
  products: any[] = [];
  animation: boolean = false;

  constructor(private companyService: CompanyserviceService, private messageService: MessageService,
    private confirmationService: ConfirmationService,private appcomponent : AppComponent,private ngxService : NgxUiLoaderService) {}

  refreshService() {
    this.getServices('iComp');

  }

  SendEmail(){
    alert("Email will send")
  }

  ngOnInit(): void {
    const serviceName = 'iComp';
    this.getServices(serviceName);
  }

  getServices(serviceName: string) {
    this.ngxService.start();

    this.companyService.getServiceStatus(serviceName).subscribe(
      (data: any) => {
        this.products = [];
        this.products.push(data);
        this.ngxService.stop();
        if(this.products[0].startupType == 'Disabled'){
          this.products[0].status = '';
          this.products[0].workingSetMemoryMB = '';
        }
      },
      error => {
        console.error('Error fetching service details:', error);
      }
    );
  }

  startService(product: any) {
    this.ngxService.start();
    this.companyService.startService(product.serviceName).subscribe(
      data => {
        console.log('Service started successfully');
        // this.ngxService.stop();
        this.refreshService();
        this.messageService.add({ severity: 'success', summary: 'Started', detail: `${product.displayName} Service Started Successfully.` });
      },
      error => {
        console.error('Error starting service:', error);
        this.ngxService.stop();
      }
    );
  }

  stopService(product: any) {
    this.ngxService.start();
    this.companyService.stopService(product.serviceName).subscribe(
      data => {
        console.log('Service stopped successfully');
        // this.ngxService.stop();
        this.refreshService();
        this.messageService.add({ severity: 'info', summary: 'Stopped', detail: `${product.displayName} Service Stopped Successfully.` });
      },
      error => {
        console.error('Error stopping service:', error);
        this.ngxService.stop();
      }
    );
  }
}
