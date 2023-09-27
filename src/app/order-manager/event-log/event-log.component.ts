import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { OmEventLogEntryDetailComponent } from 'src/app/dialogs/om-event-log-entry-detail/om-event-log-entry-detail.component'; 
import { AuthService } from 'src/app/init/auth.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { ToastrService } from 'ngx-toastr';
import labels from '../../labels/labels.json';
import { MatMenuTrigger } from '@angular/material/menu';
import { ContextMenuFiltersService } from 'src/app/init/context-menu-filters.service';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-event-log',
  templateUrl: './event-log.component.html',
  styleUrls: ['./event-log.component.scss']
})
export class EventLogComponent implements OnInit {

  displayedColumns: string[] = ['dateStamp', 'message', 'eventCode', 'nameStamp', 'eventType', 'eventLocation', 'notes', 'transactionID','actions'];
  dataSourceList: any;

  ignoreDateRange: boolean = false;
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

  constructor(
    private dialog: MatDialog,
    private Api: ApiFuntions,
    private authService: AuthService,
    private toastr: ToastrService,
    private global:GlobalService,
    private filterService: ContextMenuFiltersService,
    private datepipe: DatePipe,
    private router: Router
  ) { }

  event(e:any){
    this.resetPagination();
    this.eventLogTable(true);
  }

  ngOnInit(): void {
    this.isAdmin = this.router.url == "/OrderManager/EventLog" ? false : true;
    this.userData = this.authService.userData();
    this.startDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.endDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.eventLogTable();
  }

  ngOnDestroy() {
    this.eventLogTableSubscribe.unsubscribe();
  }

  onIgnoreDateRange(ob: MatCheckboxChange) {
    this.resetPagination();
    this.eventLogTable();
  }

  clearFilters() {
    this.startDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.endDate = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.message = "";
    this.eventLocation = "";
    this.userName = "";
    this.message = "";
    this.resetPagination();
    this.eventLogTable(true);
  }

  openOmEventLogEntryDetail(element: any) {
    let dialogRef = this.dialog.open(OmEventLogEntryDetailComponent, {
      height: 'auto',
      width: '932px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: { data: element }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventLogTable(true);
      }
    });
  }

  eventLogTable(loader: boolean = false) {
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
      "sDate": !this.ignoreDateRange ? this.startDate: new Date(new Date().setFullYear(1990)),
      "eDate": !this.ignoreDateRange ? this.endDate : new Date(),
      "nameStamp": this.userName,
      "filter": this.filterString,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    };
    this.eventLogTableSubscribe = this.Api.EventLogTable(payload).subscribe((res: any) => {
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
    this.eventLogTable(true);
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
    this.eventLogTable(true);
  }

  eventLogTypeAhead(columnName: any, message: any, loader: boolean = false) {
    this.searchAutocompleteList = [];
    let payload: any = {
      "message": message,
      "columnName": columnName,
      "sDate": "2022-06-04T00:00:00.597Z",
      "eDate": "2023-06-05T00:00:00.597Z",
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    }
    this.eventLogTypeAheadSubscribe = this.Api.EventLogTypeAhead(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data && message != "") {
        this.searchAutocompleteList = res.data.sort();
      }
    });
  }

  refresh() {
    this.resetPagination();
    this.eventLogTable(true);
  }

  deleteRange() { 
    if(this.startDate > this.endDate){
      this.toastr.error('Start date must be before end date!', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      return;
    }
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
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
          "nStamp": this.userName,
          "username": this.userData.userName,
          "wsid": this.userData.wsid
        }
        this.Api.EventRangeDelete(payload).subscribe((res: any) => {
          if (res.isExecuted && res.data) {
            this.resetPagination();
            this.eventLogTable(true);
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          } else {
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
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
    this.eventLogTable(true);
  }

  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.trigger.menuData = { item: { SelectedItem: SelectedItem, FilterColumnName: FilterColumnName, FilterConditon: FilterConditon, FilterItemType: FilterItemType } };
    this.trigger.menu?.focusFirstItem('mouse');
    this.trigger.openMenu();
  }

  onContextMenuCommand(SelectedItem: any, FilterColumnName: any, Condition: any, Type: any) {
    if (SelectedItem != undefined) {
      this.filterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, "clear", Type);
      this.filterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, Condition, Type);
    }
    this.filterString= this.filterString != "" ? this.filterString : "1 = 1";
    this.resetPagination();
    this.eventLogTable(true);
  }

  getType(val): string {
    return this.filterService.getType(val);
  }

  InputFilterSearch(FilterColumnName: any, Condition: any, TypeOfElement: any) {
    const dialogRef = this.dialog.open(InputFilterComponent, {
      height: 'auto',
      width: '480px',
      data: {
        FilterColumnName: FilterColumnName,
        Condition: Condition,
        TypeOfElement: TypeOfElement
      },
      autoFocus: '__non_existing_element__',
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe((result) => {
      this.onContextMenuCommand(result.SelectedItem, result.SelectedColumn, result.Condition, result.Type)
    }
    );
  }

  announceSortChange(e: any) {
    this.sortColumn = this.sortMapping.filter((item: any) => item.value == e.active)[0].sortValue;
    this.sortOrder = e.direction;
    this.resetPagination();
    this.eventLogTable(true);
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

  clear(){
    this.eventLogTable(true);
  }
}

