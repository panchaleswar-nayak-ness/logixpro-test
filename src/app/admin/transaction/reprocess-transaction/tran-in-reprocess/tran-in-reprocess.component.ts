import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/common/services/shared.service';
import { AuthService } from '../../../../common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { Placeholders, StringConditions, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';

@Component({
  selector: 'app-tran-in-reprocess',
  templateUrl: './tran-in-reprocess.component.html',
  styleUrls: ['./tran-in-reprocess.component.scss']
})
export class TranInReprocessComponent implements OnInit {
  placeholders = Placeholders;
  selectedOption = "reprocess";
  reasonFilter = "none";

  @Input() selectedOrder: any;

  public userData : any;
  public fieldNames : any;
  public orderList : any;
  public itemNumberList : any;
  public itemNumber : string = '';
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

  clear(reset : boolean = false) {
    if(reset) {
      this.setResetValues();
      this.filterCleared.emit('cleared');
      this.getFilteredList();
      this.getItemList();
    } else {
      this.getFilteredList();
      this.getItemList();
      this.filterCleared.emit();
    }
  }

  setResetValues() {
    this.orderNumber = "";
    this.itemNumber = "";
    this.reasonFilter = 'none';
    this.selectedOption = 'reprocess';
    this.history = false;

    this.updateService('orderNumber', this.orderNumber);
    this.updateService('itemNumber', this.itemNumber);
    this.updateService('reasonFilter', this.reasonFilter);
    this.updateService('selectedOption', this.selectedOption);
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
    this.selectedOrderNumber.emit(this.orderNumber);
    this.updateService('orderNumber', this.orderNumber);
    this.getItemList();
  }

  listSelected() { 
    this.selectedItemNum.emit(this.itemNumber);
    this.updateService('itemNumber', this.itemNumber);
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
