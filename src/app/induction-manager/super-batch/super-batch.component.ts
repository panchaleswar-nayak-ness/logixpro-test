import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { RequiredDateStatusComponent } from '../../../app/dialogs/required-date-status/required-date-status.component';
import { AuthService } from '../../../app/init/auth.service'; 
import labels from '../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-super-batch',
  templateUrl: './super-batch.component.html',
  styleUrls: ['./super-batch.component.scss']
})
export class SuperBatchComponent implements OnInit {

  displayedColumns: string[] = ['zone', 'totalTransactions', 'orderToBatch', 'newToteID', 'actions'];
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
    private dialog: MatDialog,
    private global:GlobalService,
    private toastr: ToastrService,
    private Api: ApiFuntions
  ) { }

  ngOnInit(): void {
    this.user_data = this.authService.userData(); 
    this.Api.SuperBatchIndex().subscribe(res => {
      const { preferences } = res.data;
      
      this.itemNumbers = res.data.itemNums;
      this.defaultSuperBatchSize = preferences.defaultSuperBatchSize;
      this.superBatches = res.data.superBatches;
      this.selectedOption=preferences.superBatchByToteID?'Tote':'Order'
      this.isConfirmSuperBatch=preferences.confirmSuperBatch
      this.getSuperBatchBy(this.selectedOption);
    })
  }

  openReqDataStatus() {
    const dialogRef = this.dialog.open(RequiredDateStatusComponent, {
      height: 'auto',
      width: '932px',
      autoFocus: '__non_existing_element__'
    })
  }
  printBatchLabel(type){
    if(!this.printBatchLabels){
      this.toastr.error('Please Select a Batch ID to Print', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }else{
      if(type=='printBatchLabels'){
    this.global.Print(`FileName:PrintSuperBatchLabel|ToteID:${this.printBatchLabels}`,'lbl');
    }
      if(type=='printOrderLabels'){
    this.global.Print(`FileName:PrintSuperBatchOrderLabel|ToteID:${this.printBatchLabels}`,'lbl');
        }
      if(type=='printCaseLabels'){
        debugger
    this.global.Print(`FileName:PrintPrevInZoneCaseLabelToteID|ToteID:${this.printBatchLabels}`,'lbl');

       }
   

    }
  }
  getSuperBatchBy(type: any, itemNumber?: any) {
    this.type = type;
    this.itemNum = itemNumber ? itemNumber : '';
    let payload = {
      "Type": type,
      "ItemNumber": itemNumber
    }
    this.Api.ItemZoneDataSelect(payload).subscribe(res => {
      const batchTableData = res.data.map((v, key) => ({ ...v, 'key': key, 'orderToBatch': this.defaultSuperBatchSize, 'newToteID': '' }))
      this.dataSource = batchTableData;
    });
  }

  onChangeBatch($event: MatRadioChange) {
    // console.log($event.source.name, $event.value);
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
    this.getSuperBatchBy('Item', itemNumber.value)
  }

  onCreateBtach(element: any) {
    this.batchRowData = element;
      
      
    if (element.newToteID <= 1) {
      this.toastr.error('Must enter a tote id to batch orders', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      return;
    }
    if (element.orderToBatch <= 1) {
      this.toastr.error('Orders to Batch must be greater than 1 ', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      return;
    }
    if (!element.newToteID) {
      this.toastr.error('Must enter a tote id to batch orders', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      return;
    }

    if(this.isConfirmSuperBatch){
    const dialogRef = this.dialog.open(this.batchOrderConfirmation, {
      width: 'auto',
      autoFocus: '__non_existing_element__',
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
    this.Api.SuperBatchCreate(payload).subscribe(response => {
      // console.log(response);
      if (response.isExecuted) {
        this.Api.TotePrintTableInsert({ "ToteID": element.newToteID.toString() }).subscribe(res => {
          // console.log(res);
          if(res.isExecuted){
            this.superBatches.push(element.newToteID);
            this.toastr.success(labels.alert.success, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
          else{
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }

        });
        // this.dataSource = this.dataSource.filter(item => item.key !== element.key);
        this.getSuperBatchBy(this.type, this.itemNum);
      }
      // console.log(this.dataSource);

    });
  }

  isConfirm(val: boolean) {
    this.isConfirmation = val;
  }

  checkOTB(element: any, i : any) {
    if (element.orderToBatch <= 1) {
      this.dataSource[i].orderToBatch = 2;
      this.toastr.error('Orders to Batch must be greater than 1 ', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
  }

}
