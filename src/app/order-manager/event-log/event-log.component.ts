import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { OmEventLogEntryDetailComponent } from 'src/app/dialogs/om-event-log-entry-detail/om-event-log-entry-detail.component'; 
import { AuthService } from 'src/app/init/auth.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import labels from '../../labels/labels.json';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContextMenuFiltersService } from 'src/app/init/context-menu-filters.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';

@Component({
  selector: 'app-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.scss']
})
export class EventLogComponent implements OnInit {

  displayedColumns: string[] = ['dateStamp', 'message', 'eventCode', 'nameStamp', 'eventType', 'eventLocation', 'notes', 'transactionID','actions'];
  dataSourceList: any;
  public iAdminApiService: IAdminApiService;
  ignoreDateRange: boolean ;
  startDate:any = "";
  endDate:any = "";
  message: string = "";
  eventLocation: string = "";
  eventCode: string = "";
  eventType: string = "";
  userName: string = "";
  start: number = 0;
  length: number = 15;
  filterString: string = "1 = 1";
  sortColumn: number = 0;
  sortOrder: string = "desc";

  userData: any;
  tableData: any = [];
  recordsTotal: any;
  recordsFiltered: any;
  eventLogTableSubscribe: any;
  eventLogTypeAheadSubscribe: any;

  searchAutocompleteList: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('trigger') trigger: MatMenuTrigger;
  contextMenuPosition = { x: '0px', y: '0px' };

  sortMapping: any = [
    { value: 'dateStamp', sortValue: '0' },
    { value: 'message', sortValue: '1' },
    { value: 'eventCode', sortValue: '2' },
    { value: 'nameStamp', sortValue: '3' },
    { value: 'eventType', sortValue: '4' },
    { value: 'eventLocation', sortValue: '5' },
    { value: 'notes', sortValue: '6' },
    { value: 'transactionID', sortValue: '7' },
  ];

  isAdmin: boolean = false;
  IsActiveTrigger:boolean =false;
  constructor(
    private global:GlobalService,
    private Api: ApiFuntions,
    private authService: AuthService,
    private contextMenuService : TableContextMenuService,
    private dialog:MatDialog,
    private filterService: ContextMenuFiltersService,
    private adminApiService: AdminApiService,
    private datepipe: DatePipe,
    private router: Router
  ) {
    this.iAdminApiService = adminApiService;
   }

  event(e:any){
    this.resetPagination();
    this.eventLogTable(this.objIgnoreDateRange);
  }

  ngOnInit(): void {
    this.isAdmin = !(this.router.url == "/OrderManager/EventLog");
    this.userData = this.authService.userData();
    this.startDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.endDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.eventLogTable(this.objIgnoreDateRange);
  }
  
  
  ngOnDestroy() {
    this.eventLogTableSubscribe.unsubscribe();
  }
  objIgnoreDateRange : any;
  onIgnoreDateRange(ob: MatCheckboxChange) {
    this.objIgnoreDateRange=ob;
    this.resetPagination();
    this.eventLogTable(ob);
  }

  clearFilters() {
    console.log(this.objIgnoreDateRange);
    this.message = "";
    this.eventLocation = "";
    this.userName = "";
    this.message = "";
    this.eventCode='';
    this.eventType='';
    this.resetPagination();
    this.eventLogTable(this.objIgnoreDateRange);
  }

  openOmEventLogEntryDetail(element: any) {
    let dialogRef:any = this.global.OpenDialog(OmEventLogEntryDetailComponent, {
      height: 'auto',
      width: '932px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: { data: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventLogTable(this.objIgnoreDateRange);
      }
    });
  }

  eventLogTable(obj:any) {
    let payload: any = {
      "draw": 0,
      "start": this.start,
      "length": this.length,
      "sortColumn": this.sortColumn,
      "sortOrder": this.sortOrder,
      "messageFilter": this.message,
      "eventLocation": this.eventLocation,
      "transStatus": this.eventCode,
      "transType": this.eventType,
      "sDate": !obj?.checked ? this.startDate: new Date(new Date().setFullYear(1990)),
      "eDate": !obj?.checked ? this.endDate : new Date(),
      "nameStamp": this.userName,
      "filter": this.filterString,
    };
    this.eventLogTableSubscribe = this.iAdminApiService.EventLogTable(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.tableData = res.data.openEvents;
        this.recordsTotal = res.data.recordsTotal;
        this.recordsFiltered = res.data.recordsFiltered;
      }
      else{
        this.tableData = [];
        this.recordsTotal = 0;
        this.recordsFiltered = 0;
      }
    });
  }

  search(event: any, key: any) {
    this[key] = event.option.value;
    this.resetPagination();
    this.eventLogTable(this.objIgnoreDateRange);
  }

  resetPagination() {
    this.start = 0;
    this.paginator.pageIndex = 0;
  }

  autocompleteSearchColumn(columnName: any, message: any) {
    this.resetPagination();
    this.eventLogTypeAheadSubscribe.unsubscribe();
    this.eventLogTypeAhead(columnName, message, true);
    this.eventLogTableSubscribe.unsubscribe();
    this.eventLogTable(this.objIgnoreDateRange);
  }

  eventLogTypeAhead(columnName: any, message: any, loader: boolean = false) {
    this.searchAutocompleteList = [];
    let payload: any = {
      "message": message,
      "columnName": columnName,
      "sDate": "2022-06-04T00:00:00.597Z",
      "eDate": "2023-06-05T00:00:00.597Z",
    }
    this.eventLogTypeAheadSubscribe = this.iAdminApiService.EventLogTypeAhead(payload).subscribe((res: any) => {
      if(res.isExecuted)
      {
        if (res.data && message != "") {
          this.searchAutocompleteList = res.data.sort();
        }
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("EventLogTypeAhead",res.responseMessage);
      }
      
    });
  }

  refresh() {
    this.resetPagination();
    this.eventLogTable(this.objIgnoreDateRange);
  }

  deleteRange() { 
    if(this.startDate > this.endDate){
      this.global.ShowToastr('error','Start date must be before end date!', 'Error!');
      return;
    }
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete-event-log',
        ErrorMessage: 'Are you sure you want to delete all Event Log entries with specified date, message, event location and name stamp filters?',
        action: 'delete'
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Yes') {
        let payload: any = {
          "beginDate": this.startDate,
          "endDate": this.endDate,
          "message": this.message,
          "eLocation": this.eventLocation,
          "nStamp": this.userName
        }
        this.iAdminApiService.EventRangeDelete(payload).subscribe((res: any) => {
          if (res.isExecuted && res.data) {
            this.resetPagination();
            this.eventLogTable(this.objIgnoreDateRange);
            this.global.ShowToastr('success',labels.alert.delete, 'Success!');
          } else {
            this.global.ShowToastr('error',res.responseMessage, 'Error!');
            console.log("EventRangeDelete",res.responseMessage);
          }
        });
      }
    });
  }
  
  printSelected(param:any){
    if(param.eventID == 0) param.eventID  = -1; 
    let curdatetime = this.datepipe.transform(param.dateStamp, 'yyyy-MM-dd HH:mm:ss');
    this.global.Print(`FileName:printELReport|sDate:${curdatetime}|eDate:${curdatetime}|eID:${param.eventID ? param.eventID : ''}|message:${param.message ?param.message: '' }|eLocation:${param.eLocation ?param.eLocation: '' }|nStamp:${param.nStamp ?param.nStamp: '' }`);
  }

  printRange(){
    this.global.Print(`FileName:printELReport|sDate:${this.startDate}|eDate:${this.endDate}|eID:-1|message:${this.message}|eLocation:${this.eventLocation}|nStamp:${this.message}`);
  }

  paginatorChange(event: PageEvent) {
    this.start = event.pageSize * event.pageIndex;
    this.length = event.pageSize;
    this.eventLogTable(this.objIgnoreDateRange);
  }

  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault()
    this.IsActiveTrigger = true;
    setTimeout(() => {
      this.contextMenuService.updateContextMenuState(event, SelectedItem, FilterColumnName, FilterConditon, FilterItemType);
    }, 100);
  }

  optionSelected(filter : string) {
    this.filterString = filter;
    this.resetPagination();
    this.eventLogTable(this.objIgnoreDateRange);     this.IsActiveTrigger = false; 
  }

  announceSortChange(e: any) {
    this.sortColumn = this.sortMapping.filter((item: any) => item.value == e.active)[0].sortValue;
    this.sortOrder = e.direction;
    this.resetPagination();
    this.eventLogTable(this.objIgnoreDateRange);
  }

  exportRange(){
    this.global.OpenExportModal("Single Range",`FileName:singleExport|sDate:${this.startDate}|eDate:${this.endDate}|message:${this.message}|eLocation:${this.eventLocation}|nStamp:${this.message}`);
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    const target = event.target as HTMLElement;
    if (!this.isInputField(target) && event.key === 'c') {
      event.preventDefault();
      this.clearFilters();
    }
    if (!this.isInputField(target) && event.key === 'd' && this.isAdmin) {
      event.preventDefault();
      if(this.dialog.openDialogs.length > 0) return;
      this.deleteRange();
    }
    if (!this.isInputField(target) && event.key === 'e') {
      event.preventDefault();
      this.exportRange();
    }
    if (!this.isInputField(target) && event.key === 'r') {
      event.preventDefault();
      this.refresh();
    }
  }

  isInputField(element: HTMLElement): boolean {
    return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable;
  }

  clear(field:any = ""){
    if(field=='Event Location'){
      this.eventLocation='';
    }
    else if(field=='Message'){
      this.message='';
    }
    else if(field=='Username'){
      this.userName='';
    }
    else if(field=='Event Code'){
      this.eventCode='';
    }
    else if(field=='Event Type'){
      this.eventType='';
    }
    this.eventLogTable(this.objIgnoreDateRange);
  }
}

