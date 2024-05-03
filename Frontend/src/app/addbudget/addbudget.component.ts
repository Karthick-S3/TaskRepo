import { Component, OnInit, Input , Output , EventEmitter} from '@angular/core';
import { CompanyserviceService } from '../companyservice.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { response } from 'express';
import { Company } from '../Interfaces/company';
import { start } from 'repl';
import { Country } from '../Interfaces/country';



@Component({
  selector: 'app-addbudget',
  templateUrl: './addbudget.component.html',
  styleUrl: './addbudget.component.css',
  providers: [MessageService,ConfirmationService]  
})
export class AddbudgetComponent implements OnInit {
  visible: boolean = false;
  badgeval:string = 'NEW';
  myForm!: FormGroup;;
  animation = false;

  @Input() id= 0;
  @Output() Flag = new EventEmitter<boolean>();

  
  products = [
    {
      start: 1000,
      limit : 5000,
      manhour : 25,
      containerType : "general Purpose",
      containerSize : 22
    }
  ];
  
  filess = [
    {
      key: '0',
      label: 'India',
      data: 'Documents Folder',
      children: [
          {
              key: '0-0',
              label: 'Tamilnadu',
              data: 'Work Folder',
              children: [
                  { key: '0-0-0', label: 'Chennai', data: 'Expenses Document' ,
                  children: [
                    { key: '0-0-0-0', label: 'Abc Corp', data: 'Expenses Document' },
        
                ]
                  },
                  { key: '0-0-1', label: 'Salem', data: 'Resume Document',
                  children: [
                    { key: '0-0-1-0', label: 'ZXY Co', data: 'Expenses Document' },
             
                ]
                   }
              ]
          },


          {
              key: '0-1',
              label: 'Karnataka',
              data: 'Home Folder',
    
              children: [{ key: '0-1-0', label: 'Bangalore',  data: 'Invoices for this month' }]
          },
          {
            key: '0-2',
            label: 'West Bengal',
            data: 'Home Folder',
      
            children: [{ key: '0-1-0', label: 'Kolkata',  data: 'Invoices for this month' }]
        }
      ]
  }
  ]


  constructor( private companyService: CompanyserviceService,
    private formBuilder: FormBuilder,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService){

  }
  showDialog() {
    this.visible = true;
}

ngOnInit(): void {
  this.initializeForm();
  this.companyService.TreeData().subscribe(countries => { 
    console.log(countries);
    this.files = countries;
  });
}

files: Country[] = [];
  
  addBudget(){

  }
GetLast($event: MouseEvent) {
throw new Error('Method not implemented.');
}
GetNext($event: MouseEvent) {
throw new Error('Method not implemented.');
}
GetPrevious($event: MouseEvent) {
throw new Error('Method not implemented.');
}
GetFirst($event: MouseEvent) {
throw new Error('Method not implemented.');
}
SubmitAndReset() {
throw new Error('Method not implemented.');
}
Addnew($event: MouseEvent) {
throw new Error('Method not implemented.');
}
routeToList() {
throw new Error('Method not implemented.');
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


initializeForm(): void {
  this.myForm = this.formBuilder.group({
    budgetid: ['',[Validators.required,Validators.minLength(1),Validators.maxLength(20),Validators.pattern('[a-zA-Z0-9\\-. ]*')]],
    description: ['',[Validators.maxLength(10), Validators.pattern('[a-zA-Z0-9\\- ]*')]],
    currency: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.maxLength(10)]],
    startamount: [''],
    limitamount: ['', Validators.required],
    active: ['', Validators.required],
    createdate: ['', Validators.required],
    manhour:[''],
    containertype:[''],
    containersize:[''],
    companyid:[''],

  });
}
  
}
