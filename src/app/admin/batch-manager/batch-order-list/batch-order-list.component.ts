import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
  SimpleChanges,
  EventEmitter,
  Output,
  ChangeDetectionStrategy,
  TemplateRef,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router'; 
import { AuthService } from 'src/app/init/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { BatchManagerDetailViewComponent } from '../../dialogs/batch-manager-detail-view/batch-manager-detail-view.component';
import { Subscription } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-batch-order-list',
  templateUrl: './batch-order-list.component.html',
  styleUrls: ['./batch-order-list.component.scss'],
})
export class BatchOrderListComponent implements OnInit {
  private subscription: Subscription = new Subscription();

  // @Input() orderListData : any;
  tableData: any;
  toteNumber: number = 1;
  userData: any;
  transType: any;
  max:any;
  selectedOrderLength:any=0;
  @Input() set orderListData(val: any) {
    this.tableData = new MatTableDataSource(val);
    this.tableData.paginator = this.paginator;
    this.tableData.sort = this.sort;
  }
  @Input()
  set transTypeEvent(event: Event) {
    if (event) {
      this.transType = event;
    }
  }

  @Input() displayedColumns: any;
  @Input() orderStatus: any;
  @Input() extraField: any;
  @Output() addOrderEmitter = new EventEmitter<any>();
  @Output() addRemoveAll = new EventEmitter<any>();
  fixedTote = 1;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private sharedService: SharedService,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private Api: ApiFuntions,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }

  ngAfterViewInit() {
    this.subscription.add(
      this.sharedService.batchManagerObserver.subscribe((obj) => {
     
        
        this.selectedOrderLength=obj.selectedOrderLength;
      })
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['orderListData']) {
      this.tableData['_data']['_value'] =
        changes['orderListData']['currentValue'];
    }
    if (changes['extraField']) {
      this.extraField = changes['extraField']['currentValue'];
    }
  }
  appendMax() {
    let dataLength=this.tableData['_data']['_value'].length
      this.max=parseInt(this.extraField)-this.selectedOrderLength;
      if(this.max>dataLength){
        this.max=dataLength
      }
      for (let index = 0; index < this.max; index++) {
        this.addOrders( this.tableData['_data']['_value'][index])
        
      }

  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  addOrders(order: any) {
    order.fixedTote = this.fixedTote >= 10 ? 1 : this.fixedTote++;
    order.toteNumber =
      this.toteNumber <= 10 ? this.toteNumber++ : (this.toteNumber = 1); // tote number increment till 10 after 10 restarts to 1
    this.addOrderEmitter.emit(order);
  }

  addRemoveAllOrder() {
    this.addRemoveAll.emit();
  }

  openView(element) {
    let userRights=JSON.parse(localStorage.getItem('userRights') || '');
    let permissions=userRights.includes('Order Status')

    if (permissions) {
      this.router.navigate([]).then((result) => {
        window.open(
          `/#/admin/transaction?orderStatus=${element.orderNumber}`,
          '_self'
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
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .DetailView(payload)
      .subscribe((res: any) => {
        const { data, isExecuted } = res;
        if (isExecuted && data.length > 0) {
          this.openBatchViewDetail(data);
        } else {
        }
      });
  }

  openBatchViewDetail(detailData?): void {
    const dialogRef = this.dialog.open(BatchManagerDetailViewComponent, {
      width: '1100px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: detailData,
    });
    dialogRef.afterClosed().subscribe(() => {
      
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
