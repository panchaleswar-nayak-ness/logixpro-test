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
import { Mode, ToasterTitle, ToasterType, ResponseStrings } from 'src/app/common/constants/strings.constants';
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
  public userData: UserSession;

  public iAdminApiService: IAdminApiService;
  public iConsolidationAPI: IConsolidationApi;
  public iCommonAPI: ICommonApi;
  public iGlobalConfigApi: IGlobalConfigApi;

  constructor(
    public consolidationAPI: ConsolidationApiService,
    public commonAPI: CommonApiService,
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

    // Mapping the API calls based on the mode
    const modeToApiMap = {
      [Mode.DeleteZone]: {
        method: () => this.adminApiService.deleteEmployeeZone({
          zone: this.data.zone,
          username: this.data.userName,
        })
      },
      [Mode.DeletePickLevel]: {
        method: () => this.iAdminApiService.deletePickLevels({
          levelID: this.data.picklevel.levelID.toString(),
          startShelf: this.data.picklevel.startCarousel.toString(),
          endShelf: this.data.picklevel.endCarousel.toString(),
          userName: this.data.userName,
          wsid: this.userData.wsid
        })
      },
      [Mode.DeleteLocation]: {
        method: () => this.adminApiService.deleteEmployeeLocation({
          startLocation: this.data.location.startLocation,
          endLocation: this.data.location.endLocation,
          username: this.data.userName,
        })
      },
      [Mode.DeleteConnectionString]: {
        method: () => this.globalConfigApi.ConnectionDelete({
          ConnectionName: this.data.connectionName,
        })
      },
      [Mode.DeleteGroup]: {
        method: () => this.adminApiService.deleteGroup({
          GroupName: this.data.grp_data?.groupName || this.data.allowedGroup,
          userName: this.data.userName,
        })
      },
      [Mode.DeleteAllowedGroup]: {
        method: () => this.adminApiService.deleteGroup({
          GroupName: this.data.grp_data?.groupName || this.data.allowedGroup,
          userName: this.data.userName,
        })
      },
      [Mode.DeleteAllowedFunction]: {
        method: () => this.adminApiService.deleteControlName({
          controlName: this.data.controlName,
          userName: this.data.userName,
        })
      },
      [Mode.DeleteInvMap]: {
        method: () => this.adminApiService.deleteInventoryMap({
          inventoryMapID: this.data.id
        })
      },
      [Mode.DeleteEmp]: {
        method: () => this.adminApiService.deleteAdminEmployee({
          userName: this.data.emp_data.userName,
          deleteBy: this.userData.userName,
        })
      },
      [Mode.DeleteGrpAllowed]: {
        method: () => this.adminApiService.deleteUserGroup({
          groupname: this.data.allowedGroup.groupName,
          username: this.data.allowedGroup.userName,
        })
      },
      [Mode.DeleteWarehouse]: {
        method: () => this.commonAPI.dltWareHouse({
          warehouse: this.data.warehouse,
        })
      },
      [Mode.DeleteVelocity]: {
        method: () => this.commonAPI.dltVelocityCode({
          velocity: this.data.velocity,
        })
      },
      [Mode.DeleteOrderStatus]: {
        method: () => this.adminApiService.DeleteOrderStatus(this.data.payload)
      },
      [Mode.DeleteCarrier]: {
        method: () => this.consolidationAPI.CarrierDelete({
          carrier: this.data.carrier,
        })
      },
      [Mode.DeleteWorkstation]: {
        method: () => this.globalConfigApi.WorkStationDelete()
      },
      [Mode.DeleteCategory]: {
        method: () => this.commonAPI.CategoryDelete({
          Category: this.data.category,
          SubCategory: this.data.subCategory,
        })
      }
    };

    // Execute the method based on the mode, if it exists in the map
    const selectedAction = modeToApiMap[this.data.mode];
    if (selectedAction) {
      this.handleDelete(selectedAction.method);
    } else {
      this.dialogRef.close(ResponseStrings.Yes);
    }
  }

  // Centralized method to handle API calls
  private handleDelete(apiMethod: () => any) {
    apiMethod().subscribe(
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
