import { AfterViewInit, Component, OnInit, ViewChild, Inject, Input, NgZone } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'; 
import { AdminEmployeeLookupResponse, EmployeeObject, IEmployee } from 'src/app/Iemployee';
import { MatDialog ,MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AddNewEmployeeComponent } from '../dialogs/add-new-employee/add-new-employee.component';
import { DeleteConfirmationComponent } from '../dialogs/delete-confirmation/delete-confirmation.component';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { AddZoneComponent } from '../dialogs/add-zone/add-zone.component';
import { AddLocationComponent } from '../dialogs/add-location/add-location.component';
import { AddGroupAllowedComponent } from '../dialogs/add-group-allowed/add-group-allowed.component';
import { AddNewGroupComponent } from '../dialogs/add-new-group/add-new-group.component';
import { ToastrService } from 'ngx-toastr';
import labels from '../../labels/labels.json';
import { GroupsAllowedComponent } from './groups-allowed/groups-allowed.component';
import { GroupAllowedComponent } from '../dialogs/group-allowed/group-allowed.component';
import { CloneGroupComponent } from '../dialogs/clone-group/clone-group.component';
import { Router,NavigationEnd  } from '@angular/router';
import { AuthService } from '../../../app/init/auth.service';
import { SpinnerService } from '../../../app/init/spinner.service';
import { MatOption } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GroupsLookupComponent } from './groups-lookup/groups-lookup.component';
import { EmployeesLookupComponent } from './employees-lookup/employees-lookup.component';
import { GlobalService } from 'src/app/common/services/global.service';

export interface location {
  start_location: string;
  end_location: string;
  delete_location: string;
}

// location table data



@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {
  @ViewChild(GroupsLookupComponent) groupsLookup: GroupsLookupComponent;
  @ViewChild(EmployeesLookupComponent) employeesLookup: EmployeesLookupComponent;
  emp: IEmployee;
  public isLookUp: boolean = false;
  public lookUpEvnt:any=false;
  public isGroupLookUp: boolean = false;
  public env;
  @ViewChild('matRef') matRef: MatSelect;
 // public searchGrpAllowed = '';
  public allGroups:any = [];
  public searchfuncAllowed = '';
  public grpAllFilter='';
bpSettingInp='';
bpSettingLocInp='';
  myControl = new FormControl('');
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  empData: any = {};
  max_orders: any;
  pickUplevels: any;
  assignedFunctions:any;
  unassignedFunctions:any;
  group_fetched_unassigned_function:any
  location_data: any[] = [];
  employee_data_source: any = [];
  grpData: any = {};
  // max_orders:any;
  userName: any;
  employees_action: boolean = false;
  // employee_fetched_zones: string[] = [];
  // employees_action: boolean = false;
  employee_fetched_zones: any;
  location_data_source: any;
  employee_group_allowed: any;
  emp_all_zones:any;
  groupAllowedList:any;
  FuncationAllowedList:any = [];
  OldFuncationAllowedList:any = [];
  access:any;
  grp_data:any;
  public demo1TabIndex = 0;
  public userData;
  public updateGrpTable;
  isTabChanged:any;
  empForm: FormGroup;
  @ViewChild('zoneDataRefresh', { static: true,read:MatTable }) zoneDataRefresh;
  public ButtonAccessList: any = [];
  @ViewChild('paginator1') paginator1: MatPaginator;

  // table initialization
  displayedColumns: string[] = ['startLocation', 'endLocation', 'delete_location'];
  zoneColumns: string[] = ['zones', 'actions'];
  groupsColumns: string[] = ['groups', 'actions'];
  funcationsColumns: string[] = ['Function', 'actions'];
  
  ELEMENT_DATA_1: any[] = [
    { controlname: '11/02/2022 11:58 AM', function: 'deleted Item Number 123'},
    { controlname: '11/02/2022 11:58 AM', function: 'deleted Item Number 123'}
   
  ];

  displayedColumns_1: string[] = ['controlName', 'function', 'adminLevel'];
  tableData_1 = this.ELEMENT_DATA_1
  dataSourceList_1: any
  selectedIndex:number = 0
  constructor(
    private authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer, 
    private employeeService: ApiFuntions, 
    private dialog: MatDialog,
    private toastr: ToastrService, 
    private zone: NgZone,
    public router: Router,
    public laoder: SpinnerService,
    private global:GlobalService,
    private fb: FormBuilder
    ) {  
  }

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('MatSortLocation', { static: true }) sortLocation: MatSort;
  ngAfterViewInit() {
    // this.location_data_source.sort = this.sort;
    // this.employee_fetched_zones.sort = this.sort;
  }

  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }

  clear(){
    this.bpSettingLocInp='';
this.reloadData();
  }
  clearZones(){
    this.bpSettingInp='';
    this.employee_fetched_zones.filter="";
  }
  clearGrp(){
    this.grpAllFilter='';
    this.groupAllowedList.filter="";
  }
getgroupAllowedList(){
  var payload:any = { 
    "user": this.empData.username,
    "WSID": "TESTWSID"

  }

  this.employeeService.Groupnames(payload).subscribe((res:any) => {
     
   // this.groupAllowedList = res.data;
    this.groupAllowedList = new MatTableDataSource(res.data);
  //   this.groupAllowedList.filterPredicate = (data: any, filter: string) => {
  //     return data.toLowerCase().includes(filter.trim().toLowerCase());
  // };
  }) 
}
getFuncationAllowedList(){
  var emp:any = {
    "username": this.grp_data,
    "access": this.empData.accessLevel,
    "wsid": this.userData.wsid
  }
  this.employeeService.getInsertAllAccess(emp).subscribe((res:any) => {
 
    if(res.isExecuted){
      this.reloadData();
    }
  }) 
}
applyFunctionAllowedFilter(event: any) { 
  if(!this.OldFuncationAllowedList?.length && this.FuncationAllowedList.filteredData?.length) {
    this.OldFuncationAllowedList = this.FuncationAllowedList.filteredData;
  }
  if(this.OldFuncationAllowedList.length) this.FuncationAllowedList = new MatTableDataSource(this.OldFuncationAllowedList.filter(x=> x?.toLowerCase()?.indexOf(event?.target?.value.toLowerCase()) > -1));
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
  updateIsLookUp(event: any) {
   
    this.empData = {};
    this.empData = event.userData;
    this.isLookUp = event;
    this.lookUpEvnt=true; 
    this.grp_data = event.userData?.username

    this.max_orders = event.userData.maximumOrders;
    const emp_data = {
      "user": event.userData?.username,
      "wsid": "TESTWSID"
    };
 
    this.employeeService.getAdminEmployeeDetails(emp_data)
      .subscribe((response: any) => { 
        this.isLookUp = event;
        this.lookUpEvnt=true;
        this.employee_group_allowed = response.data?.userRights
        this.pickUplevels = response.data?.pickLevels;
        this.location_data_source = new MatTableDataSource(response.data?.bulkRange);
        this.FuncationAllowedList = new MatTableDataSource(response.data.userRights);
        this.location_data = response.data?.bulkRange
        let res=response.data?.handledZones.map(item=>{
          return {zones:item}
        })
        this.employee_fetched_zones = new MatTableDataSource(res); 
        this.employee_fetched_zones.filterPredicate = (data: any, filter: string) => {
     
          
          return data.zones.toLowerCase().includes(filter.trim().toLowerCase());
      };
        this.emp_all_zones = response.data?.allZones;
        if(this.env !== 'DB') this.getgroupAllowedList();
         
      });



  }
  reloadData(){
    const emp_data = {
      "user":  this.grp_data,
      "wsid": "TESTWSID"
    };
    this.employeeService.getAdminEmployeeDetails(emp_data)
      .subscribe((response: any) => {
        this.employee_group_allowed = response.data?.userRights
        this.pickUplevels = response.data?.pickLevels;
        this.location_data_source = new MatTableDataSource(response.data?.bulkRange);
        this.FuncationAllowedList = new MatTableDataSource(response.data.userRights);
        this.location_data = response.data?.bulkRange
        let res=response.data?.handledZones.map(item=>{
          return {zones:item}
        })
        this.employee_fetched_zones = new MatTableDataSource(res);
        this.emp_all_zones = response.data?.allZones;
      });
  }
  addPermission(event:any){
    if(typeof( event.function) == 'string'){
      this.unassignedFunctions = this.unassignedFunctions.filter(name => name !== event.function);
      this.assignedFunctions.unshift(event.function);
    }
    else{
      event.function.map((func => {
        this.unassignedFunctions = this.unassignedFunctions.filter(name => name !== func);
        this.assignedFunctions.unshift(func);
      }));

    }
  }
  removePermission(event:any){ 
    if(typeof(event.function) == 'string'){
      this.assignedFunctions = this.assignedFunctions.filter(name => name !== event.function);
      this.unassignedFunctions.unshift(event.function);
    }
    else{
      event.function.map((func => {
        this.assignedFunctions = this.assignedFunctions.filter(name => name !== func);
        this.unassignedFunctions.unshift(func);
      }));

    }
  }
  saveAssignedFunc(){

    let assignFunc = {
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
      "GroupName":this.grpData.groupName,
      "controls": this.assignedFunctions
    }
    this.employeeService.insertGroupFunctions(assignFunc)
      .subscribe((res: any) => {
        this.assignedFunctions =[];
        this.unassignedFunctions =[];
        this.isGroupLookUp = false;
        if(res.isExecuted){
          this.toastr.success(labels.alert.update, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
          this.updateGrpLookUp();
        }
        else{
          this.toastr.error(res.responseMessage, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }

      });
  }
  updateGrpLookUp(event?: any) {
    this.grpData = {};
    this.grpData = event.groupData;
    this.isGroupLookUp = event;
    this.max_orders = 10;
    

    const grp_data = {
      "userName":this.userName,
      "wsid": "TESTWSID",
      "groupName":this.grpData.groupName

      }; 
    this.employeeService.getFunctionByGroup(grp_data)
    .subscribe((response:any) => { 
      this.assignedFunctions = response.data?.groupFunc
      this.unassignedFunctions = response.data?.allFunc
    });
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

   this.env =  JSON.parse(localStorage.getItem('env') || '');
   this.initialzeEmpForm();
   this.getEmployeeData();
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


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  actionDialog(event: any, emp_data: any, matEvent: MatSelectChange) {

    emp_data.env = this.env;
    emp_data.allGroups = this.allGroups;
    if (event === 'edit') {
      let dialogRef = this.dialog.open(AddNewEmployeeComponent, {
        height: 'auto',
        width: '520px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'edit',
          emp_data: emp_data,
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        if(result.data){
          this.empData = result.data.empData;
          if(result.data.groupChanged){
            this.FuncationAllowedList = new MatTableDataSource(result.data.functionsAllowedList);
          }
        }
        const matSelect: MatSelect = matEvent.source;
        matSelect.writeValue(null);
      })
    }
    if (event === 'delete') {
      let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        height: 'auto',
        width: '480px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'delete-emp',
          emp_data: emp_data,
          action: 'delete'
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        debugger
        if(!result){
          return
        }
          this.isLookUp = false;
          this.lookUpEvnt=false;
          const matSelect: MatSelect = matEvent.source;
          matSelect.writeValue(null);
          this.backEmpAction();
      })
    }


  }

  openGroupDialog() {
    let dialogRef = this.dialog.open(AddNewGroupComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe(result => {
      ;
      this.updateGrpTable = result.groupName; 
      this.groupsLookup.loadEmpData();
      // this.loadEmpData();
    })

  }
  
  backEmpAction(){
    this.clearMatSelectList();
    this.clearInput();
    this.isLookUp = false;
    this.lookUpEvnt=false
      this.employee_fetched_zones = [];
      this.location_data_source = [];
      this.groupAllowedList = [];
      this.max_orders = '';
      this.matRef.options.forEach((data: MatOption) => data.deselect());
      this.isTabChanged=true;
      this.demo1TabIndex = 0;
  }
  actionGroupDialog(event: any, grp_data: any, matEvent: MatSelectChange) { 
    if (event === 'edit') {
      let dialogRef = this.dialog.open(AddNewGroupComponent, {
        height: 'auto',
        width: '480px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'edit',
          grp_data: grp_data
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        this.isGroupLookUp = false;
        const matSelect: MatSelect = matEvent.source;
        matSelect.writeValue(null);
        this.updateGrpLookUp();
        
      })
    }
    if (event === 'delete') {
      let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        height: 'auto',
        width: '480px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'delete-group',
          grp_data: grp_data,
          userName: this.userData.userName
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        this.isGroupLookUp = false;
        const matSelect: MatSelect = matEvent.source;
        matSelect.writeValue(null);
      })
    }
    if (event === 'clone') { 
      let dialogRef = this.dialog.open(CloneGroupComponent, {
        height: 'auto',
        width: '480px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'clone',
          grp_data: grp_data
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        this.isGroupLookUp = false;
        const matSelect: MatSelect = matEvent.source;
        matSelect.writeValue(null);
      })

    }


  }

  backGroupAction(){
    this.isGroupLookUp = false;
    this.assignedFunctions = [];
    this.unassignedFunctions = [];
    this.max_orders = '';
  }

  addZoneDialog() {
    const dialogRef = this.dialog.open(AddZoneComponent, {
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
        this.zoneDataRefresh.renderRows()
      }
      // this.reloadData();
    })
  }

  deleteZone(zone: any) {
   const dialogRef =  this.dialog.open(DeleteConfirmationComponent, {
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
  editZoneDialog(zone: any) {
   const dialogRef =  this.dialog.open(AddZoneComponent, {
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
      // this.reloadData();
      ;
      
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

  saveMaximumOrders(){
    this.initialzeEmpForm();
    // this.empForm.removeControl('password');
    this.empForm.value.wsid = "TESTWID";
    this.empForm.value.username = this.empData.username;
    this.empForm.value.groupName = "";
      this.employeeService.updateAdminEmployee(this.empForm.value).subscribe((res: any) => {
        if (res.isExecuted) 
        {
          this.toastr.success(labels.alert.update, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
        else 
        {
          this.toastr.error(res.responseMessage, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
      });



  }

  openDialog() {
    let dialogRef = this.dialog.open(AddNewEmployeeComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        emp_data: null,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      
        if (result !== undefined) {
          if(result == true){
            this.employeesLookup.EmployeeLookUp();
          }
            
        }
    })
}

  addLocationDialog() {
    let dialogRef;
    dialogRef = this.dialog.open(AddLocationComponent, {
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
    })
  }

  editLocationDialog(element) {
    let dialogRef;
    dialogRef = this.dialog.open(AddLocationComponent, {
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
    dialogRef = this.dialog.open(DeleteConfirmationComponent, {
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

  AddFunctionAllowedDialog() {
    let dialogRef;
    dialogRef = this.dialog.open(AddGroupAllowedComponent, {
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
  grpAllowedDialog() {
   const  dialogRef = this.dialog.open(GroupAllowedComponent, {
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


    })
  }
  async getEmployeeData(){
    var employeRes:any = {
      "username": this.userData.userName,
      "wsid": this.userData.wsid  
    }
    this.employeeService.getEmployeeData(employeRes).subscribe((res: any) => {
      if(res.isExecuted) {
        this.ButtonAccessList =  new MatTableDataSource(res.data.allAccess);
        this.allGroups = res.data.allGroups;
        this.ButtonAccessList.paginator = this.paginator1;
      }
      else this.ButtonAccessList = [];
    });
  }
  getEmployeeDetails(){
    const emp_data = {
      "user":this.userData.userName,
      "wsid": this.userData.wsid
    };
 
    this.employeeService.getAdminEmployeeDetails(emp_data)
      .subscribe((response: any) => {
        let existingRights:any=[];
        let userRights:any=[];
        let customPermissions:any=[];
          
         existingRights = response.data.userRights; 
         customPermissions = JSON.parse(localStorage.getItem('customPerm') || '');
         userRights = [...existingRights, ...customPermissions];
         
        localStorage.setItem('userRights', JSON.stringify(userRights));
      })
  }
  deleteGroupAllowed(allowedGroup: any) {
    const dialogRef =  this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete-allowed-group',
        allowedGroup: allowedGroup,
        userName :this.grp_data
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      this.getgroupAllowedList();
    })

  }
  deleteFuncationAllowed(controlName: any) {

    let groupData = {
      
      controlName: controlName,
      userName: this.grp_data,
    };
    this.employeeService.deleteControlName(groupData).subscribe((res: any) => {
      if (res.isExecuted) {
        // this.dialog.closeAll();
        this.toastr.success('Your details have been deleted', 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
        this.reloadData();
      } else {
        // this.dialog.closeAll();
        this.toastr.error('Something went wrong!', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
    });
  

  }
  deleteGrpAllowed(allowedGroup: any) {
    allowedGroup.userName = this.grp_data;



    let emp_data = {
      groupname: allowedGroup.groupName,
      username: allowedGroup.userName,
    };
    this.employeeService.deleteUserGroup(emp_data).subscribe((res: any) => {
      if (res.isExecuted) {
        this.toastr.success(labels.alert.delete, 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
         this.getgroupAllowedList();
        //   this.reloadCurrentRoute();
      } else {
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
    });


  }

  groupAllowedFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.groupAllowedList.filter = filterValue.trim().toLowerCase();
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.location_data_source.filter = filterValue.trim().toLowerCase();
  }
  zoneFilter(event: Event) {
     const filterValue = (event.target as HTMLInputElement).value;
     this.employee_fetched_zones.filter = filterValue;
  }
  relaodPickUpLvl(){
    this.reloadData();
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
    this.employee_fetched_zones && this.employee_fetched_zones.filter? this.employee_fetched_zones.filter = '' : '';
    this.location_data_source && this.location_data_source.filter? this.location_data_source!.filter = '':'';
    this.groupAllowedList && this.groupAllowedList.filter? this.groupAllowedList.filter = '':'';
    
  }
  
 
  ChangeAdminLevel(levelresponse:any){
  var item =  {
      "controlName": levelresponse.controlName,
      "newValue": levelresponse.adminLevel
    }
    this.employeeService.updateControlName(item)
    .subscribe((r) => {
      this.toastr.success(labels.alert.update, 'Success!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    });
  }


  printEmpList(){
    this.global.Print(`FileName:printEmployees`)
    // window.location.href = `/#/report-view?file=FileName:printEmployees`;
    // window.location.reload();
  }

  printSelected(){
    this.global.Print(`FileName:printEmployeeGroup|Group:${this.grpData.groupName}`)
    // window.location.href = `/#/report-view?file=FileName:printEmployeeGroup|Group:${this.grpData.groupName}`;
    // window.location.reload();
  }

  printAll(){
    this.global.Print(`FileName:printEmployeeGroup`)
    // window.location.href = `/#/report-view?file=FileName:printEmployeeGroup`;
    // window.location.reload();
  }
}
