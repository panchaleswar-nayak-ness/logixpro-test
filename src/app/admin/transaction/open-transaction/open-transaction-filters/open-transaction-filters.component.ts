import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuthService } from 'src/app/init/auth.service'; 
import labels from '../../../../labels/labels.json';
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-open-transaction-filters',
  templateUrl: './open-transaction-filters.component.html',
  styleUrls: ['./open-transaction-filters.component.scss'],
})
export class OpenTransactionFiltersComponent implements OnInit {
  @Output() nextScreen = new EventEmitter<string>();
  @Output() eventChange = new EventEmitter<Event>();
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  searchDeb = new Subject<string>();
  public userData: any;
  selectedOption = 'Order Number';
  searchValue = '';
  selectedCheck = 'non';
  fieldNames:any;
  autoCompleteSearchResult: any;
  filterObjectForEvnt={
    selectedOption:'',
    searchValue:'',
    selectedCheck:'',

  }
  constructor(
    private authService: AuthService,
    private Api: ApiFuntions,
    private toastr: ToastrService,
    private sharedService:SharedService
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.searchDeb
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((value) => {
        if(!value) return
        this.autocompleteSearchColumn();
        this.filterObjectForEvnt.selectedOption=this.selectedOption
        this.filterObjectForEvnt.searchValue=this.searchValue
        this.filterObjectForEvnt.selectedCheck=this.selectedCheck

        this.eventChangeEmitter(value)
        // this.getContentData();
      });
      this.sharedService.fieldNameObserver.subscribe(item => {
        this.fieldNames=item;
       });
  }
  goToOnHold() {
    this.nextScreen.emit('complete');
  }
  radioChange(event){
   if(event && event.value){
      this.eventChangeEmitter(event)
   }
  }
  searchData() {}
  selectedItem(event) {
    this.searchValue = '';
  }
  eventChangeEmitter(event: any) {
    if(event){
      event={
        selectedOption:this.selectedOption,
        searchValue:this.searchValue,
        selectedCheck:this.selectedCheck
      }
      this.eventChange.emit(event);
    }


  }

  async autocompleteSearchColumn() {
    let searchPayload = {
      query: this.searchValue,
      tableName: 2,
      column: this.selectedOption,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };

    this.Api
      .NextSuggestedTransactions(searchPayload)
      .subscribe(
        (res: any) => {
          if (res && res.isExecuted) {
            this.autoCompleteSearchResult = res.data;
          }
        },
        (error) => {}
      );
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }
  ngOnDestroy() {
    this.searchDeb.unsubscribe();
  }
}
