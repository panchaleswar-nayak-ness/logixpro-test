import { Component, Inject, OnInit } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';  
import { AuthService } from '../../../../app/init/auth.service';
import labels from '../../../labels/labels.json';  
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { IConsolidationApi } from 'src/app/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/services/consolidation-api/consolidation-api.service';
import { IGlobalConfigApi } from 'src/app/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/services/globalConfig-api/global-config-api.service';
import { ICommonApi } from 'src/app/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/services/common-api/common-api.service';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteConfirmationComponent implements OnInit {
  isChecked = true;
  action = 'remove';
  actionMessage = '';
  Message: any;
  public iAdminApiService: IAdminApiService;
  public userData;
  public IconsolidationAPI : IConsolidationApi;
  public iCommonAPI : ICommonApi;


  public  iGlobalConfigApi: IGlobalConfigApi
  constructor(
    public consolidationAPI : ConsolidationApiService,
    public commonAPI : CommonApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private toastr: ToastrService,
    public globalConfigApi: GlobalConfigApiService,
    private Api: ApiFuntions, 
    private adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    private authService: AuthService,
    private router: Router
  ) { 
    this.IconsolidationAPI = consolidationAPI; this.iAdminApiService = adminApiService; 
    this.iGlobalConfigApi = globalConfigApi;
  
    this.iCommonAPI = commonAPI;
  }

  ngOnInit(): void {
    this.Message = ''; 
    if (this.data?.ErrorMessage) {
      this.Message = this.data.ErrorMessage;
    }
    this.userData = this.authService.userData();
    if (this.data?.action) {
      this.action = this.data.action;
    }
    if (this.data?.actionMessage) {
      this.actionMessage = this.data.actionMessage;
    }
  }

  onConfirmdelete() {
    
    if (this.data) {
      if (this.data.mode === 'delete-zone') {
        let zoneData = {
          zone: this.data.zone,
          username: this.data.userName,
        };
        this.iAdminApiService
          .deleteEmployeeZone(zoneData)
          .subscribe((res: any) => {
            if (res.isExecuted) {
              this.dialog.closeAll();
              this.toastr.success(labels.alert.delete, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            } else {
              this.dialog.closeAll();
              this.toastr.error(labels.alert.went_worng, 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            }
          });
      } else if (this.data.mode === 'delete-picklevel') {
        let pickLevelData = {
          wsid: 'TESTWID',
          levelID: this.data.picklevel.levelID.toString(),
          startShelf: this.data.picklevel.startCarousel.toString(),
          endShelf: this.data.picklevel.endCarousel.toString(),
          userName: this.data.userName,
        };
        this.iAdminApiService
          .deletePickLevels(pickLevelData)
          .subscribe((res: any) => {
            if (res.isExecuted) {
              this.dialog.closeAll();
              this.toastr.success(labels.alert.delete, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            } else {
              this.dialog.closeAll();
              this.toastr.error(labels.alert.went_worng, 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            }
          });
      }

      else if (this.data.mode === 'delete-location') {
        let locationData = {
          startLocation: this.data.location.startLocation,
          endLocation: this.data.location.endLocation,
          username: this.data.userName,
        };
        this.iAdminApiService
          .deleteEmployeeLocation(locationData)
          .subscribe((res: any) => {
            if (res.isExecuted) {
              this.dialog.closeAll();
              this.toastr.success(labels.alert.delete, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            } else {
              this.dialog.closeAll();
              this.toastr.error(labels.alert.went_worng, 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            }
          });
      } else if (this.data.mode === 'delete-connection-string') {
        let payload = {
          ConnectionName: this.data.connectionName,
        };
        this.iGlobalConfigApi
          .ConnectionDelete(payload)
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.toastr.success(res.responseMessage, 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close({ isExecuted: true });
              }
            },
            (error) => {
              this.toastr.error(labels.alert.went_worng, 'Error!!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            }
          );
      } else if (this.data.mode === 'delete-group') {
        let groupData = {
          wsid: 'TESTWID',
          GroupName: this.data.grp_data.groupName,
          userName: this.data.userName,
        };
        this.iAdminApiService.deleteGroup(groupData).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          } else {
            this.dialog.closeAll();
            this.toastr.error(labels.alert.went_worng, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        });
      } else if (this.data.mode === 'delete-allowed-group') {
        let groupData = {
          wsid: 'TESTWID',
          GroupName: this.data.allowedGroup,
          userName: this.data.userName,
        };
        this.iAdminApiService.deleteGroup(groupData).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          } else {
            this.dialog.closeAll();
            this.toastr.error(labels.alert.went_worng, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        });
      } else if (this.data.mode === 'delete-allowed-funcation') {
        let groupData = {
      
          controlName: this.data.controlName,
          userName: this.data.userName,
        };
        this.iAdminApiService.deleteControlName(groupData).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          } else {
            this.dialog.closeAll();
            this.toastr.error(labels.alert.went_worng, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        });
      }
       else if (this.data.mode === 'delete-inventory-map') {
        let payload = {
          inventoryMapID: this.data.id, 
        };
        this.iAdminApiService.deleteInventoryMap(payload).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          } else {
            this.dialog.closeAll();
            this.toastr.error(labels.alert.went_worng, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        });
      } else if (this.data.mode === 'delete-emp') {
        let emp_data = {
          userName: this.data.emp_data.username,
          deleteBy: this.userData.userName,
          wsid: 'TESTWSID',
        };
        this.iAdminApiService
          .deleteAdminEmployee(emp_data)
          .subscribe((res: any) => {
            if (res.isExecuted) {
              this.dialogRef.close('deleted');
              this.toastr.success(labels.alert.delete, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            }
          });
      } else if (this.data.mode === 'delete-grpallowed') {
        let emp_data = {
          groupname: this.data.allowedGroup.groupName,
          username: this.data.allowedGroup.userName,
        };
        this.iAdminApiService.deleteUserGroup(emp_data).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialog.closeAll();
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          } else {
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        });
      } else if (this.data.mode === 'delete-warehouse') {
        let emp_data = {
          warehouse: this.data.warehouse
        };
        this.iCommonAPI.dltWareHouse(emp_data).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialogRef.close('Yes');
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          } else {
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        });
      } else if (this.data.mode === 'delete-velocity') {
        let emp_data = {
          velocity: this.data.velocity
        };
        this.iCommonAPI.dltVelocityCode(emp_data).subscribe((res: any) => {
          if (res.isExecuted) {
            this.dialogRef.close('Yes');
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          } else {
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        });
      } else if (this.data.mode === 'delete-order-status') {
        this.iAdminApiService
          .DeleteOrderStatus(this.data.paylaod)
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.toastr.success(labels.alert.success, 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.toastr.error(labels.alert.went_worng, 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close({ isExecuted: false });
              }
            },
            (error) => {}
          );
      } else if (this.data.mode === 'delete-carrier') {
        let payload = {
          carrier: this.data.carrier
        };
        this.IconsolidationAPI
          .CarrierDelete(payload)
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.toastr.success(labels.alert.success, 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.toastr.error(labels.alert.went_worng, 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close({ isExecuted: false });
              }
            },
            (error) => {}
          );
      } else if (this.data.mode === 'delete_workstation') {
        this.iGlobalConfigApi
          .WorkStationDelete()
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.toastr.success(labels.alert.success, 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close({ isExecuted: true });
              } else {
                this.toastr.error(labels.alert.went_worng, 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
              }
              this.dialogRef.close({ isExecuted: false });
            },
            (err) => {
              this.toastr.error(labels.alert.went_worng, 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            }
          );
      }else if(this.data.mode == 'delete-category'){
        let payload = {
          Category:this.data.category,
          SubCategory:this.data.subCategory,
        };

        this.iCommonAPI
          .CategoryDelete(payload)
          .subscribe(
            (res: any) => {
              if (res.isExecuted) {
                this.toastr.success(labels.alert.success, 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close('Yes');
              } else {
                this.toastr.error(labels.alert.went_worng, 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
                this.dialogRef.close({ isExecuted: false });
              }
        
            },
            (err) => {
              this.toastr.error(labels.alert.went_worng, 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            }
          );
      } 
      else {
        this.dialogRef.close('Yes');
      }
    } else {
      this.dialogRef.close('Yes');
    }
  }

  checkOptions(event: MatCheckboxChange): void {
    if (event.checked) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
