import { Component, OnInit } from '@angular/core';
import { DialogConstants, Style } from 'src/app/common/constants/strings.constants';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';
import { FilterOrderNumberComponent } from '../filter-order-number/filter-order-number.component';
import { PickToteInFilterComponent } from '../pick-tote-in-filter/pick-tote-in-filter.component';
import { PickToteInductionFilter } from '../../models/PickToteInductionModel';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-non-super-batch-orders',
  templateUrl: './non-super-batch-orders.component.html',
  styleUrls: ['./non-super-batch-orders.component.scss']
})
export class NonSuperBatchOrdersComponent implements OnInit {

  constructor(private global: GlobalService, private Api: ApiFuntions) { }

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
  
  filters: PickToteInductionFilter[] = [];
  dataSource = new MatTableDataSource(this.elementData);
 

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

  retrieveFilteredNonSuperBatchOrders(selectedZones: string[]) {
    this.Api.RetrieveNonSuperBatchOrders({ Zones: selectedZones }).subscribe(
      (filteredOrders) => {
        this.dataSource = new MatTableDataSource(filteredOrders.data);
      }
    );
  }
}
