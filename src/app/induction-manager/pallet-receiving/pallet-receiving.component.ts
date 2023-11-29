import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/common/init/auth.service';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { ToasterMessages, ToasterTitle, ToasterType, showNotificationHeading, showNotificationMessage ,DialogConstants,Style} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-pallet-receiving',
  templateUrl: './pallet-receiving.component.html',
  styleUrls: ['./pallet-receiving.component.scss'],
})
export class PalletReceivingComponent implements OnInit {
  processForm: FormGroup;
  userData;
  toteIDCrossBtn;
  itemNoCrossBtn;
  public iInductionManagerApi:IInductionManagerApiService;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;
  constructor(
    public inductionManagerApi : InductionManagerApiService,
    private authService: AuthService,
    public global:GlobalService,
    
  ) {
    this.iInductionManagerApi = inductionManagerApi;
    this.processForm = new FormGroup({
      toteID: new FormControl('', Validators.required),
      itemNo: new FormControl('', Validators.required),
      quantity: new FormControl(0, Validators.required),
    });
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }

  async processPallet() {
    if (
      this.processForm.value.toteID === '' ||
      this.processForm.value.itemNo === '' ||
      this.processForm.value.quantity === ''
    ) {
      this.showNotification(
        showNotificationHeading.FieldsMissing,
        showNotificationMessage.FieldsFill
      );
    } else if (this.processForm.value.quantity <= 0) {
      this.showNotification(
        showNotificationHeading.InvalidQuantity,
        showNotificationMessage.InvalidQuantity
      );
    } else {
      // validate Tote
      let payloadTote = {
        toteID: this.processForm.value.toteID,
      };
      this.iInductionManagerApi
        .ValidateTote(payloadTote) //validate tote
        .subscribe((response: any) => {
          if (response.data) {
            let payloadItem = {
              item: this.processForm.value.itemNo
            };
            this.iInductionManagerApi
              .ValidateItem(payloadItem) //validate item number
              .subscribe((response: any) => {
                if (response.data) {
                  // if item number is valid process pallet
                  let payload = {
                    toteId: this.processForm.value.toteID,
                    itemNumber: this.processForm.value.itemNo,
                    quantity: this.processForm.value.quantity, 
                  };
                  this.iInductionManagerApi
                    .ProcessPallet(payload)
                    .subscribe((response: any) => {
                      if (response.isExecuted) {
                        this.global.ShowToastr(ToasterType.Success,
                          ToasterMessages.PalletProcessed,
                          ToasterTitle.Success 
                        );

                        this.resetForm();
                      } else {
                        this.global.ShowToastr(ToasterType.Error,
                          ToasterMessages.ErrorOccuredPalletSetup,
                          ToasterType.Error
                        );
                      }
                    });
                } else {
                  this.showNotification(
                    showNotificationHeading.InvalidItemEntered,
                    showNotificationMessage.ItemNotExists
                  );
                }
              });
          } else {
            this.showNotification(
              showNotificationHeading.InvalidToteEntered,
              showNotificationMessage.ToteAlreadyExists
            );
            console.log("ValidateTote");
          }
        });
    }
  }

  resetForm() {
    this.processForm.reset();
    this.processForm.get('quantity')?.setValue(0);
    Object.keys(this.processForm.controls).forEach((key) => {
      this.processForm.get(key)?.setErrors(null);
      this.processForm.get(key)?.markAsPristine();
      this.processForm.get(key)?.markAsUntouched();
    });
  }

  showNotification(heading, message) {
    const dialogRef:any = this.global.OpenDialog(AlertConfirmationComponent, {
      height: 'auto',
      width: Style.w786px,
      data: {
        message: message,
        heading: heading,
        disableCancel: true,
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  ngAfterViewInit() {
    this.searchBoxField?.nativeElement.focus();
  }
}
