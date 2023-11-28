import { Component } from '@angular/core';
import {  UniqueConstants } from 'src/app/common/constants/strings.constants';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-cm-carriers-add-delete-edit',
  templateUrl: './cm-carriers-add-delete-edit.component.html',
  styleUrls: ['./cm-carriers-add-delete-edit.component.scss']
})
export class CmCarriersAddDeleteEditComponent{
  elementData: PeriodicElement[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  ];  
  displayedColumns: string[] = [UniqueConstants.Select, 'action'];
  periodicElementTable = this.elementData;

}
