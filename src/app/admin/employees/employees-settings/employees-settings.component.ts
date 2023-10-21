import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { GlobalService } from 'src/app/common/services/global.service';
import { AddZoneComponent } from '../../dialogs/add-zone/add-zone.component';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { AddLocationComponent } from '../../dialogs/add-location/add-location.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import labels from '../../../labels/labels.json';
import { AddGroupAllowedComponent } from '../../dialogs/add-group-allowed/add-group-allowed.component';
import { GroupAllowedComponent } from '../../dialogs/group-allowed/group-allowed.component';

@Component({
  selector: 'app-employees-settings',
  templateUrl: './employees-settings.component.html',
  styleUrls: ['./employees-settings.component.scss']
})
export class EmployeesSettingsComponent implements OnInit {

  empForm: FormGroup;

  @ViewChild('zoneDataRefresh', { static: true,read:MatTable }) zoneDataRefresh;  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('MatSortLocation', { static: true }) sortLocation: MatSort;

  @Input() emp_all_zones;
  @Input() empData;

  @Input() demo1TabIndex : number = 0;
  @Input() bpSettingInp : string = '';
  @Input() isLookUp : boolean = false;
  @Input() employee_fetched_zones;
  @Input() displayedColumns;
  @Input() zoneColumns;

  @Input() bpSettingLocInp : string = '';
  @Input() location_data_source;

  @Input() max_orders : number = 0;

  @Input() lookUpEvnt;
  @Input() isTabChanged;
  @Input() pickUplevels;
  @Input() grp_data;

  @Input() env : string = '';
  @Input() searchfuncAllowed : string = '';
  @Input() FuncationAllowedList;
  @Input() funcationsColumns;

  @Input() grpAllFilter : string = '';
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
    private global : GlobalService,
    private _liveAnnouncer: LiveAnnouncer,
    private fb: FormBuilder,
    private adminApiService: AdminApiService
  ) { 
    this.iAdminApiService = adminApiService; 
  }

  ngOnInit(): void {
    this.initialzeEmpForm();
  }

  // tabChanged(event) { 
  //   this.tabChangedEmit.emit(event);
  // }
  
  // zoneFilter(event) { 
  //   this.zoneFilterEmit.emit(event);
  // }
  
  // clearZones() { 
  //   this.clearZonesEmit.emit();
  // }
  
  // addZoneDialog() { 
  //   this.addZoneDialogEmit.emit();
  // }

  // announceSortChange(event) { 
  //   this.announceSortChangeEmit.emit(event);
  // }

  // editZoneDialog(element) { 
  //   this.editZoneDialogEmit.emit(element);
  // }

  // deleteZone(element) { 
  //   this.deleteZoneEmit.emit(element);
  // }

  // applyFilter(event) { 
  //   this.applyFilterEmit.emit(event);
  // }

  // clear() { 
  //   this.clearEmit.emit();
  // }

  // addLocationDialog() { 
  //   this.addLocationDialogEmit.emit();
  // }

  // editLocationDialog(element) { 
  //   this.editLocationDialogEmit.emit(element);
  // }

  // deleteLocation(element) { 
  //   this.deleteLocationEmit.emit(element);
  // }

  // saveMaximumOrders() {
  //   this.saveMaximumOrdersEmit.emit();
  // }

  // relaodPickUpLvl() {
  //   this.relaodPickUpLvlEmit.emit();
  // }

  applyFunctionAllowedFilter(event) {
    this.applyFunctionAllowedFilterEmit.emit(event);
  }

  getFuncationAllowedList() {
    this.getFuncationAllowedListEmit.emit();
  }

  // AddFunctionAllowedDialog() {
  //   this.AddFunctionAllowedDialogEmit.emit();
  // }

  // deleteFuncationAllowed(element) {
  //   this.deleteFuncationAllowedEmit.emit(element);
  // }

  // groupAllowedFilter(event) {
  //   this.groupAllowedFilterEmit.emit(event);
  // }

  // clearGrp() {
  //   this.clearGrpEmit.emit();
  // }

  // grpAllowedDialog() {
  //   this.grpAllowedDialogEmit.emit();
  // }

  // deleteGrpAllowed(element) {
  //   this.deleteGrpAllowedEmit.emit(element);
  // }

  getgroupAllowedList(){
    let payload:any = {
      user : this.grp_data
    }
    this.iAdminApiService.Groupnames(payload).subscribe((res:any) => {
      if(res.isExecuted && res.data)
      {
        this.groupAllowedList = new MatTableDataSource(res.data);

      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("Groupnames",res.responseMessage);

      }
      
    }) 
  }

  reloadData(){
    const emp_data = {
      "user":  this.grp_data,
      "wsid": "TESTWSID"
    };
    this.iAdminApiService.getAdminEmployeeDetails(emp_data)
      .subscribe((response: any) => {
        // this.employee_group_allowed = response.data?.userRights
        this.pickUplevels = response.data?.pickLevels;
        this.location_data_source = new MatTableDataSource(response.data?.bulkRange);
        this.FuncationAllowedList = new MatTableDataSource(response.data.userRights);
        // this.location_data = response.data?.bulkRange;
        let res=response.data?.handledZones.map(item=>{
          return {zones:item}
        })
        this.employee_fetched_zones = new MatTableDataSource(res);
        this.emp_all_zones = response.data?.allZones;
      });
  }

  tabChanged(event){
    this.isTabChanged=event;
    this.clearInput();
  }

  clearInput(){
    this.bpSettingInp='';
    this.bpSettingLocInp='';
    this.searchfuncAllowed = '';
    this.grpAllFilter='';
    this.employee_fetched_zones.filter = '';
    this.location_data_source!.filter = '';
    this.groupAllowedList.filter = '';
  }

  zoneFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.employee_fetched_zones.filter = filterValue;
  }

  clearZones(){
    this.bpSettingInp='';
    this.employee_fetched_zones.filter="";
  }

  addZoneDialog() {
    const dialogRef:any = this.global.OpenDialog(AddZoneComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        allZones: this.emp_all_zones,
        userName: this.grp_data
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result.mode === 'addZone'){
        this.employee_fetched_zones.filteredData.push({zones:result.data.zone})
        this.employee_fetched_zones.sort=this.sort;
        this.zoneDataRefresh.renderRows();
      }
    })
  }

  /** Announce the change in sort state for assistive technology. */
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.employee_fetched_zones.sort = this.sort;
    this.location_data_source.sort=this.sortLocation;
  }

  editZoneDialog(zone: any) {
    const dialogRef:any =  this.global.OpenDialog(AddZoneComponent, {
       height: 'auto',
       width: '480px',
       autoFocus: '__non_existing_element__',
       disableClose:true,
       data: {
         mode: 'edit-zone',
         zone: zone.zones,
         allZones: this.emp_all_zones,
         fetchedZones:this.employee_fetched_zones.filteredData,
         userName:this.grp_data
       }
     })
     dialogRef.afterClosed().subscribe(result => {
       
       if (result.mode === 'editZone') {
         const newData = { zones: result.data.zone }; 
         const index = this.employee_fetched_zones.filteredData.findIndex(item => item.zones === result.oldZone);
       
         if (index > -1) { 
           this.employee_fetched_zones.filteredData.splice(index, 1, newData);
         } else { 
           this.employee_fetched_zones.filteredData.push(newData);
         }
       
         this.employee_fetched_zones = new MatTableDataSource(this.employee_fetched_zones.filteredData);
       }
 
     })
 
   }

  clearGrp(){
    this.grpAllFilter='';
    this.groupAllowedList.filter="";
  }

  deleteZone(zone: any) {
    const dialogRef:any =  this.global.OpenDialog(DeleteConfirmationComponent, {
       height: 'auto',
       width: '480px',
       autoFocus: '__non_existing_element__',
       disableClose:true,
       data: {
         mode: 'delete-zone',
         zone: zone.zones,
         userName:this.grp_data
       }
     })
     dialogRef.afterClosed().subscribe(result => {
       this.reloadData();
     })
 
   }

   applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.location_data_source.filter = filterValue.trim().toLowerCase();
  }

  clear(){
    this.bpSettingLocInp='';
    this.reloadData();
  }

  addLocationDialog() {
    console.log(this.grp_data)
    let dialogRef;
    dialogRef = this.global.OpenDialog(AddLocationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        userName:this.grp_data
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'add'){
        this.reloadData();
      }
    });
  }

  editLocationDialog(element) {
    let dialogRef;
    dialogRef = this.global.OpenDialog(AddLocationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        userName:this.grp_data,
        locationData: element
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result === 'update'){
        this.reloadData();
      }
    })
  }

  deleteLocation(location:any){
    let dialogRef;
    dialogRef = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete-location',
        location: location,
        userName:this.grp_data
      }
    })
    dialogRef.afterClosed().subscribe(result => {
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
      active:this.empData.active,
      maximumOrders:this.max_orders
    });
  }

  saveMaximumOrders(){
    this.initialzeEmpForm();
    this.empForm.value.wsid = "TESTWID";
    this.empForm.value.username = this.empData.username;
    this.empForm.value.groupName = "";
      this.iAdminApiService.updateAdminEmployee(this.empForm.value).subscribe((res: any) => {
        if (res.isExecuted) this.global.ShowToastr('success',labels.alert.update, 'Success!');
        else {
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
          console.log("updateAdminEmployee",res.responseMessage);
        }
      });
  }

  relaodPickUpLvl(){
    this.reloadData();
  }

  AddFunctionAllowedDialog() {
    let dialogRef;
    dialogRef = this.global.OpenDialog(AddGroupAllowedComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data:{
        userName:this.grp_data,
        wsid:"TESTWSID"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    })
  }

  deleteFuncationAllowed(controlName: any) {
    let groupData = {
      controlName: controlName,
      userName: this.grp_data,
    };
    this.iAdminApiService.deleteControlName(groupData).subscribe((res: any) => {
      if (res.isExecuted) {
        this.global.ShowToastr('success','Your details have been deleted', 'Success!');
        this.reloadData();
      } else {
        this.global.ShowToastr('error','Something went wrong!', 'Error!');
        console.log("deleteControlName",res.responseMessage);
      }
    });
  }

  groupAllowedFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.groupAllowedList.filter = filterValue.trim().toLowerCase();
  }

  grpAllowedDialog() {
    const  dialogRef:any = this.global.OpenDialog(GroupAllowedComponent, {
       height: 'auto',
       width: '480px',
       autoFocus: '__non_existing_element__',
       disableClose:true,
       data:{
         grp_data:this.grp_data
       }
     })
 
     dialogRef.afterClosed().subscribe(result => {
       this.getgroupAllowedList();
       this.reloadData();
     });
  }

  deleteGrpAllowed(allowedGroup: any) {
    allowedGroup.userName = this.grp_data;
    let emp_data = {
      groupname: allowedGroup.groupName,
      username: allowedGroup.userName,
    };
    this.iAdminApiService.deleteUserGroup(emp_data).subscribe((res: any) => {
      if (res.isExecuted) {
        this.global.ShowToastr('success',labels.alert.delete, 'Success!');
         this.getgroupAllowedList();
      } else {
        this.global.ShowToastr('error',res.responseMessage, 'Error!');
        console.log("deleteUserGroup",res.responseMessage);
      }
    });
  }

}
