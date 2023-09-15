import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs'; 
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-supplier-item-id',
  templateUrl: './supplier-item-id.component.html',
  styleUrls: ['./supplier-item-id.component.scss'],
})
export class SupplierItemIdComponent implements OnInit {
  @ViewChild('supplier_id') supplier_id: ElementRef;
  supplierID;
  description;
  itemNumber;
  floatLabelControlItem: any = new FormControl('item' as FloatLabelType);
  hideRequiredControlItem = new FormControl(false);
  searchByItem: any = new Subject<string>();
  searchAutocompleteItemNum: any = [];
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private Api: ApiFuntions,
    public dialogRef: MatDialogRef<any>
  ) {
    this.supplierID = data.supplierID;
  }
  getFloatLabelValueItem(): FloatLabelType {
    return this.floatLabelControlItem.value || 'item';
  }
  ngOnInit(): void {
    this.searchByItem
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteSearchColumnItem();
      });
  }
  ngAfterViewInit() {
    this.supplier_id.nativeElement.focus();
  }

  async autocompleteSearchColumnItem() {
    let searchPayload = {
      supplierID: this.supplierID,
      username: this.data.userName,
      wsid: this.data.wsid,
    };
    this.Api
      .SupplierItemTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          if (res.data) {
            this.searchAutocompleteItemNum = res.data;
          }
        },
        (error) => {}
      );
  }
  setItem(e) {
    this.supplierID=e.option.value;
 
  }

  setSupplierID(){
    this.dialogRef.close({ isExecuted: true,supplierID:this.supplierID,itemNumber:this.itemNumber,description:this.description});

  }
  getRow(row) {
    this.description=row.description;
    this.itemNumber=row.itemNumber;
    // let payLoad = {
    //   id: row.id,
    //   username: this.data.userName,
    //   wsid: this.data.wsid,
    // };
    // this.transactionService
    //   .get(payLoad, '/Admin/ManualTransactionTypeAhead', true)
    //   .subscribe(
    //     (res: any) => {
    //       if(res && res.data){
    //         this.setLocationByItemList=res.data.map((item)=>{
    //           return {invMapID:item.invMapID,select:`${item.itemQty}@${item.locationNumber}`}
    //         }) 
    //       }
    //       // this.searchAutocompleteItemNum = res.data;
    //     },
    //     (error) => {}
    //   );
  }
  ngOnDestroy() {
    this.searchByItem.unsubscribe();
  }
}
