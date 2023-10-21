import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-batch-manager-detail-view',
  templateUrl: './batch-manager-detail-view.component.html',
  styleUrls: ['./batch-manager-detail-view.component.scss']
})
export class BatchManagerDetailViewComponent implements OnInit {

  fieldNames:any;
  public iAdminApiService: IAdminApiService;
  displayedColumns: string[] = ['item_no', 'description','transaction_qty','lotNo', 'expiration_date', 'uom', 'serial_no', 'notes','location','warehouse','userField1','userField2','toteID'];
  dataSource:any = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  constructor(private Api:ApiFuntions,private global : GlobalService, private _liveAnnouncer: LiveAnnouncer,private adminApiService: AdminApiService,@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<any>) { 

    this.iAdminApiService = adminApiService;
    
  }

  ngOnInit(): void {
    this.OSFieldFilterNames();
    this.dataSource = new MatTableDataSource(this.data);
    // this.dataSource.sort = this.sort
  }
  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  public OSFieldFilterNames() { 
    this.iAdminApiService.ColumnAlias().subscribe((res: any) => {
      if(res.isExecuted && res.data)
      {
        this.fieldNames = res.data;
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("ColumnAlias",res.responseMessage);

      }
   
    })
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

}
