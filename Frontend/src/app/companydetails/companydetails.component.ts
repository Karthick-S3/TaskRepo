
import { ChangeDetectorRef, Component, OnInit, ViewChild , ElementRef  } from '@angular/core';
import { CompanyserviceService } from '../companyservice.service';
import { Company } from '../Interfaces/company';
import { Country } from '../Interfaces/country';
import { State } from '../Interfaces/state';
import { City } from '../Interfaces/city';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { BudgetDetail } from '../Interfaces/budgetdetail';
import { ConfirmationService } from 'primeng/api';
import { NgxUiLoaderService } from 'ngx-ui-loader';






@Component({
  selector: 'app-companydetails',
  templateUrl: './companydetails.component.html',
  styleUrls: ['./companydetails.component.css'],
  providers: [MessageService,CheckboxModule,CommonModule]
})
export class CompanydetailsComponent implements OnInit {


  constructor(
    private companyService: CompanyserviceService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private appcomponent : AppComponent,
    private confirmationService: ConfirmationService,
    private ngxService : NgxUiLoaderService  ) {}

  
  @ViewChild('demo') demoTable!: Table;
  @ViewChild('filterInput') filterInput!:ElementRef<HTMLInputElement>;
  

  total_record: number = 0;
  companys: Company[] = [];
  countrys: Country[] = [];
  selectedCountry: Country[] = [];
  selectedCountryIds: number[] = [];
  states: State[] = [];
  selectedState: State[] = [];
  citys: City[] = [];
  selectedCity: City[] = [];
  selectedStateIds: number[] = [];
  selectedCityIds: number[] = [];
  loading: boolean = false;
  animation: boolean = false;
  showwwww: boolean = false;
  fileName="Company Details.xlsx";
  sFiledValue: string[] | undefined;
  searchField: string[] | undefined;
  Companyid:any;
  Showadd:boolean = false;
  rowIndex:number = 0;
  showval: number | undefined;
  Tempcompany:Company[] = [];
  sortField:string | undefined='';
  sortOrder:boolean =false;
  globalFilter:string | undefined='';
  selectedRowIndex: number | null = null;
  expand:boolean = true;
  checked: string[] = [];
  selectedcompany!:Company;
  visible:boolean = false;

  detail_total_records!:number;
  single:any;
  budgetid!:number;
  budgetdetail: BudgetDetail[] = [];

  rowsperpageVal = this.appcomponent.TableProp.rowsperpage;
  scrollheightVal = this.appcomponent.TableProp.largeTabScroll;
  deatilscrollheightVal = this.appcomponent.TableProp.smallTabScroll;
  TabValues = [
    { field: 'companyname', header: 'CompanyName', width: '10%' },
    { field: 'companyshortname', header: 'Shortname', width: '9%' },
    { field: 'contact', header: 'Business Cont', width: '9%' },
    { field: 'address', header: 'Address', width: '9%' },
    { field: 'country', header: 'Country', width: '9%' },
    { field: 'state', header: 'State', width: '9%' },
    { field: 'city', header: 'City', width: '9%' },
    { field: 'zipcode', header: 'Zip code', width: '9%' },
    // { field: 'active', header: 'Active', width: '9%' },
    // { field: 'currency', header: 'Currency', width: '9%' },
    { field: 'budgetid', header: 'BudgetId', width: '9%' },
    { field: 'revenue', header: 'Revenue', width: '9%' }
  ];

  alertBudgetId(event: Event, budgetId: number): void {
    event.stopPropagation();
    this.visible = true;
    this.budgetid = budgetId;
    
    
    this.companyService.LazyDataBudgetDetail(0,  5, '', true, [], [],'',this.budgetid).subscribe(responce => {
      this.budgetdetail = responce;
     
    })
   
  }

  

  expandTable(){
  this.expand = !this.expand;
  }

 
  onCheckboxClick(event: Event) {
    event.stopPropagation();
    
  }
  routebyid(company:any,rowIndex:number){
    this.Companyid = company.companyid

    this.rowIndex = rowIndex;
    this.selectedRowIndex = rowIndex;
    this.Showadd = true;

    this.companyService.lazyData2(0 || 0, this.total_record || 10, this.sortField, this.sortOrder, this.searchField, this.sFiledValue, this.selectedCountryIds, this.selectedStateIds, this.selectedCityIds, this.globalFilter)
    .subscribe(companies => {
      this.Tempcompany = companies;
    });
    
  }
  returnPreviousCompId(){
    if(this.rowIndex==0){
      return undefined;
    }else{
     this.selectedRowIndex=this.rowIndex-1;
      return this.Tempcompany[--this.rowIndex].companyid;
    }
    
  }
   
  returnNextCompId() {
    if(this.rowIndex==this.Tempcompany.length-1){
      return undefined;
    }else{
      this.selectedRowIndex=this.rowIndex+1;
      return this.Tempcompany[++this.rowIndex]?.companyid;

    }
  }
  
  
  returnLastCompId(){
    if(this.rowIndex== this.Tempcompany.length-1){
      return undefined;
    }else{
      this.rowIndex = this.Tempcompany.length-1;
      this.selectedRowIndex = this.rowIndex;
      return this.Tempcompany[this.rowIndex].companyid;
    }
    
  }
  returnFirstCompId(){
    if(this.rowIndex==0){
      return undefined;
    }else{
      this.rowIndex = 0;
      this.selectedRowIndex = 0;
      return this.Tempcompany[0].companyid;
    }
    
  }
  shows(){
    this.Showadd = true;
    this.Companyid = 0;
  }

  show(val : boolean){
    this.Showadd = val;
  }
  

  ExportData() {
    const event = {
        first: 0,
        rows: this.total_record,
        sortField: "companyid",
        sortOrder: true
    };

    this.companyService.lazyData2(event.first || 0, event.rows || 10, event.sortField, event.sortOrder, this.searchField, this.sFiledValue, this.selectedCountryIds, this.selectedStateIds, this.selectedCityIds,this.globalFilter)
        .subscribe(companies => {
            if (companies && companies.length > 0) {
                const jsonData = companies.map(company => {
                    return {
                      'Cmp Id': company.companyid,
                      'CompanyName': company.companyname,
                      'Shortname': company.companyshortname,
                      'Business Cont': company.contact,
                      'Address': company.address,
                      'Country': company.country,
                      'State': company.state,
                      'City': company.city,
                      'Zip code': company.zipcode,
                      'Active': company.active,
                      'Revenue': company.revenue,
                      'Currency' : company.currency
                    };
                });
                const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
                const wb: XLSX.WorkBook = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
                XLSX.writeFile(wb, this.fileName);
                this.messageService.add({ severity: 'success', summary: 'Downloaded', detail: 'Company Details Downloaded Successfully' });
            } else {
                console.error('No companies found.');
            }
        });
  }

  

  showFilter(){
    this.showwwww = !this.showwwww;
  }

    erase(demo: Table) {
      this.messageService.add({ severity: 'info', summary: 'Clear', detail: 'Column Filter has been Cleared' });
    Object.keys(demo.filters).forEach(key => {
      const filter = demo.filters[key];
      if (Array.isArray(filter)) {
        filter.forEach((f: any) => f.value = null);
      } else {
        filter.value = null;
      }
    });

    

    const event: TableLazyLoadEvent = {
      first: 0,
      rows:this.showval
    };
    this.loadCompanies(event)
  }

    reload(){   
      this.messageService.add({ severity: 'success', summary: 'Reload', detail: 'Company Details Reloaded' });
    this.showwwww = false;
    this.selectedRowIndex =null;
    this.demoTable.reset();
    if (this.filterInput) {
      this.filterInput.nativeElement.value = ''; 
    }

  
  }

  PrintPage(){
    window.print();
  }

 

  ngOnInit(): void {
    
    

    this.loadCompanies({
      first: 0,
      rows: 10,
      sortField: undefined,
      sortOrder: 1,
      filters: {},
      globalFilter: ''
    });
    this.loadCountry();
    this.loadState();
    this.loadCity();

    this.ngxService.start();

    
   
  
  }


  
  
  loadCompanies(event : TableLazyLoadEvent): void {
   
      this.ngxService.start();
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
 
      this.companyService.lazyData2(event.first || 0, event.rows || 10, sortField, sortOrder, searchField, sFiledValue, this.selectedCountryIds, this.selectedStateIds, this.selectedCityIds,globalFilter)
        .subscribe(companies => {
          // console.log(companies);
          this.companys = companies;
          this.total_record = companies[0].total_records;
          this.ngxService.stop();
        });
  }



  loadCountry(): void {
    this.companyService.getCountry().subscribe({
      next: (countrys) => {
        this.countrys = countrys;
        this.cdr.detectChanges(); 
      },
      error: (response) => {
        console.error(response);
      }
    });
  }

  loadState(): void {

    this.companyService.getState().subscribe({
      next: (states) => {
        this.states = states;

      },
      error: (response) => {
        console.error(response);
      }
    });
  }

  loadCity(): void {

    this.companyService.getCity().subscribe({
      next: (citys) => {
        this.citys = citys;

      },
      error: (response) => {
        console.error(response);
      }
    });
  }

  onCountryChange(event: Country[]): void {
    if(event){
      const selectedCountryIds: number[] = [];
      this.selectedCountryIds=[];
      this.selectedStateIds=[];
      event.forEach(country => {
        selectedCountryIds.push(country.cid);
      });
      if(selectedCountryIds.length==0){
        this.loadCity();
        this.loadState();
      }
      if (selectedCountryIds.length > 0) {
        this.getStatesByIds(selectedCountryIds);
        this.getCitybyCountryIds(selectedCountryIds);
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

  onStateChange(event: State[]): void {
    if(event){
      const selectedStateIds: number[] = [];
      event.forEach(states => {
        selectedStateIds.push(states.sid);
      });
      if(selectedStateIds.length==0){
        this.loadCity();
      }
      this.selectedStateIds=[];
      this.selectedCity = [];
      this.selectedCityIds = [];
      if (selectedStateIds.length > 0) {
        this.getCityBystateIds(selectedStateIds);  
      }
    }
  }

  onCityChange(event: State[]): void {
    if(event){
      this.selectedCityIds=[];
    }
  }

  getCityBystateIds(selectedCountryIds: number[]): void {
    this.companyService.getCityBystateIds(selectedCountryIds)
      .subscribe(citys => {
        this.citys = citys;
      });

    this.selectedCityIds=[];
  }

  onSubmit() {
    this.ngxService.start();
    this.selectedCity.map(city => this.selectedCityIds.push(city.cityid));
    this.selectedState.map(state => this.selectedStateIds.push(state.sid));
    this.selectedCountry.map(country => this.selectedCountryIds.push(country.cid));
    if(this.selectedCity.length==0 && this.selectedState.length==0 && this.selectedCountry.length==0){
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please select at least one filter before submitting.' });
    }

    if(this.selectedCityIds.length ==0 && this.selectedCountryIds.length ==0 && this.selectedStateIds.length ==0) {
      const event: TableLazyLoadEvent = {
        first: 0,
        rows: this.showval,
        sortField: undefined, 
        sortOrder: null,
        globalFilter:this.globalFilter
      };

      
      // console.log(event);
      this.loadCompanies(event);
      this.ngxService.stop();
      

    }
    else{
      const event: TableLazyLoadEvent = {
        first: 0,
        rows: this.showval,
        sortField: undefined, 
        sortOrder: 1, 
        globalFilter:this.globalFilter
      };
    
      this.loadCompanies(event);
    }
  }

  clearForm(form: any): void {
    form.resetForm();
    this.selectedCityIds = [];
    this.selectedCountryIds = [];
    this.selectedStateIds = [];
    this.selectedCountry = [];
    this.selectedCity=[];
    this.selectedState = [];
    if (this.filterInput) {
      this.filterInput.nativeElement.value = ''; 
    }
    this.selectedRowIndex = null;
    this.loadCountry();
    this.loadState();
    this.loadCity();
    this.demoTable.reset();
    this.showwwww = false;
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Filters cleared successfully.' });
  }


  UnsavedChange(): Promise<boolean> {
    if (!this.Showadd) {
      return Promise.resolve(true);
    }

    this.appcomponent.msgStatus = 'confirm';

    return new Promise<boolean>((resolve, reject) => {
      this.confirmationService.confirm({
        message: 'You have unsaved changes in the screen, Do you want to continue?',
        header: 'Confirmation',
        icon: 'pi pi-check-circle',
        acceptIcon: "none",
        rejectIcon: "none",
        acceptLabel: 'Yes',
        rejectLabel: 'No',
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        }
      });
    });
  }
  

}
