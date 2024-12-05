import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
 
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ToasterTitle, ToasterType ,LiveAnnouncerMessage,ResponseStrings,StringConditions,DialogConstants,UniqueConstants,Style,ColumnDef,TableConstant, Placeholders} from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';

@Component({
  selector: 'app-ccb-count-queue',
  templateUrl: './count-queue.component.html',
  styleUrls: ['./count-queue.component.scss'],
})
export class CCBCountQueueComponent implements OnInit {
  placeholders = Placeholders;
  displayedColumns: string[] = [
    'itemNumber',
    UniqueConstants.Description,
    'locationQty',
    'um',
    TableConstant.WareHouse,
    TableConstant.Location,
    'velocityCode',
    UniqueConstants.cellSize,
    'serialNo',
    'lotNo',
    'expDate',
    ColumnDef.Action,
  ];
  dataSource: any = [];
  noData:boolean=false;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() updateData: string;
  public iAdminApiService: IAdminApiService;
  constructor(
    private adminApiService: AdminApiService,
    private _liveAnnouncer: LiveAnnouncer,
    public Api: ApiFuntions,
    private authService: AuthService,
    public global:GlobalService, 
  ) {
    this.iAdminApiService = adminApiService;
    this.userData = this.authService.userData();
  }
  userData: any;
  pageEvent: PageEvent;
  @Output() countEvent = new EventEmitter<string>();
  @Output() insertEvent = new EventEmitter<string>();
  @Input()
  set event(event: Event) {
   
    if(event===undefined)return
    if (event['invMapIDs'] || event['invMapIDs'].length > 0 || event !=undefined || event !=null ) {
   
      this.getCountQue();
    }
  }
  customPagination: any = {
    total: '',
    recordsPerPage: 10,
    startIndex: 1,
    endIndex: 10,
  };
  sortColumn: any = {
    columnIndex: 1,
    sortOrder: 'desc',
  };

  ngOnInit(): void {
    this.initializeDataSource();
  }

  initializeDataSource(): void {
    this.dataSource = new MatTableDataSource();
    this.getCountQue();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
   
    if (changes['updateData'][StringConditions.currentValue]) {
      this.getCountQue();
    }
   
  }

  
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }





  getCountQue() {
    let payload = { 
      draw: 1,
      sRow: this.customPagination.startIndex,
      eRow: this.customPagination.endIndex,
      sortColumnIndex: this.sortColumn.columnIndex,
      sortOrder: this.sortColumn.sortOrder,
    };
    this.iAdminApiService.GetCCQueue(payload).subscribe(
      (res: any) => {
        if(res.isExecuted && res.data)
        {
          if (res.data.invCycleCount.length >= 0) {
            this.dataSource = new MatTableDataSource(res.data.invCycleCount);
            this.customPagination.total = res.data?.recordsFiltered;
            this.noData=true;
            this.getCount(res.data.recordsTotal);
          } else {
  this.noData  = false;
  this.customPagination.total = 0;
          }

        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("GetCCQueue",res.responseMessage);
        }
      },
    );

  
  }
  getCount(count) {
    this.countEvent.emit(count);
  }

  createCycleCount() {
    const dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w786px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        message:
          'Would you like to create count transactions for these locations?',
        heading: 'Create Cycle Count',
      },
    });
    dialogRef.afterClosed().subscribe((res:any) => {
      if (res===ResponseStrings.Yes) {
        this.iAdminApiService.CreateCountRecords().subscribe(
          (response: any) => {
            if (response.isExecuted) {
              this.global.ShowToastr(ToasterType.Success,response.responseMessage, ToasterTitle.Success);
              this.getCountQue();
              this.getCount(0);
              this.initializeDataSource();
              this.insertEvent.emit('insert');
            } else {
              this.global.ShowToastr(ToasterType.Error,
                'Error Occured while creating Count records, check event log for more information',ToasterTitle.Error
              );
              console.log("CreateCountRecords",res.responseMessage);
            }
          },
        );
      } 
    });
  }

  deleteCycleCount(event) {
        this.iAdminApiService.RemoveccQueueAll().subscribe(
          (response: any) => {
            if (response.isExecuted) {
              this.global.ShowToastr(ToasterType.Success,response.responseMessage, ToasterTitle.Success);
              this.getCount(0);
              this.getCountQue();
              this.initializeDataSource();
            } else {
              this.global.ShowToastr(ToasterType.Error,
                
                'An Error Occured while trying to remove all data, check the event log for more information', ToasterTitle.Error
              );
              console.log("RemoveccQueueAll",response.responseMessage);
            }
          },
        );
  }

  deleteRow(rowId) {
    let payload = { 
      invMapID: rowId.toString(),
    };
    this.iAdminApiService.RemoveccQueueRow(payload).subscribe(
      (res: any) => {
        if (res.isExecuted) {
          this.getCountQue();
        } else {
          this.global.ShowToastr(ToasterType.Error,
            'An Error Occured while trying to remove this row, check the event log for more information',ToasterTitle.Error
          );
          console.log("RemoveccQueueRow",res.responseMessage);
        }
      },
    );
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.customPagination.startIndex = e.pageSize * e.pageIndex;
    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;
    this.getCountQue();
  }

  sortChange(event) {
    if (
      !this.dataSource._data._value ||
      event.direction == '' ||
      event.direction == this.sortColumn.sortOrder
    )
      return;
    let index;
    this.displayedColumns.forEach((x, i) => {
      if (x === event.active) {
        index = i+1;
      }
    });
    this.sortColumn.columnIndex = index;
    this.sortColumn.sortOrder = event.direction;
    this.getCountQue();
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
  }
}
