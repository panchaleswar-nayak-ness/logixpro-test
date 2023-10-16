import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/init/auth.service';
import { Router } from '@angular/router';

import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';

@Component({
  selector: 'app-la-location-assignment-quantities',
  templateUrl: './la-location-assignment-quantities.component.html',
  styleUrls: []
})
export class LaLocationAssignmentQuantitiesComponent implements OnInit {

  public userData:any;
  public totalCount:any;
  public count:any = 0
  public pick:any = 0
  public putaway:any = 0
  public listLabel:any;
  public listLabelFPZ:any;
  public iAdminApiService: IAdminApiService;

  constructor( 
             @Inject(MAT_DIALOG_DATA) public data: any,
             private Api: ApiFuntions,
             private authservice : AuthService,
             private adminApiService: AdminApiService,
             public dialogRef: MatDialogRef<any>,
             private router: Router,
              
             private global:GlobalService
             ) { 
              this.iAdminApiService = adminApiService;
             }

  ngOnInit(): void {
    this.userData = this.authservice.userData()
    this.getTotalValues()
  }

  getTotalValues(){
    this.totalCount = this.data.totalCount;
    this.totalCount.forEach(item => {
      switch (item.transactionType) {
        case "Count":
          this.count = item.count;
          break;
        case "Pick":
          this.pick = item.count;
          break;
        case "Put Away":
          this.putaway = item.count;
          break;
        default:
          break;
      }
    });

  }

  viewOrderSelection(event:any,index?){
    this.iAdminApiService.GetLocAssCountTable().subscribe((res:any)=>{
      if(res.isExecuted){
        res.data.tabIndex = index
        this.dialogRef.close(res.data);  
      }
      else{
        this.global.ShowToastr('error',res.responseMessage, 'Error!')
      }
    })
  }

  printShortage(){
    this.global.Print(`FileName:PreviewLocAssPickShort`);
    }

  printShortageZone(){
    this.global.Print(`FileName:PreviewLocAssPickShortFPZ`);
  }

  exitBack(){
    this.dialogRef.close();
    this.router.navigate([]).then((result) => {
      window.open(`/#/admin`, '_self');
    });
  }
}
