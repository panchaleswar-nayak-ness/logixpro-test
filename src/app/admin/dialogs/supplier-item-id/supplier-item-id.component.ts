import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs'; 
import { ToasterTitle, ToasterType ,UniqueConstants} from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';

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
  floatLabelControlItem: any = new FormControl(UniqueConstants.item as FloatLabelType);
  hideRequiredControlItem = new FormControl(false);
  searchByItem: any = new Subject<string>();
  searchAutocompleteItemNum: any = [];
  isValidItemSelected: boolean = false;
  
  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    private global:GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>
  ) {
    this.supplierID = data.supplierID;
    this.iCommonAPI = commonAPI;
  }
  getFloatLabelValueItem(): FloatLabelType {
    return this.floatLabelControlItem.value || UniqueConstants.item;
  }
  ngOnInit(): void {
    this.searchByItem
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.autocompleteSearchColumnItem();
      });
  }
  ngAfterViewInit() {
    this.supplier_id.nativeElement.focus();
  }

  async autocompleteSearchColumnItem() {
    let searchPayload = {
      supplierID: this.supplierID
    };
    this.iCommonAPI
      .SupplierItemTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          if (res.data && res.data.length > 0) {
            this.searchAutocompleteItemNum = res.data;
          }
          else{
            // Don't clear input, just disable button and show error
            this.description = '';
            this.itemNumber = '';
            this.isValidItemSelected = false;
            this.searchAutocompleteItemNum = [];
            this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
          }
        },
      );
  }
  setItem(e) {
    // Find the selected item from the autocomplete list
    const selectedItem = this.searchAutocompleteItemNum.find(
      (item) => item.supplierItemID === e.option.value
    );
    
    if (selectedItem) {
      this.supplierID = selectedItem.supplierItemID;
      this.description = selectedItem.description;
      this.itemNumber = selectedItem.itemNumber;
      this.isValidItemSelected = true;
    }
  }

  onInputChange(value: string) {
    // Reset validation state when user types
    this.isValidItemSelected = false;
    this.searchByItem.next(value);
  }

  clearInput() {
    this.supplierID = '';
    this.description = '';
    this.itemNumber = '';
    this.isValidItemSelected = false;
    this.searchAutocompleteItemNum = [];
  }

  setSupplierID(){
    this.dialogRef.close({ 
      isExecuted: true, 
      supplierID: this.supplierID, 
      itemNumber: this.itemNumber, 
      description: this.description
    });
  }
  ngOnDestroy() {
    this.searchByItem.unsubscribe();
  }
}
