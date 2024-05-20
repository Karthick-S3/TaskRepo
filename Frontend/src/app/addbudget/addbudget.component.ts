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
import { Currency } from '../Interfaces/currency';
import { State } from '../Interfaces/state';
import { City } from '../Interfaces/city';
import { BudgetDetail } from '../Interfaces/budgetdetail';
import { first, skip } from 'rxjs';
import { Budget } from '../Interfaces/budget';




@Component({
  selector: 'app-addbudget',
  templateUrl: './addbudget.component.html',
  styleUrl: './addbudget.component.css',
  providers: [MessageService,ConfirmationService]  
})
export class AddbudgetComponent implements OnInit {
shows() {
alert("shows")
}
  visible: boolean = false;
  badgeval:string = 'NEW';
  myForm!: FormGroup;
  myForm2!: FormGroup;
  currency:Currency[] = [];
  country:Country[] = [];
  state:State[] = [];
  city:City[] = [];
  shortname: any[] = [];
  showwwww: boolean = false;
  budgetdetail: BudgetDetail[] = [];
  showval:number = 0;
  total_records: number = 0;
  sFiledValue: string[] | undefined;
  searchField: string[] | undefined;
  sortField:string | undefined='';
  sortOrder:boolean =false;
  globalFilter:string | undefined='';
  showAddBudgetdetail:boolean = false;
  budgetid :number =0;
  animation = false;
  showentrrytable:boolean = false;

  @Input() id= 0;
  @Output() Flag = new EventEmitter<boolean>();

  
  products : any = [
    {
      start: '0',
      limit : '0',
      manhour : '0',
      containerType : "none",
      containerSize : '0'
    }
  ];

  containertype : any =[
    { label: 'General Purpose', value: 'General Purpose' },
  { label: 'Refrigerated', value: 'Refrigerated' },
  { label: 'OpenTop Container', value: 'OpenTop Container' },
  { label: 'Flatrack Container', value: 'Flatrack Container' },
  { label: 'HalfHeight Container', value: 'HalfHeight Container' },
  { label: 'Tunnel Container', value: 'Tunnel Container' },
  { label: 'Tanks Container', value: 'Tanks Container' }
  ]


  resetdetailentry(){
    this.myForm.get('startamount')?.setValue(0);
    this.myForm.get('limitamount')?.setValue(0);
    this.myForm.get('manhour')?.setValue(0);
    this.myForm.get('containersize')?.setValue(0);
    this.myForm.get('containertype')?.setValue('');

    this.detaillinerow = null;
  }

  Addintoentry(){

    // alert("Working");  
    // console.log(this.detaillinerow);
    // this.budgetdetail[this.budgetdetail.length].containersize = this.myForm.get('containersize')?.value;

    const containersize = this.myForm.get('containersize')?.value;
    const containertype = this.myForm.get('containertype')?.value;
    const manhour = this.myForm.get('manhour')?.value;
    const limitamount = this.myForm.get('limitamount')?.value;
    const startamount = this.myForm.get('startamount')?.value;
    const budgetid = this.myForm.get('budgetid')?.value;
    let budgetdetailid = 0;
    if(this.detaillinerow != null ){
      budgetdetailid = this.myForm.get('budgetdetailid')?.value;
    }
    

    
    const newItem: BudgetDetail = {
      budgetdetailid: budgetdetailid, 
      startamount: startamount,
      limitamount: limitamount,
      manhour: manhour,
      containersize: containersize,
      containertype: containertype,
      budgetid: budgetid,
      total_records: this.budgetdetail.length
    };


    
    if (budgetdetailid == 0 && this.detaillinerow == null) {
      this.budgetdetail.push(newItem);
      console.log(this.budgetdetail);
    } else {
      this.budgetdetail.splice(this.detaillinerow, 1, newItem);
    }
    this.myForm.get('startamount')?.setValue(0);
    this.myForm.get('limitamount')?.setValue(0);
    this.myForm.get('manhour')?.setValue(0);
    this.myForm.get('containersize')?.setValue(0);
    this.myForm.get('containertype')?.setValue('');

    this.detaillinerow = null;

    
  }
  detaillinerow: any = null;
  showindetailtable(val: any,rowIndex : number) {
  this.detaillinerow = rowIndex;

    this.myForm.patchValue(val);

  }
  
  

  LazyDataBudget(event:any){
    if(this.budgetid==0){
     

    }else{
    this.animation = true;
    const sortField: string | undefined = typeof event.sortField === 'string' ? event.sortField : undefined;
    const sortOrder: boolean = event.sortOrder === 1 ? true : false;
    const globalFilter : string | undefined = typeof event.globalFilter === 'string' ? event.globalFilter : undefined;
    let searchField: string[] = [];
    let sFiledValue: string[] = [];

    if (event.filters) {
      for (const key in event.filters) {
        if (event.filters.hasOwnProperty(key)) {
          const filterValue = event.filters[key];
          if (filterValue && ('value' in filterValue) && filterValue.value !== null) {
            if(key=="global"){
              continue;
            }
            searchField.push(key);
            sFiledValue.push(filterValue.value);
          }
        }
      }
    }
    this.searchField=searchField;
    this.sFiledValue=sFiledValue;
    this.sortOrder=sortOrder;
    this.sortField=sortField;
    this.globalFilter = globalFilter;
    
    this.showval = event.rows !== null ? event.rows : undefined;

    this.companyService.LazyDataBudgetDetail(event.first || 0, event.rows || 10, sortField, sortOrder, searchField, sFiledValue,globalFilter,this.budgetid)
    .subscribe((budget) => {
      this.animation = false;
      this.budgetdetail = budget;
      this.total_records = budget[0].total_records;
      // this.total_records = this.budgetdetail[0].total_records;
    })
  }
  }
  
  // filess = [
  //   {
  //     key: '0',
  //     label: 'India',
  //     data: 'Documents Folder',
  //     children: [
  //         {
  //             key: '0-0',
  //             label: 'Tamilnadu',
  //             data: 'Work Folder',
  //             children: [
  //                 { key: '0-0-0', label: 'Chennai', data: 'Expenses Document' ,
  //                 children: [
  //                   { key: '0-0-0-0', label: 'Abc Corp', data: 'Expenses Document' },
        
  //               ]
  //                 },
  //                 { key: '0-0-1', label: 'Salem', data: 'Resume Document',
  //                 children: [
  //                   { key: '0-0-1-0', label: 'ZXY Co', data: 'Expenses Document' },
             
  //               ]
  //                  }
  //             ]
  //         },


  //         {
  //             key: '0-1',
  //             label: 'Karnataka',
  //             data: 'Home Folder',
    
  //             children: [{ key: '0-1-0', label: 'Bangalore',  data: 'Invoices for this month' }]
  //         },
  //         {
  //           key: '0-2',
  //           label: 'West Bengal',
  //           data: 'Home Folder',
      
  //           children: [{ key: '0-1-0', label: 'Kolkata',  data: 'Invoices for this month' }]
  //       }
  //     ]
  // }
  // ]


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
  this.initializeForm();
  this.loadCurrency();
  this.loadCountry();
  this.loadState();
  this.loadCity();
  this.loadCompany();

  if(this.id==0){
    this.showentrrytable = false;
    this.badgeval = 'NEW';
  }else{
    this.showentrrytable = true;
    this.badgeval = 'EDIT';
    this.companyService.getById(this.id).subscribe(value => {
      this.myForm.patchValue(value);
      this.budgetid = this.myForm.get('budgetid')?.value;
      Object.keys(value).forEach(controlName => {
        if (this.myForm.get(controlName)) {
          const disableFields = ['budgetcurrencyid', 'budgetactive', 'description', 'startamount', 'limitamount','manhour','containertype','containersize'];
          if (!disableFields.includes(controlName) ) {
            this.myForm.get(controlName)?.disable();
          }
        }
      });
      this.addReadOnlyStyles();
      // console.log(this.budgetid);
      const event = {
        first : 0,
        rows: 10,
      }

      this.LazyDataBudget(event);
    })

  }
  
  
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


addBudget(){

  if(this.myForm.valid){
    const updatedetail:any = [];
    let insertdetail:any = [];
  
    this.budgetdetail.forEach((data:any) => {
        if(data.budgetdetailid != 0){
          updatedetail.push(data);
        }else{
          insertdetail.push(data);
        }
    })
  
    if(this.badgeval == 'EDIT'){
  
      if(this.myForm.get('budgetcurrencyid')?.value == this.myForm.get('currencyid')?.value){
        this.companyService.updatebudgetlines(updatedetail).subscribe(value => {
          console.log(value);
        })
        
        this.companyService.insertBudgetLines(insertdetail).subscribe(value => {
          console.log(value);
        })
      }else{
        alert("Currency Mismatch")
      }
  
      
    }else{
      if(this.myForm.get('budgetcurrencyid')?.value == this.myForm.get('currencyid')?.value){
        const budgetActiveValue = this.myForm.get('budgetactive')?.value;
        const budgetActive = budgetActiveValue === null ? false : budgetActiveValue;
        const budget: Budget = {
          description: this.myForm.get('description')?.value,
          budgetcurrencyid: this.myForm.get('budgetcurrencyid')?.value,
          budgetactive: budgetActive.toString(),
          createdate: this.myForm.get('createdate')?.value,
          companyid: this.myForm.get('companyid')?.value,
          budgetid: 0,
          total_records: 0,
          currency: ''
        };
  
        
        
        this.companyService.insertBudget(budget).subscribe( val => {
          this.myForm.get('budgetid')?.setValue(val)
          insertdetail = [];
          this.budgetdetail.forEach((data:any) => {
              data.budgetid = val;
              insertdetail.push(data);
            
        })
  
        this.companyService.insertBudgetLines(insertdetail).subscribe( val => {
          console.log("Budget Created & budget line added")
        })
        });
        
        
        
        
      }else{
        console.log(this.myForm)
        alert("Currency Mismatching");
      }
    }
  }else{
    alert("Insert proper detail");
  }
  
}


files: Country[] = [];

loadCurrency(){
  this.companyService.GetCurrency().subscribe(currency => {
      this.currency = currency;
      // alert(currency);
  })
}
loadCountry(){
  this.companyService.getCountry().subscribe(country => {
    this.country = country;
  })
}
loadState(){
  this.companyService.getState().subscribe(state => {
    this.state = state;
  })
}
loadCity(){
  this.companyService.getCity().subscribe(city => {
    this.city = city;
  })
}

loadCompany(){
  this.companyService.getShortName().subscribe(shortname => {
    this.shortname = shortname;
  })
}
  
onNodeSelect(val : any){
  
if(val.node.children.length == 0){
  this.budgetid = this.myForm.get('budgetid')?.value;
  this.animation = true;
    this.companyService.getById(val.node.key).subscribe(company => {
      
      this.myForm.patchValue(company);
      this.budgetid = this.myForm.get('budgetid')?.value;
      Object.keys(company).forEach(controlName => {
        if (this.myForm.get(controlName)) {
          const disableFields = ['budgetcurrencyid', 'budgetactive', 'description', 'startamount', 'limitamount','manhour','containertype','containersize'];
          if (!disableFields.includes(controlName) ) {
            this.myForm.get(controlName)?.disable();
          }
        }
      });
      const event = {
        first : 0,
        rows: 10,
      }
  
      this.LazyDataBudget(event);
      
      this.showentrrytable = true;
      this.addReadOnlyStyles();
      this.animation = false;
      if(this.myForm.get('budgetid')?.value != 0){
        this.badgeval = 'EDIT';
      }else{
        this.badgeval = 'NEW';
        this.budgetdetail = [];
      }
    })
}else{
  // console.log(val)
  alert("choose proper company name")
}

}
addReadOnlyStyles(): void {
  // Example: Add a CSS class to make read-only fields visually distinct
  const readOnlyFields = document.querySelectorAll('.readonly-field');
  readOnlyFields.forEach(field => {
    field.classList.add('read-only'); // Add 'read-only' class
  });
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
showfil(){
  this.showwwww = !this.showwwww;
}
hidefil(){
  this.showwwww = false;
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
    budgetid: [''],
    description: ['',[Validators.minLength(1),Validators.maxLength(20), Validators.pattern('[a-zA-Z0-9\\- ]*')]],
    currency: [''],
    startamount: [0,Validators.required,Validators.pattern('[0-9]*')],
    limitamount: [0, Validators.required,Validators.pattern('[0-9]*')],
    active: ['', Validators.required],
    createdate: [''],
    manhour:[0,Validators.required,Validators.pattern('[0-9]*')],
    containertype:['',Validators.required],
    containersize:[0,Validators.required,Validators.pattern('[0-9]*')],
    companyid:[''],
    companyname:[''],
    companyshortname:['',Validators.required],
    contact:[''],
    zipcode:[''],
    country:[''],
    state : [''],
    city:[''],
    revenue:[''],
    cid:[''],
    sid:[''],
    cityid:[''],
    currencyid:[''],
    budgetcurrencyid:['',Validators.required],
    budgetactive:['False'],
    budgetdetailid:[]



  });
}


  
}
