import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

import { AuthService } from '../../../../app/init/auth.service'; 
import labels from '../../../labels/labels.json'
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
export interface PeriodicElement {
  name: string;
  position: number;
}
@Component({
  selector: 'app-set-column-seq',
  templateUrl: './set-column-seq.component.html',
  styleUrls: ['./set-column-seq.component.scss']

})
export class SetColumnSeqComponent implements OnInit {
  ELEMENT_DATA: PeriodicElement[] = [];
  public iAdminApiService: IAdminApiService;
  constructor(
    private Api: ApiFuntions, 
    private authService: AuthService,
    private adminApiService: AdminApiService,
    private global:GlobalService,
    public dialogRef: MatDialogRef<any> 
    ) { 
      this.iAdminApiService = adminApiService;

    } 
  dataSource :PeriodicElement[];

  ngOnInit(): void {
    this.dataSource = [];
    this.ELEMENT_DATA = []; 
  let payload = { 
    "viewName": "Inventory Map"
  }
    this.iAdminApiService.GetColumnSequenceDetail(payload).subscribe((res) => {
      if(res.isExecuted)
      {
        this.formatColumn(res.data.columnSequence);
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("GetColumnSequenceDetail",res.responseMessage);
      }
          
      
    });
  }

  @ViewChild('table') table: MatTable<PeriodicElement>;
  displayedColumns: string[] = ['position', 'name'];
  

  dropTable(event: CdkDragDrop<PeriodicElement[]>) {
    const prevIndex = this.dataSource.findIndex((d) => d === event.item.data);
    moveItemInArray(this.dataSource, prevIndex, event.currentIndex);
    this.table.renderRows();
  }

  formatColumn(column: any){
    column.map((val, i) => {
      this.ELEMENT_DATA.push({ position: i, name: val})
    })
    this.dataSource = this.ELEMENT_DATA;
  }
  
  saveColumnSeq(){
    let userData = this.authService.userData();
    let sortedColumn = this.dataSource.map(t=>t.name);
    let payload = {
      "columns": sortedColumn, 
      "viewName": "Inventory Map"
    }
    this.iAdminApiService.SaveColumns(payload).subscribe((res:any) => {
      if(res.isExecuted){
        this.global.ShowToastr('success',labels.alert.success, 'Success!');
      }
      else{
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("SaveColumns",res.responseMessage);
      }
      this.dialogRef.close('');
      
    });
      
  }

}
