import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { CmShippingCarrierComponent } from 'src/app/dialogs/cm-shipping-carrier/cm-shipping-carrier.component'; 
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

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
  constructor(
    private Api: ApiFuntions,
    private toastr: ToastrService,
    private authService: AuthService,
    public dialog: MatDialog
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
  }

  ngOnInit(): void {
    this.searchByInput
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.shippingForm.controls['contIDText'].setValue(value);
        this.saveShippingPreferences();
      });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['shippingData']['currentValue']) {
      this.setPreferences(changes['shippingData']['currentValue']);
    }
  }

  setPreferences(item) {
    this.shippingForm.controls['allowShip'].setValue(item.shipping);
    this.shippingForm.controls['allowPack'].setValue(item.packing);
    this.shippingForm.controls['printCont'].setValue(item.autoPrintContPL);
    this.shippingForm.controls['printOrd'].setValue(item.autoPrintOrderPL);
    this.shippingForm.controls['printContLabel'].setValue(
      item.autoPrintContLabel
    );
    this.shippingForm.controls['contIDText'].setValue(item.containerIDDefault);
    this.shippingForm.controls['contID'].setValue(item.enterContainerID);
    this.shippingForm.controls['confirmPack'].setValue(item.confirmAndPacking);
    this.shippingForm.controls['confirmQTY'].setValue(
      item.confirmAndPackingConfirmQuantity
    );
    this.shippingForm.controls['freight'].setValue(item.freight);
    this.shippingForm.controls['freight1'].setValue(item.freight1);
    this.shippingForm.controls['freight2'].setValue(item.freight2);
    this.shippingForm.controls['weight'].setValue(item.weight);
    this.shippingForm.controls['length'].setValue(item.length);
    this.shippingForm.controls['width'].setValue(item.width);
    this.shippingForm.controls['height'].setValue(item.height);
    this.shippingForm.controls['cube'].setValue(item.cube);


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
    const dialogRef = this.dialog.open(CmShippingCarrierComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete-create-count',
        actionMessage: ``,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {});
  }

  saveShippingPreferences() {
    let payload = {
      packing: this.shippingForm.controls['allowPack'].value,
      confirmPack: this.shippingForm.controls['confirmPack'].value,
      printContPL: this.shippingForm.controls['printCont'].value,
      printOrderPL: this.shippingForm.controls['printOrd'].value,
      printContLabel: this.shippingForm.controls['printContLabel'].value,
      entContainerID: this.shippingForm.controls['contID']?.value,
      containerIDDEF: this.shippingForm.controls['contIDText'].value,
      confPackQuant: this.shippingForm.controls['confirmQTY'].value,
      freight: this.shippingForm.controls['freight'].value,
      freight1: this.shippingForm.controls['freight1'].value,
      freight2: this.shippingForm.controls['freight2'].value,
      weight: this.shippingForm.controls['weight'].value,
      length: this.shippingForm.controls['length'].value,
      width: this.shippingForm.controls['width'].value,
      height: this.shippingForm.controls['height'].value,
      cube: this.shippingForm.controls['cube'].value,
      shipping: this.shippingForm.controls['allowShip']?.value,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .ConsolidationPreferenceShipUpdate(payload)
      .subscribe((response: any) => {
        this.shippingEvnt.emit();
        if (!response.isExecuted) {
          this.toastr.error('Error', 'An Error Occured while trying to save', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      });
  }

  toggleAllowPackage() {
    this.selectionPacking = !this.selectionPacking;

    if (!this.selectionPacking) {
      this.selectionConfirmPacking = false;
      this.shippingForm.controls['confirmPack'].setValue(false);
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
      this.shippingForm.controls['printCont'].setValue(false);
      this.shippingForm.controls['printOrd'].setValue(false);
      this.shippingForm.controls['printContLabel'].setValue(false);
      this.shippingForm.controls['contID'].setValue(false);
      this.shippingForm.controls['confirmQTY'].setValue(false);
      this.shippingForm.controls['contIDText'].setValue('');
    }
    this.saveShippingPreferences();
  }
}
