import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-super-batch-orders',
  templateUrl: './super-batch-orders.component.html',
  styleUrls: ['./super-batch-orders.component.scss'],
})
export class SuperBatchOrdersComponent implements OnInit {
  constructor(
    private global: GlobalService, 
    private Api: ApiFuntions,
    public inductionManagerApi: InductionManagerApiService
  ) {
    this.iInductionManagerApi = inductionManagerApi;
  }

  displayedColumns: string[] = [
    'itemNumber',
    'priority',
    'quality',
    'requiredDate',
    'totalOrderQty',
    'toteScanned',
  ];

  elementData = [
    {
      itemNumber: 'Zone 1',
      priority: 'Location 1',
      quality: '1',
      requiredDate: '02/02/2024',
      totalOrderQty: '5',
    },
    {
      itemNumber: 'Zone 2',
      priority: 'Location 1',
      quality: '2',
      requiredDate: '02/02/2024',
      totalOrderQty: '5',
    },
    {
      itemNumber: 'Zone 3',
      priority: 'Location 1',
      quality: '3',
      requiredDate: '02/02/2024',
      totalOrderQty: '5',
    },
  ];

  public iInductionManagerApi: IInductionManagerApiService;
  filters: PickToteInductionFilter[] = [];
  orderNumberFilter: string = '';
  dataSource: any;
  toteScanned: any;

  ngOnInit(): void {
    // this.rebind(this.elementData);
  }

  rebind(data?: any[]) {
    let mappedData = data?.map((m) => {
      return {
        itemNumber: m.itemNumber,
        priority: m.minPriority,
        quality: m.quality,
        requiredDate: m.minRequiredDate,
        totalOrderQty: m.totalQuantity,
      };
    });

    // let dataToBind = mappedData ? mappedData : this.elementData;
    this.dataSource = new MatTableDataSource(mappedData);
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
      this.orderNumberFilter = result.orderNumberFilter
        .split(',')
        .map((m: string) => this.global.getTrimmedAndLineBreakRemovedString(m));
      this.global.sendMessage({ orderNumberFilters: this.orderNumberFilter });
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

  retrieveFilteredSuperBatchOrders(values: any) {
    this.Api.RetrieveSuperBatchOrders(values).subscribe((filteredOrders) => {
      this.rebind(filteredOrders.data);
    });
  }

  onEnter(element: any) {
    const {
      itemNumber,
      priority,
      warehouse,
      requiredDate,
      totalOrderQty,
      toteScanned,
    } = element;

    var quality = warehouse && warehouse !== '' ? warehouse.substr(1, 1) : '';

    var valueToInduct = {
      itemNumber,
      priority,
      quality,
      requiredDate,
      totalOrderQty,
      toteScanned,
      inductionType: '',
      maxToteQuantity: 0,
    };
    valueToInduct.inductionType = 'SuperBatch';

    let response: Observable<any> = this.iInductionManagerApi.PreferenceIndex();
    response.subscribe((res: any) => {
      if (res.data && res.isExecuted) {
        const values = res.data.imPreference;

        //Pick Tote Induction Settings
        valueToInduct.maxToteQuantity = values.maximumQuantityperTote;
        console.log(valueToInduct);

        // call api to induct this tote as per PLST-2772
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
