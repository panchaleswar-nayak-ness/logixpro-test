import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/common/init/auth.service';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { CMConsolidationPreferences, ToasterMessages, ToasterTitle, ToasterType ,StringConditions, Placeholders} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-preferences-consolidation',
  templateUrl: './preferences-consolidation.component.html',
  styleUrls: [],
})

export class PreferencesConsolidationComponent {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  ItemNumber: string = this.fieldMappings.itemNumber;
  UserField1:string = this.fieldMappings.userField1;
  placeholders = Placeholders;
  filtersForm: FormGroup;
  @Input() pref: any;
  userData: any;
  @Output() consolidationEvnt = new EventEmitter<void>();
  public IconsolidationAPI: IConsolidationApi;

  constructor(
    public consolidationAPI: ConsolidationApiService,
    private authService: AuthService,
    public global: GlobalService
  ) {
    this.userData = this.authService.userData();
    this.filtersForm = new FormGroup({
      defPackList: new FormControl(''),
      blindVerify: new FormControl(''),
      verifyEach: new FormControl(''),
      packingList: new FormControl(''),
      printUnVerified: new FormControl(''),
      printVerified: new FormControl(''),
      defLookType: new FormControl(''),
      backOrders: new FormControl(''),
      nonPickpro: new FormControl(''),
      emailPackSlip: new FormControl(''),
      validateStaingLocs: new FormControl(''),
    });
    this.IconsolidationAPI = consolidationAPI;
  }

  setPreferences(item) {
    this.filtersForm.controls[CMConsolidationPreferences.DefPackList].setValue(item.defaultPackingList);
    this.filtersForm.controls[CMConsolidationPreferences.BlindVerify].setValue(item.blindVerifyItems);
    this.filtersForm.controls[CMConsolidationPreferences.VerifyEach].setValue(item.verifyItems);
    this.filtersForm.controls[CMConsolidationPreferences.PackingList].setValue(item.packingListSort);
    this.filtersForm.controls[CMConsolidationPreferences.PrintUnVerified].setValue(item.printUnVerified);
    this.filtersForm.controls[CMConsolidationPreferences.PrintVerified].setValue(item.printVerified);
    this.filtersForm.controls[CMConsolidationPreferences.DefLookType].setValue(item.defaultLookupType);
    this.filtersForm.controls[CMConsolidationPreferences.BackOrders].setValue(item.autoCompBOShipComplete);
    this.filtersForm.controls[CMConsolidationPreferences.NonPickPro].setValue(item.stageNonPickProOrders);
    this.filtersForm.controls[CMConsolidationPreferences.EmailPackSlip].setValue(item.emailPickingSlip);
    this.filtersForm.controls[CMConsolidationPreferences.ValidateStaingLocs].setValue(item.validateStagingLocations);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pref'][StringConditions.currentValue]) {
      this.setPreferences(changes['pref'][StringConditions.currentValue])
    }
  }

  changePreferences() {
    this.updatePreferencesValues();
  }

  saveEmailSlip() {
    let payload = {
      emailPickSlip: this.filtersForm.controls[CMConsolidationPreferences.EmailPackSlip].value
        ? this.filtersForm.controls[CMConsolidationPreferences.EmailPackSlip].value
        : false
    };
    // Get the email slip data from the server
    this.IconsolidationAPI
      .SystemPreferenceEmailSlip(payload)
      .subscribe(
        // When the request has completed
        (response: any) => {
          // If the request was successful
          if (response.isExecuted) {
            // Show a success message
            this.global.ShowToastr(ToasterType.Success,response.responseMessage,ToasterTitle.Success);
          } else {
            // Show an error message
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorOccuredTryingToRemoveAll,ToasterTitle.Error);
          }
        }
      );
  }

  updatePreferencesValues() {
    let payload = {
      autoCompleteShip: this.filtersForm.controls[CMConsolidationPreferences.BackOrders].value,
      defPackList: this.filtersForm.controls[CMConsolidationPreferences.DefPackList].value,
      deffLookType: this.filtersForm.controls[CMConsolidationPreferences.DefLookType].value,
      verifyItems: this.filtersForm.controls[CMConsolidationPreferences.VerifyEach].value,
      blindVerify: this.filtersForm.controls[CMConsolidationPreferences.BlindVerify].value,
      printVerified: this.filtersForm.controls[CMConsolidationPreferences.PrintVerified].value,
      printUnVerified: this.filtersForm.controls[CMConsolidationPreferences.PrintUnVerified].value,
      packingListSort: this.filtersForm.controls[CMConsolidationPreferences.PackingList].value,
      nonPickpro: this.filtersForm.controls[CMConsolidationPreferences.NonPickPro].value.toString(),
      validateStaingLocs: this.filtersForm.controls[CMConsolidationPreferences.ValidateStaingLocs].value.toString()
    };
    this.IconsolidationAPI
      .ConsolidationPreferenceUpdate(payload)
      .subscribe(
        (response: any) => {
          if (response.isExecuted) {
            this.consolidationEvnt.emit();
          } else {
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorOccuredTryingToRemoveAll,ToasterTitle.Error);
          }
        }
      );
  }
}
