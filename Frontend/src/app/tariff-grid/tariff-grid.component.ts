import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Budget } from '../Interfaces/budget';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { CompanyserviceService } from '../companyservice.service';
import { MessageService } from 'primeng/api';
import * as XLSX from 'xlsx';
import { Console } from 'console';


@Component({
  selector: 'app-tariff-grid',
  templateUrl: './tariff-grid.component.html',
  styleUrl: './tariff-grid.component.css',
  providers: [MessageService]
})
export class TariffGridComponent implements OnInit  {

  @ViewChild('demo') demoTable!: Table;
  @ViewChild('filterInput') filterInput!:ElementRef<HTMLInputElement>;

  budget:Budget[] = [];
  loading: boolean = false;
  total_records: number = 0;
  showval: number | undefined = 10;
  sFiledValue: string[] | undefined;
  searchField: string[] | undefined;
  sortField:string | undefined='';
  sortOrder:boolean =false;
  globalFilter:string | undefined='';
  animation = false;
  showwwww: boolean = false;
  fileName="Budget Details.xlsx";
  showAddBudget : boolean = false;
  Showadd: boolean | undefined;
  Companyid:any = 0;


  constructor( private companyService: CompanyserviceService,
    private messageService: MessageService,
   ){

  }




ngOnInit(): void {
  this.LazyDataBudget({
    first: 0,
    rows: 10,
    sortField: undefined,
    sortOrder: 1,
    filters: {},
    globalFilter: ''
  });
}














  LazyDataBudget(event : TableLazyLoadEvent): void {
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

    this.companyService.LazyDataBudget(event.first || 0, event.rows || 10, sortField, sortOrder, searchField, sFiledValue,globalFilter)
    .subscribe((budget) => {
      this.animation = false;
      this.budget = budget;
      this.total_records = budget[0].total_records;
    })

}

routebyid(val: any,index : number) {
  this.showAddBudget = true;
  this.Companyid = val.companyid;
}
ExportData() {
  const event = {
      first: 0,
      rows: this.total_records,
      sortField: "companyid",
      sortOrder: true
  };

  this.companyService.LazyDataBudget(event.first || 0, event.rows || 10, event.sortField, event.sortOrder, this.searchField, this.sFiledValue,this.globalFilter)
      .subscribe(companies => {
          if (companies && companies.length > 0) {
              const jsonData = companies.map(company => {
                  return {
                    'Budget Code': company.budgetid,
                    'Description': company.description,
                    'Currency': company.budgetcurrencyid,
                    'Active': company.budgetactive,
                    'Create Date': company.createdate,
                  };
              });
              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
              const wb: XLSX.WorkBook = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
              XLSX.writeFile(wb, this.fileName);
              this.messageService.add({ severity: 'success', summary: 'Downloaded', detail: 'Budget Details Downloaded Successfully' });
          } else {
              console.error('No companies found.');
          }
      });
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
  this.LazyDataBudget(event);

}

showFilter() {
  this.showwwww = !this.showwwww;
}
reload() {
  this.messageService.add({ severity: 'success', summary: 'Reload', detail: 'Budget Details Reloaded' });
    this.showwwww = false;
    this.demoTable.reset();
    if (this.filterInput) {
      this.filterInput.nativeElement.value = ''; 
    }
}

shows() {
  this.showAddBudget = true;
  this.Companyid = 0;
  
}
show(val : boolean){
  this.showAddBudget = val;
}
 
}
