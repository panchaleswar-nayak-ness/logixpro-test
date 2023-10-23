import {Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators'; 
import { IEmployee } from 'src/app/Iemployee';
import { MatDialog} from '@angular/material/dialog';
import { AddNewEmployeeComponent } from '../dialogs/add-new-employee/add-new-employee.component';
import { DeleteConfirmationComponent } from '../dialogs/delete-confirmation/delete-confirmation.component';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { AddZoneComponent } from '../dialogs/add-zone/add-zone.component';
import { AddLocationComponent } from '../dialogs/add-location/add-location.component';
import { AddGroupAllowedComponent } from '../dialogs/add-group-allowed/add-group-allowed.component';
import { AddNewGroupComponent } from '../dialogs/add-new-group/add-new-group.component';
import labels from '../../labels/labels.json';
import { GroupAllowedComponent } from '../dialogs/group-allowed/group-allowed.component';
import { CloneGroupComponent } from '../dialogs/clone-group/clone-group.component';
import { Router} from '@angular/router';
import { AuthService } from '../../../app/init/auth.service';
import { SpinnerService } from '../../../app/init/spinner.service';
import { MatOption } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GroupsLookupComponent } from './groups-lookup/groups-lookup.component';
import { EmployeesLookupComponent } from './employees-lookup/employees-lookup.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

export interface Location {
  start_location: string;
  end_location: string;
  delete_location: string;
}

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
  userName: any;
  employees_action: boolean = false;
  employee_fetched_zones: any;
  location_data_source: any;
  employee_group_allowed: any;
  emp_all_zones:any;
  groupAllowedList:any = {};
  FuncationAllowedList:any = [];
  OldFuncationAllowedList:any = [];
  access:any;
  public iAdminApiService: IAdminApiService;
  grp_data:any;
  public demo1TabIndex = 0;
  public userData;
  public updateGrpTable;
  isTabChanged:any;
  empForm: FormGroup;
  
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
  selectedIndex:number = 0;

  constructor(
    private authService: AuthService,
    private employeeService: ApiFuntions, 
    private global:GlobalService,
    private adminApiService: AdminApiService,
    private zone: NgZone,
    public router: Router,
    public laoder: SpinnerService,
    private dialog:MatDialog
    ) {  
      this.iAdminApiService = adminApiService;
    }

  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  
  getFuncationAllowedList(){
    let emp:any = {
      "username": this.grp_data,
      "access": this.empData.accessLevel
    }
    this.iAdminApiService.getInsertAllAccess(emp).subscribe((res:any) => {
      if(res.isExecuted)
      {
        this.reloadData();
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("getInsertAllAccess",res.responseMessage);
      }
      
    }) 
  }
  
  applyFunctionAllowedFilter(event: any) { 
    if(!this.OldFuncationAllowedList?.length && this.FuncationAllowedList.filteredData?.length) {
      this.OldFuncationAllowedList = this.FuncationAllowedList.filteredData;
    }
    if(this.OldFuncationAllowedList.length) this.FuncationAllowedList = new MatTableDataSource(this.OldFuncationAllowedList.filter(x=> x?.toLowerCase()?.indexOf(event?.target?.value.toLowerCase()) > -1));
  }

  updateIsLookUp(event: any) {
    this.empData = {};
    this.empData = event.userData;
    this.isLookUp = event;
    this.lookUpEvnt=true; 
    this.grp_data = event.userData?.username;

    this.max_orders = event.userData.maximumOrders;
    const emp_data = {
      "user": event.userData?.username,
      "wsid": "TESTWSID"
    };
 
    this.iAdminApiService.getAdminEmployeeDetails(emp_data)
      .subscribe((response: any) => { 
        if(response.isExecuted && response.data)
        {
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
        }
        else {
          this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
          console.log("getAdminEmployeeDetails",response.responseMessage);
        }
         
      });



  }
  reloadData(){
    const emp_data = {
      "user":  this.grp_data,
      "wsid": "TESTWSID"
    };
    this.iAdminApiService.getAdminEmployeeDetails(emp_data)
      .subscribe((response: any) => {
        if(response.isExecuted && response.data)
        {
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
        }
        else {
          this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
          console.log("getAdminEmployeeDetails",response.responseMessage);
        }
        
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
      "GroupName":this.grpData.groupName,
      "controls": this.assignedFunctions
    }
    this.iAdminApiService.insertGroupFunctions(assignFunc)
      .subscribe((res: any) => {
        this.assignedFunctions =[];
        this.unassignedFunctions =[];
        this.isGroupLookUp = false;
        if(res.isExecuted){
          this.global.ShowToastr('success',labels.alert.update, 'Success!');
          this.updateGrpLookUp();
        }
        else{
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
          console.log("insertGroupFunctions",res.responseMessage);
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
    this.iAdminApiService.getFunctionByGroup(grp_data)
    .subscribe((response:any) => {
      if(response.isExecuted && response.data)
      {
        this.assignedFunctions = response.data?.groupFunc
      this.unassignedFunctions = response.data?.allFunc
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("getFunctionByGroup",response.responseMessage);
      } 
      
    });
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value ?? '')),
    );

   this.env =  JSON.parse(localStorage.getItem('env') ?? '');
  //  this.initialzeEmpForm();
   this.getEmployeeData();
  }

  


  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  actionDialog(event: any, emp_data: any, matEvent: MatSelectChange) {

    emp_data.env = this.env;
    emp_data.allGroups = this.allGroups;
    if (event === 'edit') {
      let dialogRef:any = this.global.OpenDialog(AddNewEmployeeComponent, {
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
      let dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
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
    let dialogRef:any = this.global.OpenDialog(AddNewGroupComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe(result => {
      ;
      this.updateGrpTable = result.groupName; 
      this.groupsLookup.loadEmpData();
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
      let dialogRef:any = this.global.OpenDialog(AddNewGroupComponent, {
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
      let dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
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
      let dialogRef:any = this.global.OpenDialog(CloneGroupComponent, {
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

  openDialog() {
    let dialogRef:any = this.global.OpenDialog(AddNewEmployeeComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        emp_data: null,
      }
    });
    dialogRef.afterClosed().subscribe(result => {
        if (result !== undefined)
          if(result == true) this.employeesLookup.EmployeeLookUp();
    });
  }

  async getEmployeeData(){
    let employeRes:any = {}
    this.iAdminApiService.getEmployeeData(employeRes).subscribe((res: any) => {
      if(res.isExecuted) {
        this.ButtonAccessList =  new MatTableDataSource(res.data.allAccess);
        this.allGroups = res.data.allGroups;
        this.ButtonAccessList.paginator = this.paginator1;
      }
      else {
        this.ButtonAccessList = [];
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("getEmployeeData",res.responseMessage);
      }
    });
  }
  getEmployeeDetails(){
    const emp_data = {};
    this.iAdminApiService.getAdminEmployeeDetails(emp_data)
      .subscribe((response: any) => {
        if(response.isExecuted)
        {
          let existingRights:any=[];
        let userRights:any=[];
        let customPermissions:any=[];
          
        existingRights = response.data.userRights; 
        customPermissions = JSON.parse(localStorage.getItem('customPerm') ?? '');
        userRights = [...existingRights, ...customPermissions];
         
        localStorage.setItem('userRights', JSON.stringify(userRights));

        }
        else {
          this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
          console.log("",response.responseMessage)
        }
      })
  }

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

  clearInput(){
    this.bpSettingInp='';
    this.bpSettingLocInp='';
    this.searchfuncAllowed = '';
    this.grpAllFilter='';
    this.employee_fetched_zones.filter = '';
    this.location_data_source!.filter = '';
    this.groupAllowedList.filter = '';
  }
 
  ChangeAdminLevel(levelresponse:any){
  let item =  {
      "controlName": levelresponse.controlName,
      "newValue": levelresponse.adminLevel
    }
    this.iAdminApiService.updateControlName(item)
    .subscribe((r) => {
      if(r.isExecuted)
      {
        this.global.ShowToastr('success',labels.alert.update, 'Success!');
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("updateControlName",r.responseMessage);
      }
      
    });
  }

  printEmpList(){
    this.global.Print(`FileName:printEmployees`)
  }

  printSelected(){
    this.global.Print(`FileName:printEmployeeGroup|Group:${this.grpData.groupName}`)
  }

  printAll(){
    this.global.Print(`FileName:printEmployeeGroup`)
  }
}
