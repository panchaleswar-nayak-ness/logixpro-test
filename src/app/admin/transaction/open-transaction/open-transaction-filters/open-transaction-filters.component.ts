import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { AuthService } from 'src/app/common/init/auth.service'; 
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { SharedService } from 'src/app/common/services/shared.service';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { Column, Placeholders, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-open-transaction-filters',
  templateUrl: './open-transaction-filters.component.html',
  styleUrls: ['./open-transaction-filters.component.scss'],
})
export class OpenTransactionFiltersComponent implements OnInit {
  @Output() nextScreen = new EventEmitter<string>();
  @Output() eventChange = new EventEmitter<Event>();

  placeholders = Placeholders;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  searchDeb = new Subject<string>();
  public userData: any;
  selectedOption = Column.OrderNumber;
  searchValue = '';
  selectedCheck = 'non';
  fieldNames:any;
  autoCompleteSearchResult: any;
  filterObjectForEvnt={
    selectedOption:'',
    searchValue:'',
    selectedCheck:'',
  }

  public iAdminApiService: IAdminApiService;
  
  constructor(
    private authService: AuthService,
    public adminApiService: AdminApiService,
    private global : GlobalService,
    private sharedService:SharedService
  ) { 
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.searchDeb.pipe(debounceTime(600), distinctUntilChanged()).subscribe((value) => {
      if(!value) return;
      this.autoCompleteSearchColumn();
      this.filterObjectForEvnt.selectedOption = this.selectedOption;
      this.filterObjectForEvnt.searchValue = this.searchValue;
      this.filterObjectForEvnt.selectedCheck = this.selectedCheck;
      this.eventChangeEmitter(value);
    });
    this.sharedService.fieldNameObserver.subscribe(item => this.fieldNames = item);
  }

  goToOnHold() {
    this.nextScreen.emit('complete');
  }

  radioChange(event) {
   if(event?.value) this.eventChangeEmitter(event);
  }
  
  selectedItem(event) {
    this.searchValue = '';
  }

  eventChangeEmitter(event: any) {
    if(event) {
      event = {
        selectedOption:this.selectedOption,
        searchValue:this.searchValue,
        selectedCheck:this.selectedCheck
      }
      this.eventChange.emit(event);
    }
  }

  async autoCompleteSearchColumn() {
    let searchPayload = {
      query: this.searchValue,
      tableName: 2,
      column: this.selectedOption
    };

    this.iAdminApiService.NextSuggestedTransactions(searchPayload).subscribe({
      next: (res: any) => {
        if (res?.isExecuted) this.autoCompleteSearchResult = res.data;
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("NextSuggestedTransactions",res.responseMessage);   
        }
      },
      error: (error) => {}
    });
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }
  
  ngOnDestroy() {
    this.searchDeb.unsubscribe();
  }
}
