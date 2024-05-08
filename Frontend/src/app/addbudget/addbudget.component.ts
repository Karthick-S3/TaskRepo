import { Component, OnInit, Input , Output , EventEmitter} from '@angular/core';
import { CompanyserviceService } from '../companyservice.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';
import { response } from 'express';
import { Company } from '../Interfaces/company';
import { start } from 'repl';
import { Country } from '../Interfaces/country';
import { count } from 'console';




@Component({
  selector: 'app-addbudget',
  templateUrl: './addbudget.component.html',
  styleUrl: './addbudget.component.css',
  providers: [MessageService,ConfirmationService]  
})
export class AddbudgetComponent implements OnInit {
  visible: boolean = false;
  badgeval:string = 'NEW';
  myForm!: FormGroup;

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


tree : any;


ngOnInit(): void {
  this.initializeForm();

  this.companyService.getCountry().subscribe(countries => {
    this.companyService.getState().subscribe(states => {
      this.companyService.getCity().subscribe(cities => {
        const tree: TreeItem[] = [];

        countries.forEach(country => {
          const countryObj: TreeItem = {
            key: country.cid.toString(),
            label: country.country,
            data: 'Country Data Placeholder',
            children: []
          };

          const statesOfCountry = states.filter(state => state.cid === country.cid);

          statesOfCountry.forEach(state => {
            const stateObj: StateObj = {
              key: `${country.cid}-${state.sid}`,
              label: state.state,
              data: 'State Data Placeholder',
              children: []
            };

            const citiesOfState = cities.filter(city => city.cid === country.cid && city.sid === state.sid);

            citiesOfState.forEach(city => {
              const cityObj: TreeItem = {
                key: `${country.cid}-${state.sid}-${city.cityid}`,
                label: city.city,
                data: 'City Data Placeholder',
                children: []
              };

              this.companyService.getShortName().subscribe(shortnames => {
                shortnames.forEach(shortname => {
                  if (shortname.cid === country.cid && shortname.cityid === city.cityid) {
                    cityObj.children.push({
                      key: `${shortname.companyid}`, 
                      label: shortname.companyshortname,
                      data: 'Company Short Name Data Placeholder',
                      children: [] 
                    });
                  }
                });
              });

              stateObj.children.push(cityObj);
            });

            countryObj.children.push(stateObj);
          });

          tree.push(countryObj);
        });

        this.tree = tree;
      });
    });
  });
  interface StateObj {
    key: string;
    label: string;
    data: string;
    children: any[]; 
  }
  interface TreeItem {
    key: string;
    label: string;
    data: string;
    children: TreeItem[];
  }
  
}


files: Country[] = [];
  
onNodeSelect(val : any){
this.animation = true;
  this.companyService.getById(val.node.key).subscribe(company => {
    this.myForm.patchValue(company);
    console.log(company);
    Object.keys(company).forEach(controlName => {
      if (this.myForm.get(controlName)) {
        this.myForm.get(controlName)?.disable();
      }
    });

    this.addReadOnlyStyles();
    this.animation = false;
  })
}
addReadOnlyStyles(): void {
  // Example: Add a CSS class to make read-only fields visually distinct
  const readOnlyFields = document.querySelectorAll('.readonly-field');
  readOnlyFields.forEach(field => {
    field.classList.add('read-only'); // Add 'read-only' class
  });
}


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
    companyname:[''],
    companyshortname:[''],
    contact:[''],
    zipcode:[''],
    country:[''],
    state : [''],
    city:[''],
    revenue:['']


  });
}


  
}
