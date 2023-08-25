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
import { ToastrService } from 'ngx-toastr'; 
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DeleteConfirmationTransactionComponent } from 'src/app/admin/dialogs/delete-confirmation-transaction/delete-confirmation-transaction.component';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

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
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    public Api: ApiFuntions,
    private authService: AuthService,
    public dialog: MatDialog,
    public toastr: ToastrService
  ) {
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
    // this.dataSource.sort = this.sort
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
      userName: this.userData.userName,
      wsid: this.userData.wsid,
      draw: 1,
      sRow: this.customPagination.startIndex,
      eRow: this.customPagination.endIndex,
      sortColumnIndex: this.sortColumn.columnIndex,
      sortOrder: this.sortColumn.sortOrder,
    };
    this.Api.GetCCQueue(payload).subscribe(
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
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
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
        let payload = {
          userName: this.userData.userName,
          wsid: this.userData.wsid,
          appName: 'Cycle Count',
        };
       
        this.Api.CreateCountRecords().subscribe(
          (response: any) => {
            if (response.isExecuted) {
              this.toastr.success(response.responseMessage, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
              this.getCountQue();
              this.getCount(0);
              this.ngOnInit();
              this.insertEvent.emit('insert');
            } else {
              this.toastr.error(
                'Error',
                'Error Occured while creating Count records, check event log for more information',
                {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                }
              );
            }
          },
          (error) => {}
        );
      } else {
      }
    });
  }

  deleteCycleCount(event) {
    // const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
    //   height: 'auto',
    //   width: '600px',
    //   autoFocus: '__non_existing_element__',
    //   data: {
    //     mode: 'delete-cycle-count',
    //     actionMessage: 'all records from the Queue',
    //     action:'delete'
    //   },
    // });

        let payload = {
          userName: this.userData.userName,
          wsid: this.userData.wsid,
          appName: 'Cycle Count',
        };

        this.Api.RemoveccQueueAll().subscribe(
          (response: any) => {
            if (response.isExecuted) {
              this.toastr.success(response.responseMessage, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
              this.getCount(0);
              this.getCountQue();
              this.ngOnInit();

            } else {
              this.toastr.error(
                'Error',
                'An Error Occured while trying to remove all data, check the event log for more information',
                {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                }
              );
            }
          },
          (error) => {}
        );
  }

  deleteRow(rowId) {

    let payload = {
      wsid: this.userData.wsid,
      invMapID: rowId.toString(),
    };
    this.Api.RemoveccQueueRow(payload).subscribe(
      (res: any) => {
        if (res.isExecuted) {
          this.getCountQue();
        } else {
          this.toastr.error(
            'Error',
            'An Error Occured while trying to remove this row, check the event log for more information',
            {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            }
          );
        }
      },
      (error) => {}
    );
    // const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
    //   height: 'auto',
    //   width: '600px',
    //   autoFocus: '__non_existing_element__',
    //   disableClose:true,
    //   data: {
    //     mode: 'delete-cycle-count',
    //   },
    // });
    // dialogRef.afterClosed().subscribe((res) => {
    //   if (res === 'Yes') {
      
    //   }
    // });
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
    this.displayedColumns.find((x, i) => {
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
