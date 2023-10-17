import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
 
import { AuthService } from 'src/app/init/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IInductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { InductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api.service';
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
    public Api: ApiFuntions,
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
        'Fields Missing',
        'Not all the fields were filled out. Please fill them out'
      );
    } else if (this.processForm.value.quantity <= 0) {
      this.showNotification(
        'Invalid Quantity',
        'An invalid quantity was entered. Please enter a quantity greater than 0'
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
                        this.global.ShowToastr('success',
                          'Pallet was processed',
                          'Success!' 
                        );

                        this.resetForm();
                      } else {
                        this.global.ShowToastr('error',
                          'An error occurred processing this pallet setup',
                          'Error!' 
                        );
                      }
                    });
                } else {
                  this.showNotification(
                    'Invalid Item Entered',
                    'This item does not exist in Inventory'
                  );
                }
              });
          } else {
            this.showNotification(
              'Invalid Tote Entered',
              'This tote id already exists in Open Transactions'
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
      width: '786px',
      data: {
        message: message,
        heading: heading,
        disableCancel: true,
      },
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((result) => {});
  }
  ngAfterViewInit() {
    this.searchBoxField.nativeElement.focus();
  }
}
