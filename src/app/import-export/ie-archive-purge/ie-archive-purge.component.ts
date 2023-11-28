import { Component} from '@angular/core';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { DialogConstants } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-ie-archive-purge',
  templateUrl: './ie-archive-purge.component.html',
  styleUrls: ['./ie-archive-purge.component.scss']
})
export class IeArchivePurgeComponent  {

  ELEMENT_DATA: any[] =[
    {table_name: 'Archive Event Log'},
    {table_name: 'Archive Export Transactions History'},
    {table_name: 'Archive Import Transactions History'},
    {table_name: 'Archive Induction Transactions'},
    {table_name: 'Archive Ship Trans History'},
    {table_name: 'Archive Shipping History'},
    {table_name: 'Archive Transactions History'},
    {table_name: 'Event Log'},
    {table_name: 'Export Transactions History'},
    {table_name: 'Import Transactions History'},
    {table_name: 'Induction Transactions History'},
    {table_name: 'Transactions History'}
  ];

  displayedColumns: string[] = ['table_name','purge_days','archive'];
  tableData = this.ELEMENT_DATA;
  dataSourceList: any

  constructor(
    private global:GlobalService,
  ) { }

  IeImportAllDialog(){
     this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: '550px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
  }
}
