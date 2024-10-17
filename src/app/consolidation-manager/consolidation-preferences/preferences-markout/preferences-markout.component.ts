import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StringConditions, ToasterMessages, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { AuthService } from 'src/app/common/init/auth.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { CmPreferences, UserSession } from 'src/app/common/types/CommonTypes';

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
    });
    this.IconsolidationAPI = consolidationAPI;
  }

  setPreferences(item) {
    this.markoutForm.controls['defaultViewType'].setValue(item.defaultViewType);
    this.markoutForm.controls['autoPrintMarkoutReport'].setValue(item.autoPrintMarkoutReport);
    this.markoutForm.controls['autoPrintToteManifest'].setValue(item.autoPrintToteManifest);
    this.markoutForm.controls['autoPrintToteManifest2'].setValue(item.autoPrintToteManifest2);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pref'][StringConditions.currentValue]) {
      this.setPreferences(changes['pref'][StringConditions.currentValue])
    }
  }

  updateMarkoutPreferences() {
    let payload = {
      defaultViewType: this.markoutForm.controls['defaultViewType'].value.toString(),
      autoPrintMarkoutReport: this.markoutForm.controls['autoPrintMarkoutReport'].value,
      autoPrintToteManifest: this.markoutForm.controls['autoPrintToteManifest'].value,
      autoPrintToteManifest2: this.markoutForm.controls['autoPrintToteManifest2'].value,
    };
    this.IconsolidationAPI
      .ConsolidationPreferenceMarkoutUpdate(payload)
      .subscribe(
        (response: any) => {
          if (response.isExecuted) {
            this.markoutEvnt.emit();
          } else {
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorOccuredTryingToRemoveAll,ToasterTitle.Error);
          }
        }
      );
  }

}
