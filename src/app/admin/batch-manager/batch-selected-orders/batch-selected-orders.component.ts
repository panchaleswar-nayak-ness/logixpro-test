import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from '../../../common/init/auth.service';
import labels from 'src/app/common/labels/labels.json';
import { SharedService } from 'src/app/common/services/shared.service';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import { CreateBatchConfirmationComponent } from '../../dialogs/create-batch-confirmation/create-batch-confirmation.component';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ConfirmationHeadings, ConfirmationMessages, DialogConstants, LiveAnnouncerMessage, ResponseStrings, StringConditions, ToasterTitle, ToasterType ,Style,UniqueConstants} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-batch-selected-orders',
  templateUrl: './batch-selected-orders.component.html',
  styleUrls: ['./batch-selected-orders.component.scss'],
})

export class BatchSelectedOrdersComponent implements OnInit {
  public userData: any;
  batchOrderDataTable: any;
  transType: any;
  pickToTotes: boolean;
  nextToteID: any;
  @Input() set selectedOrderList(val: any) {
    this.batchOrderDataTable = new MatTableDataSource(val);
    this.batchOrderDataTable.paginator = this.paginator;
    this.batchOrderDataTable.sort = this.sort;
  }
  @Input() displayedColumns: any;
  @Input() batchManagerSettings: any;
  @Input() type: any;
  @Input() isAutoBatch: any;
  @Output() addRemoveAll = new EventEmitter<any>();
  @Output() batchCreated = new EventEmitter<any>();
  @Output() batchIdUpdateEmit = new EventEmitter<any>();
  @Input()
  set transTypeEvent(event: Event) {
    if (event) {
      this.transType = event;
      this.addRemoveAll.emit();
    }
  }
  public nextOrderNumber: any;
  public batchID: any;
  @Output() removeOrderEmitter = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public iAdminApiService: IAdminApiService;
  toteValue = 0;

  constructor(
    private global: GlobalService,
    private _liveAnnouncer: LiveAnnouncer,
    private authService: AuthService,
    public adminApiService: AdminApiService,
    private sharedService: SharedService
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }

  ngAfterViewInit() {
    this.sharedService.batchManagerObserver.subscribe((obj) => {
      if (obj['isCreate']) {
        this.createBatch();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    let toteLimit = 0;
    if (changes['selectedOrderList']) {
      this.batchOrderDataTable['_data']['_value'].forEach((element) => {
        if (toteLimit < 10) {
          toteLimit++;
        } else {
          toteLimit = 1;
        }
        element['toteNumber'] = toteLimit;
      });
      this.sharedService.updateBatchManagerObject({
        selectedOrderLength: this.batchOrderDataTable['_data']['_value'].length,
      });
    }
    if (changes['isAutoBatch']) {
      this.isAutoBatch = changes['isAutoBatch'][StringConditions.currentValue];
    }
    this.batchManagerSettings.map((batchSetting) => {
      this.nextOrderNumber = batchSetting.batchID;
      this.pickToTotes = JSON.parse(batchSetting.pickToTotes.toLowerCase());
      this.nextToteID = batchSetting.nextToteID;
    });
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
  }

  printReport(type) {
    if (type === StringConditions.Batch) {
      let dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: DialogConstants.auto,
        width: Style.w786px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          message: ConfirmationMessages.ClickOkToPrintBatchReport,
          heading: ConfirmationHeadings.BatchManager,
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res === ResponseStrings.Yes) {
          let ordersArr: any = [];
          this.batchOrderDataTable._data._value.forEach(element => {
            ordersArr.push(element.orderNumber)
          });
          this.global.Print(`FileName:PrintBatchReport|TransType:${this.transType}|Orders:${ordersArr.length > 0 ? ordersArr : ''}|BatchID:${this.nextOrderNumber}`)
        }
      });
    } else {
      let dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: DialogConstants.auto,
        width: Style.w786px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          message: ConfirmationMessages.ClickOkToPrintItemLabels,
          heading: ConfirmationHeadings.BatchManager,
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res === ResponseStrings.Yes) {
          let ordersArr: any = [];
          this.batchOrderDataTable._data._value.forEach(element => {
            ordersArr.push(element.orderNumber)
          });
          this.global.Print(`FileName:PrintBatchLabel|TransType:${this.transType}|Orders:${ordersArr.length > 0 ? ordersArr : ''}`, UniqueConstants.Ibl)
        }
      });
    }
  }

  removeOrders(order: any) {
    this.removeOrderEmitter.emit(order);
  }

  createBatch() {
    let iBactchData: any[] = [];
    this.batchOrderDataTable.data.map((order: any) => {
      let result = [
        order.orderNumber.toString(),
        this.isAutoBatch
          ? order.toteNumber.toString()
          : order.fixedTote.toString(),
      ];
      iBactchData.push(result);
    });
    let paylaod = {
      batch: iBactchData,
      nextBatchID:
        this.nextOrderNumber != this.batchID
          ? this.nextOrderNumber
          : this.batchID,
      transType: this.type,
    };
    try {
      this.iAdminApiService
        .BatchInsert(paylaod)
        .subscribe((res: any) => {
          const { isExecuted } = res;
          if (isExecuted) {
            this.batchCreated.emit(true);
            this.batchIdUpdateEmit.emit(true);
            this.global.ShowToastr(ToasterType.Success, labels.alert.success, ToasterTitle.Success);
          }
          else {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.log("BatchInsert", res.responseMessage);
          }
        });
    } catch (error) {
    }
  }

  addRemoveAllOrder() {
    if (this.batchOrderDataTable['_data']['_value'].length == 0) return;
    this.addRemoveAll.emit();
  }

  createBatchDialog() {
    if (this.nextOrderNumber === '') {
      const dialogRef: any = this.global.OpenDialog(AlertConfirmationComponent, {
        height: DialogConstants.auto,
        width: Style.w786px,
        data: {
          message: ConfirmationMessages.BatchIDMustBeSpecified,
          heading: ConfirmationHeadings.BatchManager,
        },
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => { });
    } else if (this.batchOrderDataTable.data.length == 0) {
      const dialogRef: any = this.global.OpenDialog(AlertConfirmationComponent, {
        height: DialogConstants.auto,
        width: Style.w786px,
        data: {
          message: ConfirmationMessages.NoOrdersSelected,
          heading: ConfirmationHeadings.BatchManager,
        },
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((result) => { });
    } else {
      let dialogRef;
      dialogRef = this.global.OpenDialog(CreateBatchConfirmationComponent, {
        height: DialogConstants.auto,
        width: '550px',
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          pickToTotes: this.pickToTotes,
          transType: this.transType,
          nextToteID: this.nextToteID,
          selectedOrderList: this.batchOrderDataTable['_data']['_value'],
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.createBatch();
        }
      });
    }
  }
}
