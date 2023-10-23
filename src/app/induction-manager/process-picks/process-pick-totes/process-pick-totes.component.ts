import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';
import { IInductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api.service';

@Component({
  selector: 'app-process-pick-totes',
  templateUrl: './process-pick-totes.component.html',
  styleUrls: ['./process-pick-totes.component.scss']
})
export class ProcessPickTotesComponent implements OnInit {
  @Output() ToteAction = new EventEmitter<any>();
  @Output() fillNxtToteId = new EventEmitter<any>();
  @Output() clearOrderNum = new EventEmitter<any>();
  @Input() dataSource:any;
  @Input() TOTE_SETUP:any;
  @Input() imPreferences:any;
  @Input() useInZonePickScreen:any;
  @Input() batchID:any;
  selection = new SelectionModel<any>(true, []);
  public iinductionManagerApi:IInductionManagerApiService;
  displayedColumns: string[] = ['position', 'toteid', 'orderno', 'priority', 'other'];
  public userData: any;
  constructor( private global:GlobalService,
    private authService: AuthService,
    private inductionManagerApi: InductionManagerApiService,
    private router: Router) { 
    this.iinductionManagerApi = inductionManagerApi;
    this.userData = this.authService.userData();
  }

  ngOnInit(): void {
  }
  onViewOrder(ele: any) {
    if (ele.orderNumber) {
      this.router.navigate([]).then((result) => {
        window.open(`/#/InductionManager/Admin/TransactionJournal?orderStatus=${ele.orderNumber}`, '_blank');
      });
    }
    else {
      this.global.ShowToastr('error','Please enter in an order number.', 'Error!');
    }
  }
  isValidOrderNumber(element: any) {
    let payload = {
      "OrderNumber": element.orderNumber
    }
    this.iinductionManagerApi.ValidateOrderNumber(payload).subscribe(res => {
      if (res.data === 'Invalid') {
        this.global.ShowToastr('error','This is not a vaild order number for this pick batch.', 'Error!');
        element.orderNumber = ''
        console.log("ValidateOrderNumber",res.responseMessage);
      }
    });
  }
  onToteAction(val: any) {
      this.ToteAction.emit(val); 
    const matSelect: MatSelect = val.source;
    matSelect.writeValue(null);
  }
  checkDuplicateTote(val: any, i: any) {
    for (let index = 0; index < this.TOTE_SETUP.length; index++) {
      const element = this.TOTE_SETUP[index];
      if (val.toteID !== '') {
        if (element.toteID == val.toteID && index != i) {
          this.TOTE_SETUP[i].toteID = "";
          this.global.ShowToastr('error','This tote id is already in this batch. Enter a new one', 'Error!');
          break;
        }
      }
    }

  }
  async printToteLabels(row) {
    console.log(row);
    let positionList: any = [];
    let toteList: any = [];
    let orderNumberList: any = [];

    if (row.toteID === "" || row.orderNumber === "") {
      this.global.ShowToastr('error','Missing data from the desired print row', 'Error!')
    } else {

      positionList.push(row.position)
      toteList.push(row.toteID)
      orderNumberList.push(row.orderNumber)

      if (this.imPreferences.printDirectly) {
        await   this.global.Print(`FileName:PrintPrevIMPickToteLabelButt|Positions:${positionList}|ToteIDs:${toteList}|OrderNums:${orderNumberList}`, 'lbl');

      } else {
        window.open(`/#/report-view?file=FileName:PrintPrevIMPickToteLabelButt|Positions:${positionList}|ToteIDs:${toteList}|OrderNums:${orderNumberList}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

      }

    }
  }
  clearOrderNumber(index:any){
    this.clearOrderNum.emit(index);
    // this.clearOrderNumber(i)
  }
  fillNextToteID(index:any){
    this.fillNxtToteId.emit(index);
    // this.fillNextToteID(i)
  }
  
async  printPickLabels(row) {
  let positionList: any = [];
  let toteList: any = [];
  let orderNumberList: any = [];
  if (row.toteID === "" || row.orderNumber === "") {
    this.global.ShowToastr('error','Missing data from the desired print row', 'Error!')
  } else {
    positionList.push(row.position)
    toteList.push(row.toteID)
    orderNumberList.push(row.orderNumber)

    if (this.imPreferences.printDirectly) {
      await  this.global.Print(`FileName:PrintPrevIMPickItemLabel|Positions:${positionList}|ToteIDs:${toteList}|OrderNums:${orderNumberList}|BatchID:${this.batchID}|WSID:${this.userData.wsid}`, 'lbl');

    } else {
      window.open(`/#/report-view?file=FileName:PrintPrevIMPickItemLabel|Positions:${positionList}|ToteIDs:${toteList}|OrderNums:${orderNumberList}|BatchID:${this.batchID}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

    }



  }
}
}
