import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';

import { debounceTime, distinctUntilChanged, Subject } from 'rxjs'; 
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import {  Placeholders, UniqueConstants } from 'src/app/common/constants/strings.constants';
import { ApiResponse } from 'src/app/common/types/CommonTypes';

@Component({
  selector: 'app-set-item-location',
  templateUrl: './set-item-location.component.html',
  styleUrls: ['./set-item-location.component.scss'],
})
export class SetItemLocationComponent implements OnInit {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  LabelItemNumber: string = this.fieldMappings.itemNumber;
  placeholders = Placeholders;
  @ViewChild('itm_nmb') itm_nmb: ElementRef;
  itemNumber;
  floatLabelControl: any = new FormControl(UniqueConstants.item as FloatLabelType);
  floatLabelControlLocation: any = new FormControl(
    'autoLocation' as FloatLabelType
  );
  hideRequiredControl = new FormControl(false);
  hideRequiredControlItem = new FormControl(false);
  searchAutocompleteList: any=[];
  searchAutocompleteListItem: any = [];
  searchByOrderNumber = new Subject<string>();
  searchByItemNumber = new Subject<string>();
  location: any;
  itemInvalid=false;
  isValidItemSelected: boolean = false;
  invMapID;
  LocationNumber;
  public iAdminApiService: IAdminApiService;
  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    
    private Api:ApiFuntions,
    private adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<any>

  ) {
    this.iAdminApiService = adminApiService;
    this.itemNumber = data.itemNumber;
    this.iCommonAPI = commonAPI;
    // If item number is provided initially, validate it
    if (this.itemNumber) {
      this.isValidItemSelected = true;
    }
  }
  getFloatLabelValueLocation(): FloatLabelType {
    return this.floatLabelControlLocation.value || 'autoLocation';
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || UniqueConstants.item;
  }
  onFocusOutEvent(event){
    if(event.target.value==='') {
      this.isValidItemSelected = false;
      return;
    }
    this.validateItem();
  }
  searchData() {
    if(this.itemNumber=='') {
      this.isValidItemSelected = false;
      return;
    }
    // Hide error immediately and mark as valid since user selected from dropdown
    this.itemInvalid = false;
    this.isValidItemSelected = true;
    this.autocompleteGetLocation();
  }
  getRow(row){
    this.invMapID=row.invMapID
    this.LocationNumber = row.locationNumber
  }

  onInputChange(value: string) {
    // Reset validation state when user types
    this.isValidItemSelected = false;
    this.itemInvalid = false; // Hide error immediately when user starts typing
    this.searchByItemNumber.next(value);
  }

  clearInput() {
    this.itemNumber = '';
    this.isValidItemSelected = false;
    this.itemInvalid = false;
    this.searchAutocompleteList = [];
    this.searchAutocompleteListItem = [];
  }
  setLocation(){
    this.dialogRef.close({ isExecuted: true,invMapID:this.invMapID,LocationNumber:this.LocationNumber,itemNumber:this.itemNumber});
  }
  validateItem(){
    let payLoad = {
      itemNumber: this.itemNumber
    };
    this.commonAPI
      .ItemExists(payLoad)
      .subscribe(
        {next:(res: ApiResponse<string>) => {
          if(res?.isExecuted){
            if(res.data===''){
              this.itemInvalid=true;
              this.isValidItemSelected = false;
              this.searchAutocompleteList=[];
            }else{
              this.itemInvalid=false;
              this.isValidItemSelected = true;
              this.autocompleteGetLocation();
            }
          }
        },
        error:(error) => {}}
      );
  }

  validateItemAfterTyping(){
    // Only show error if no autocomplete suggestions available
    let payLoad = {
      itemNumber: this.itemNumber
    };
    this.commonAPI
      .ItemExists(payLoad)
      .subscribe(
        {next:(res: any) => {
          if(res?.isExecuted){
            if(res.data===''){
              // Only show error if there are no autocomplete suggestions
              if (!this.searchAutocompleteListItem || this.searchAutocompleteListItem.length === 0) {
                this.itemInvalid=true;
                this.isValidItemSelected = false;
                this.searchAutocompleteList=[];
              }
            }else{
              this.itemInvalid=false;
              this.isValidItemSelected = true;
              this.autocompleteGetLocation();
            }
          }
        },
        error:(error) => {}}
      );
  }
  ngOnInit(): void {
    this.autocompleteGetLocation();

    this.searchByItemNumber
      .pipe(debounceTime(2000), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteGetItem();
        // After 2 seconds pause, validate if there's a value
        if (value && value.trim() !== '') {
          this.validateItemAfterTyping();
        }
      });
  }
  ngAfterViewInit() {
    this.itm_nmb.nativeElement.focus();
  }

  async autocompleteGetLocation() {
    let searchPayload = {
      itemNumber: this.itemNumber,
      username: this.data.userName,
      wsid: this.data.wsid,
    };
    this.iAdminApiService
      .GetLocations(searchPayload)
      .subscribe(
        {next: (res: any) => {
          this.searchAutocompleteList = res.data;
        },
        error: (error) => {}}
      );
  }

  async autocompleteGetItem() {
    let searchPayload = {
      itemNumber: this.itemNumber,
      beginItem: '---',
      isEqual: false
    };
    this.commonAPI
      .SearchItem(searchPayload)
      .subscribe(
        {next: (res: any) => {
          this.searchAutocompleteListItem = res.data;
        },
        error: (error) => {}}
      );
  }
  ngOnDestroy() {
    this.searchByOrderNumber.unsubscribe();
    this.searchByItemNumber.unsubscribe();
  }
}
