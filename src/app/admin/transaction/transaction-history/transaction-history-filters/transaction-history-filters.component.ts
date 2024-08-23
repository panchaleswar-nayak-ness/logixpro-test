import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/common/init/auth.service'; 
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { Column, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';

@Component({
  selector: 'app-transaction-history-filters',
  templateUrl: './transaction-history-filters.component.html',
  styleUrls: [],
})
export class TransactionHistoryFiltersComponent implements OnInit {

  @Output() startDate = new EventEmitter<any>();
  @Output() endDate = new EventEmitter<any>();
  @Output() orderNo = new EventEmitter<any>();
  @Output() resetDates = new EventEmitter<any>();
  @Output() clearData = new EventEmitter<Event>();

  searchByOrderNumber = new Subject<string>();
  orderNumber: any;
  searchAutocompleteList: any;
  sDate: any = new Date(1973,10,7);
  eDate: any = new Date();
  floatLabelControl = new FormControl('auto' as FloatLabelType);

  public userData: any;

  public iAdminApiService: IAdminApiService;

  constructor(
    private authService: AuthService,
    public adminApiService: AdminApiService,
    private global : GlobalService,
    private currentTabDataService: CurrentTabDataService
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    if (this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_History]) {
      let param = this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_History];
      this.sDate = param.sDate
      this.eDate = param.eDate
      this.orderNumber = param.orderNumber
    }
    else{
      this.sDate =  new Date(1973,10,7);
      this.eDate = new Date();
      this.orderNumber = ''
    }
    this.userData = this.authService.userData();
    this.searchByOrderNumber.pipe(debounceTime(400), distinctUntilChanged()).subscribe((value) => { 
      if(value === ""){
        this.onOrderNoChange('')
        return
      }
      this.autoCompleteSearchColumn();
      this.onOrderNoChange(value);
    });
  }

  onOrderNoChange(event) {
    this.orderNo.emit(event);
    this.emitFilterValue()
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  resetToTodaysDate() {
    this.eDate = new Date()
    this.sDate = new Date()
    this.orderNumber = '';
    this.searchAutocompleteList = [];
    this.resetDates.emit({endDate : new Date(),startDate : new Date()})
    this.clearData.emit(event);
    this.emitFilterValue()
   
  }

  searchData(event) {
    this.onOrderNoChange(event);
  }

  async autoCompleteSearchColumn() {
    let searchPayload = {
      query: this.orderNumber,
      tableName: 3,
      column: Column.OrderNumber
    };
    this.iAdminApiService.NextSuggestedTransactions(searchPayload).subscribe({
      next: (res: any) => {
        if(res.isExecuted && res.data) this.searchAutocompleteList = res.data;
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("NextSuggestedTransactions",res.responseMessage);
        }
      }
    });
  }

  onDateChange(event: any): void {
    this.sDate = new Date(event);
    this.startDate.emit(this.sDate);
    this.emitFilterValue()
  }

  onEndDateChange(event: any): void {
    this.eDate = new Date(event);
    this.endDate.emit(this.eDate);
    this.emitFilterValue()
  }

  ngOnDestroy() {
    this.searchByOrderNumber.unsubscribe();
  }

  onInputChange(event: Event): void {// to avoid negative values
    const value = (event.target as HTMLInputElement).value;
    if (Number(value) < 0) this.orderNumber = 0;
  }

  clear(){
    this.orderNumber = ''
    this.onOrderNoChange('')
  }

    // Emit an object with all the values when any field changes
    emitFilterValue() {
      this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_History] = {
        ...this.currentTabDataService.savedItem[this.currentTabDataService.TRANSACTIONS_History], // spread the existing values
        orderNumber: this.orderNumber,
        sDate: this.sDate,
        eDate: this.eDate,
      };
    
    }
}
