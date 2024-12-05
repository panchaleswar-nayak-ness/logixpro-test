import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UniqueConstants, ColumnDef} from 'src/app/common/constants/strings.constants';
import { AppRoutes } from 'src/app/common/constants/menu.constants';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1089, name: '12345', weight: 500, symbol: '2541',},
  {position: 1089, name: '10086', weight: 300, symbol: '3021',},
  {position: 1089, name: '6521', weight: 500, symbol: '1234',},
  {position: 1089, name: '5213', weight: 2000, symbol: '90000',},
 ];

@Component({
  selector: 'app-ccdiscrepancies',
  templateUrl: './ccdiscrepancies.component.html',
  styleUrls: []
})
export class CCDiscrepanciesComponent{

  displayedColumns: string[] = [UniqueConstants.position, 'name', 'weight', 'symbol', 'ex', 'srno', ColumnDef.Action];
  tableData = ELEMENT_DATA;

  constructor(private router: Router) { }

  createTransaction(){
    this.router.navigate([AppRoutes.AdminCreateCounts]);
  }
}
