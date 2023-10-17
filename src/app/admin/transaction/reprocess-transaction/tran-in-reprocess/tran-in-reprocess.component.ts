import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import { AuthService } from '../../../../../app/init/auth.service'; 
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-tran-in-reprocess',
  templateUrl: './tran-in-reprocess.component.html',
  styleUrls: ['./tran-in-reprocess.component.scss']
})
export class TranInReprocessComponent implements OnInit {
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
    private Api: ApiFuntions,
    private global : GlobalService,
    private authService: AuthService,
    private adminApiService: AdminApiService,
    private sharedService:SharedService
  ) {   this.iAdminApiService = adminApiService; }

  ngOnInit(): void {
    this.selectedOptionChange.emit(this.selectedOption);
    this.userData = this.authService.userData();
    this.getFilteredList();
    this.sharedService.updateReprocessObserver.subscribe(selectedOrder => {
      this.orderNumber='';
      this.itemNumber='';
      this.orderNumber=selectedOrder.orderNumber;
      this.itemNumber=selectedOrder.itemNumber;
      this.orderSelected();
      this.listSelected();
     
       })
       this.sharedService.fieldNameObserver.subscribe(item => {
        this.fieldNames=item;
       });
  }

  radioButtonChange(event) {

    this.orderNumber='';
    this.itemNumber='';
    if(event.value === 'history'){
      this.history = true;
    }
    else{
      this.history = false;
    }
    this.radioChangeEvent.emit({radioChange:true})
    this.reprocessSelectionEvent.emit(event.value);
    this.selectedOptionChange.emit(this.selectedOption);
    this.clear();
  }
  reasonFilterChange(event) {
    this.orderNumber='';
    this.itemNumber='';
    this.radioChangeEvent.emit({radioChange:true})
    this.reasonFilterEvent.emit(event.value);
    this.clear();
  }

  clear(reset:boolean=false)
  {

    if(reset){
   
      this.setResetValues();
     this.filterCleared.emit('cleared');
     this.getFilteredList();
     this.getItemList();
    }else{
      this.getFilteredList();
     this.getItemList();
      this.filterCleared.emit();
    }
    
  
  }

  setResetValues(){
    this.orderNumber="";
    this.itemNumber="";
    this.reasonFilter='none';
    this.selectedOption='reprocess';
   this.history=false;
  }

  getFilteredList() {
    let payload = {
      "ItemNumber": this.itemNumber,
      "OrderNumber": this.orderNumber,
      "History": this.history, 
    }
    this.iAdminApiService.ReprocessTypeahead(payload).subscribe(res => {
      if (res.data) {
        this.orderList = res.data;
      } else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("ReprocessTypeahead",res.responseMessage);
      }
    });
  }

  orderSelected(){ 
    this.selectedOrderNumber.emit(this.orderNumber);
    this.getItemList();
  }
  listSelected(event?){ 
    this.selectedItemNum.emit(this.itemNumber);
  }
  getItemList(){
    let payload = {
      "ItemNumber": this.itemNumber,
      "OrderNumber": this.orderNumber,
      "History": this.history, 
    }
    this.iAdminApiService.ReprocessTypeahead(payload).subscribe(res => {
      if (res.data) {
        this.itemNumberList = res.data;
      } else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("ReprocessTypeahead",res.responseMessage);
        
      }
    });
  }


}
