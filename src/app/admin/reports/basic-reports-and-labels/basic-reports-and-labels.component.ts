import { Component, OnInit, ViewChild, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToasterTitle, ToasterType,UniqueConstants,ColumnDef} from 'src/app/common/constants/strings.constants';
import { AppNames } from 'src/app/common/constants/menu.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions'; 
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ChangeFilterRequest } from 'src/app/common/interface/admin/reports.interfaces';

@Component({
  selector: 'app-basic-reports-and-labels',
  templateUrl: './basic-reports-and-labels.component.html',
  styleUrls: ['./basic-reports-and-labels.component.scss']
})
export class BasicReportsAndLabelsComponent implements OnInit, OnDestroy {

  reports:any = [];
  @ViewChild('matRef') matRef: MatSelect;
  @ViewChildren(MatAutocompleteTrigger) triggers!: QueryList<MatAutocompleteTrigger>;
  reportTitles: any = [1,2,3,4]; 
  searchByInput: any = new Subject<string>();
  listFilterValue:any = [];
  oldFilterValue:any = [];
  fields:any = [];
  
  basicReportModel:any = {};
  reportData:any = {};
  
  // Debouncing properties
  searchSubjects: Subject<{value: string, index: number}>[] = [];
  private readonly DEBOUNCE_TIME = 400; // 400ms delay
  
  // Debouncing for "Value To Test" field changes
  private valueChangeSubjects: Subject<{value: string, index: number}>[] = [];
  private readonly VALUE_CHANGE_DEBOUNCE_TIME = 1000; // 1000ms delay for value changes
  
  // Lazy loading properties
  currentPage: number[] = [1, 1, 1, 1, 1, 1]; // Track page for each of 6 filters
  hasMoreData: boolean[] = [true, true, true, true, true, true]; // Track if more data available
  isLoadingMore: boolean[] = [false, false, false, false, false, false]; // Loading state
  private readonly PAGE_SIZE = 500; // Number of items per page
  loadingMore: string = "Loading more...";
  
  // Store scroll handlers for proper listener management
  private scrollHandlers: Map<number, (event: Event) => void> = new Map();
  // Store autocomplete subscriptions for cleanup
  private autocompleteSubscriptions: Map<number, Subscription> = new Map();
  ELEMENT_DATA: any[] =[
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'},
    {order_no: '1202122'}
  ]
  comparisonOperators = [
    { label: '', value: '' },
    { label: '= (Equals)', value: "=" },
    { label: '> (Greater Than)', value: ">" },
    { label: '< (Less Than)', value: "<" },
    { label: '>= (Greater Than or Equal)', value: ">=" },
    { label: '<= (Less Than or Equal)', value: "<=" },
    { label: '<> (Not Equal)', value: "<>" },
    { label: 'LIKE (Matches value with wildcards)', value: "LIKE" },
    { label: 'NOT LIKE (Matches value with wildcards)', value: "NOT LIKE" },
    { label: 'NULL (Empty/Blank)', value: "NULL" },
    { label: 'NOT NULL', value: "NOT NULL" },
    { label: 'BETWEEN', value:  "BETWEEN"},
    { label: 'NOT BETWEEN', value: "NOT BETWEEN" },
    { label: 'IN (In list like 1, 2, 3, 4)', value: "IN" },
    { label: 'NOT IN (Not in list like 1, 2, 3, 4)', value: "NOT IN" }
  ];
  

    displayedColumns: string[] = ['fields','expression_type','value_to_test','between',ColumnDef.Actions];
    tableData = this.ELEMENT_DATA
    dataSourceList:any
    currentApp

    public iAdminApiService: IAdminApiService;
    public userData: any;
  constructor(private dialog: MatDialog,private api:ApiFuntions,private adminApiService: AdminApiService,private authService:AuthService,private route:Router,public global:GlobalService,private router: Router) {
    this.iAdminApiService = adminApiService;    
    this.userData = this.authService.userData(); 
    this.route.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
        let spliUrl=event.url.split('/');
        switch (spliUrl[1]) {
          case 'admin':
            this.currentApp = 'Admin';
            break;
          case AppNames.OrderManager:
            this.currentApp = 'OM';
            break;
          case AppNames.InductionManager:
            this.currentApp = 'IM';
            break;
          case 'ConsolidationManager':
            this.currentApp = 'CM';
            break;
          default:
            break;
        }
     }
      });
  }

  ngOnInit(): void {
    this.basicReportModel.ChooseReport = "";
    this.getCustomReports();
    this.initializeDebounce();
  }

  initializeDebounce(){
    // Initialize debounced search subjects for each filter input (6 total)
    for (let i = 0; i < 6; i++) {
      this.searchSubjects[i] = new Subject<{value: string, index: number}>();
      
      // Set up debounced subscription - only calls API after user stops typing
      this.searchSubjects[i].pipe(
        debounceTime(this.DEBOUNCE_TIME),
        distinctUntilChanged((prev, curr) => prev.value === curr.value)
      ).subscribe(({value, index}) => {
        // Reset to page 1 when searching
        this.currentPage[index] = 1;
        this.changeFilter(this.reportData[4 + index], index, value, 1);
      });
    }
    
    // Initialize debounced value change subjects for each "Value To Test" field (6 total)
    for (let i = 0; i < 6; i++) {
      this.valueChangeSubjects[i] = new Subject<{value: string, index: number}>();
      
      // Set up debounced subscription - waits 1000ms after user stops typing
      this.valueChangeSubjects[i].pipe(
        debounceTime(this.VALUE_CHANGE_DEBOUNCE_TIME),
        distinctUntilChanged((prev, curr) => prev.value === curr.value)
      ).subscribe(({value, index}) => {
        this.reportFieldValues(index, value);
      });
    }
  }

  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  openAction(event:any){
    this.clearMatSelectList();
  }
  onFocusEmptyInput(i: number) {
    // Only load if no data exists yet
    if (!this.listFilterValue[i] || this.listFilterValue[i].length === 0) {
      this.currentPage[i] = 1;
      // Check if there's already a value in the input field (default value)
      const existingValue = this.reportData[16 + i] || '';
      this.changeFilter(this.reportData[4 + i], i, existingValue, 1);
    }
  }


  filterByItem(value : any,index){ 
    // Use debounced subject instead of direct API call
    // This prevents API spam while user is typing
    this.searchSubjects[index].next({value: value || '', index: index});
  }

  
  
  getCustomReports(){
    let payload = {
      'app':this.currentApp
    }
    this.iAdminApiService.Getcustomreports(payload).subscribe((res:any)=>{
      if(res.isExecuted && res.data)
      {
        this.reports = res?.data?.reports;
        this.reports.push('Utilization Report');
        
        // Sort reports alphabetically, ignoring case
        this.reports.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      this.reports.unshift('');
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("Getcustomreports",res.responseMessage);
      }
    })
  }



// Method to handle selection and navigation
basicReportDetails(selectedReport: string) {
  
  if (selectedReport === 'Utilization Report') {
      // Navigate to utilizationDashboard when "Utilization Report" is selected
      this.router.navigate(['/admin/reports/utilizationDashboard']);
  } else {
    let payload:any = {
      report:selectedReport, 
      }
      this.iAdminApiService.basicreportdetails(payload).subscribe((res:any)=>{
        if(res.isExecuted && res.data)
        {
          this.reportData = res?.data?.reportData; 
        this.fields = res?.data?.fields; 
        this.fields.unshift('');
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("basicreportdetails",res.responseMessage);
        }
      })
     
  }
}


  async changeFilter(column, index, searchTerm: string = '', pageNumber: number = 1) {  
    // Don't load if already loading
    if (this.isLoadingMore[index] && pageNumber > 1) {
      return;
    }

    // Reset hasMoreData for new searches (page 1)
    if (pageNumber === 1) {
      this.hasMoreData[index] = true;
    }

    // Set loading state for lazy loading
    if (pageNumber > 1) {
      this.isLoadingMore[index] = true;
    }

    const payload: ChangeFilterRequest = {
      reportName: this.basicReportModel.ChooseReport,
      column: column,
      searchTerm: searchTerm,
      pageSize: this.PAGE_SIZE,
      pageNumber: pageNumber
    };
    
    this.iAdminApiService.changefilter(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        if (pageNumber === 1) {
          // New search or initial load - replace data
          this.listFilterValue[index] = res.data;
          this.oldFilterValue[index] = res.data;
          this.currentPage[index] = 1;
        } else {
          // Lazy load - append data
          this.listFilterValue[index] = [...this.listFilterValue[index], ...res.data];
          this.oldFilterValue[index] = [...this.oldFilterValue[index], ...res.data];
        }
        
        // Check if we got less than pageSize, meaning no more data available
        this.hasMoreData[index] = res.data.length >= this.PAGE_SIZE;
        this.isLoadingMore[index] = false;
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("changefilter", res.responseMessage);
        this.isLoadingMore[index] = false;
      }
    }, (error) => {
      this.isLoadingMore[index] = false;
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
    });
  }
  reportFieldsExps(item:any=null,index:any=null){
    if(item == 'fields'){
      this.reportData[10+index] = "";
      this.reportData[16+index] = "";
      this.reportData[22+index] = "";
    }
    let payload:any = {
     report:this.basicReportModel.ChooseReport, 
     fields:[],
     exps:[]
    };
     for(let i = 0;i<6;i++){
      payload.fields.push(this.reportData[4+i]);
     }  
     for(let i = 0;i<6;i++){
      payload.exps.push(this.reportData[10+i]);
     }  
     this.iAdminApiService.ReportFieldsExps(payload).subscribe((res:any)=>{  
       
     })
   }

   valueSelect(event: MatAutocompleteSelectedEvent,index){ 
    this.reportData[16+index]  = event.option.value;
    this.reportFieldValues(index,this.reportData[16+index]);
   }
   selectedIndex:number;
   selectedValue:string;
   reportFieldValuesChange(index,value){
      // Use debounced subject instead of setTimeout
      this.valueChangeSubjects[index].next({value: value, index: index});
   }
reportFieldValues(selectedIndex,selectedValue,IsRemove=false){
  if(IsRemove || !(selectedIndex == this.selectedIndex && selectedValue == this.selectedIndex)){
    this.selectedIndex = selectedIndex;
    this.selectedValue =selectedValue;
  let payload:any = {
    report:this.basicReportModel.ChooseReport, 
    V1:[] ,
    V2:[]
   };
    for(let i = 0;i<6;i++){
     payload.V1.push(this.reportData[16+i].toString());
    }   for(let i = 0;i<6;i++){
      payload.V2.push(["NOT BETWEEN","BETWEEN"].indexOf(this.reportData[10 + i]) > -1 && this.reportData[22+i].toString() ? this.reportData[22+i].toString():"");
      
     } 
     this.iAdminApiService.reportfieldvalues(payload).subscribe((res:any)=>{ 
       console.log('resss')
       
     })
   } 
    
  }
reportPayloadTitles(){
  let payload:any = {
    report:this.basicReportModel.ChooseReport, 
    title:[]  
   };
    for(let i = 0;i<4;i++){
     payload.title.push(this.reportData[i]);
    }    
     this.iAdminApiService.ReportTitles(payload).subscribe((res:any)=>{  
       
     })
   }

  openListAndLabel(){ 
    window.open(`/#/report-view?file=${this.global.capitalizeAndRemoveSpaces(this.basicReportModel.ChooseReport)+'-lst'}`, UniqueConstants._blank, 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
  }
Remove(index){ 
  this.reportData[16+index] = "";
  this.reportData[4+index] = "";
  this.reportData[10+index] = ""; 
  this.reportFieldsExps();
  this.reportFieldValues(index,"",true);
  this.reportPayloadTitles();
  
  // Reset pagination state
  this.currentPage[index] = 1;
  this.hasMoreData[index] = true;
  this.listFilterValue[index] = [];
  this.oldFilterValue[index] = [];
}

/**
 * Load more data for lazy loading (called when user scrolls near bottom)
 */
loadMoreData(index: number): void {
  if (!this.hasMoreData[index] || this.isLoadingMore[index]) {
    return; // Don't load if no more data or already loading
  }
  
  this.currentPage[index]++;
  const searchTerm = this.reportData[16 + index] || '';
  const column = this.reportData[4 + index];
  
  this.changeFilter(column, index, searchTerm, this.currentPage[index]);
}

/**
 * Setup scroll listener when autocomplete opens
 */
onAutocompleteOpened(index: number, trigger: MatAutocompleteTrigger): void {
  // Unsubscribe from previous subscription if exists
  const oldSubscription = this.autocompleteSubscriptions.get(index);
  if (oldSubscription) {
    oldSubscription.unsubscribe();
  }

  // Function to attach scroll listener to panel
  const attachScrollListener = () => {
    // Use requestAnimationFrame to ensure panel is fully rendered in next frame
    requestAnimationFrame(() => {
      const panel = trigger.autocomplete.panel?.nativeElement as HTMLElement;

      if (panel) {
        // Remove old handler if exists
        const oldHandler = this.scrollHandlers.get(index);
        if (oldHandler) {
          panel.removeEventListener('scroll', oldHandler);
        }

        // Create and store new handler with proper types
        const newHandler = (event: Event) => this.handleAutocompleteScroll(event, index);
        this.scrollHandlers.set(index, newHandler);
        
        // Add new listener
        panel.addEventListener('scroll', newHandler);
      }
    });
  };

  // Check if panel is already open and attach listener immediately
  if (trigger.panelOpen) {
    attachScrollListener();
  }

  // Subscribe to opened events for future opens
  const subscription = trigger.autocomplete.opened.subscribe(() => {
    attachScrollListener();
  });

  // Store subscription for cleanup
  this.autocompleteSubscriptions.set(index, subscription);
}

/**
 * Handle scroll event on autocomplete panel
 */
private handleAutocompleteScroll(event: Event, index: number): void {
  const target = event.target as HTMLElement;
  if (!target) return;
  
  const threshold = 0.8; // Load more when scrolled 80% down
  const position = (target.scrollTop + target.offsetHeight) / target.scrollHeight;
  
  if (position > threshold) {
    this.loadMoreData(index);
  }
}

/**
 * Cleanup subscriptions when component is destroyed
 */
ngOnDestroy(): void {
  // Unsubscribe from all search subjects to prevent memory leaks
  this.searchSubjects.forEach(subject => {
    if (subject) {
      subject.complete();
    }
  });
  
  // Unsubscribe from value change subjects
  this.valueChangeSubjects.forEach(subject => {
    if (subject) {
      subject.complete();
    }
  });
  
  // Unsubscribe from autocomplete subscriptions
  this.autocompleteSubscriptions.forEach(subscription => {
    if (subscription) {
      subscription.unsubscribe();
    }
  });
  
  // Clean up scroll listeners
  this.scrollHandlers.clear();
  this.autocompleteSubscriptions.clear();
}

isValueInputDisabled(index: number): boolean {
  const reportField = this.reportData[4 + index];
  const isFieldEmpty = reportField === '' || reportField === null;
  const noReportSelected = this.basicReportModel.ChooseReport === '';

  return isFieldEmpty || noReportSelected;
}

}
