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
import { Mode, ToasterTitle, ToasterType ,ResponseStrings} from 'src/app/common/constants/strings.constants';
import { UserSession } from 'src/app/common/types/CommonTypes';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
})
export class DeleteConfirmationComponent implements OnInit {
  isChecked = true;
  action = 'remove';
  actionMessage = '';
  Message: any;
  public userData : UserSession;

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
    this.Message = this.data?.ErrorMessage || '';
    this.userData = this.authService.userData();
    this.action = this.data?.action || this.action;
    this.actionMessage = this.data?.actionMessage || this.actionMessage;
  }

  onConfirmdelete() {
    if (!this.data) {
      this.dialogRef.close(ResponseStrings.Yes);
      return;
    }

    switch (this.data.mode) {
      case Mode.DeleteZone:
        this.handleDelete(this.adminApiService.deleteEmployeeZone, {
          zone: this.data.zone,
          username: this.data.userName,
        });
        break;
      case Mode.DeletePickLevel:
        this.handleDelete(this.iAdminApiService.deletePickLevels, {
          levelID: this.data.picklevel.levelID.toString(),
          startShelf: this.data.picklevel.startCarousel.toString(),
          endShelf: this.data.picklevel.endCarousel.toString(),
          userName: this.data.userName,
          wsid: this.userData.wsid
        });
        break;
      case Mode.DeleteLocation:
        this.handleDelete(this.adminApiService.deleteEmployeeLocation, {
          startLocation: this.data.location.startLocation,
          endLocation: this.data.location.endLocation,
          username: this.data.userName,
        });
        break;
      case Mode.DeleteConnectionString:
        this.handleDelete(this.globalConfigApi.ConnectionDelete, {
          ConnectionName: this.data.connectionName,
        });
        break;
      case Mode.DeleteGroup:
      case Mode.DeleteAllowedGroup:
        this.handleDelete(this.adminApiService.deleteGroup, {
          GroupName: this.data.grp_data?.groupName || this.data.allowedGroup,
          userName: this.data.userName,
        });
        break;
      case Mode.DeleteAllowedFunction:
        this.handleDelete(this.adminApiService.deleteControlName, {
          controlName: this.data.controlName,
          userName: this.data.userName,
        });
        break;
      case Mode.DeleteInvMap:
        this.handleDelete(this.adminApiService.deleteInventoryMap, {
          inventoryMapID: this.data.id,
        });
        break;
      case Mode.DeleteEmp:
        this.handleDelete(this.adminApiService.deleteAdminEmployee, {
          userName: this.data.emp_data.userName,
          deleteBy: this.userData.userName,
        });
        break;
      case Mode.DeleteGrpAllowed:
        this.handleDelete(this.adminApiService.deleteUserGroup, {
          groupname: this.data.allowedGroup.groupName,
          username: this.data.allowedGroup.userName,
        });
        break;
      case Mode.DeleteWarehouse:
        this.handleDelete(this.commonAPI.dltWareHouse, {
          warehouse: this.data.warehouse,
        });
        break;
      case Mode.DeleteVelocity:
        this.handleDelete(this.commonAPI.dltVelocityCode, {
          velocity: this.data.velocity,
        });
        break;
      case Mode.DeleteOrderStatus:
        this.handleDelete(this.adminApiService.DeleteOrderStatus, this.data.paylaod);
        break;
      case Mode.DeleteCarrier:
        this.handleDelete(this.consolidationAPI.CarrierDelete, {
          carrier: this.data.carrier,
        });
        break;
      case Mode.DeleteWorkstation:
        this.handleDelete(this.globalConfigApi.WorkStationDelete);
        break;
      case Mode.DeleteCategory:
        this.handleDelete(this.commonAPI.CategoryDelete, {
          Category: this.data.category,
          SubCategory: this.data.subCategory,
        });
        break;
      default:
        this.dialogRef.close(ResponseStrings.Yes);
    }
  }

  private handleDelete(apiMethod: Function, payload?: any) {
    apiMethod(payload).subscribe(
      (res: any) => {
        if (res.isExecuted) {
          this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
          this.dialogRef.close({ isExecuted: true });
        } else {
          this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
          this.dialogRef.close({ isExecuted: false });
          console.log(apiMethod.name, res.responseMessage);
        }
      },
      (error: any) => {
        this.global.ShowToastr(ToasterType.Error, labels.alert.went_worng, ToasterTitle.Error);
        console.log(apiMethod.name, error);
      }
    );
  }

  checkOptions(event: MatCheckboxChange): void {
    this.isChecked = !event.checked;
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => { 
      this.router.navigate([currentUrl]); 
    });
  }
}
