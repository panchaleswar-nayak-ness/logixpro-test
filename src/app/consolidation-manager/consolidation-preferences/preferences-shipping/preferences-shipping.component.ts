import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CmShippingCarrierComponent } from 'src/app/dialogs/cm-shipping-carrier/cm-shipping-carrier.component';
import { AuthService } from 'src/app/common/init/auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { CMShippingPreferences, ToasterMessages, ToasterTitle, ToasterType ,StringConditions,DialogConstants,Style, Placeholders} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-preferences-shipping',
  templateUrl: './preferences-shipping.component.html',
  styleUrls: ['./preferences-shipping.component.scss'],
})
export class PreferencesShippingComponent implements OnInit {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  UserField1:string = this.fieldMappings.userField1;
  UserField2:string = this.fieldMappings.userField2;
  UserField3:string = this.fieldMappings.userField3;
  UserField4:string = this.fieldMappings.userField4;
  UserField5:string = this.fieldMappings.userField5;
  UserField6:string = this.fieldMappings.userField6;
  UserField7:string = this.fieldMappings.userField7;
  UserField8:string = this.fieldMappings.userField8;
  UserField9:string = this.fieldMappings.userField9;
  UserField10:string = this.fieldMappings.userField10;
  placeholders = Placeholders;
  shippingForm: FormGroup;
  selectionShipping: boolean = false;
  selectionPacking: boolean = false;
  selectionConfirmPacking: boolean = false;
  searchByInput: any = new Subject<string>();
  @Input() shippingData: any;
  @Output() shippingEvnt = new EventEmitter<void>();
  userData: any;
  public IconsolidationAPI: IConsolidationApi;

  constructor(
    public consolidationAPI: ConsolidationApiService,
    private authService: AuthService,
    public global: GlobalService
  ) {
    this.userData = this.authService.userData();
    this.shippingForm = new FormGroup({
      allowShip: new FormControl(''),
      freight: new FormControl(''),
      freight1: new FormControl(''),
      freight2: new FormControl(''),
      weight: new FormControl(''),
      length: new FormControl(''),
      width: new FormControl(''),
      height: new FormControl(''),
      cube: new FormControl(''),
      allowPack: new FormControl(''),
      confirmPack: new FormControl(''),
      printCont: new FormControl(''),
      printOrd: new FormControl(''),
      printContLabel: new FormControl(''),
      contID: new FormControl(''),
      confirmQTY: new FormControl(''),
      contIDText: new FormControl(''),
      userField1: new FormControl(''),
      userField2: new FormControl(''),
      userField3: new FormControl(''),
      userField4: new FormControl(''),
      userField5: new FormControl(''),
      userField6: new FormControl(''),
      userField7: new FormControl(''),
      userField_1_Alias: new FormControl(''),
      userField_2_Alias: new FormControl(''),
      userField_3_Alias: new FormControl(''),
      userField_4_Alias: new FormControl(''),
      userField_5_Alias: new FormControl(''),
      userField_6_Alias: new FormControl(''),
      userField_7_Alias: new FormControl(''),
    });
    this.IconsolidationAPI = consolidationAPI;
  }

  ngOnInit(): void {
    this.searchByInput
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.shippingForm.controls[CMShippingPreferences.ContIDText].setValue(value);
        this.saveShippingPreferences();
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['shippingData'][StringConditions.currentValue]) {
      this.setPreferences(changes['shippingData'][StringConditions.currentValue]);
    }
  }

  setPreferences(item) {
    this.shippingForm.controls[CMShippingPreferences.AllowShip].setValue(item.shipping);
    this.shippingForm.controls[CMShippingPreferences.AllowPack].setValue(item.packing);
    this.shippingForm.controls[CMShippingPreferences.PrintCont].setValue(item.autoPrintContPL);
    this.shippingForm.controls[CMShippingPreferences.PrintOrd].setValue(item.autoPrintOrderPL);
    this.shippingForm.controls[CMShippingPreferences.PrintContLabel].setValue(item.autoPrintContLabel);
    this.shippingForm.controls[CMShippingPreferences.ContIDText].setValue(item.containerIDDefault);
    this.shippingForm.controls[CMShippingPreferences.ContID].setValue(item.enterContainerID);
    this.shippingForm.controls[CMShippingPreferences.ConfirmPack].setValue(item.confirmAndPacking);
    this.shippingForm.controls[CMShippingPreferences.ConfirmQTY].setValue(item.confirmAndPackingConfirmQuantity);
    this.shippingForm.controls[CMShippingPreferences.Freight].setValue(item.freight);
    this.shippingForm.controls[CMShippingPreferences.Freight1].setValue(item.freight1);
    this.shippingForm.controls[CMShippingPreferences.Freight2].setValue(item.freight2);
    this.shippingForm.controls[CMShippingPreferences.Weight].setValue(item.weight);
    this.shippingForm.controls[CMShippingPreferences.Length].setValue(item.length);
    this.shippingForm.controls[CMShippingPreferences.Width].setValue(item.width);
    this.shippingForm.controls[CMShippingPreferences.Height].setValue(item.height);
    this.shippingForm.controls[CMShippingPreferences.Cube].setValue(item.cube);
    this.shippingForm.controls[CMShippingPreferences.userField1].setValue(item.userField1);
    this.shippingForm.controls[CMShippingPreferences.userField2].setValue(item.userField2);
    this.shippingForm.controls[CMShippingPreferences.userField3].setValue(item.userField3);
    this.shippingForm.controls[CMShippingPreferences.userField4].setValue(item.userField4);
    this.shippingForm.controls[CMShippingPreferences.userField5].setValue(item.userField5);
    this.shippingForm.controls[CMShippingPreferences.userField6].setValue(item.userField6);
    this.shippingForm.controls[CMShippingPreferences.userField7].setValue(item.userField7);
    this.shippingForm.controls[CMShippingPreferences.userField_1_Alias].setValue(item.userField1Alias);
    this.shippingForm.controls[CMShippingPreferences.userField_2_Alias].setValue(item.userField2Alias);
    this.shippingForm.controls[CMShippingPreferences.userField_3_Alias].setValue(item.userField3Alias);
    this.shippingForm.controls[CMShippingPreferences.userField_4_Alias].setValue(item.userField4Alias);
    this.shippingForm.controls[CMShippingPreferences.userField_5_Alias].setValue(item.userField5Alias);
    this.shippingForm.controls[CMShippingPreferences.userField_6_Alias].setValue(item.userField6Alias);
    this.shippingForm.controls[CMShippingPreferences.userField_7_Alias].setValue(item.userField7Alias);

    if (item.packing && item.confirmAndPacking) {
      this.selectionPacking = true;
      this.selectionConfirmPacking = true;
      this.selectionConfirmPacking = true;
    } else if (item.packing && !item.confirmAndPacking) {
      this.selectionPacking = true;
      this.selectionConfirmPacking = true;
      this.selectionConfirmPacking = false;
    } else {
      this.selectionPacking = false;
      this.selectionConfirmPacking = false;
      this.selectionConfirmPacking = false;
    }

    if (item.shipping) {
      this.selectionShipping = true;
    } else {
      this.selectionShipping = false;
    }
  }

  openCarrier() {
    this.global.OpenDialog(CmShippingCarrierComponent, {
      height: 'auto',
      width: Style.w600px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        mode: 'delete-create-count',
        actionMessage: ``,
      },
    });
  }

  saveShippingPreferences() {
    let payload = {
      packing: this.shippingForm.controls[CMShippingPreferences.AllowPack].value,
      confirmPack: this.shippingForm.controls[CMShippingPreferences.ConfirmPack].value,
      printContPL: this.shippingForm.controls[CMShippingPreferences.PrintCont].value,
      printOrderPL: this.shippingForm.controls[CMShippingPreferences.PrintOrd].value,
      printContLabel: this.shippingForm.controls[CMShippingPreferences.PrintContLabel].value,
      entContainerID: this.shippingForm.controls[CMShippingPreferences.ContID]?.value,
      containerIDDEF: this.shippingForm.controls[CMShippingPreferences.ContIDText].value,
      confPackQuant: this.shippingForm.controls[CMShippingPreferences.ConfirmQTY].value,
      freight: this.shippingForm.controls[CMShippingPreferences.Freight].value,
      freight1: this.shippingForm.controls[CMShippingPreferences.Freight1].value,
      freight2: this.shippingForm.controls[CMShippingPreferences.Freight2].value,
      weight: this.shippingForm.controls[CMShippingPreferences.Weight].value,
      length: this.shippingForm.controls[CMShippingPreferences.Length].value,
      width: this.shippingForm.controls[CMShippingPreferences.Width].value,
      height: this.shippingForm.controls[CMShippingPreferences.Height].value,
      cube: this.shippingForm.controls[CMShippingPreferences.Cube].value,
      userField1: this.shippingForm.controls[CMShippingPreferences.userField1].value,
      userField2: this.shippingForm.controls[CMShippingPreferences.userField2].value,
      userField3: this.shippingForm.controls[CMShippingPreferences.userField3].value,
      userField4: this.shippingForm.controls[CMShippingPreferences.userField4].value,
      userField5: this.shippingForm.controls[CMShippingPreferences.userField5].value,
      userField6: this.shippingForm.controls[CMShippingPreferences.userField6].value,
      userField7: this.shippingForm.controls[CMShippingPreferences.userField7].value,
      userField_1_Alias: this.shippingForm.controls[CMShippingPreferences.userField_1_Alias].value,
      userField_2_Alias: this.shippingForm.controls[CMShippingPreferences.userField_2_Alias].value,
      userField_3_Alias: this.shippingForm.controls[CMShippingPreferences.userField_3_Alias].value,
      userField_4_Alias: this.shippingForm.controls[CMShippingPreferences.userField_4_Alias].value,
      userField_5_Alias: this.shippingForm.controls[CMShippingPreferences.userField_5_Alias].value,
      userField_6_Alias: this.shippingForm.controls[CMShippingPreferences.userField_6_Alias].value,
      userField_7_Alias: this.shippingForm.controls[CMShippingPreferences.userField_7_Alias].value,
      shipping: this.shippingForm.controls[CMShippingPreferences.AllowShip]?.value
    };
    this.IconsolidationAPI
      .ConsolidationPreferenceShipUpdate(payload)
      .subscribe((response: any) => {
        this.shippingEvnt.emit();
        if (!response.isExecuted) {
          this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorWhileSave,ToasterTitle.Error);
          console.log("ConsolidationPreferenceShipUpdate", response.responseMessage);
        }
      });
  }

  toggleAllowPackage() {
    this.selectionPacking = !this.selectionPacking;
    if (!this.selectionPacking) {
      this.selectionConfirmPacking = false;
      this.shippingForm.controls[CMShippingPreferences.ConfirmPack].setValue(false);
    } else if (this.selectionPacking) {
      this.selectionConfirmPacking = true;
    }
    this.toggleConfirmPackage();
    this.saveShippingPreferences();
  }

  toggleAllowShip() {
    this.selectionShipping = !this.selectionShipping;
    this.saveShippingPreferences();
  }

  toggleConfirmPackage() {
    this.selectionConfirmPacking = !this.selectionConfirmPacking;
    if (!this.selectionConfirmPacking) {
      this.shippingForm.controls[CMShippingPreferences.PrintCont].setValue(false);
      this.shippingForm.controls[CMShippingPreferences.PrintOrd].setValue(false);
      this.shippingForm.controls[CMShippingPreferences.PrintContLabel].setValue(false);
      this.shippingForm.controls[CMShippingPreferences.ContID].setValue(false);
      this.shippingForm.controls[CMShippingPreferences.ConfirmQTY].setValue(false);
      this.shippingForm.controls[CMShippingPreferences.ContIDText].setValue('');
    }
    this.saveShippingPreferences();
  }
}
