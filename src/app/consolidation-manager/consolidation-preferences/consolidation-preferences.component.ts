import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/init/auth.service';
import { Subscription } from 'rxjs';
import { CmCarriersAddDeleteEditComponent } from 'src/app/dialogs/cm-carriers-add-delete-edit/cm-carriers-add-delete-edit.component';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType ,DialogConstants} from 'src/app/common/constants/strings.constants';
import { CmPreferences, UserSession } from 'src/app/common/types/CommonTypes';

interface Response {
  data: {
    cmPreferences: CmPreferences
  };
  responseMessage: string;
  isExecuted: boolean;
}

@Component({
  selector: 'app-consolidation-preferences',
  templateUrl: './consolidation-preferences.component.html',
  styleUrls: [],
})
export class ConsolidationPreferencesComponent implements OnInit {

  userData: UserSession;
  preferencesData: CmPreferences;
  private subscription: Subscription = new Subscription();
  public IconsolidationAPI: IConsolidationApi;

  constructor(
    public consolidationAPI: ConsolidationApiService,
    private authService: AuthService,
    public global: GlobalService
  ) {
    this.userData = this.authService.userData();
    this.IconsolidationAPI = consolidationAPI;
  }

  openCmCarriers() {
    this.global.OpenDialog(CmCarriersAddDeleteEditComponent, {
      height: 'auto',
      width: '720px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    })
  }

  ngOnInit(): void {
    this.getPreferences();
  }

  getPreferences() {
    let payload = {
      type: '',
      value: ''
    };
    this.IconsolidationAPI
      .ConsoleDataSB(payload)
      .subscribe((res : Response) => {
        if (res.isExecuted) this.preferencesData = res.data.cmPreferences;
        else this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
