import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-reprocess-transaction-detail-view',
  templateUrl: './reprocess-transaction-detail-view.component.html',
  styleUrls: ['./reprocess-transaction-detail-view.component.scss'],
})
export class ReprocessTransactionDetailViewComponent implements OnInit {
  @ViewChild('field_focus') field_focus: ElementRef;
  itemID:any;
  userData:any;
  fieldNames:any;
  constructor(
    private Api: ApiFuntions,
    private userService:AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  reprocessInfo = new FormGroup({
    orderNumber: new FormControl({ value: '', disabled: true }),
    itemNumber: new FormControl({ value: '', disabled: true }),
    transactionType: new FormControl({ value: '', disabled: true }),
    lineNumber: new FormControl({ value: '', disabled: true }),
    description: new FormControl({ value: '', disabled: true }),
    notes: new FormControl({ value: '', disabled: true }),
    importDate: new FormControl({ value: '', disabled: true }),
    importBy: new FormControl({ value: '', disabled: true }),
    importFileName: new FormControl({ value: '', disabled: true }),
    requiredDate: new FormControl({ value: '', disabled: true }),
    uom: new FormControl({ value: '', disabled: true }),
    lotNumber: new FormControl({ value: '', disabled: true }),
    expirationDate: new FormControl({ value: '', disabled: true }),
    serialNumber: new FormControl({ value: '', disabled: true }),
    revision: new FormControl({ value: '', disabled: true }),
    wareHouse: new FormControl({ value: '', disabled: true }),
    location: new FormControl({ value: '', disabled: true }),
    transactionQuantity: new FormControl({ value: '', disabled: true }),
    priority: new FormControl({ value: '', disabled: true }),
    label: new FormControl({ value: '', disabled: true }),
    hostTransID: new FormControl({ value: '', disabled: true }),
    emergency: new FormControl({ value: '', disabled: true }),
    shipVia: new FormControl({ value: '', disabled: true }),
    shipToName: new FormControl({ value: '', disabled: true }),
    shipToLine1: new FormControl({ value: '', disabled: true }),
    shipToLine2: new FormControl({ value: '', disabled: true }),
    shipToCountry: new FormControl({ value: '', disabled: true }),
    shipToState: new FormControl({ value: '', disabled: true }),
    shipToZip: new FormControl({ value: '', disabled: true }),
    promisedDate: new FormControl({ value: '', disabled: true }),
    userField9: new FormControl({ value: '', disabled: true }),
    userField10: new FormControl({ value: '', disabled: true }),
    reason: new FormControl({ value: '', disabled: true }),
    reasonMessage: new FormControl({ value: '', disabled: true }),
  });
  ngOnInit(): void {  
    this.itemID=this.data.itemID
    this.userData=this.userService.userData();
    this.getReprocessData();
    this.OSFieldFilterNames();
    // this.reprocessInfo.controls.orderNumber.setValue('123213');
  }
  ngAfterViewInit(): void {
    this.field_focus.nativeElement.focus();
  }
  public OSFieldFilterNames() { 
    this.Api.ColumnAlias().subscribe((res: any) => {
      this.fieldNames = res.data;
      // this.sharedService.updateFieldNames(this.fieldNames)
    })
  }
  getReprocessData() {
    let payLoad = { id: this.itemID, username: this.userData.userName, wsid: this.userData.wsid};

    this.Api
      .RPDetails(payLoad)
      .subscribe((res: any) => {
        if (res && res.isExecuted) {
          let item=res.data;
          this.reprocessInfo.controls.orderNumber.setValue(item.orderNumber);
          this.reprocessInfo.controls.itemNumber.setValue(item.itemNumber);
          this.reprocessInfo.controls.transactionType.setValue(item.transactionType);
          this.reprocessInfo.controls.lineNumber.setValue(item.lineNumber);
          this.reprocessInfo.controls.description.setValue(item.description);
          this.reprocessInfo.controls.notes.setValue(item.notes);
          this.reprocessInfo.controls.importDate.setValue(item.importDate);
          this.reprocessInfo.controls.importBy.setValue(item.importBy);
          this.reprocessInfo.controls.importFileName.setValue(item.importFileName);
          this.reprocessInfo.controls.requiredDate.setValue(item.requiredDate);
          this.reprocessInfo.controls.uom.setValue(item.unitOfMeasure);
          this.reprocessInfo.controls.lotNumber.setValue(item.lotNumber);
          this.reprocessInfo.controls.expirationDate.setValue(item.expirationDate);
          this.reprocessInfo.controls.serialNumber.setValue(item.serialNumber);
          this.reprocessInfo.controls.revision.setValue(item.revision);
          this.reprocessInfo.controls.wareHouse.setValue(item.warehouse);
          this.reprocessInfo.controls.location.setValue(item.location);
          this.reprocessInfo.controls.transactionQuantity.setValue(item.transactionQuantity);
          this.reprocessInfo.controls.priority.setValue(item.priority);
          this.reprocessInfo.controls.label.setValue(item.label);
          this.reprocessInfo.controls.hostTransID.setValue(item.hostTransactionID);
          this.reprocessInfo.controls.emergency.setValue(item.emergency);
          this.reprocessInfo.controls.shipVia.setValue(item.userField2);
          this.reprocessInfo.controls.shipToName.setValue(item.userField3);
          this.reprocessInfo.controls.shipToLine1.setValue(item.userField1);
          this.reprocessInfo.controls.shipToLine2.setValue(item.userField4);
          this.reprocessInfo.controls.shipToCountry.setValue(item.userField6);
          this.reprocessInfo.controls.shipToState.setValue(item.userField7);
          this.reprocessInfo.controls.shipToZip.setValue(item.userField8);
          this.reprocessInfo.controls.promisedDate.setValue(item.userField9);
          this.reprocessInfo.controls.userField9.setValue(item.userField5);
          this.reprocessInfo.controls.userField10.setValue(item.userField10);
          this.reprocessInfo.controls.reason.setValue(item.reason);
          this.reprocessInfo.controls.reasonMessage.setValue(item.reasonMessage);
        }
      });
  }
}
