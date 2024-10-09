import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConstants, Style } from 'src/app/common/constants/strings.constants';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';
import { FilterOrderNumberComponent } from '../filter-order-number/filter-order-number.component';
import { PickToteInFilterComponent } from '../pick-tote-in-filter/pick-tote-in-filter.component';
import { PickToteInductionFilter } from '../../models/PickToteInductionModel';

@Component({
  selector: 'app-super-batch-orders',
  templateUrl: './super-batch-orders.component.html',
  styleUrls: ['./super-batch-orders.component.scss']
})
export class SuperBatchOrdersComponent implements OnInit {

  constructor(private global: GlobalService, private Api: ApiFuntions) { }

  displayedColumns: string[] = [
    'orderNumber',
    'zone',
    'priority',
    'requiredDate',
    'totalOrderQty',
    'toteScanned',
  ];

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

  dataSource = new MatTableDataSource(this.elementData);
  filters: PickToteInductionFilter[] = [];

  ngOnInit(): void {
  }

  filterOrderNum() {
    const dialogRef: any = this.global.OpenDialog(FilterOrderNumberComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });
  }

  openColumnFilter() {
    const dialogRef: any = this.global.OpenDialog(PickToteInFilterComponent, {
      height: 'auto',
      width: Style.w786px,
      autoFocus: DialogConstants.autoFocus,
      data: this.filters,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.filters = result;
      }
    });
  }

  retrieveFilteredSuperBatchOrders(selectedZones: string[]) {
    this.Api.RetrieveSuperBatchOrders({ Zones: selectedZones }).subscribe(
      (filteredOrders) => {
        this.dataSource = new MatTableDataSource(filteredOrders.data);
      }
    );
  }
}
