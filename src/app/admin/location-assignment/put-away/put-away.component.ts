import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service';
import labels from '../../../labels/labels.json';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-put-away',
  templateUrl: './put-away.component.html',
  styleUrls: ['./put-away.component.scss']
})
export class PutAwayComponent implements OnInit {

  displayedColumns1: string[] = ['orderNumber', 'itemCount', 'priority', 'requiredDate', 'action'];
  displayedColumns2: string[] = ['orderNumber', 'itemCount', 'priority', 'requiredDate', 'action'];
  tableData1: any = new MatTableDataSource([]);
  tableData2: any = new MatTableDataSource([]);
  userData: any;
  orderNumberSearch: string = '';

  @ViewChild('MatSort1') sort1: MatSort;
  sequenceKeyMapping1: any = [
    { sequence: 'orderNumber', key: 'orderNumber' },
    { sequence: 'itemCount', key: 'itemCount' },
    { sequence: 'priority', key: 'priority' },
    { sequence: 'requiredDate', key: 'requiredDate' },
  ];

  @ViewChild('MatSort2') sort2: MatSort;
  sequenceKeyMapping2: any = [
    { sequence: 'orderNumber', key: 'orderNumber' },
    { sequence: 'itemCount', key: 'itemCount' },
    { sequence: 'priority', key: 'priority' },
    { sequence: 'requiredDate', key: 'requiredDate' },
  ];

  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;

  filterValue1:string = '';
  filterValue2:string = '';

  constructor(
    private toastr: ToastrService,
    private Api: ApiFuntions,
    private authService: AuthService,
    private dialog: MatDialog,
    private _liveAnnouncer1: LiveAnnouncer,
    private _liveAnnouncer2: LiveAnnouncer
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.GetLocAssPutAwayTable();
  }

  GetLocAssPutAwayTable(loader: boolean = false) {
    this.Api.GetLocAssPutAwayTable().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.tableData1 = new MatTableDataSource(res.data);
        this.tableData1.paginator = this.paginator1;
      } else { 
        this.tableData1 = new MatTableDataSource([]); 
      }
    });
  }

  add(order: any) {
    this.tableData2 = new MatTableDataSource(this.tableData2.data.concat(order));
    this.tableData2.paginator = this.paginator2;
    this.tableData2.sort = this.sort2;
    this.tableData2.filter = this.filterValue2.trim().toLowerCase();

    let index:any = this.tableData1.data.findIndex(x => x.orderNumber == order.orderNumber);
    this.tableData1.data.splice(index,1);
    this.tableData1 = new MatTableDataSource(this.tableData1.data);
    this.tableData1.paginator = this.paginator1;
    this.tableData1.sort = this.sort1;
    this.tableData1.filter = this.filterValue1.trim().toLowerCase();
  }

  remove(order: any) {
    this.tableData1 = new MatTableDataSource(this.tableData1.data.concat(order));
    this.tableData1.paginator = this.paginator1;
    this.tableData1.sort = this.sort1;
    this.tableData1.filter = this.filterValue1.trim().toLowerCase();

    let index:any = this.tableData2.data.findIndex(x => x.orderNumber == order.orderNumber);
    this.tableData2.data.splice(index,1);
    this.tableData2 = new MatTableDataSource(this.tableData2.data);
    this.tableData2.paginator = this.paginator2;
    this.tableData2.sort = this.sort2;
    this.tableData2.filter = this.filterValue2.trim().toLowerCase();
  }

  addAll() {
    this.tableData2 = new MatTableDataSource(this.tableData2.data.concat(this.tableData1.data));
    this.tableData2.paginator = this.paginator2;
    this.tableData2.sort = this.sort2;
    this.tableData2.filter = this.filterValue2.trim().toLowerCase();

    this.tableData1 = new MatTableDataSource([]);
    this.tableData1.paginator = this.paginator1;
    this.tableData1.sort = this.sort1;
    this.tableData1.filter = this.filterValue1.trim().toLowerCase();
  }

  removeAll() {
    this.tableData1 = new MatTableDataSource(this.tableData1.data.concat(this.tableData2.data));
    this.tableData1.paginator = this.paginator1;
    this.tableData1.sort = this.sort1;
    this.tableData1.filter = this.filterValue1.trim().toLowerCase();

    this.tableData2 = new MatTableDataSource([]);
    this.tableData2.paginator = this.paginator2;
    this.tableData2.sort = this.sort2;
    this.tableData2.filter = this.filterValue2.trim().toLowerCase();
  }

  locationAssignment() {
    if (this.tableData2.data.length == 0) {
      this.toastr.error("There were no orders selected for location assignment marking", 'No Orders Selected', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
    else {
      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          heading: 'Mark Selected Orders for PUT AWAY Location Assignment?',
          message: 'Do you want to mark these orders for location assignment?',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'Yes') {
          let payload: any = {
            "transType": 'putaway',
            "orders": this.tableData2.data.map((item: any) => { return item.orderNumber }),
            "username": this.userData.userName,
            "wsid": this.userData.wsid
          };
          this.Api.LocationAssignmentOrderInsert(payload).subscribe((res: any) => {
            if (res.isExecuted && res.data) {
              this.tableData2 = new MatTableDataSource([]);
              this.tableData2.paginator = this.paginator2;
              this.toastr.success(labels.alert.success, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
            } else {
              this.toastr.error("There was an error marking these orders for location assignment", 'Error', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
            }
          });
        }
      });
    };
  }

  //Sorting
  announceSortChange1(sortState: Sort) {
    sortState.active = this.sequenceKeyMapping1.filter((x: any) => x.sequence == sortState.active)[0]?.key;
    if (sortState.direction) {
      this._liveAnnouncer1.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer1.announce('Sorting cleared');
    }
    this.tableData1.sort = this.sort1;
  }

  announceSortChange2(sortState: Sort) { 
    sortState.active = this.sequenceKeyMapping2.filter((x: any) => x.sequence == sortState.active)[0]?.key;
    if (sortState.direction) {
      this._liveAnnouncer2.announce(`Sorted ${sortState.direction}ending`);
    } else { 
      this._liveAnnouncer2.announce('Sorting cleared');
    }
    this.tableData2.sort = this.sort2;
  }

  applyFilter1(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData1.filter = filterValue.trim().toLowerCase();
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.tableData2.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild('table1') table1: MatTable<any>;

  @ViewChild('table2') table2: MatTable<any>;




ngAfterViewChecked(): void {

    if (this.table1) {

        this.table1.updateStickyColumnStyles();

    }

    if (this.table2) {

      this.table2.updateStickyColumnStyles();

  }

}

}
