import { Component, HostListener, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef} from '@angular/material/dialog';
import { AuthService } from 'src/app/common/init/auth.service';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { ToasterMessages, ToasterTitle, ResponseStrings, KeyboardKeys, ToasterType, showNotificationHeading, UniqueConstants, showNotificationMessage ,DialogConstants,Style, Placeholders} from 'src/app/common/constants/strings.constants';
import { SelectionTransactionForToteComponent } from 'src/app/dialogs/selection-transaction-for-tote/selection-transaction-for-tote.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { ApiResponse, ColumnAlias } from 'src/app/common/types/CommonTypes';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { MatPaginator } from '@angular/material/paginator';

export interface PeriodicElement {
  position: string;
}

@Component({
  selector: 'app-pallet-receiving',
  templateUrl: './pallet-receiving.component.html',
  styleUrls: ['./pallet-receiving.component.scss'],
})
export class PalletReceivingComponent implements OnInit {
  zone : string;
  processForm: FormGroup;
  userData;
  toteIDCrossBtn;
  itemNoCrossBtn;
  placeholders = Placeholders;
  public iInductionManagerApi:IInductionManagerApiService;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;
  formValues: any;
  
  constructor(
    public inductionManagerApi : InductionManagerApiService,
    private authService: AuthService,
    public global:GlobalService,
    public adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<SelectionTransactionForToteComponent>,
    private dialog: MatDialog // Inject MatDialog service
  ) {
    this.iInductionManagerApi = inductionManagerApi;
    this.iAdminApiService = adminApiService;
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('quantityInput') quantityInput!: ElementRef;
  
  ifAllowed: boolean = false
  @ViewChild('inputVal') inputVal: ElementRef;
  inputType: string = "Any";
  toteForm : FormGroup;
  toteID: string;
  batchId2: string = '';
  batchId: string = '';
  assignedZones: string = '';
  status: string = 'Not Processed';
  applyStrip:any;
  stripSide:any;
  inputValue: string = "";
  stripLength:any;
  dataSource2: any= new MatTableDataSource<any>([]);
  processPutAwayIndex: any;
  fieldNames: ColumnAlias;
  imPreferences: any;
  autoAssignAllZones: any;
  currentToteID: number = 0;
  public iAdminApiService: IAdminApiService;
  cellSize: string = '0';
  autoPutToteIDS: boolean = false;
  pickBatchQuantity: number = 0;
  selectedIndex: number = 0;
  searchAutocompleteItemNum2: any = [];
  ELEMENT_DATA = [{ position: 0, cells: '', toteid: '', locked: '' }];
  dataSource: any;
  tote: any;
  toteQuantity: any;
  [key: string]: any; 
  assignedZonesArray: { zone: string }[] = [{ zone: '' }];

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getCurrentToteID();
    this.OSFieldFilterNames();
    this.processForm = new FormGroup({
      toteID: new FormControl('', Validators.required),
      itemNo: new FormControl('', Validators.required),
      quantity: new FormControl(0, Validators.required),
      lotNumber: new FormControl(''),
      expirationDate: new FormControl(' '),
      id: new FormControl(' '),
      orgQty: new FormControl(0),
    });
    this.getProcessPutAwayIndex();
  }

  @HostListener('window:beforeunload', [UniqueConstants.event])
  onbeforeunload(event) {
    if (this.ifAllowed) {
      event.preventDefault();
      event.returnValue = false;
    }
  }

  public OSFieldFilterNames() {
    this.clearFieldNames();
    this.iAdminApiService.ColumnAlias().subscribe((res: ApiResponse<ColumnAlias>) => {
      if (res.isExecuted && res.data) this.fieldNames = res.data
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ColumnAlias", res.responseMessage);
      }
    })
  }
  
  getCurrentToteID() {
    this.iInductionManagerApi.NextTote().subscribe(
      (res: ApiResponse<number>) => {
        if (res.data && res.isExecuted) this.currentToteID = res.data
        else {
          // this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("NextTote", res.responseMessage);
        }
      
      },
      (error) => { }
    );
  }

  IMPreferences:any;
  getProcessPutAwayIndex() {
    this.iInductionManagerApi.ProcessPutAwayIndex().subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          this.IMPreferences =  res.data.imPreference;
          this.cellSize = res.data.imPreference.defaultCells;
          this.autoPutToteIDS = res.data.imPreference.autoPutAwayToteID;
          this.pickBatchQuantity = res.data.imPreference.pickBatchQuantity;
          this.processPutAwayIndex = res.data;
          this.inputType = res.data.imPreference.defaultPutAwayScanType;
          this.applyStrip = res.data.imPreference.stripScan
          this.stripLength = res.data.imPreference.stripNumber
          this.stripSide = res.data.imPreference.stripSide
          if (res.data.batchIDs) {
            this.batchId = res.data.batchIDs;
            this.selectedIndex = 1;
            this.batchId2 = res.data.batchIDs;
            // this.fillToteTable(res.data.batchIDs);
              this.inputVal.nativeElement.focus();
              this.autocompleteSearchColumnItem2();
          }
        } 
        else {
          this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("ProcessPutAwayIndex",res.responseMessage);
        }
      },
      (error) => { }
    );
  }

  selectionChanged(value: any) {
    this.inputType = value;
  }

  clearFieldNames() {
    this.fieldNames = {
      itemNumber: '',
      unitOfMeasure: '',
      userField1: '',
      userField2: '',
      userField3: '',
      userField4: '',
      userField5: '',
      userField6: '',
      userField7: '',
      userField8: '',
      userField9: '',
      userField10: ''
    }
  }

  openST(event: any) {
    if (event.key === KeyboardKeys.Enter){
      this.inputValue = event.target.value;    
      this.openSelectionTransactionDialogue();
  }
  else this.global.ShowToastr(ToasterType.Error,`Invalid Item Entered. This Item does not exist as Item Number.`, ToasterTitle.Error); 
}

clearToteID() {
  this.toteIDCrossBtn = '';
  this.processForm.get('toteID')?.setValue(this.processForm.value.toteID);
}

  applyStripIfApplicable(){
    if(this.applyStrip)
      if (this.stripSide.toLowerCase() == 'right') this.inputValue = this.inputValue.substring(0, this.inputValue.length - this.stripLength);
      else this.inputValue = this.inputValue.substring(this.stripLength, this.inputValue.length);
  }

  async autocompleteSearchColumnItem2() {
    let searchPayload = {
      batchID: this.batchId2,
    };
    this.iInductionManagerApi.BatchIDTypeAhead(searchPayload).subscribe(
      (res: any) => {
        if (res.isExecuted &&  res.data) {
          this.searchAutocompleteItemNum2 = res.data;
        } else {
          // this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("BatchIDTypeAhead",res.responseMessage);
        }
      },
      (error) => { }
    );
  }

  openSelectionTransactionDialogue() {
    if (this.inputValue == '') {
      this.global.ShowToastr(ToasterType.Error,'The input code provided was not recognized as the Item Number.',ToasterTitle.Error);
    return;
     };

      const dialogRef:any = this.global.OpenDialog(SelectionTransactionForToteComponent, {
        height: 'auto',
        width: '1100px',
        autoFocus: DialogConstants.autoFocus,
        disableClose:true,
        data: {
          inputType: this.inputType,
          inputValue: this.inputValue,
          userName: this.userData.userName,
          wsid: this.userData.wsid,
          batchID: this.batchId,
          zones: this.assignedZones,
          totes: this.dataSource2.data,
          selectIfOne: this.processPutAwayIndex.imPreference.selectIfOne,
          defaultPutAwayQuantity: this.processPutAwayIndex.imPreference.defaultPutAwayQuantity,
          autoForwardReplenish: this.processPutAwayIndex.imPreference.autoForwardReplenish,
          imPreference: this.processPutAwayIndex.imPreference,
          propFields:this.fieldNames,
          openFrom: 'pallet receiving'
        }
      });

      dialogRef.afterClosed().subscribe((res) => {
        if (res.refreshdata==true) {
            this.selectedValues(res.id, res.itemNumber, res.lotNumber, res.quantity, res.expirationDate); 
            
        } else {
            this.resetFormValues();
        }         
        });
      
      this.applyStripIfApplicable();
    }
  
    resetFormValues() {
      this.processForm.reset({
        toteID: this.processForm.value.toteID, 
        itemNo: this.processForm.value.itemNo,
        quantity: '',
        lotNumber: '',
        expirationDate: '',
        id: '',
        orgQty: 0,
      });
        this.quantityInput.nativeElement.focus();
    }

    selectedValues(id, itemNumber, lotNumber, transactionQuantity, expirationDate) {   
      this.processForm.reset({
        toteID: this.processForm.value.toteID, 
        itemNo: itemNumber,
        lotNumber: lotNumber,
        quantity: transactionQuantity,
        expirationDate: new Date(expirationDate),
        id: id,
        orgQty: transactionQuantity,
      });
        this.quantityInput.nativeElement.focus();
    }

    savePallet(split: boolean) {
      const payload = {
        toteId: this.processForm.value.toteID,
        itemNumber: this.processForm.value.itemNo,
        quantity: this.processForm.value.quantity,
        lotNumber: this.processForm.value.lotNumber,
        expirationDate: this.processForm.value.expirationDate,
        id: this.processForm.value.id,
        split: split, // Assuming `split` is defined elsewhere in your component
      };
    
      this.iInductionManagerApi.ProcessPallet(payload).subscribe((response: any) => {
        if (response.isExecuted) {
          this.global.ShowToastr(
            ToasterType.Success,
            ToasterMessages.PalletProcessed,
            ToasterTitle.Success
          );
          this.resetForm();
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.ErrorOccuredPalletSetup,
            ToasterType.Error
          );
        }
      });
    }
    
    async processPallet() {
      if (
        this.processForm.value.toteID === '' || this.processForm.value.toteID == undefined ||
        this.processForm.value.itemNo === '' || this.processForm.value.itemNo == undefined ||
        this.processForm.value.lotNumber === '' || this.processForm.value.lotNumber == undefined ||
        this.processForm.value.expirationDate === '' || this.processForm.value.expirationDate == undefined ||
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
                item: this.processForm.value.itemNo,
              };
              this.iInductionManagerApi
                .ValidateItem(payloadItem) //validate item number
                .subscribe((response: any) => {

                  if (response.data) {
                    let split = false;
                    if (this.processForm.value.id) {
                      console.log(this.processForm.value);

                      if (
                        this.processPutAwayIndex.imPreference.dontAllowOverReceipt === true && 
                        this.processForm.value.quantity > this.processForm.value.orgQty
                      ) {
                        this.global.ShowToastr(ToasterType.Error, 'Quantity cannot be greater than current transaction quantity:' + this.processForm.value.orgQty.toString(), ToasterTitle.Error);
                        return;
                      }
                     

                      if (
                        this.processPutAwayIndex.imPreference.splitShortPutAway === true && 
                        this.processForm.value.quantity < this.processForm.value.orgQty
                      ) {
                        const dialogRef = this.global.OpenDialog(ConfirmationDialogComponent, {
                          height: 'auto',
                          width: Style.w560px,
                          autoFocus: DialogConstants.autoFocus,
                          disableClose: true,
                          data: {
                            message: 'This transaction quantity is greater than the assigned quantity. Click OK if you will receive more of this order/item. Click Cancel to mark this transaction as received short.',
                          },
                        });
                      
                        dialogRef.afterClosed().subscribe((result: boolean) => {
                          if (result) {
                            split = true;
                          } else {
                            split = false;                            
                          }
                          this.savePallet(split);
                        });
                        return;
                      }
                      
                    } else this.processForm.value.id = 0;

                    this.savePallet(split);
                  } else {
                    this.showNotification(
                      showNotificationHeading.InvalidItemEntered,
                      showNotificationMessage.ItemNotExists
                    );
                  }
                });
            } else {
              // Show error in toaster if tote ID is not valid
              this.global.ShowToastr(ToasterType.Error,
                "Invalid Tote Entered", 
                ToasterTitle.Error
              );
              console.log("Invalid Tote ID");
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
