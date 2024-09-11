import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConstants, Style } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { SelectZonesComponent } from 'src/app/dialogs/select-zones/select-zones.component';
import { PickToteInFilterComponent } from './pick-tote-in-filter/pick-tote-in-filter.component';
import { FilterOrderNumberComponent } from './filter-order-number/filter-order-number.component';

@Component({
  selector: 'app-pick-tote-induction',
  templateUrl: './pick-tote-induction.component.html',
  styleUrls: ['./pick-tote-induction.component.scss']
})
export class PickToteInductionComponent implements OnInit {

  constructor(private global: GlobalService){}
  displayedColumns: string[] = [
    'orderNumber',
    'startZone',
    'priority',
    'requiredDate',
    'totalOrderQty',
    'toteScanned',
  ];

  elementData = [
    { orderNumber: 'Zone 1', startZone: 'Location 1', priority: 'Location 1', requiredDate:'02/02/2024', totalOrderQty: "5" },
    { orderNumber: 'Zone 2', startZone: 'Location 2', priority: 'Location 1', requiredDate:'02/02/2024', totalOrderQty: "5" },
    { orderNumber: 'Zone 3', startZone: 'Location 3', priority: 'Location 1', requiredDate:'02/02/2024', totalOrderQty: "5" }
  ];
  dataSource = new MatTableDataSource(this.elementData);
  ngOnInit(): void {
  }

 

  openColumnFilter(){
    const dialogRef:any = this.global.OpenDialog(PickToteInFilterComponent, {
      height: 'auto',
      width: Style.w786px,
      autoFocus: DialogConstants.autoFocus,
    disableClose:true,
    });
  }

  
  filterOrderNum(){
    const dialogRef:any = this.global.OpenDialog(FilterOrderNumberComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
    disableClose:true,
    });
  }


  openSelectZones(){
    const dialogRef:any = this.global.OpenDialog(SelectZonesComponent, {
      height: 'auto',
      width: '60%',
      autoFocus: DialogConstants.autoFocus,
    disableClose:true,
   
    });
  }

}
