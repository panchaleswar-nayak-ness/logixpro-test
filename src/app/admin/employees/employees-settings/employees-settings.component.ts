import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { GlobalService } from 'src/app/common/services/global.service';
import { AddZoneComponent } from '../../dialogs/add-zone/add-zone.component';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { AddLocationComponent } from '../../dialogs/add-location/add-location.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import labels from 'src/app/common/labels/labels.json';
import { AddGroupAllowedComponent } from '../../dialogs/add-group-allowed/add-group-allowed.component';
import { GroupAllowedComponent } from '../../dialogs/group-allowed/group-allowed.component';
import { LiveAnnouncerMessage, StringConditions, ToasterMessages, ToasterTitle, ToasterType ,DialogConstants} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-employees-settings',
  templateUrl: './employees-settings.component.html',
  styleUrls: ['./employees-settings.component.scss']
})
export class EmployeesSettingsComponent implements OnInit {

  empForm: FormGroup;

  @ViewChild('zoneDataRefresh', { static: true, read: MatTable }) zoneDataRefresh;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('MatSortLocation', { static: true }) sortLocation: MatSort;

  @Input() empAllZones;
  @Input() empData;

  @Input() demo1TabIndex: number = 0;
  @Input() bpSettingInp: string = '';
  @Input() isLookUp: boolean = false;
  @Input() employeeFetchedZones;
  @Input() displayedColumns;
  @Input() zoneColumns;

  @Input() bpSettingLocInp: string = '';
  @Input() locationDataSource;

  @Input() maxOrders: number = 0;

  @Input() lookUpEvnt;
  @Input() isTabChanged;
  @Input() pickUplevels;
  @Input() grpData;

  @Input() env: string = '';
  @Input() searchfuncAllowed: string = '';
  @Input() FuncationAllowedList;
  @Input() funcationsColumns;

  @Input() grpAllFilter: string = '';
  @Input() groupAllowedList;
  @Input() groupsColumns;

  @Output() tabChangedEmit = new EventEmitter();
  @Output() zoneFilterEmit = new EventEmitter();
  @Output() clearZonesEmit = new EventEmitter();
  @Output() addZoneDialogEmit = new EventEmitter();
  @Output() announceSortChangeEmit = new EventEmitter();
  @Output() editZoneDialogEmit = new EventEmitter();
  @Output() deleteZoneEmit = new EventEmitter();

  @Output() applyFilterEmit = new EventEmitter();
  @Output() clearEmit = new EventEmitter();
  @Output() addLocationDialogEmit = new EventEmitter();
  @Output() editLocationDialogEmit = new EventEmitter();
  @Output() deleteLocationEmit = new EventEmitter();

  @Output() saveMaximumOrdersEmit = new EventEmitter();

  @Output() relaodPickUpLvlEmit = new EventEmitter();

  @Output() applyFunctionAllowedFilterEmit = new EventEmitter();
  @Output() getFuncationAllowedListEmit = new EventEmitter();
  @Output() AddFunctionAllowedDialogEmit = new EventEmitter();
  @Output() deleteFuncationAllowedEmit = new EventEmitter();

  @Output() groupAllowedFilterEmit = new EventEmitter();
  @Output() clearGrpEmit = new EventEmitter();
  @Output() grpAllowedDialogEmit = new EventEmitter();
  @Output() deleteGrpAllowedEmit = new EventEmitter();

  public iAdminApiService: IAdminApiService;

  constructor(
    private global: GlobalService,
    private _liveAnnouncer: LiveAnnouncer,
    private fb: FormBuilder,
    public adminApiService: AdminApiService
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.initialzeEmpForm();
  }

  applyFunctionAllowedFilter(event) {
    this.applyFunctionAllowedFilterEmit.emit(event);
  }

  getFuncationAllowedList() {
    this.getFuncationAllowedListEmit.emit();
  }

  getgroupAllowedList() {
    let payload: any = {
      user: this.grpData
    }
    this.iAdminApiService.Groupnames(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.groupAllowedList = new MatTableDataSource(res.data);

      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("Groupnames", res.responseMessage);

      }

    })
  }

  reloadData() {
    const emp_data = {
      "user": this.grpData,
      "wsid": "TESTWSID"
    };
    this.iAdminApiService.getAdminEmployeeDetails(emp_data)
      .subscribe((response: any) => {
        this.pickUplevels = response.data?.pickLevels;
        this.locationDataSource = new MatTableDataSource(response.data?.bulkRange);
        this.FuncationAllowedList = new MatTableDataSource(response.data.userRights);
        let res = response.data?.handledZones.map(item => {
          return { zones: item }
        })
        this.employeeFetchedZones = new MatTableDataSource(res);
        this.empAllZones = response.data?.allZones;
      });
  }

  tabChanged(event) {
    this.isTabChanged = event;
    this.clearInput();
  }

  clearInput() {
    this.bpSettingInp = '';
    this.bpSettingLocInp = '';
    this.searchfuncAllowed = '';
    this.grpAllFilter = '';
    this.employeeFetchedZones.filter = '';
    this.locationDataSource.filter = '';
    this.groupAllowedList.filter = '';
  }

  zoneFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.employeeFetchedZones.filter = filterValue;
  }

  clearZones() {
    this.bpSettingInp = '';
    this.employeeFetchedZones.filter = "";
  }

  addZoneDialog() {
    const dialogRef: any = this.global.OpenDialog(AddZoneComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        allZones: this.empAllZones,
        userName: this.grpData
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result.mode === 'addZone') {
        this.employeeFetchedZones.filteredData.push({ zones: result.data.zone })
        this.employeeFetchedZones.sort = this.sort;
        this.zoneDataRefresh.renderRows();
      }
    })
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.employeeFetchedZones.sort = this.sort;
    this.locationDataSource.sort = this.sortLocation;
  }

  editZoneDialog(zone: any) {
    const dialogRef: any = this.global.OpenDialog(AddZoneComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        mode: 'edit-zone',
        zone: zone.zones,
        allZones: this.empAllZones,
        fetchedZones: this.employeeFetchedZones.filteredData,
        userName: this.grpData
      }
    })
    dialogRef.afterClosed().subscribe(result => {

      if (result.mode === 'editZone') {
        const newData = { zones: result.data.zone };
        const index = this.employeeFetchedZones.filteredData.findIndex(item => item.zones === result.oldZone);

        if (index > -1) {
          this.employeeFetchedZones.filteredData.splice(index, 1, newData);
        } else {
          this.employeeFetchedZones.filteredData.push(newData);
        }

        this.employeeFetchedZones = new MatTableDataSource(this.employeeFetchedZones.filteredData);
      }

    })

  }

  clearGrp() {
    this.grpAllFilter = '';
    this.groupAllowedList.filter = "";
  }

  deleteZone(zone: any) {
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        mode: 'delete-zone',
        zone: zone.zones,
        userName: this.grpData
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    })

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.locationDataSource.filter = filterValue.trim().toLowerCase();
  }

  clear() {
    this.bpSettingLocInp = '';
    this.reloadData();
  }

  addLocationDialog() {
    console.log(this.grpData)
    let dialogRef;
    dialogRef = this.global.OpenDialog(AddLocationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        userName: this.grpData
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result === StringConditions.Add) {
        this.reloadData();
      }
    });
  }

  editLocationDialog(element) {
    let dialogRef;
    dialogRef = this.global.OpenDialog(AddLocationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        userName: this.grpData,
        locationData: element
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'update') {
        this.reloadData();
      }
    })
  }

  deleteLocation(location: any) {
    let dialogRef;
    dialogRef = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        mode: 'delete-location',
        location: location,
        userName: this.grpData
      }
    })
    dialogRef.afterClosed().subscribe(() => {
      this.reloadData();
    })
  }

  initialzeEmpForm() {
    this.empForm = this.fb.group({
      mi: this.empData.mi,
      firstName: this.empData.firstName,
      lastName: this.empData.lastName,
      username: this.empData.username,
      password: this.empData.password,
      emailAddress: this.empData.emailAddress,
      accessLevel: this.empData.accessLevel,
      active: this.empData.active,
      maximumOrders: this.maxOrders
    });
  }

  saveMaximumOrders() {
    this.initialzeEmpForm();
    this.empForm.value.wsid = "TESTWID";
    this.empForm.value.username = this.empData.username;
    this.empForm.value.groupName = "";
    this.iAdminApiService.updateAdminEmployee(this.empForm.value).subscribe((res: any) => {
      if (res.isExecuted) this.global.ShowToastr(ToasterType.Success, labels.alert.update, ToasterTitle.Success);
      else {
        this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
        console.log("updateAdminEmployee", res.responseMessage);
      }
    });
  }

  relaodPickUpLvl() {
    this.reloadData();
  }

  AddFunctionAllowedDialog() {
    let dialogRef;
    dialogRef = this.global.OpenDialog(AddGroupAllowedComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        userName: this.grpData,
        wsid: "TESTWSID"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    })
  }

  deleteFuncationAllowed(controlName: any) {
    let groupData = {
      controlName: controlName,
      userName: this.grpData,
    };
    this.iAdminApiService.deleteControlName(groupData).subscribe((res: any) => {
      if (res.isExecuted) {
        this.global.ShowToastr(ToasterType.Success, 'Your details have been deleted', ToasterTitle.Success);
        this.reloadData();
      } else {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
        console.log("deleteControlName", res.responseMessage);
      }
    });
  }

  groupAllowedFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.groupAllowedList.filter = filterValue.trim().toLowerCase();
  }

  grpAllowedDialog() {
    const dialogRef: any = this.global.OpenDialog(GroupAllowedComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        grp_data: this.grpData
      }
    })

    dialogRef.afterClosed().subscribe(() => {
      this.getgroupAllowedList();
      this.reloadData();
    });
  }

  deleteGrpAllowed(allowedGroup: any) {
    allowedGroup.userName = this.grpData;
    let emp_data = {
      groupname: allowedGroup.groupName,
      username: allowedGroup.userName,
    };
    this.iAdminApiService.deleteUserGroup(emp_data).subscribe((res: any) => {
      if (res.isExecuted) {
        this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
        this.getgroupAllowedList();
      } else {
        this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterType.Error);
        console.log("deleteUserGroup", res.responseMessage);
      }
    });
  }

}
