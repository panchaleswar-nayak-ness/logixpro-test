import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table'; 
import { AddNewDeviceComponent } from 'src/app/admin/dialogs/add-new-device/add-new-device.component';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { SharedService } from 'src/app/common/services/shared.service';
import {  StringConditions, ToasterTitle, ToasterType ,DialogConstants,Style,TableConstant,UniqueConstants,ColumnDef} from 'src/app/common/constants/strings.constants';
import { ApiResponse, CustomPagination, UserSession } from 'src/app/common/types/CommonTypes';
import { Sort } from '@angular/material/sort';
import { DevicePreferencesTableRequest } from 'src/app/common/interface/admin/device-preferences';
import { DevicePreferencesColumnMap } from 'src/app/common/constants/admin/device-preferences-constants';

interface DevicePreference {
  zone: string;
  deviceType: string;
  deviceNumber: string;
  deviceModel: string;
  controllerType: string | null;
  controllerTermPort: string;
  arrowDirection: string;
  lightDirection: string;
  laserPointer: string;
  lightTreeNumber: string;
  beginAddress: string;
  displayPositions: string;
  displayCharacters: string;
  deviceID: string;
  selected: boolean;
}

interface DevicePreferencesTableResponse {
  recordsTotal: number;
  recordsFiltered: number;
  devicePreferences: DevicePreference[];
}

@Component({
  selector: 'app-sp-device-preference',
  templateUrl: './sp-device-preference.component.html',
  styleUrls: ['./sp-device-preference.component.scss'],
})
export class SpDevicePreferenceComponent implements OnInit {
  public dataSource: MatTableDataSource<DevicePreference>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public userData: UserSession;
  pageEvent: PageEvent;
  public iAdminApiService: IAdminApiService;
  sortColName: string = 'Zone';
  sortDir: string = UniqueConstants.Asc;
  customPagination: CustomPagination = {
    total: 0,
    recordsPerPage: 10,
    startIndex: 0,
    endIndex: 10,
  };
  public displayedColumns: string[] = [
    TableConstant.zone,
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
    ColumnDef.Actions,
  ];
  constructor(
    public authService: AuthService,
    private global:GlobalService,
    public adminApiService: AdminApiService,  
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getDevicePrefTable();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getDevicePrefTable() {
    const payload: DevicePreferencesTableRequest = {
      // Convert to 1-based index for backend
      startRow: this.customPagination.startIndex,
      endRow: this.customPagination.startIndex + this.customPagination.recordsPerPage,
      sortColumn: this.sortColName,
      sortOrder: this.sortDir, // should ideally be 'asc' | 'desc'
      zone: '',
    };

    this.iAdminApiService.DevicePreferencesTable(payload).subscribe((res: ApiResponse<DevicePreferencesTableResponse>) => {
      if (res?.data?.devicePreferences) {
        this.dataSource = new MatTableDataSource(res.data.devicePreferences);
        this.customPagination.total = res.data?.recordsFiltered;
      } else { 
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("LocationZone", res.responseMessage);
      }
    });
  }

  addEditNewDevice(item? : DevicePreference, isEdit = false) {
    const dialogRef: any = this.global.OpenDialog(AddNewDeviceComponent, {
      height: DialogConstants.auto,
      width: '960px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        isEdit: isEdit,
        item: item,
        onSave: () => this.getDevicePrefTable()
      },
    });

    dialogRef.afterClosed().subscribe((result) => { if(result === StringConditions.Yes) this.getDevicePrefTable() });
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
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        action: UniqueConstants.delete,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === StringConditions.Yes) {
        let payload = { deviceID: deviceID };
        this.iAdminApiService.DevicePreferencesDelete(payload).subscribe((res: any) => {
            if (res.isExecuted) {
              this.global.ShowToastr(ToasterType.Success,res.responseMessage, ToasterTitle.Success);
              this.getDevicePrefTable();
            } else {
              this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
              console.log("DevicePreferencesDelete",res.responseMessage);
            }
        });
      }
    });
  }

  sortChange(event: Sort): void {
    if (!event.direction || !event.active) return;

    // Skip if sort is unchanged
    if (event.direction === this.sortDir && event.active === this.sortColName) return;

    this.sortDir = event.direction;

    const sortColKey = event.active;
    this.sortColName = DevicePreferencesColumnMap[sortColKey] || '';

    this.getDevicePrefTable();
  }

  selectRow(row: DevicePreference) {
    this.dataSource.filteredData.forEach(element => {
      if(row != element) element.selected = false;
    });
    const selectedRow = this.dataSource.filteredData.find(x => x === row);
    if (selectedRow) selectedRow.selected = !selectedRow.selected;
  }
}
