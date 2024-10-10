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
    'itemNumber',
    'priority',
    'quality',
    'requiredDate',
    'totalOrderQty',
    'toteScanned'
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

  dataSource = new MatTableDataSource(this.elementData);
  filters: PickToteInductionFilter[] = [];

  ngOnInit(): void {
    this.rebind(this.elementData);
  }

  rebind(data?: any[]) {
    let dataToBind = data ? data : this.elementData;
    this.dataSource = new MatTableDataSource(dataToBind);
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

  onEnter(element){
    console.log(element);
    // TODO: call api to induct this tote as per PLST-2772
  }
}
