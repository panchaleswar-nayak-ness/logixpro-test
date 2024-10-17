import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  DialogConstants,
  LiveAnnouncerMessage,
  Style,
  ToasterMessages,
  ToasterTitle,
  ToasterType,
} from 'src/app/common/constants/strings.constants';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';
import { FilterOrderNumberComponent } from '../filter-order-number/filter-order-number.component';
import { PickToteInFilterComponent } from '../pick-tote-in-filter/pick-tote-in-filter.component';
import { PickToteInductionFilter } from '../../models/PickToteInductionModel';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatInput } from '@angular/material/input';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-non-super-batch-orders',
  templateUrl: './non-super-batch-orders.component.html',
  styleUrls: ['./non-super-batch-orders.component.scss'],
})
export class NonSuperBatchOrdersComponent implements OnInit, AfterViewInit {
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private global: GlobalService,
    private Api: ApiFuntions,
    public inductionManagerApi: InductionManagerApiService
  ) {
    this.iInductionManagerApi = inductionManagerApi;
  }

  @ViewChild('table') table: MatTable<any>;
  @ViewChildren(MatInput) toteInputs!: QueryList<MatInput>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;


  
  elementData = [
    {
      orderNumber: 'Zone 1',
      zone: 'Location 1',
      priority: 'Location 1',
      requiredDate: '02/02/2024',
      totalOrderQty: '5',
    },
    {
      orderNumber: 'Zone 2',
      zone: 'Location 2',
      priority: 'Location 1',
      requiredDate: '02/02/2024',
      totalOrderQty: '5',
    },
    {
      orderNumber: 'Zone 3',
      zone: 'Location 3',
      priority: 'Location 1',
      requiredDate: '02/02/2024',
      totalOrderQty: '5',
    },
  ];

  displayedColumns: string[] = [
    'orderNumber',
    'zone',
    'priority',
    'requiredDate',
    'completedQuantity',
    'toteScanned',
  ];

  public iInductionManagerApi: IInductionManagerApiService;
  filters: PickToteInductionFilter[] = [];
  orderNumberFilter: string = '';
  dataSource: MatTableDataSource<any>;
  toteScanned: any;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.updatedPaginator();
    this.focusFirstInput();
  }

  rebind(data?: any[]) {
    this.dataSource = new MatTableDataSource(data);
    this.updatedPaginator();
    this.updateSorting();
  }

  updatedPaginator() {
    if (this.dataSource && this.dataSource.filteredData.length > 0)
      this.dataSource.paginator = this.paginator;
  }

  updateSorting() {
    if (this.dataSource && this.dataSource.filteredData.length > 0)
      this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction)
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    else this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    this.updateSorting();
  }

  filterOrderNum() {
    const dialogRef: any = this.global.OpenDialog(FilterOrderNumberComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      data: {
        OrderNumberFilter: this.orderNumberFilter,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.orderNumberFilter = result.orderNumberFilter
          // .split(',')
          .map((m: string) =>
            this.global.getTrimmedAndLineBreakRemovedString(m)
          );

        // send the currently selected order number filters to parent component via observable
        this.global.sendMessage({ orderNumberFilters: this.orderNumberFilter });
      }
    });
  }

  openColumnFilter() {
    const dialogRef: any = this.global.OpenDialog(PickToteInFilterComponent, {
      height: 'auto',
      width: Style.w786px,
      autoFocus: DialogConstants.autoFocus,
      data: {
        ColumnFilter: this.filters,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: PickToteInductionFilter[]) => {
      if (result) {
        this.filters = result;

        // send the currently selected column filters to parent component via observable
        this.global.sendMessage({ columnFilters: this.filters });
      }
    });
  }

  retrieveFilteredNonSuperBatchOrders(values: any) {
    this.Api.RetrieveNonSuperBatchOrders(values).subscribe((filteredOrders) => {
      let response = filteredOrders.data.result;

      if (response) {
        let mappedResponse = response.map((m) => {
          return {
            orderNumber: m.orderNumber,
            zone: m.zone,
            priority: m.priority,
            requiredDate: m.requiredDate,
            completedQuantity: m.completedQuantity,
          };
        });

        this.rebind(response);
        this.focusFirstInput();
      }
    });
  }

  focusFirstInput() {
    setTimeout(() => {
      const firstInput = this.toteInputs?.first;
      if (firstInput) {
        firstInput.focus();
      }
    });
  }

  onEnter(element: any) {
    const {
      completedQuantity,
      orderNumber,
      zone,
      priority,
      toteScanned,
      requiredDate,
    } = element;

    var valueToInduct = {
      orderNumber,
      zone,
      priority,
      requiredDate,
      completedQuantity,
      toteScanned,
      maxToteQuantity: 0,
      inductionType: 'NonSuperBatch',
    };

    let response: Observable<any> = this.iInductionManagerApi.PreferenceIndex();
    response.subscribe((res: any) => {
      if (res.data && res.isExecuted) {
        const values = res.data.imPreference;

        //Pick Tote Induction Settings
        valueToInduct.maxToteQuantity = values.maximumQuantityperTote;
        console.log(valueToInduct);

        // call api to induct this tote as per PLST-2754
        if (valueToInduct.toteScanned) {
          this.Api.PerformNonSuperBatchOrderInduction(valueToInduct).subscribe(
            (res: any) => {
              if (res.data && res.isExecuted) {
                this.global.ShowToastr(ToasterType.Success,res.responseMessage, ToasterTitle.Success);
              } else {
                this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
              }
            }
          );
        }
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.SomethingWentWrong,
          ToasterTitle.Error
        );
      }
    });
  }
}
