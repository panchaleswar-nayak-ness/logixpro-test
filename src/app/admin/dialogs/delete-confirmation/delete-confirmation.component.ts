import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../../common/init/auth.service';
import labels from 'src/app/common/labels/labels.json';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { IGlobalConfigApi } from 'src/app/common/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/common/services/globalConfig-api/global-config-api.service';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { Mode, ToasterTitle, ToasterType ,ResponseStrings,dataCredientials} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteConfirmationComponent implements OnInit {
  isChecked = true;
  action = 'remove';
  actionMessage = '';
  Message: any;
  public userData;

  public iAdminApiService: IAdminApiService;
  public iConsolidationAPI : IConsolidationApi;
  public iCommonAPI : ICommonApi;
  public iGlobalConfigApi: IGlobalConfigApi;

  constructor(
    public consolidationAPI : ConsolidationApiService,
    public commonAPI : CommonApiService,
    private dialog: MatDialog,
    public globalConfigApi: GlobalConfigApiService,
    private global: GlobalService,
    public adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    private authService: AuthService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.iConsolidationAPI = consolidationAPI; 
    this.iAdminApiService = adminApiService; 
    this.iGlobalConfigApi = globalConfigApi;
    this.iCommonAPI = commonAPI;
  }

  ngOnInit(): void {
    this.Message = ''; 
    if (this.data?.ErrorMessage) this.Message = this.data.ErrorMessage;
    this.userData = this.authService.userData();
    if (this.data?.action) this.action = this.data.action;
    if (this.data?.actionMessage) this.actionMessage = this.data.actionMessage;
  }

  onConfirmdelete() {
    if (this.data) {
      if (this.data.mode === Mode.DeleteZone) {
        let zoneData = {
          zone: this.data.zone,
          username: this.data.userName,
        };
        this.iAdminApiService.deleteEmployeeZone(zoneData).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
          } else {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
            console.log("deleteEmployeeZone", res.responseMessage);
          }
        });
      } else if (this.data.mode === Mode.DeletePickLevel) {
        let pickLevelData = {
          levelID: this.data.picklevel.levelID.toString(),
          startShelf: this.data.picklevel.startCarousel.toString(),
          endShelf: this.data.picklevel.endCarousel.toString(),
          userName: this.data.userName,
        };
        this.iAdminApiService.deletePickLevels(pickLevelData).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
          } else {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
            console.log("deletePickLevels", res.responseMessage);
          }
        });
      } else if (this.data.mode === Mode.DeleteLocation) {
        let locationData = {
          startLocation: this.data.location.startLocation,
          endLocation: this.data.location.endLocation,
          username: this.data.userName,
        };
        this.iAdminApiService.deleteEmployeeLocation(locationData).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
          } else {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
            console.log("deleteEmployeeLocation",res.responseMessage);
          }
        });
      } else if (this.data.mode === Mode.DeleteConnectionString) {
        let payload = {
          ConnectionName: this.data.connectionName,
        };
        this.iGlobalConfigApi
          .ConnectionDelete(payload)
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.global.ShowToastr(ToasterType.Success, res.responseMessage, ToasterTitle.Success);
                this.dialogRef.close({ isExecuted: true });
              }
            },
            (error) => {
              this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
              console.log("ConnectionDelete", error);
            }
          );
      } else if (this.data.mode === Mode.DeleteGroup) {
        let groupData = {
          GroupName: this.data.grp_data.groupName,
          userName: this.data.userName,
        };
        this.iAdminApiService.deleteGroup(groupData).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
          } else {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
            console.log("deleteGroup",res.responseMessage);
          }
        });
      } else if (this.data.mode === Mode.DeleteAllowedGroup) {
        let groupData = {
          GroupName: this.data.allowedGroup,
          userName: this.data.userName,
        };
        this.iAdminApiService.deleteGroup(groupData).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
          } else {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
            console.log("deleteGroup",res.responseMessage);
          }
        });
      } else if (this.data.mode === Mode.DeleteAllowedFunction) {
        let groupData = {
          controlName: this.data.controlName,
          userName: this.data.userName,
        };
        this.iAdminApiService.deleteControlName(groupData).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
          } else {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
            console.log("deleteControlName",res.responseMessage);
          }
        });
      } else if (this.data.mode === Mode.DeleteInvMap) {
        let payload = {
          inventoryMapID: this.data.id, 
        };
        this.iAdminApiService.deleteInventoryMap(payload).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
          } else {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
            console.log("deleteInventoryMap",res.responseMessage);
          }
        });
      } else if (this.data.mode === Mode.DeleteEmp) {
        debugger
        let emp_data = {
          userName: this.data.emp_data.userName,
          deleteBy: this.userData.userName,
          wsid: dataCredientials.testWsid,
        };
        this.iAdminApiService
          .deleteAdminEmployee(emp_data)
          .subscribe((res: any) => {
            if (res.isExecuted) {
              this.dialogRef.close('deleted');
              this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
            }
            else {
              this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
              console.log("deleteAdminEmployee",res.responseMessage);
            }
          });
      } else if (this.data.mode === Mode.DeleteGrpAllowed) {
        let emp_data = {
          groupname: this.data.allowedGroup.groupName,
          username: this.data.allowedGroup.userName,
        };
        this.iAdminApiService.deleteUserGroup(emp_data).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
          } else {
            this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
            console.log("deleteUserGroup",res.responseMessage);
          }
        });
      } else if (this.data.mode === Mode.DeleteWarehouse) {
        let emp_data = {
          warehouse: this.data.warehouse
        };
        this.iCommonAPI.dltWareHouse(emp_data).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialogRef.close(ResponseStrings.Yes);
            this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
          } else {
            this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
            console.log("dltWareHouse",res.responseMessage);
          }
        });
      } else if (this.data.mode === Mode.DeleteVelocity) {
        let emp_data = {
          velocity: this.data.velocity
        };
        this.iCommonAPI.dltVelocityCode(emp_data).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialogRef.close(ResponseStrings.Yes);
            this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
          } else {
            this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
            console.log("dltVelocityCode",res.responseMessage);
          }
        });
      } else if (this.data.mode === Mode.DeleteOrderStatus) {
        this.iAdminApiService
          .DeleteOrderStatus(this.data.paylaod)
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
                this.dialogRef.close({ isExecuted: false });
                console.log("DeleteOrderStatus",res.responseMessage);
                
                
              }
            },
            (error) => {}
          );
      } else if (this.data.mode === Mode.DeleteCarrier) {
        let payload = {
          carrier: this.data.carrier
        };
        this.iConsolidationAPI
          .CarrierDelete(payload)
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
                this.dialogRef.close({ isExecuted: false });
                console.log("CarrierDelete",res.responseMessage);
              }
            },
            (error) => {}
          );
      } else if (this.data.mode === Mode.DeleteWorkstation) {
        this.iGlobalConfigApi
          .WorkStationDelete()
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
                console.log("WorkStationDelete",res.responseMessage);
              }
              this.dialogRef.close({ isExecuted: false });
            },
            (err) => {
              this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
              
            }
          );
      } else if(this.data.mode == Mode.DeleteCategory) {
        let payload = {
          Category:this.data.category,
          SubCategory:this.data.subCategory,
        };

        this.iCommonAPI
          .CategoryDelete(payload)
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
                this.dialogRef.close(ResponseStrings.Yes);
              } else {
                this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
                this.dialogRef.close({ isExecuted: false });
                console.log("CategoryDelete",res.responseMessage);
              }
            },
            (err) => {
              this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
            }
          );
      } 
      else this.dialogRef.close(ResponseStrings.Yes);
    } 
    else this.dialogRef.close(ResponseStrings.Yes);
  }

  checkOptions(event: MatCheckboxChange): void {
    if (event.checked) this.isChecked = false;
    else this.isChecked = true;
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => { this.router.navigate([currentUrl]); });
  }
}
