import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { StringConditions, ToasterMessages, ToasterTitle, ToasterType ,UniqueConstants} from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';

@Component({
  selector: 'app-process-pick-totes',
  templateUrl: './process-pick-totes.component.html',
  styleUrls: ['./process-pick-totes.component.scss']
})
export class ProcessPickTotesComponent {
  @Output() ToteAction = new EventEmitter<any>();
  @Output() fillNxtToteId = new EventEmitter<any>();
  @Output() clearOrderNum = new EventEmitter<any>();
  @Input() dataSource: any;
  @Input() TOTE_SETUP: any;
  @Input() imPreferences: any;
  @Input() useInZonePickScreen: any;
  @Input() batchID: any;
  selection = new SelectionModel<any>(true, []);
  public iinductionManagerApi: IInductionManagerApiService;
  displayedColumns: string[] = [UniqueConstants.position, 'toteid', 'orderno', UniqueConstants.Priority, 'other'];
  public userData: any;
  constructor(private global: GlobalService,
    private authService: AuthService,
    public inductionManagerApi: InductionManagerApiService,
    private router: Router) {
    this.iinductionManagerApi = inductionManagerApi;
    this.userData = this.authService.userData();
  }


  onViewOrder(ele: any) {
    if (ele.orderNumber) {
      this.router.navigate([]).then((result) => {
        window.open(`/#/InductionManager/Admin/TransactionJournal?orderStatus=${ele.orderNumber}`, UniqueConstants._blank);
      });
    }
    else {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.EnterOrderNo, ToasterTitle.Error);
    }
  }

  isValidOrderNumber(element: any) {
    let payload = {
      "OrderNumber": element.orderNumber
    }
    this.iinductionManagerApi.ValidateOrderNumber(payload).subscribe(res => {
      if (res.data === StringConditions.Invalid) {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.InvalidOrderNo, ToasterTitle.Error);
        element.orderNumber = ''
        console.log("ValidateOrderNumber", res.responseMessage);
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
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.ToteIdAlreadyInBatch, ToasterTitle.Error);
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
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.MissingDataFromPrint, ToasterTitle.Error)
    } else {

      positionList.push(row.position)
      toteList.push(row.toteID)
      orderNumberList.push(row.orderNumber)

      if (this.imPreferences.printDirectly) {
        await this.global.Print(`FileName:PrintPrevIMPickToteLabelButt|Positions:${positionList}|ToteIDs:${toteList}|OrderNums:${orderNumberList}`, UniqueConstants.Ibl);

      } else {
        window.open(`/#/report-view?file=FileName:PrintPrevIMPickToteLabelButt|Positions:${positionList}|ToteIDs:${toteList}|OrderNums:${orderNumberList}`, UniqueConstants._blank, 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

      }
    }
  }

  clearOrderNumber(index: any) {
    this.clearOrderNum.emit(index);
    // this.clearOrderNumber(i)
  }

  fillNextToteID(index: any) {
    this.fillNxtToteId.emit(index);
    // this.fillNextToteID(i)
  }

  async printPickLabels(row) {
    let positionList: any = [];
    let toteList: any = [];
    let orderNumberList: any = [];
    if (row.toteID === "" || row.orderNumber === "") {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.MissingDataFromPrint, ToasterTitle.Error)
    } else {
      positionList.push(row.position)
      toteList.push(row.toteID)
      orderNumberList.push(row.orderNumber)

      if (this.imPreferences.printDirectly) {
        await this.global.Print(`FileName:PrintPrevIMPickItemLabel|Positions:${positionList}|ToteIDs:${toteList}|OrderNums:${orderNumberList}|BatchID:${this.batchID}|WSID:${this.userData.wsid}`, UniqueConstants.Ibl);
      } else {
        window.open(`/#/report-view?file=FileName:PrintPrevIMPickItemLabel|Positions:${positionList}|ToteIDs:${toteList}|OrderNums:${orderNumberList}|BatchID:${this.batchID}|WSID:${this.userData.wsid}`, UniqueConstants._blank, 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
      }
    }
  }
}
