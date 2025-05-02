import { Component} from '@angular/core';
import { AccessLevel, defaultEmployeeAccessLevels, defaultWorkstationSetup, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiResponse, UserSession, WorkStationSetup } from 'src/app/common/types/CommonTypes';

@Component({
  selector: 'app-wp-workstation-setup',
  templateUrl: './wp-workstation-setup.component.html',
  styleUrls: []
})
export class WpWorkstationSetupComponent  {

  public iAdminApiService: IAdminApiService;
  userData: UserSession;
  employeeAccessLevels = defaultEmployeeAccessLevels;
  workStationSetup = defaultWorkstationSetup;

  constructor(
    public authService: AuthService,
    public global: GlobalService,
    public adminApiService: AdminApiService
  ) {
    this.iAdminApiService = adminApiService;
    this.userData = authService.userData();
  }
  
  ngOnInit(): void {
    this.getAccessLevelByGroupFunctions();
    this.getWorkstationSetup();
  }
  
  public async getAccessLevelByGroupFunctions() {
    this.employeeAccessLevels = await this.iAdminApiService.AccessLevelByGroupFunctions(false);
  }
  public getWorkstationSetup() {    
    this.iAdminApiService.WorkstationSetupInfo().subscribe((res: ApiResponse<WorkStationSetup>) => {
      if (res.isExecuted && res.data) {
        this.workStationSetup = res.data;
        this.workStationSetup.storageContainer = this.userData.accessLevel?.toLowerCase() === AccessLevel.Administrator ? res.data.storageContainer : false;
        this.workStationSetup.locationControl = this.userData.accessLevel?.toLowerCase() === AccessLevel.Administrator ? res.data.locationControl : false;
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      }
    });
  }
}
