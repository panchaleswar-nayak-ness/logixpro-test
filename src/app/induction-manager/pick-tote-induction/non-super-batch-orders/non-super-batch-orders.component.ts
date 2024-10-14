import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  DialogConstants,
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

@Component({
  selector: 'app-non-super-batch-orders',
  templateUrl: './non-super-batch-orders.component.html',
  styleUrls: ['./non-super-batch-orders.component.scss'],
})
export class NonSuperBatchOrdersComponent implements OnInit, AfterViewInit {
  constructor(
    private global: GlobalService,
    private Api: ApiFuntions,
    public inductionManagerApi: InductionManagerApiService
  ) {
    this.iInductionManagerApi = inductionManagerApi;
  }

  @ViewChild('table') table: MatTable<any>;
  @ViewChild('toteTextbox', { static: true }) toteTextbox: MatInput;

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
    'totalOrderQty',
    'toteScanned',
  ];

  public iInductionManagerApi: IInductionManagerApiService;
  filters: PickToteInductionFilter[] = [];
  orderNumberFilter: string = '';
  dataSource: any;
  toteScanned: any;

  ngOnInit(): void {
    // this.rebind(this.elementData);
  }

  ngAfterViewInit() {
    // const firstRow = this.table.rows[0];
    // const firstRowTextbox = firstRow.querySelector('input');
    // firstRowTextbox.focus();
  }

  rebind(data?: any[]) {
    // let dataToBind = data ? data : this.elementData;
    this.dataSource = new MatTableDataSource(data);
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
          .split(',')
          .map((m: string) =>
            this.global.getTrimmedAndLineBreakRemovedString(m)
          );
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
        this.global.sendMessage({ columnFilters: this.filters });
      }
    });
  }

  retrieveFilteredNonSuperBatchOrders(values: any) {
    this.Api.RetrieveNonSuperBatchOrders(values).subscribe((filteredOrders) => {
      this.rebind(filteredOrders.data.result);
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
      inductionType: '',
      maxToteQuantity: 0,
    };
    valueToInduct.inductionType = 'NonSuperBatch';

    let response: Observable<any> = this.iInductionManagerApi.PreferenceIndex();
    response.subscribe((res: any) => {
      if (res.data && res.isExecuted) {
        const values = res.data.imPreference;

        //Pick Tote Induction Settings
        valueToInduct.maxToteQuantity = values.maximumQuantityperTote;
        console.log(valueToInduct);

        // call api to induct this tote as per PLST-2754
        if (valueToInduct.toteScanned) {
          this.Api.PerformOrderInduction(valueToInduct).subscribe(
            (res: any) => {
              if (res.data) {
              } else {
                this.global.ShowToastr(
                  ToasterType.Error,
                  ToasterMessages.SomethingWentWrong,
                  ToasterTitle.Error
                );
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
