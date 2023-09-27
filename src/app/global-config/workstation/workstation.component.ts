import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { SharedService } from 'src/app/services/shared.service'; 
import labels from '../../labels/labels.json';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

export interface PeriodicElement {
  position: string;
}

@Component({
  selector: 'app-workstation',
  templateUrl: './workstation.component.html',
  styleUrls: ['./workstation.component.scss'],
})
export class WorkstationComponent implements OnInit {
  @ViewChild('matRef') matRef: MatSelect;
  displayedColumns: string[] = ['appName', 'canAccess', 'defaultApp'];
  appName_datasource: any = [];
  selection = new SelectionModel<PeriodicElement>(true, []);
  workstationData: any = [];
  selectedItem: any;
  canAccessAppList: any = [];
  defaultAccessApp;
  licAppNames: any = [];
  licAppObj: any;
  wsid: any;
  appName: any = '';
  selectedVariable: any;
  sideBarOpen: boolean = true;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.appName_datasource.data.length;
    return numSelected === numRows;
  }
  async radioChange(item) {
    this.wsid = item.wsid;
    this.selectedItem = item;

    await this.getCanAccessList(this.selectedItem.wsid);
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.appName_datasource.data);
  }


  
  /** The label for the checkbox on the passed row */
  

  constructor(
    private sharedService: SharedService,
    private api: ApiFuntions,
    private toastr: ToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let sharedData = this.sharedService.getData();
    let appData = this.sharedService.getApp();

    if (
      sharedData?.workstations?.length
    ) {
        
      this.workstationData = sharedData.workstations;
      this.workstationData.filter(item=>{
        if(item.pcName===""){
          this.workstationData.push( this.workstationData.splice( this.workstationData.indexOf(item), 1)[0]);
        }
    })
    } else {
      this.getMenuData();
    }
    if (appData) {
      this.getAppLicense();
      this.licAppNames = Object.keys(appData);
      this.convertToObj();
      this.appName_datasource = new MatTableDataSource(this.licAppObj);
    } else {
      this.getAppLicense();
    }
  }

  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  getMenuData() {
    let payload = {
      LicenseString:
        'qdljjBp3O3llQvKEW01qlvO4dTIFf6VMuJvYMgXgEc8U8q+dVlMKt0mKG6qtD9DO',
      AppUrl: 'CM1',
      DisplayName: 'Consolidation Manager',
      AppName: 'Consolidation Manager',
    };
    this.api.GlobalMenu(payload).subscribe(
      {next: (res: any) => {
        if (res?.data) {
          this.sharedService.setData(res.data);
          res.data.workstations.map((obj) => ({ ...obj, checked: false }));
          this.workstationData = res.data.workstations;
         
          this.workstationData.filter(item=>{
              if(item.pcName===""){
                this.workstationData.push( this.workstationData.splice( this.workstationData.indexOf(item), 1)[0]);
              }
          })
        }
      },
      error: (error) => {}}
    );
  }
  async getAppLicense() {
    this.api.AppLicense().subscribe(
      {next: (res: any) => {
        if(res?.data) {
          this.licAppNames = res.data;
          this.sharedService.setApp(this.licAppNames);
          this.licAppNames = Object.keys(res.data);
          this.convertToObj();
          this.updateLicObj(res)
            
          this.appName_datasource = new MatTableDataSource(this.licAppObj);
        }
      },
      error: (error) => {}}
    );
  }


  convertToObj() {
    this.licAppObj = this.licAppNames.reduce((acc, item) => {
      
      return [...acc, { appName: item, canAccess: false, defaultApp: false }];
    }, []);
  }
  updateLicObj(res){
    this.licAppObj.map((item,i)=>{
      this.licAppObj[i]['displayName']=res.data[item.appName].info.displayName
       })
     
  }
  async getCanAccessList(wsid) {
    // get can access

    let payload = {
      workstationid: wsid,
    };
    this.api.getWorkstationapp(payload)
      .subscribe(
        {next: (res: any) => {
          if (res?.data) {
            this.canAccessAppList = res.data;
            this.getDefaultAppList(wsid, this.canAccessAppList);
          }
        },
        error: (error) => {}}
      );
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  async getDefaultAppList(wsid, canAccessArr) {
    // get can access
    let payload = {
      workstationid: wsid,
    };
    this.api.workstationdefaultapp(payload)
      .subscribe(
        {next: (res: any) => {
          this.defaultAccessApp =  res?.data ? res.data : '';

          if (this.licAppObj.length) {
            // reset to default
            this.licAppObj.map((itm) => {
              itm.canAccess = false;
              itm.defaultApp = false;
              itm.defaultDisable= itm.appName==='Induction' || itm.appName==='ICSAdmin' 
            });
          }
          if (canAccessArr.length) {
            // find and map check boxes of selected apps
            this.licAppObj.map((obj, i) => {
              if (this.defaultAccessApp === obj.appName) {
                this.licAppObj[i].defaultApp = true;
              }
              canAccessArr.find((item, j) => {
                if (item === obj.appName) {
                  this.licAppObj[i].canAccess = true;
                }
              });
            });
          }
        },
        error: (error) => {}}
      );
  }

  onChangeCheckbox(event, item) {
    let payload = {
      wsid: this.wsid,
      AppName: item.appName,
    };
    if (event.checked) {
      this.addCanAccess(payload);
    } else {
      this.removeCanAccess(payload);
    }
  }
  onChangeRadio(event, item) {
    let payload = {
      WSID:this.wsid,
      AppName: item.appName,
    };
    this.defaultAppAdd(payload);
  }

  defaultAppAdd(payload) {
    this.api.WorkStationDefaultAppAddDefault(payload)
      .subscribe(
        {next: (res: any) => {


          if(res.isExecuted){
            this.getCanAccessList(this.wsid);
          }
        },
        error: (error) => {}}
      );
  }

  removeCanAccess(payload) {
    this.api.WorkStationAppDelete(payload)
      .subscribe(
        {next: (res: any) => {
          ;
        },
        error: (error) => {}}
      );
  }

  addCanAccess(payload) {
    this.api.workstationapp(payload).subscribe(
        {next: (res: any) => {
          if (res.isExecuted) {
            this.getCanAccessList(this.wsid);
          }
        },
        error: (error) => {}}
      );
  }

  actionDialog(opened: boolean) {
    if (!opened && this.selectedVariable) {
      if (this.selectedVariable === 'delete_workstation') {
        const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
          height: 'auto',
          width: '480px',
          autoFocus: '__non_existing_element__',
      disableClose:true,
          data: {
            mode: 'delete_workstation',
            wsid: this.wsid,
          },
        });
        dialogRef.afterClosed().subscribe((result) => {
          this.clearMatSelectList();
          this.getMenuData();
        });
      }

      if (this.selectedVariable === 'clear_disabled') {
        this.clearDefaultApp();
        this.clearMatSelectList()
      }
      if(this.selectedVariable==='get_client_cert'){
        this.clearMatSelectList()
      }
    }
  }
  deleteWorkStation() {
    if (!this.wsid) return;
    let payload = {
      WSID: this.wsid,
    };
    this.api.WorkStationDelete(payload).subscribe(
        {next: (res: any) => {
          if (res.isExecuted) {
            this.toastr.success(labels.alert.success, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
          this.getMenuData();
          this.wsid = null;
        },
        error: (error) => {
          this.toastr.error(labels.alert.went_worng, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }}
      );
  }
  clearDefaultApp() {
    this.licAppObj.map((itm) => {
      if (itm.defaultApp) {
        this.appName = itm.appName;
      }
      itm.defaultApp = false;
    });

    let payload = {
      WSID: this.wsid,
      AppName: '',
    };
    this.defaultAppAdd(payload);
    this.clearMatSelectList();
  }
}
