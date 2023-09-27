import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FloatLabelType } from '@angular/material/form-field';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs'; 
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-set-item-location',
  templateUrl: './set-item-location.component.html',
  styleUrls: [],
})
export class SetItemLocationComponent implements OnInit {
  @ViewChild('itm_nmb') itm_nmb: ElementRef;
  itemNumber;
  floatLabelControl: any = new FormControl('item' as FloatLabelType);
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
  invMapID;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
    private Api:ApiFuntions,
    public dialogRef: MatDialogRef<any>

  ) {
    this.itemNumber = data.itemNumber;
  }
  getFloatLabelValueLocation(): FloatLabelType {
    return this.floatLabelControlLocation.value || 'autoLocation';
  }
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'item';
  }
  onFocusOutEvent(event){
    if(event.target.value==='') return;
    this.validateItem();
  }
  searchData() {
    if(this.itemNumber=='')return
   this.validateItem();
   
  }
  getRow(row){
    this.invMapID=row.invMapID
  
    
  }
  setLocation(){
    this.dialogRef.close({ isExecuted: true,invMapID:this.invMapID,itemNumber:this.itemNumber});
  }
  validateItem(){
    let payLoad = {
      itemNumber: this.itemNumber,
        username: this.data.userName,
        wsid: this.data.wsid,
      };
      setTimeout(() => {
        
   
      this.Api
        .ItemExists(payLoad)
        .subscribe(
          {next:(res: any) => {
            if(res?.isExecuted){
              if(res.data===''){
                
                this.itemInvalid=true
                this.searchAutocompleteList=[]
              }else{
                this.itemInvalid=false
                this.autocompleteGetLocation();
  
              }
       
            }
          },
          error:(error) => {}}
        );
      }, 500);
  }
  ngOnInit(): void {
    this.autocompleteGetLocation();

    this.searchByItemNumber
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteGetItem();
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
    this.Api
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
      isEqual: false,
      username: this.data.userName,
      wsid: this.data.wsid,
    };
    this.Api
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
