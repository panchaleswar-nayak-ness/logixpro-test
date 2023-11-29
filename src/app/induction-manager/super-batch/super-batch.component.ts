import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatRadioChange } from '@angular/material/radio';
import { RequiredDateStatusComponent } from '../../../app/dialogs/required-date-status/required-date-status.component';
import { AuthService } from '../../common/init/auth.service'; 
import labels from 'src/app/common/labels/labels.json';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { ToasterTitle, ToasterType ,DialogConstants,TableConstant,ColumnDef,UniqueConstants} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-super-batch',
  templateUrl: './super-batch.component.html',
  styleUrls: ['./super-batch.component.scss']
})
export class SuperBatchComponent implements OnInit {
  public iInductionManagerApi: IInductionManagerApiService;
  displayedColumns: string[] = [TableConstant.zone, 'totalTransactions', 'orderToBatch', 'newToteID', ColumnDef.Actions];
  dataSource: any;
  user_data: any;
  totalTransHeading = 'Single Line Orders';
  defaultSuperBatchSize: any;
  superBatches: any;
  isItemNumber: boolean = true;
  itemNumbers: any;
  order_to_batch: any;
  type: any = 'Order';
  tote_id: any;
  printBatchLabels:any;
  batchRowData: any;
  isConfirmation: boolean = false;
  isConfirmSuperBatch:boolean=false;
  itemNum : any;
  selectedOption:any;
  @ViewChild('batchOrderConfirmation') batchOrderConfirmation: TemplateRef<any>;

  constructor(
    private authService: AuthService,
    public inductionManagerApi: InductionManagerApiService,
    private global: GlobalService
  ) {
    this.iInductionManagerApi = inductionManagerApi;
   }

  ngOnInit(): void {
    this.user_data = this.authService.userData(); 
    this.iInductionManagerApi.SuperBatchIndex().subscribe(res => {
      if (res.isExecuted && res.data)
      {
        const { preferences } = res.data;
      
        this.itemNumbers = res.data.itemNums;
        this.defaultSuperBatchSize = preferences.defaultSuperBatchSize;
        this.superBatches = res.data.superBatches;
        this.selectedOption=preferences.superBatchByToteID?'Tote':'Order'
        this.isConfirmSuperBatch=preferences.confirmSuperBatch
        this.getSuperBatchBy(this.selectedOption);
        
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("SuperBatchIndex",res.responseMessage);

      }

   
    })
  }

  openReqDataStatus() {
    this.global.OpenDialog(RequiredDateStatusComponent, {
      height: 'auto',
      width: '932px',
      autoFocus: DialogConstants.autoFocus
    })
  }
  printBatchLabel(type){
    if(!this.printBatchLabels){
      this.global.ShowToastr(ToasterType.Error,'Please Select a Batch ID to Print', ToasterTitle.Error);
    }else{
      if(type=='printBatchLabels'){
    this.global.Print(`FileName:PrintSuperBatchLabel|ToteID:${this.printBatchLabels}`,UniqueConstants.Ibl);
    }
      if(type=='printOrderLabels'){
    this.global.Print(`FileName:PrintSuperBatchOrderLabel|ToteID:${this.printBatchLabels}`,UniqueConstants.Ibl);
        }
      if(type=='printCaseLabels'){
    this.global.Print(`FileName:PrintPrevInZoneCaseLabelToteID|ToteID:${this.printBatchLabels}`,UniqueConstants.Ibl);

       }
   

    }
  }
  getSuperBatchBy(type: any, itemNumber?: any) {
    this.type = type;
    this.itemNum = itemNumber ??  '';
    let payload = {
      "Type": type,
      "ItemNumber": itemNumber
    }
    this.iInductionManagerApi.ItemZoneDataSelect(payload).subscribe(res => {
      if (res.isExecuted && res.data)
      {
        const batchTableData = res.data.map((v, key) => ({ ...v, 'key': key, 'orderToBatch': this.defaultSuperBatchSize, 'newToteID': '' }))
      this.dataSource = batchTableData;

      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ItemZoneDataSelect",res.responseMessage);
      }
      
    });
  }

  onChangeBatch($event: MatRadioChange) {
    if ($event.value === 'Item') {
      this.dataSource = [];
      this.isItemNumber = false;
    }
    else if ($event.value === 'Tote') {
      this.isItemNumber = true; 
      this.totalTransHeading = 'Single Line Tote Order';
      this.getSuperBatchBy($event.value);
    }
    else {
      this.isItemNumber = true;
      this.totalTransHeading = 'Single Line Orders';
      this.getSuperBatchBy($event.value);
    }
  }

  onItemSelectChange(itemNumber: any) {
    if(itemNumber.value){
      this.getSuperBatchBy('Item', itemNumber.value)
    }
    else{
      this.dataSource = [];
    }
  }

  onCreateBtach(element: any) {
    this.batchRowData = element;
      
      
    if (element.newToteID <= 1) {
      this.global.ShowToastr(ToasterType.Error,'Must enter a tote id to batch orders', ToasterTitle.Error);
      return;
    }
    if (element.orderToBatch <= 1) {
      this.global.ShowToastr(ToasterType.Error,'Orders to Batch must be greater than 1 ', ToasterTitle.Error);
      return;
    }
    if (!element.newToteID) {
      this.global.ShowToastr(ToasterType.Error,'Must enter a tote id to batch orders', ToasterTitle.Error);
      return;
    }

    if(this.isConfirmSuperBatch){
    const dialogRef:any = this.global.OpenDialog(this.batchOrderConfirmation, {
      width: 'auto',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });

    dialogRef.afterClosed().subscribe(() => {
      if (this.isConfirmation) {
        this.saveBatch(element);
      }
    });
  }else{
    this.saveBatch(element);
  }
  }

  saveBatch(element: any) {
    let BatchByOrder;
    if (this.type === 'Order') {
      BatchByOrder = 1;
    } else if (this.type === 'Tote') {
      BatchByOrder = 0;
    }
    else {
      BatchByOrder = 2;
    }
    let payload = {
      "Zone": element.zone,
      "ToBatch": element.orderToBatch.toString(),
      "ToteID": element.newToteID.toString(),
      "ItemNum": this.itemNum.toString(),
      "BatchByOrder": BatchByOrder.toString()
    }
    this.iInductionManagerApi.SuperBatchCreate(payload).subscribe(response => {
      if (response.isExecuted) {
        this.iInductionManagerApi.TotePrintTableInsert({ "ToteID": element.newToteID.toString() }).subscribe(res => {
          if(res.isExecuted){
            this.superBatches.push(element.newToteID);
            this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
          }
          else{
            this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
            console.log("TotePrintTableInsert",res.responseMessage);
          }

        });
        this.getSuperBatchBy(this.type, this.itemNum);
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("SuperBatchCreate");
      }

    });
  }

  isConfirm(val: boolean) {
    this.isConfirmation = val;
  }

  checkOTB(element: any, i : any) {
    if (element.orderToBatch <= 1) {
      this.dataSource[i].orderToBatch = 2;
      this.global.ShowToastr(ToasterType.Error,'Orders to Batch must be greater than 1 ', ToasterTitle.Error);
    }
  }

}
