import { Component, OnInit, Input , Output , EventEmitter} from '@angular/core';
import { CompanyserviceService } from '../companyservice.service';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
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

single:any;
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
  citys:City[] = [];
  shortname: any[] = [];
  showwwww: boolean = false;
  budgetdetail: BudgetDetail[] = [];
  showval:number = 10;
  total_records: number = 5;
  sFiledValue: string[] | undefined;
  searchField: string[] | undefined;
  sortField:string | undefined='';
  sortOrder:boolean =false;
  globalFilter:string | undefined='';
  showAddBudgetdetail:boolean = false;
  budgetid :number =0;
  animation = false;
  showentrrytable:boolean = false;
  deletedetail:any = [];

  @Input() id= 0;
  @Output() Flag = new EventEmitter<boolean>();

  
  products : any = [
    {
      startamount: '0',
      limit : '0',
      manhour : '1',
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


  resetdetailentry(event : any){
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to reset budgetdetailline',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-danger",
      acceptButtonStyleClass: 'p-button-success',
      acceptLabel: 'Yes' ,
      accept: () => {
        this.myForm.get('startamount')?.setValue(0);
        this.myForm.get('limitamount')?.setValue(0);
        this.myForm.get('manhour')?.setValue(1);
        this.myForm.get('containersize')?.setValue(1);
        this.myForm.get('containertype')?.setValue('');
    
        this.detaillinerow = null;
        this.messageService.add({ severity: 'info', summary: 'Reset', detail: 'Detailline reset successfully.' });
      },
      reject : () =>{

      }
      
        
  });
    
  }

  reloadbudget(){
    this.budgetdetail
  }

  deleteline(event : any){
    
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure to delete this detail line?',
      header: 'Confirmation',
      icon: 'pi pi-trash',
      acceptIcon: 'none',
      rejectIcon: 'none',
      acceptButtonStyleClass: 'p-button-success',
      rejectButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        let index = 0;
        this.budgetdetail.forEach(element => {
          if(element.budgetdetailid == event.controls.budgetdetailid.value){
            this.deletedetail.push(element.budgetdetailid);
            this.budgetdetail.splice(index, 1);
            this.myForm.get('startamount')?.setValue(0);
            this.myForm.get('limitamount')?.setValue(0);
            this.myForm.get('manhour')?.setValue(1);
            this.myForm.get('containersize')?.setValue(1);
            this.myForm.get('containertype')?.setValue('');
            
          }
          index ++;
        });
        this.messageService.add({ severity: 'warn', summary: 'Deleted', detail: 'Detailline Deleted Successfully' });
        index = 0;
      },
      reject : () =>{

      },
      
      
        
  });
  }

  Addintoentry(event : any){
    

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


   
   
  const isDuplicate = this.budgetdetail.some(item => {
       
    return ((item.containertype === newItem.containertype  && item.startamount == newItem.startamount) || (item.containertype === newItem.containertype && item.limitamount == newItem.limitamount) || item.containertype == newItem.containertype); 
});



if(newItem.containertype == null || newItem.startamount == 0 || newItem.limitamount == 0  || (newItem.startamount > newItem.limitamount)  || newItem.manhour == 0  || newItem.containersize == 0){
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: 'Please enter valid values in the fields to create a budget detailline.1',
      header: 'Invalid Input',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: "none",
    rejectIcon: "none",
    acceptButtonStyleClass: 'p-button-danger',
    acceptLabel: 'Ok', 
    rejectVisible: false, 
    accept: () => {
    }
    
      
});



}else{
  if (!isDuplicate) {
    this.budgetdetail.push(newItem);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Detailline added Successfully',
      header: 'Confirmation',
      icon: 'pi pi-check-circle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: 'p-button-success',
      acceptLabel: 'Ok', 
      rejectVisible: false, 
      accept: () => {
        
      }
  });
    this.myForm.get('startamount')?.setValue(0);
    this.myForm.get('limitamount')?.setValue(0);
    this.myForm.get('manhour')?.setValue(1);
    this.myForm.get('containersize')?.setValue(1);
    this.myForm.get('containertype')?.setValue('');
    } else {
      this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'This combination already exists. Please enter a new combination.',
        header: 'Duplicate Entry',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: "none",
        rejectIcon: "none",
        rejectButtonStyleClass: 'p-button-danger',
        acceptLabel: 'Ok', 
        rejectVisible: false, 
        accept: () => {
        }
    });
    }
}





    
  

      // this.budgetdetail.push(newItem);
      // console.log(this.budgetdetail);
      // console.log(newItem);
    } else {
     
      this.myForm.get('startamount')?.setValue(0);
      this.myForm.get('limitamount')?.setValue(0);
      this.myForm.get('manhour')?.setValue(1);
      this.myForm.get('containersize')?.setValue(1);
      this.myForm.get('containertype')?.setValue('');
        this.budgetdetail.splice(this.detaillinerow, 1, newItem);
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Detailline Updated Successfully' });
      
    }
    

    this.detaillinerow = null;
    this.total_records = this.budgetdetail.length;

    
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

  this.animation = true;


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
      if(this.myForm.get('budgetactive')?.value == 'true'){
        this.myForm.get('budgetactive')?.setValue(true);
      }else{
        this.myForm.get('budgetactive')?.setValue(false);
      }
      Object.keys(value).forEach(controlName => {
        if (this.myForm.get(controlName)) {
          const disableFields = [ 'budgetactive', 'description', 'startamount', 'limitamount','manhour','containertype','containersize'];
          if (!disableFields.includes(controlName) ) {
            this.myForm.get(controlName)?.disable();
          }
        }
      });
      this.addReadOnlyStyles();
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


  this.animation = false;
  
}


addBudget( event : any){
 
  console.log(this.myForm);

  if(this.myForm.valid){
    let updatedetail:any = [];
    let insertdetail:any = [];
    
  
    this.budgetdetail.forEach((data:any) => {
        if(data.budgetdetailid != 0){
          updatedetail.push(data);
        }else{
          insertdetail.push(data);
        }
    })

    if(this.badgeval == 'NEW'){


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
          alert("WORKING")
          this.myForm.get('budgetid')?.setValue(val)
          insertdetail = [];
          this.budgetdetail.forEach((data:any) => {
              data.budgetid = val;
              insertdetail.push(data);
              if(insertdetail.length >0){
                this.companyService.insertBudgetLines(insertdetail).subscribe(value => {
                  // console.log(value);
                })
              }
            
        })
  
        

        });
        
        
        
      }else{
      
        this.confirmationService.confirm({
          target: event.target as EventTarget,
          message: 'The budget currency must match the company currency.',
          header: 'Currency Mismatch',
          icon: 'pi pi-exclamation-triangle',
          acceptIcon: "none",
          rejectIcon: "none",
          acceptButtonStyleClass: 'p-button-warning',
          acceptLabel: 'Ok', 
          rejectVisible: false, 
          accept: () => {
          }
      });

      this.myForm.get('budgetcurrencyid')?.markAsTouched;
      this.myForm.get('budgetcurrencyid')?.setValue('');
      }

      

      
    }
  
    if(this.badgeval == 'EDIT'){
  
 
      if(updatedetail.length>0){
        this.companyService.updatebudgetlines(updatedetail).subscribe(value => {
          // console.log(value);
        })
      }
       
        
        if(insertdetail.length >0){
          this.companyService.insertBudgetLines(insertdetail).subscribe(value => {
            // console.log(value);
          })
        }
        

        if(this.deletedetail.length>0){
          this.companyService.deleteDetailLine(this.deletedetail).subscribe(value => {
            console.log(value);
          })

          this.deletedetail = [];
        }
        

        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Budget Detail Updated Successfully !' });
  
      
    }
  }else{
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Please enter valid values in the fields to create a budget detail2.',
      header: 'Invalid Input',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      acceptButtonStyleClass: 'p-button-danger',
      acceptLabel: 'Ok', 
      rejectVisible: false, 
      accept: () => {
      }
  });
  if (this.myForm.invalid) {
      this.myForm.get('budgetcurrencyid')?.setValue('');
        for (const control of Object.keys(this.myForm.controls)) {
          this.myForm.controls[control].markAsTouched();
        }
      }
  }
  
}

transformToUppercase(event:any){
  const input = event.target as HTMLInputElement;
    input.value = input.value.toUpperCase();
    this.myForm.get('description')?.setValue(input.value);
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
          const disableFields = ['budgetactive', 'description', 'startamount', 'limitamount','manhour','containertype','containersize'];
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
        this.myForm.get('budgetcurrencyid')?.disable();
      }else{
        this.badgeval = 'NEW';
        this.myForm.get('budgetcurrencyid')?.enable();
        this.budgetdetail = [];
      }
    })
}else{
  this.confirmationService.confirm({
    target: val.target as EventTarget,
    message: 'Choose Proper Company Short name in the Hierarchy',
    header: 'Choose Proper Company',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon: "none",
    rejectIcon: "none",
    acceptButtonStyleClass: 'p-button-warning',
    acceptLabel: 'Ok', 
    rejectVisible: false, 
    accept: () => {
    }
});
}


console.log(this.myForm.get('budgetcurrency')?.value);
}
addReadOnlyStyles(): void {
 
  const readOnlyFields = document.querySelectorAll('.readonly-field');
  readOnlyFields.forEach(field => {
    field.classList.add('read-only');
  });
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

onCityChange(event : any){
  let selectedCityid:number = 0;
  if(event){
    selectedCityid = event.value;
    this.companyService.getShortNameByid(selectedCityid).subscribe ( data => {
      this.shortname = [];
      data.forEach(element => {
        this.shortname.push(element);
      });
      
    })

  } 
}



onShortnameChange(event:any){
  this.companyService.getById(event.value).subscribe(company => {
      
    this.myForm.patchValue(company);
    this.budgetid = this.myForm.get('budgetid')?.value;
    Object.keys(company).forEach(controlName => {
      if (this.myForm.get(controlName)) {
        const disableFields = ['budgetactive', 'description', 'startamount', 'limitamount','manhour','containertype','containersize'];
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
      this.myForm.get('budgetcurrencyid')?.disable();
    }else{
      this.badgeval = 'NEW';
      this.myForm.get('budgetcurrencyid')?.enable();
      this.budgetdetail = [];
    }
  })
}



getStatesByIds(selectedCountryIds: number[]): void {
  this.companyService.getStatesByIds(selectedCountryIds)
    .subscribe(states => {
      this.state = states;
    });
}

getCitybyCountryIds(selectedCountryIds: number[]): void {
  this.companyService.getCitybyCountryIds(selectedCountryIds)
    .subscribe(citys => {
      this.city = citys;
    });
}

getCityBystateIds(selectedCountryIds: number[]): void {
  this.companyService.getCityBystateIds(selectedCountryIds)
    .subscribe(citys => {
      this.citys = citys;
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
  alert("Working")
  this.showwwww = false;

}
BackToList() {
  if(this.myForm.touched){
    this.confirmationService.confirm({
      
      message: 'You have unsaved changes in the screen. Do you want to continue?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      acceptButtonStyleClass:"p-button-danger",
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
    description: ['', [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20),
      Validators.pattern('[a-zA-Z0-9\\- ]*')
    ]],
    currency: ['',Validators.required],
    startamount: [0, [
      Validators.pattern('^[0-9]*$'),
  ]],
  limitamount: [0, [
      Validators.pattern('^[0-9]*$'),

  ]],
    active: [''],
    createdate: [''],
    manhour: [1, [
      Validators.pattern('^[0-9]*$'),
      Validators.max(100)
  ]],
    containertype:[''],
    containersize: [1, [
      Validators.pattern('^[0-9]*$'),
      Validators.min(1),
      Validators.max(40)
  ]],
    companyid:['',Validators.required],
    companyname:['',Validators.required],
    companyshortname:['',Validators.required],
    contact:['',Validators.required],
    zipcode:['',Validators.required],
    country:[''],
    state : [''],
    city:[''],
    revenue:['',Validators.required],
    cid:['',[Validators.required]],
    sid:['',[Validators.required]],
    cityid:['',[Validators.required]],
    currencyid:['',Validators.required],
    budgetcurrencyid:['',Validators.required],
    budgetactive:['False'],
    budgetdetailid:[]




  } ,{ validators: startAmountLessThanLimitAmountValidator() });
}




  
}
export function startAmountLessThanLimitAmountValidator(): ValidatorFn {
  return (formGroup: AbstractControl): { [key: string]: boolean } | null => {

    const startAmount = formGroup.get('startamount')?.value;
    const limitAmount = formGroup.get('limitamount')?.value;
    const containerType = formGroup.get('containertype')?.value;

    if ( startAmount >= limitAmount && startAmount != '0'  && limitAmount !='0') {
        return { 'startAmountGreaterThanOrEqualLimitAmount': true };
    }
    return null;
  };


  
}