import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'; 

import { AddNewDeviceComponent } from 'src/app/admin/dialogs/add-new-device/add-new-device.component';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-sp-device-preference',
  templateUrl: './sp-device-preference.component.html',
  styleUrls: ['./sp-device-preference.component.scss'],
})
export class SpDevicePreferenceComponent implements OnInit {
  public dataSource: any = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public userData: any;
  pageEvent: PageEvent;
  public iAdminApiService: IAdminApiService;
  sortCol = 0;
  sortDir = 'asc';
  customPagination: any = {
    total: '',
    recordsPerPage: 10,
    startIndex: 0,
    endIndex: 10,
  };
  public displayedColumns: string[] = [
    'zone',
    'deviceType',
    'device',
    'deviceModel',
    'controllerType',
    'controllerTermPort',
    'arrowDirection',
    'lightDirection',
    'userLaserPointer',
    'useLightTree',
    'firstAddress',
    'positions',
    'displayCharacters',
    'actions',
  ];
  constructor(
    private Api: ApiFuntions,
    public authService: AuthService,
    private global:GlobalService,
    private adminApiService: AdminApiService,
    
    private sharedService: SharedService
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getDevicePrefTable();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;

    this.sharedService.devicePrefObserver.subscribe((evt) => {
 
      this.getDevicePrefTable();
    });
  }

  getDevicePrefTable() {
    let payload = {
      draw: 0,
      start: this.customPagination.startIndex,
      length: this.customPagination.recordsPerPage,
      column: this.sortCol,
      sortDir: this.sortDir,
      zone: '', 
    };


    this.iAdminApiService.DevicePreferencesTable(payload)
    .subscribe((res: any) => {
      console.log(res);

      if (res?.data?.devicePreferences) {
        this.dataSource = new MatTableDataSource(res.data.devicePreferences);
        this.customPagination.total = res.data?.recordsFiltered;
      }
    });
  }

  addEditNewDevice(item?, isEdit = false) {
    let dialogRef:any = this.global.OpenDialog(AddNewDeviceComponent, {
      height: 'auto',
      width: '960px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        isEdit: isEdit,
        item: item,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Yes') {
        this.getDevicePrefTable();
      }
    });
  }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.customPagination.startIndex = e.pageSize * e.pageIndex;
    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;
    this.getDevicePrefTable();
  }
  deleteAllOrders(deviceID) {
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        action: 'delete',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Yes') {
        let payload = {
          deviceID: deviceID, 
        };
        this.iAdminApiService
          .DevicePreferencesDelete(payload)
          .subscribe((res: any) => {
            if (res.isExecuted) {
              this.global.ShowToastr('success',res.responseMessage, 'Success!');
              this.getDevicePrefTable();
            } else {
              this.global.ShowToastr('error',res.responseMessage, 'Error!');
            }
          });
      }
    });
  }
  sortChange(event) {
    if (
      !this.dataSource._data._value ||
      event.direction == '' ||
      event.direction == this.sortCol
    )
      return;
    let index;
    this.displayedColumns.forEach((x, i) => {
      if (x === event.active) {
        index = i + 1;
      }
    });

    this.sortCol = index;
    this.sortDir = event.direction;
    this.getDevicePrefTable();
  }

  selectRow(row: any) {
    this.dataSource.filteredData.forEach(element => {
      if(row != element){
        element.selected = false;
      }
    });
    const selectedRow = this.dataSource.filteredData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }
}
