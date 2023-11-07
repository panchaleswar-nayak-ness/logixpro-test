import { Component} from '@angular/core';
import { IEmployee,EmployeeObject,AdminEmployeeLookupResponse,AccessGroupObject } from '../Iemployee'; 
import { Router } from '@angular/router';
import { ApiFuntions } from '../services/ApiFuntions';
import { SharedService } from '../services/shared.service';
import { IAdminApiService } from '../services/admin-api/admin-api-interface';
import { AdminApiService } from '../services/admin-api/admin-api.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent  {
  sideBarOpen: boolean = true;
  emp: IEmployee;
  empRes:EmployeeObject;
  public iAdminApiService: IAdminApiService;
  breadcrumbList: any = [];
  isMenuHide:any=false;
  constructor(public employeeService: ApiFuntions,  public router: Router,private adminApiService: AdminApiService,private sharedService:SharedService) {
    this.iAdminApiService = adminApiService;
    this.sharedService.SideBarMenu.subscribe(menu => {
      this.sideBarOpen = menu;   
    });
    this.sharedService.sideMenuHideObserver.subscribe(menu => {
      this.isMenuHide = menu;   
    });
   }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  ngOnDestroy(){
    console.log('sideMenuHideObserver');
    this.sharedService.sideMenuHideObserver.unsubscribe();
  }


  

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  //Methods

  //Employees

  //get employee
  getEmployee() { 
this.iAdminApiService.getEmployeeData(this.emp)
.subscribe((response: EmployeeObject) => {
  


  });
}

  //get employee stats info
  employeeStatsInfo() {
    this.emp = {
      "users": "1234",
      "startDate": "2019-10-27",
      "endDate": "2020-10-27",
      "startRow": 1,
      "draw": 10
    };
this.iAdminApiService.employeeStatsInfo(this.emp)
.subscribe((response: AdminEmployeeLookupResponse) => {
  


  });
}

//delete employee Lookup
deleteEmployee() {
  this.emp = {
    "deleteBy": "1234"
  };
this.iAdminApiService.deleteAdminEmployee(this.emp)
.subscribe((response: AdminEmployeeLookupResponse) => {



});

}


//update employee Lookup
updateEmployee() {
  this.emp = { 
    "lastName": "Ahmed",
    "firstName": "admin",
    "mi": "",
    "active": true,
    "maximumOrders": 10,
    "accessLevel": "",
    "groupName": "",
    "emailAddress": "aa@gmail.com"
  };
this.iAdminApiService.updateAdminEmployee(this.emp)
.subscribe((response: AdminEmployeeLookupResponse) => {



});

}




//control Name

//get control name
getControlName() {
  this.emp = {  
    "filter": "%"
  };
this.iAdminApiService.getControlName(this.emp)
.subscribe((response: EmployeeObject) => {



});

}

//update control name
updateControlName() {
  this.emp = {
   "controlName": "Admin Create Orders",
  "newValue": true
  };
this.iAdminApiService.updateControlName(this.emp)
.subscribe((response: EmployeeObject) => {



});

}

//delete control name
deleteControlName() {
  this.emp = {
  "controlName": "Admin Create Orders" 
  };
this.iAdminApiService.deleteControlName(this.emp)
.subscribe((response: EmployeeObject) => {



});

}

//submit control name
submitControlName() {
  this.emp = {
  "controlName": "Admin Create Orders" 
  };
this.iAdminApiService.submitControlResponse(this.emp)
.subscribe((response: EmployeeObject) => {



});

}

//zones

// updateEmployeeZone

updateEmployeeZone() {
  this.emp = { 
  "zone": "01",

  };
this.iAdminApiService.updateEmployeeZone(this.emp)
.subscribe((response: AdminEmployeeLookupResponse) => {



});

}

//deleteEmployeeZone

deleteEmployeeZone() {
  this.emp = { 
  "zone": "01",

  };
this.iAdminApiService.deleteEmployeeZone(this.emp)
.subscribe((response: AdminEmployeeLookupResponse) => {



});

}












//get zones



getZones() { 
this.iAdminApiService.getZones()
.subscribe((response: AdminEmployeeLookupResponse) => {



});

}


//InsertAllAccess

insertAllAccess() {
  this.emp = { 
  "access": "Administrator" 
  };
this.iAdminApiService.insertAllAccess(this.emp)
.subscribe((response: AdminEmployeeLookupResponse) => {



});

}

//EmployeeLocation

insertEmployeeLocation() {
  this.emp = { 
  "startLocation": "01",
  "endLocation": "05"
  };
this.iAdminApiService.insertEmployeeLocation(this.emp)
.subscribe((response: AdminEmployeeLookupResponse) => {



});

}

updateEmployeeLocation() {
  this.emp = { 
    "startLocation": "02",
    "endLocation": "05",
    "oldStartLocation": "01",
    "oldEndLocation": "05"
  };
this.iAdminApiService.updateEmployeeLocation(this.emp)
.subscribe((response: AdminEmployeeLookupResponse) => {



});

}

deleteEmployeeLocation() {
  this.emp = { 
    "startLocation": "02",
    "endLocation": "05"
  };
this.iAdminApiService.deleteEmployeeLocation(this.emp)
.subscribe((response: AdminEmployeeLookupResponse) => {



});

}

//PickLevels
insertPickLevels() {
  this.emp = { 
    "wsid": "TESTWID",
    "levelID": "01",
    "startShelf": "01",
    "endShelf": "05"
  };
this.iAdminApiService.insertPickLevels(this.emp)
.subscribe((response: AdminEmployeeLookupResponse) => {



});

}


updatePickLevels() {
  this.emp = { 
    "wsid": "TESTWID",
    "levelID": "01",
    "startShelf": "01",
    "endShelf": "05"
  };
this.iAdminApiService.updatePickLevels(this.emp)
.subscribe((response: AdminEmployeeLookupResponse) => {



});

}

deletePickLevels() {
  this.emp = { 
    "wsid": "TESTWID",
    "levelID": "01",
    "startShelf": "01",
    "endShelf": "05"
  };
this.iAdminApiService.deletePickLevels(this.emp)
.subscribe((response: AdminEmployeeLookupResponse) => {



});

}


//UpdateAccessGroup

updateAccessGroup() {
  this.emp = { 
    "group": "Administrator"

  };
this.iAdminApiService.updateAccessGroup(this.emp)
.subscribe((response: AccessGroupObject) => {



});

}
//Group

insertGroup() {
  this.emp = { 
    "wsid": "TESTWID",
    "GroupName": "Group Test"

  };
this.iAdminApiService.updateAccessGroup(this.emp)
.subscribe((response: AccessGroupObject) => {



});

}





}
