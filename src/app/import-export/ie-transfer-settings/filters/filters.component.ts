import { Component, EventEmitter,Output } from '@angular/core';
import {  UniqueConstants } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent {

  ELEMENT_DATA: any[] =[
    {trans_type: '10A'},
    {trans_type: '10A'},
    {trans_type: '10A'},
    {trans_type: '10A'},
    {trans_type: '10A'},
    {trans_type: '10A'},
    {trans_type: '10A'},
    {trans_type: '10A'},
    {trans_type: '10A'},
  ];

  displayedColumns: string[] = ['trans_type','import_date','order_no','item_no',UniqueConstants.Description,'trans_qty','priority'];
  tableData = this.ELEMENT_DATA;
  dataSourceList: any;

  @Output() back = new EventEmitter<string>();

  returnToPrev() {
    this.back.emit('back');
  }
}
