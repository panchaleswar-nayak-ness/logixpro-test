import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/common/init/auth.service';
import { BatchManagerDetailViewComponent } from '../../dialogs/batch-manager-detail-view/batch-manager-detail-view.component';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/common/services/shared.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import {
  DialogConstants,
  LiveAnnouncerMessage,
  ToasterTitle,
  ToasterType,
  localStorageKeys,
  StringConditions,
  UniqueConstants,
  KeyboardKeys,
  Style,
} from 'src/app/common/constants/strings.constants';
import {
  AppPermissions,
  AppRoutes,
} from 'src/app/common/constants/menu.constants';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';

@Component({
  selector: 'app-batch-order-list',
  templateUrl: './batch-order-list.component.html',
  styleUrls: ['./batch-order-list.component.scss'],
})
export class BatchOrderListComponent implements OnInit {
  private subscription: Subscription = new Subscription();
  batchOrderDataTable: any;
  toteNumber: number = 1;
  userData: any;
  transType: any;
  max: any;
  selectedOrderLength: any = 0;
  @Input() set orderListData(val: any) {
    this.batchOrderDataTable = new MatTableDataSource(val);
    this.batchOrderDataTable.paginator = this.paginator;
    this.batchOrderDataTable.sort = this.sort;

    this.batchOrderDataTable.sortingDataAccessor = (
      row: any,
      columnName: string
    ) => {
      if (columnName === 'status') {
        return this.checkOrderStatus(row);
      }
      else if (columnName === 'orderNumber') {
        return row.orderNumber;
      }
      else if (columnName === 'countOfOrderNumber') {
        return row.countOfOrderNumber;
      }
      else if (columnName === 'minOfPriority') {
        return row.minOfPriority;
      }
      //  else {
      //   return '';
      // }
    };
  }
  @Input()
  set transTypeEvent(event: Event) {
    if (event) {
      this.transType = event;
    }
  }
  public iAdminApiService: IAdminApiService;
  @Input() displayedColumns: any;
  @Input() orderStatus: any;
  @Input() extraField: any;
  @Output() addOrderEmitter = new EventEmitter<any>();
  @Output() addRemoveAll = new EventEmitter<any>();
  fixedTote = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  orderNumberLookup: string;

  constructor(
    private sharedService: SharedService,
    private liveAnnouncer: LiveAnnouncer,
    private router: Router,
    public adminApiService: AdminApiService,
    private authService: AuthService,
    private global: GlobalService
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }

  ngAfterViewInit() {
    this.subscription.add(
      this.sharedService.batchManagerObserver.subscribe((obj) => {
        this.selectedOrderLength = obj.selectedOrderLength;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['orderListData']) {
      this.batchOrderDataTable['_data']['_value'] =
        changes['orderListData'][StringConditions.currentValue];
    }
    if (changes['extraField']) {
      this.extraField = changes['extraField'][StringConditions.currentValue];
    }
  }

  appendMax() {
    let dataLength = this.batchOrderDataTable['_data']['_value'].length;
    this.max = parseInt(this.extraField) - this.selectedOrderLength;
    if (this.max > dataLength) {
      this.max = dataLength;
    }
    for (let index = 0; index < this.max; index++) {
      this.addOrders(this.batchOrderDataTable['_data']['_value'][index]);
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
  }

  orderNumberLookupFun(e: any) {
    if (e.key === KeyboardKeys.Enter && this.orderNumberLookup != '') {
      let lookup = this.batchOrderDataTable.filteredData.filter(
        (x: any) =>
          x.orderNumber.toLowerCase() == this.orderNumberLookup.toLowerCase()
      );
      if (lookup?.length > 0) {
        this.addOrders(lookup[0]);
      } else {
        this.global.OpenDialog(AlertConfirmationComponent, {
          height: 'auto',
          width: Style.w560px,
          data: {
            message:
              'The entered order was not found within the order selection list table display.',
            heading: 'Order Not Found',
            disableCancel: true,
          },
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        });
      }
      this.orderNumberLookup = '';
    }
  }

  addOrders(order: any) {
    order.fixedTote = this.fixedTote >= 10 ? 1 : this.fixedTote++;
    if (this.toteNumber <= 10) {
      this.toteNumber++;
    } else {
      this.toteNumber = 1;
    }
    order.toteNumber = this.toteNumber;
    this.addOrderEmitter.emit(order);
  }

  addRemoveAllOrder() {
    this.addRemoveAll.emit();
  }

  openView(element) {
    let userRights = JSON.parse(
      localStorage.getItem(localStorageKeys.UserRights) ?? ''
    );
    let permissions = userRights.includes(AppPermissions.OrderStatus);
    if (permissions) {
      this.router.navigate([]).then(() => {
        window.open(
          `${AppRoutes.AdminTransaction}?orderStatus=${element.orderNumber}`,
          UniqueConstants._self
        );
      });
    } else {
      this.switchToOS(element.orderNumber, this.transType);
    }
  }

  switchToOS(order, transType) {
    let payload = {
      order: order,
      transType: transType,
    };
    this.iAdminApiService.DetailView(payload).subscribe((res: any) => {
      const { data, isExecuted } = res;
      if (isExecuted && data.length > 0) {
        this.openBatchViewDetail(data);
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          this.global.globalErrorMsg(),
          ToasterTitle.Error
        );
        console.log('DetailView', res.responseMessage);
      }
    });
  }

  openBatchViewDetail(detailData?): void {
    this.global.OpenDialog(BatchManagerDetailViewComponent, {
      width: '1100px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: detailData,
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  checkOrderStatus(order: any): string {

    if (order.isReprocess === false) {
      return 'Open';
    } else {
      return 'Re-process';
    }
  }

  getColors(order: any): string {
    if (order.isReprocess === false) {
      return 'background-color: #FFF0D6;color:#4D3B1A';
    } else {
      return 'background-color:   #F7D0DA;color:#4D0D1D';
    }
  }
}
