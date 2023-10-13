import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
 
import { AuthService } from 'src/app/init/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { ConsolidationApiService } from 'src/app/services/consolidation-api/consolidation-api.service';
import { IConsolidationApi } from 'src/app/services/consolidation-api/consolidation-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-preferences-consolidation',
  templateUrl: './preferences-consolidation.component.html',
  styleUrls: [],
})
export class PreferencesConsolidationComponent {
  filtersForm: FormGroup;
  @Input() pref: any;
  userData: any;
  @Output() consolidationEvnt= new EventEmitter<void>();

  public IconsolidationAPI : IConsolidationApi;

  constructor(
    public consolidationAPI : ConsolidationApiService,
    // private Api: ApiFuntions,
    
    private authService: AuthService,
    public global:GlobalService
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
           this.filtersForm.controls['defPackList'].setValue(item.defaultPackingList);
          this.filtersForm.controls['blindVerify'].setValue(item.blindVerifyItems);
          this.filtersForm.controls['verifyEach'].setValue(item.verifyItems);
          this.filtersForm.controls['packingList'].setValue(item.packingListSort);
          this.filtersForm.controls['printUnVerified'].setValue(item.printUnVerified);
          this.filtersForm.controls['printVerified'].setValue(item.printVerified);
          this.filtersForm.controls['defLookType'].setValue(item.defaultLookupType);
          this.filtersForm.controls['backOrders'].setValue(item.autoCompBOShipComplete);
          this.filtersForm.controls['nonPickpro'].setValue(item.stageNonPickProOrders);
          this.filtersForm.controls['emailPackSlip'].setValue(item.emailPickingSlip);
          this.filtersForm.controls['validateStaingLocs'].setValue(item.validateStagingLocations);
         
  }
  
  ngOnChanges(changes: SimpleChanges) { 
    if (changes['pref']['currentValue']) {
      this.setPreferences(changes['pref']['currentValue'])
    }
  }
  changePreferences() {
    this.updatePreferencesValues();
  }

  saveEmailSlip() {
    let payload = {
      emailPickSlip: this.filtersForm.controls['emailPackSlip'].value
        ? this.filtersForm.controls['emailPackSlip'].value
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
        this.global.ShowToastr('success',response.responseMessage, 'Success!');

      } else {
        // Show an error message
        this.global.ShowToastr('error',
          'Error',
          'An Error Occured while trying to remove all data, check the event log for more information'
        );
      }
    },
        (error) => {}
      );
  }
  updatePreferencesValues() {
    let payload = {
      autoCompleteShip: this.filtersForm.controls['backOrders'].value,
      defPackList: this.filtersForm.controls['defPackList'].value,
      deffLookType: this.filtersForm.controls['defLookType'].value,
      verifyItems: this.filtersForm.controls['verifyEach'].value,
      blindVerify: this.filtersForm.controls['blindVerify'].value,
      printVerified: this.filtersForm.controls['printVerified'].value,
      printUnVerified: this.filtersForm.controls['printUnVerified'].value,
      packingListSort: this.filtersForm.controls['packingList'].value,
      nonPickpro: this.filtersForm.controls['nonPickpro'].value.toString(),
      validateStaingLocs: this.filtersForm.controls['validateStaingLocs'].value.toString()
    };
    this.IconsolidationAPI
      .ConsolidationPreferenceUpdate(payload)
      .subscribe(
        (response: any) => {
          if (response.isExecuted) {
            this.consolidationEvnt.emit();
          } else {
            this.global.ShowToastr('error',
              'Error',
              'An Error Occured while trying to remove all data, check the event log for more information'
            );
          }
        },
        (error) => {}
      );
  }
}
