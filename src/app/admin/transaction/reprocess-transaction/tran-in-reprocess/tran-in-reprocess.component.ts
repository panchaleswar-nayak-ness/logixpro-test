import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/common/services/shared.service';
import { AuthService } from '../../../../common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { Placeholders, StringConditions, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';
import { ClearType, ClearTypes } from 'src/app/common/types/CommonTypes';

// Constants for default values
const DEFAULT_REASON_FILTER = 'none';
const DEFAULT_SELECTED_OPTION = 'reprocess';

@Component({
  selector: 'app-tran-in-reprocess',
  templateUrl: './tran-in-reprocess.component.html',
  styleUrls: ['./tran-in-reprocess.component.scss']
})
export class TranInReprocessComponent implements OnInit {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  itemNumber: string = this.fieldMappings.itemNumber;
  LabelitemNumber: string = this.fieldMappings.itemNumber;
  placeholders = Placeholders;
  selectedOption = DEFAULT_SELECTED_OPTION;
  reasonFilter = DEFAULT_REASON_FILTER;

  @Input() selectedOrder: any;

  public userData : any;
  public fieldNames : any;
  public orderList : any;
  public itemNumberList : any;
  // public itemNumber : string = '';
  public orderNumber : string = '';
  public history : boolean = false;
  
  public iAdminApiService: IAdminApiService;

  @Output() reprocessSelectionEvent = new EventEmitter<string>();
  @Output() radioChangeEvent = new EventEmitter<any>();
  @Output() reasonFilterEvent = new EventEmitter<string>();
  @Output() selectedOrderNumber = new EventEmitter<string>();
  @Output() selectedItemNum = new EventEmitter<string>();
  @Output() filterCleared = new EventEmitter<string>();
  @Output() selectedOptionChange = new EventEmitter<string>();

  constructor(
    private global: GlobalService,
    private authService: AuthService,
    public adminApiService: AdminApiService,
    private sharedService: SharedService,
    private currentTabDataService: CurrentTabDataService 
  ) {   
    this.iAdminApiService = adminApiService; 
  }

  ngOnInit(): void {
    if (this.currentTabDataService.savedItem[this.currentTabDataService.Reprocess_Transaction]) {
      let param = this.currentTabDataService.savedItem[this.currentTabDataService.Reprocess_Transaction];
      this.itemNumber = param.itemNumber
      this.orderNumber = param.orderNumber
      this.selectedOption = param.selectedOption
      this.reasonFilter = param.reasonFilter
    }else{
      this.itemNumber = '';
      this.orderNumber = '';
      this.selectedOption = "reprocess";
      this.reasonFilter = "none";
    }
    this.selectedOptionChange.emit(this.selectedOption);
    this.updateService('selectedOption', this.selectedOption);

    this.userData = this.authService.userData();
    this.getFilteredList();
    this.sharedService.updateReprocessObserver.subscribe((selectedOrder) => {
      this.orderNumber = '';
      this.itemNumber = '';
      this.orderNumber = selectedOrder.orderNumber;
      this.itemNumber = selectedOrder.itemNumber;
      this.orderSelected();
      this.listSelected();
    });
    this.sharedService.fieldNameObserver.subscribe((item) => this.fieldNames = item);
  }

  radioButtonChange(event) {
    this.orderNumber='';
    this.itemNumber='';
    if(event.value === StringConditions.history) this.history = true;
    else this.history = false;
    this.radioChangeEvent.emit({radioChange:true})
    this.reprocessSelectionEvent.emit(event.value);
    this.selectedOptionChange.emit(this.selectedOption);

    this.updateService('selectedOption', this.selectedOption);
    this.clear();
  }

  reasonFilterChange(event) {
    this.orderNumber='';
    this.itemNumber='';
    this.radioChangeEvent.emit({radioChange:true})
    this.reasonFilterEvent.emit(event.value);

    this.updateService('reasonFilter', event.value);
    this.clear();
  }

  clear(reset: boolean = false, clearType: ClearType = ClearTypes.All) {
    if (reset) {
      this.setResetValues(clearType);
      this.filterCleared.emit('cleared');
    } else {
      this.filterCleared.emit();
    }

    this.getFilteredList();
    this.getItemList();
  }

  setResetValues(clearType: ClearType = ClearTypes.All) {
    // Reset common values
    this.reasonFilter = DEFAULT_REASON_FILTER;
    this.selectedOption = DEFAULT_SELECTED_OPTION;
    this.history = false;

    // Reset specific values based on clear type
    switch (clearType) {
      case ClearTypes.All:
        this.orderNumber = "";
        this.itemNumber = "";
        this.updateService('orderNumber', this.orderNumber);
        this.updateService('itemNumber', this.itemNumber);
        break;
      case ClearTypes.Order:
        this.orderNumber = "";
        this.updateService('orderNumber', this.orderNumber);
        break;
      case ClearTypes.Item:
        this.itemNumber = "";
        this.updateService('itemNumber', this.itemNumber);
        break;
    }

    // Update common service values
    this.updateService('reasonFilter', this.reasonFilter);
    this.updateService('selectedOption', this.selectedOption);
  }

  orderClear(reset: boolean = false) {
    this.clear(reset,  ClearTypes.Order);
  }

  itemClear(reset: boolean = false) {
    this.clear(reset, ClearTypes.Item);
  }

  getFilteredList() {
    let payload = {
      "ItemNumber": this.itemNumber,
      "OrderNumber": this.orderNumber,
      "History": this.history, 
    }
    this.iAdminApiService.ReprocessTypeahead(payload).subscribe(res => {
      if (res.data) this.orderList = res.data;
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ReprocessTypeahead",res.responseMessage);
      }
    });
  }

  orderSelected() {
    if (!this.orderNumber || this.orderNumber.trim() === '') {
      this.orderClear(true);  // trigger the same logic as clear button
      return;
    }
    this.selectedOrderNumber.emit(this.orderNumber);
    this.updateService('orderNumber', this.orderNumber);
    this.getItemList();
  }

  listSelected() {
    if (!this.itemNumber || this.itemNumber.trim() === '') {
      this.itemClear(true);
      return;
    }
    this.selectedItemNum.emit(this.itemNumber);
    this.updateService('itemNumber', this.itemNumber);
  }

  onOrderInputChange() {
    // Whenever user types or pastes, we refresh the dropdown
    this.getFilteredList();
  }

  onOrderPaste(event: ClipboardEvent) {
    this.getFilteredList();
  }

  onItemInputChange() {
    this.getItemList();
  }

  onItemPaste(event: ClipboardEvent) {
    this.getItemList();
  }

  getItemList() {
    let payload = {
      "ItemNumber": this.itemNumber,
      "OrderNumber": this.orderNumber,
      "History": this.history, 
    }
    this.iAdminApiService.ReprocessTypeahead(payload).subscribe(res => {
      if (res.data) this.itemNumberList = res.data;
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ReprocessTypeahead",res.responseMessage);
      }
    });
  }

  private updateService(key: string, value: any) {
    this.currentTabDataService.savedItem[this.currentTabDataService.Reprocess_Transaction] = {
      ...this.currentTabDataService.savedItem[this.currentTabDataService.Reprocess_Transaction],
      [key]: value
    };
  }
}
