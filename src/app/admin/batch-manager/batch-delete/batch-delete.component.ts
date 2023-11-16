import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  TemplateRef,
  ViewChild,
  Input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../app/init/auth.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { CurrentTabDataService } from '../../inventory-master/current-tab-data-service';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { DialogConstants, StringConditions, ToasterTitle, ToasterType, TransactionType } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-batch-delete',
  templateUrl: './batch-delete.component.html',
  styleUrls: ['./batch-delete.component.scss'],
})
export class BatchDeleteComponent implements OnInit {
  transList: any = [
    {
      id: TransactionType.Pick,
      name: TransactionType.Pick,
    },
    {
      id: TransactionType.PutAway,
      name: TransactionType.PutAway,
    },
    {
      id: TransactionType.Count,
      name: TransactionType.Count,
    },
  ];
  batchListData: any = [];
  public iAdminApiService: IAdminApiService;
  get batchList(): any {
    return this.batchListData;
  }
  set batchList(value: any) {
    this.batchListData = value;
  }
  transType: string = TransactionType.Pick;
  batchID: string | undefined = '';
  isChecked = true;
  public userData: any;
  public dltType: any;
  @ViewChild('deleteAction') deleteActionTemplate: TemplateRef<any>;
  @ViewChild('deleteByTransaction') deleteByTransactionTemplate: TemplateRef<any>;
  @Output() transTypeEmitter = new EventEmitter<any>();
  @Output() deleteEmitter = new EventEmitter<any>();
  @Input()
  set batchUpdater(batchUpdater: Event) {
    if (batchUpdater) {
      this.getBatch(this.transType);
    }
  }

  constructor(
    private global: GlobalService,
    private dialog: MatDialog,
    public authService: AuthService,
    public adminApiService: AdminApiService,
    private currentTabDataService: CurrentTabDataService,
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.initializeComponent();
  }

  initializeComponent() {
    this.userData = this.authService.userData();
    if (!this.applySavedItem())
      this.getBatch(this.transType);
  }

  checkOptions(event: MatCheckboxChange): void {
    if (event.checked) {
      this.isChecked = true;
    } else {
      this.isChecked = false;
    }
  }

  getBatch(type: any) {
    try {
      let paylaod = {
        transType: type
      };
      this.iAdminApiService
        .SelectBatchesDeleteDrop(paylaod)
        .subscribe((res: any) => {
          this.batchList = [];
          if (res.isExecuted && res.data.length > 0) {
            this.batchList.push(StringConditions.AllTransaction);
            res.data.forEach((i: any) => {
              if (i) this.batchList.push(i);
            });
          }
          else {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.log("SelectBatchesDeleteDrop", res.responseMessage);
          }
        });
      this.recordSavedItem();
    } catch (error) {
    }
  }

  applySavedItem() {
    if (this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER_DELETE]) {
      let item = this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER_DELETE];
      this.transType = item.transType;
      this.batchList = item.batchList;
      return true;
    }
    return false;
  }

  recordSavedItem() {
    this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER_DELETE] = {
      transType: this.transType,
      batchList: this.batchList
    }
  }

  changeTranType(value: any) {
    this.getBatch(value);
    this.transTypeEmitter.emit(value);
  }

  deleteBatch(type: any, id: any) {
    if (id == '') return;
    let payload = {
      batchID: id,
      identity: 2,
      transType: type
    };
    if (this.batchID !== StringConditions.AllTransaction) {
      let dialogRef: any = this.global.OpenDialog(this.deleteActionTemplate, {
        width: '550px',
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(() => {
        if (this.dltType) {
          if (this.dltType == StringConditions.BatchTote) {
            payload.identity = 0;
          } else {
            payload.identity = 1;
          }
          this.iAdminApiService
            .BatchDeleteAll(payload)
            .subscribe((res: any) => {
              if (res.isExecuted) {
                this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER_DELETE] = undefined;
                this.initializeComponent();
                this.global.ShowToastr(ToasterType.Success, res.responseMessage, ToasterTitle.Success);
                this.deleteEmitter.emit(res);
                this.batchID = "";
                this.dltType = "";
              }
              else {
                this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
                console.log("BatchDeleteAll", res.responseMessage);
              }
            });
        }
      });
    } else {
      payload.identity = 2;
      const dialogRef: any = this.global.OpenDialog(this.deleteByTransactionTemplate, {
        width: '550px',
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (this.dltType === StringConditions.BatchToteTrans) {
          this.iAdminApiService
            .BatchDeleteAll(payload)
            .subscribe((res: any) => {
              if (res.isExecuted) {
                this.currentTabDataService.savedItem[this.currentTabDataService.BATCH_MANAGER_DELETE] = undefined;
                this.initializeComponent();
                this.global.ShowToastr(ToasterType.Success, res.responseMessage, ToasterTitle.Success);
                this.deleteEmitter.emit(res.data);
                this.batchID = "";
                this.dltType = "";
              }
              else {
                this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
                console.log("BatchDeleteAll", res.responseMessage);
              }
            });
        }
      });
    }
    this.isChecked = false;
  }

  onDeleteOptions(dltType: any) {
    this.dltType = dltType;
    this.dialog.closeAll();
  }
}
