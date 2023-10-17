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
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
 
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-ccb-count-queue',
  templateUrl: './count-queue.component.html',
  styleUrls: ['./count-queue.component.scss'],
})
export class CCBCountQueueComponent implements OnInit {
  displayedColumns: string[] = [
    'itemNumber',
    'description',
    'locationQty',
    'um',
    'warehouse',
    'location',
    'velocityCode',
    'cellSize',
    'serialNo',
    'lotNo',
    'expDate',
    'action',
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
    this.dataSource = new MatTableDataSource();

    this.getCountQue();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
   
    if (changes['updateData']['currentValue']) {
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
        if (res.isExecuted && res.data.invCycleCount.length >= 0) {
          this.dataSource = new MatTableDataSource(res.data.invCycleCount);
          this.customPagination.total = res.data?.recordsFiltered;
          this.noData=true;
          this.getCount(res.data.recordsTotal);
        } else {
this.noData  = false;
this.customPagination.total = 0;
        }
      },
      (error) => {}
    );

  
  }
  getCount(count) {
    this.countEvent.emit(count);
  }

  createCycleCount() {
    const dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: '786px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        message:
          'Would you like to create count transactions for these locations?',
        heading: 'Create Cycle Count',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      
      if (res==='Yes') {
       
       
        this.iAdminApiService.CreateCountRecords().subscribe(
          (response: any) => {
            if (response.isExecuted) {
              this.global.ShowToastr('success',response.responseMessage, 'Success!');
              this.getCountQue();
              this.getCount(0);
              this.ngOnInit();
              this.insertEvent.emit('insert');
            } else {
              
              this.global.ShowToastr('error',
                'Error',
                'Error Occured while creating Count records, check event log for more information'
              );
              console.log("CreateCountRecords",res.responseMessage);
            }
          },
          (error) => {}
        );
      } 
    });
  }

  deleteCycleCount(event) {

      

        this.iAdminApiService.RemoveccQueueAll().subscribe(
          (response: any) => {
            if (response.isExecuted) {
              this.global.ShowToastr('success',response.responseMessage, 'Success!');
              this.getCount(0);
              this.getCountQue();
              this.ngOnInit();

            } else {
              
              this.global.ShowToastr('error',
                'Error',
                'An Error Occured while trying to remove all data, check the event log for more information'
              );
              console.log("RemoveccQueueAll",response.responseMessage);
            }
          },
          (error) => {}
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
          
          this.global.ShowToastr('error',
            'Error',
            'An Error Occured while trying to remove this row, check the event log for more information'
          );
          console.log("RemoveccQueueRow",res.responseMessage);
        }
      },
      (error) => {}
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
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }




}
