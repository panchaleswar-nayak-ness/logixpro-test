import { Component, Input, OnInit } from '@angular/core';
import { defaultAccessLevelByGroupFunctions, defaultWorkstationSetup, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiResponse, UserSession } from 'src/app/common/types/CommonTypes';

@Component({
  selector: 'app-storage-container-management',
  templateUrl: './storage-container-management.component.html',
  styleUrls: ['./storage-container-management.component.scss'],
})
export class StorageContainerManagementComponent implements OnInit {

  public iAdminApiService: IAdminApiService;
  userData: UserSession;
  @Input() accessLevelByGroupFunctions = defaultAccessLevelByGroupFunctions;
  @Input() workstationSetup = defaultWorkstationSetup;
  
  constructor(
    public authService: AuthService,
    public global: GlobalService,
    public adminApiService: AdminApiService
  ) {
    this.iAdminApiService = adminApiService;
    this.userData = authService.userData();
  }

  ngOnInit(): void {
  }

  payload() {
    const payload = {
      StorageContainer: this.workstationSetup.storageContainer,
      LocationControl: this.workstationSetup.locationControl
    };
    this.saveForm(payload);
  }

  async saveForm(paylaod : {
    StorageContainer: boolean,
    LocationControl: boolean
  }) 
  {
    this.iAdminApiService
      .StorageContainerManagementUpdate(paylaod)
      .subscribe((res: ApiResponse<[]>) => {
        if(!res.isExecuted)
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      });
  }
}
  