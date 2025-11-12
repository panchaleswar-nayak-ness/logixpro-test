import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StringConditions, ToasterMessages, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { AuthService } from 'src/app/common/init/auth.service';
import { ResponseData } from 'src/app/common/interface/Iemployee';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiResponse, CmPreferences, UserSession } from 'src/app/common/types/CommonTypes';

interface Config {
  defaultViewType: string; 
  autoPrintMarkoutReport: boolean;
  autoPrintToteManifest: boolean;
  autoPrintToteManifest2: boolean;
  decInvOnCompletion: boolean;
  currentStatus: boolean;
  missed: boolean;
  short: boolean;
  shipShort: boolean;
  complete: boolean;
  notInducted: boolean;
}
@Component({
  selector: 'app-preferences-markout',
  templateUrl: './preferences-markout.component.html',
  styleUrls: ['./preferences-markout.component.scss']
})


export class PreferencesMarkoutComponent {

  markoutForm: FormGroup;
  @Input() pref: CmPreferences;
  userData: UserSession;
  @Output() markoutEvnt = new EventEmitter<void>();
  public IconsolidationAPI: IConsolidationApi;

  constructor(public consolidationAPI: ConsolidationApiService,
              private authService: AuthService,
              public global: GlobalService
            ) { 
    this.userData = this.authService.userData();
    this.markoutForm = new FormGroup({
      defaultViewType: new FormControl(''),
      autoPrintMarkoutReport: new FormControl(false),
      autoPrintToteManifest: new FormControl(false),
      autoPrintToteManifest2: new FormControl(false),
      decInvOnCompletion: new FormControl(false),
      currentStatus:new FormControl(false),
      short: new FormControl(false),
      missed: new FormControl(false),
      shipShort:new FormControl(false),
      complete:new FormControl(false),
      notInducted:new FormControl(false)
    });
    this.IconsolidationAPI = consolidationAPI;
  }

  setPreferences(item) {
    this.markoutForm.controls['defaultViewType'].setValue(item.defaultViewType);
    this.markoutForm.controls['autoPrintMarkoutReport'].setValue(item.autoPrintMarkoutReport);
    this.markoutForm.controls['autoPrintToteManifest'].setValue(item.autoPrintToteManifest);
    this.markoutForm.controls['autoPrintToteManifest2'].setValue(item.autoPrintToteManifest2);
    this.markoutForm.controls['decInvOnCompletion'].setValue(item.decInvOnCompletion);
    this.markoutForm.controls['currentStatus'].setValue(item.currentStatus);
    this.markoutForm.controls['short'].setValue(item.short);
    this.markoutForm.controls['missed'].setValue(item.missed);
    this.markoutForm.controls['complete'].setValue(item.complete);
    this.markoutForm.controls['shipShort'].setValue(item.shipShort);
    this.markoutForm.controls['notInducted'].setValue(item.notInducted);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pref'] && changes['pref'].currentValue) {
      this.setPreferences(changes['pref'].currentValue);
    }
  }

  updateMarkoutPreferences() {
    let payload = {
      defaultViewType: this.markoutForm.controls['defaultViewType'].value.toString(),
      autoPrintMarkoutReport: this.markoutForm.controls['autoPrintMarkoutReport'].value,
      autoPrintToteManifest: this.markoutForm.controls['autoPrintToteManifest'].value,
      autoPrintToteManifest2: this.markoutForm.controls['autoPrintToteManifest2'].value,
      decInvOnCompletion: this.markoutForm.controls['decInvOnCompletion'].value,
      currentStatus: this.markoutForm.controls['currentStatus'].value,
      short: this.markoutForm.controls['short'].value,
      missed: this.markoutForm.controls['missed'].value,
      shipShort: this.markoutForm.controls['shipShort'].value,
      complete: this.markoutForm.controls['complete'].value,
      notInducted:  this.markoutForm.controls['notInducted'].value,
    };
    this.IconsolidationAPI
      .ConsolidationPreferenceMarkoutUpdate(payload)
      .subscribe(
        (response: ApiResponse<Config>) => {
          if (response.isExecuted) {
            this.markoutEvnt.emit();
          } else {
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorOccuredTryingToRemoveAll,ToasterTitle.Error);
          }
        }
      );
  }

}
