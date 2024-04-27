import { Component, OnInit, Input , Output , EventEmitter} from '@angular/core';
import { CompanyserviceService } from '../companyservice.service';
import { Router } from '@angular/router';
import { City } from '../Interfaces/city';
import { State } from '../Interfaces/state';
import { Country } from '../Interfaces/country';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { response } from 'express';
import { Company } from '../Interfaces/company';
import { CompanydetailsComponent } from '../companydetails/companydetails.component';

@Component({
  selector: 'app-add-details',
  templateUrl: './add-details.component.html',
  styleUrls: ['./add-details.component.css'],
  providers: [MessageService,ConfirmationService]  
})
export class AddDetailsComponent implements OnInit {
  isActive: boolean = false;
  submit = false;
  myForm!: FormGroup;
  citys: City[] = [];
  states: State[] = [];
  countrys: Country[] = [];
  animation: boolean = false;
  newcompany : Company[] = [];
  badgeval : string = '';

  comp:any[] = [];

  @Input() id= 0;
  @Output() Flag = new EventEmitter<boolean>();
  
  
  

  constructor(
    private companyService: CompanyserviceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private companydetail:CompanydetailsComponent
  ) {}
  GetFirst(){

    const val = this.companydetail.returnFirstCompId();
    const id:number =val;
     this.companyService.getById(Number(id)).subscribe({
        next: (response) => {
          this.myForm.patchValue(response);

          this.myForm.get('email')?.setValue("Example@gmail.com");
          this.myForm.get('revenue')?.setValue(response.revenue.toString());

          if(response.active == "Yes"){
            this.myForm.get('active')?.setValue(true);
          }else{
            this.myForm.get('active')?.setValue(false);
          }
     }
     });
  }
  GetLast(){

    const val = this.companydetail.returnLastCompId();
    const id:number =val;
     this.companyService.getById(Number(id)).subscribe({
        next: (response) => {
          this.myForm.patchValue(response);

          this.myForm.get('email')?.setValue("Example@gmail.com");
          this.myForm.get('revenue')?.setValue(response.revenue.toString());
          // this.myForm.get('zipcode')?.setValue(response.zipcode.toString());

          if(response.active == "Yes"){
            this.myForm.get('active')?.setValue(true);
          }else{
            this.myForm.get('active')?.setValue(false);
          }
     }
     });
  }

  GetPrevious(){

    const val = this.companydetail.returnPreviousCompId();
    const id:number =val;
     this.companyService.getById(Number(id)).subscribe({
        next: (response) => {
          this.myForm.patchValue(response);

          this.myForm.get('email')?.setValue("Example@gmail.com");
          this.myForm.get('revenue')?.setValue(response.revenue.toString());
          // this.myForm.get('zipcode')?.setValue(response.zipcode.toString());

          if(response.active == "Yes"){
            this.myForm.get('active')?.setValue(true);
          }else{
            this.myForm.get('active')?.setValue(false);
          }
     }
     });
  }

  GetNext(){

    const val = this.companydetail.returnNextCompId();
    const id:number =val;
     this.companyService.getById(Number(id)).subscribe({
        next: (response) => {
          this.myForm.patchValue(response);

          this.myForm.get('email')?.setValue("Example@gmail.com");
          this.myForm.get('revenue')?.setValue(response.revenue.toString());

          if(response.active == "Yes"){
            this.myForm.get('active')?.setValue(true);
          }else{
            this.myForm.get('active')?.setValue(false);
          }
     }
     });
  }

  routeToList(){
    if(this.myForm.invalid){
      this.insert();
    }else{
      this.insert();
      this.Flag.emit(false);
    }
  }
  resetForm() {
    this.messageService.add({ severity: 'info', summary: 'New Company', detail: 'To add a new detail, the form has been cleared.' });
    this.myForm.reset();
    this.ngOnInit();
    setTimeout(() => {
      if (this.myForm.invalid) {
        for (const control of Object.keys(this.myForm.controls)) {
          this.myForm.controls[control].markAsUntouched();
        }
      }
    });
  }
  SubmitAndReset(){
    if(this.myForm.valid){
      this.insert();
      this.myForm.reset();
      this.badgeval = "NEW";
      this.id=0;
    }else{
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Please enter a valid value.' 
      });
    }
    
    
    
  }
  onCountryChange(event: any) {
    const selectedCountryid: number[] = [];
    if (event) {
      selectedCountryid.push(event.value);
      this.getCitybyCountryIds(selectedCountryid);
      this.getStatesByIds(selectedCountryid);
    }
  }

  onStateChange(event: any) {
    const selectedStateid: number[] = [];
    if (event) {
      selectedStateid.push(event.value);
      this.getCityBystateIds(selectedStateid);
    }
  }

  Addnew(event: Event) {
    this.id = 0;
    if(this.myForm.touched || this.id>0){
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'You have unsaved changes in the screen. Do you want to continue?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon:"none",
        rejectIcon:"none",
        rejectButtonStyleClass:"p-button-text",
        accept: () => {
            this.resetForm();
        },
        reject: () => {
            
        }
    });
    }else{
      this.resetForm();
    }
    
}
BackToList(event: Event) {
  if(this.myForm.touched){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'You have unsaved changes in the screen. Do you want to continue?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.Flag.emit(false);
      },
      reject: () => {
          
      }
  });
  }else{
    this.Flag.emit(false);
  }
  
}

  ngOnInit(): void {
    
    this.loadCountry();
    this.loadState();
    this.loadCity();

    if(this.id == 0){
      this.initializeForm();
      this.badgeval = 'NEW';
      
    }else{
      this.badgeval = 'EDIT'
      this.animation = true;
      this.initializeForm();
      this.companyService.getById(Number(this.id)).subscribe({
        next: (response) => {
          this.myForm.patchValue(response);
          this.myForm.get('email')?.setValue("Example@gmail.com");
          this.myForm.get('revenue')?.setValue(response.revenue.toString());
          // this.myForm.get('zipcode')?.setValue(response.zipcode.toString());
          this.animation = false;
          if(response.active == "Yes"){
            this.myForm.get('active')?.setValue(true);
          }else{
            this.myForm.get('active')?.setValue(false);
          }
        }
      });
      
    }

  }

  initializeForm(): void {
    this.myForm = this.formBuilder.group({
      companyname: ['',[Validators.required,Validators.minLength(1),Validators.maxLength(20),Validators.pattern('[a-zA-Z0-9\\-. ]*')]],
      companyshortname: ['',[Validators.maxLength(10), Validators.pattern('[a-zA-Z0-9\\- ]*')]],
      contact: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]],
      active: [''],
      cid: ['', Validators.required],
      sid: ['', Validators.required],
      cityid: ['', Validators.required],
      country:[''],
      state:[''],
      city:[''],
      contactid:[''],
      revenue: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'), Validators.maxLength(12)]],
      address: [''],
      email: ['', [Validators.required,Validators.minLength(5),Validators.maxLength(250),Validators.email ]],
      zipcode: ['', [Validators.required,Validators.pattern('[0-9]*'),Validators.maxLength(5),Validators.minLength(5)]],
    });
  }

  loadCountry(): void {
    this.companyService.getCountry().subscribe({
      next: (countrys) => {
        this.countrys = countrys;
      },
      error: (response) => {
        console.error(response);
      },
    });
  }

  loadState(): void {
    this.companyService.getState().subscribe({
      next: (states) => {
        this.states = states;
      },
      error: (response) => {
        console.error(response);
      },
    });
  }

  loadCity(): void {
    this.companyService.getCity().subscribe({
      next: (citys) => {
        this.citys = citys;
      },
      error: (response) => {
        console.error(response);
      },
    });
  }

  insert(): void {
    if(this.myForm.invalid){
      for (const control of Object.keys(this.myForm.controls)){
        this.myForm.controls[control].markAsTouched();
      }
      this.messageService.add({ 
        severity: 'error', 
        summary: 'Error', 
        detail: 'Please enter a valid value.' 
      });
    }
    else{
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Company details submitted successfully!' });
      this.myForm.get('active')?.setValue(this.myForm.value.active ? 'yes' : 'no');
      this.myForm.get('country')?.setValue('');
      this.myForm.get('state')?.setValue('');
      this.myForm.get('city')?.setValue('');
      if(this.id > 0){
        this.companyService.updateCompany(this.myForm.value).subscribe({
          next : (company) => {
            console.log("updated succesfully");
          },
          error: (response) => {
            console.log(response);
          }
        })
      }else{
        this.myForm.get('contactid')?.setValue(0);
          this.companyService.insertCompany(this.myForm.value).subscribe({
            next: (company) => {
              console.log("Inserted successfully");
            },
            error: (response) => {
              console.log(response);
            },
          });
        }

    }
    
    
  }



  getStatesByIds(selectedCountryIds: number[]): void {
    this.companyService.getStatesByIds(selectedCountryIds)
      .subscribe(states => {
        this.states = states;
      });
  }

  getCitybyCountryIds(selectedCountryIds: number[]): void {
    this.companyService.getCitybyCountryIds(selectedCountryIds)
      .subscribe(citys => {
        this.citys = citys;
      });
  }

  getCityBystateIds(selectedCountryIds: number[]): void {
    this.companyService.getCityBystateIds(selectedCountryIds)
      .subscribe(citys => {
        this.citys = citys;
      });
  }

}
