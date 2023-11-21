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
import { CMShippingPreferences, ToasterMessages, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-preferences-shipping',
  templateUrl: './preferences-shipping.component.html',
  styleUrls: [],
})
export class PreferencesShippingComponent implements OnInit {
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
    if (changes['shippingData']['currentValue']) {
      this.setPreferences(changes['shippingData']['currentValue']);
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
      width: '600px',
      autoFocus: '__non_existing_element__',
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
