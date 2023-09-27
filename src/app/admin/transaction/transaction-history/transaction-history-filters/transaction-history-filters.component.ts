import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/init/auth.service'; 
import { ApiFuntions } from 'src/app/services/ApiFuntions';

let today = new Date();
let year = today.getFullYear();
let month = today.getMonth();
let day = today.getDate();
let backDate = new Date(year - 50, month, day);
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
  sdate: any = backDate.toISOString();
  edate: any = new Date().toISOString();
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  public userData: any;

  constructor(
    private authService: AuthService,
    private Api:ApiFuntions
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.searchByOrderNumber
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => { 
        if(value===""){
          this.onOrderNoChange('')
          return
        }
        this.autocompleteSearchColumn();
         this.onOrderNoChange(value)
      });
  }

  onOrderNoChange(event) {
    this.orderNo.emit(event);
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  resetToTodaysDate() {
    this.edate=new Date().toISOString()
    this.sdate=new Date().toISOString()
    this.orderNumber='';
    this.searchAutocompleteList = [];
    this.resetDates.emit({endDate : new Date().toISOString(),startDate : new Date().toISOString()})
    this.clearData.emit(event);
   
  }

  searchData(event) {
    this.onOrderNoChange(event);
  }

  async autocompleteSearchColumn() {
    let searchPayload = {
      query: this.orderNumber,
      tableName: 3,
      column: 'Order Number',
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .NextSuggestedTransactions(searchPayload)
      .subscribe(
        {next: (res: any) => {
          this.searchAutocompleteList = res.data;
        },
        error: (error) => {}}
      );
  }
  onDateChange(event: any): void {
    this.sdate = new Date(event).toISOString();
    this.startDate.emit(event);
  }

  onEndDateChange(event: any): void {
    this.edate = new Date(event).toISOString();
    this.endDate.emit(event);
  }
  ngOnDestroy() {
    this.searchByOrderNumber.unsubscribe();
  }
   onInputChange(event: Event): void {// to avoid negative values
    const value = (event.target as HTMLInputElement).value;
    if (Number(value) < 0) {
      this.orderNumber = 0;
    }
  }

  clear(){
    this.orderNumber = ''
    this.onOrderNoChange('')
  }
}
