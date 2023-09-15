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
  styleUrls: ['./set-item-location.component.scss'],
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
          (res: any) => {
            if(res && res.isExecuted){
              if(res.data===''){
                
                this.itemInvalid=true
                this.searchAutocompleteList=[]
              }else{
                this.itemInvalid=false
                this.autocompleteGetLocation();
  
              }
       
            }
            // this.searchAutocompleteItemNum = res.data;
          },
          (error) => {}
        );
      }, 500);
  }
  ngOnInit(): void {
    this.autocompleteGetLocation();
    // this.searchByOrderNumber
    //   .pipe(debounceTime(600), distinctUntilChanged())
    //   .subscribe((value) => {
    //     this.autocompleteGetItem();
    //   });

    this.searchByItemNumber
      .pipe(debounceTime(600), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteGetItem();
      });
  }
  ngAfterViewInit() {
    this.itm_nmb.nativeElement.focus();
  }

  // getItemLocation(){

  //   let payload={
  //     itemNumber:  this.itemNumber,
  //     username: this.data.userName,
  //     wsid: this.data.wsid,
  //   }

  //   this.transactionService.get(payload,'/Admin/GetLocations',true).subscribe((res:any)=>{
  //     if(res && res.data){
  //       this.searchAutocompleteListItem=res.data

  //     }
  //   })
  // }
  async autocompleteGetLocation() {
    let searchPayload = {
      itemNumber: this.itemNumber,
      username: this.data.userName,
      wsid: this.data.wsid,
    };
    this.Api
      .GetLocations(searchPayload)
      .subscribe(
        (res: any) => {
          this.searchAutocompleteList = res.data;
        },
        (error) => {}
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
        (res: any) => {
          this.searchAutocompleteListItem = res.data;
        },
        (error) => {}
      );
  }
  ngOnDestroy() {
    this.searchByOrderNumber.unsubscribe();
    this.searchByItemNumber.unsubscribe();
  }
}
