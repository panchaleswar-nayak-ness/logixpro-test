import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/init/auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';

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
  

  constructor(private dialog: MatDialog,
             @Inject(MAT_DIALOG_DATA) public data: any,
             private Api: ApiFuntions,
             private authservice : AuthService,
             public dialogRef: MatDialogRef<any>,
             private router: Router,
             private toastr: ToastrService, 
             private global:GlobalService
             ) { }

  ngOnInit(): void {
    this.userData = this.authservice.userData()
    this.getTotalValues()
  }

  getTotalValues(){
    this.totalCount = this.data.totalCount;

    this.totalCount.forEach(item => {
      if (item.transactionType === "Count") {
        this.count = item.count;
      } else if (item.transactionType === "Pick") {
        this.pick = item.count;
      } else if (item.transactionType === "Put Away") {
        this.putaway = item.count;
      }
    });

  }

  viewOrderSelection(event:any,index?){
    
    this.Api.GetLocAssCountTable().subscribe((res:any)=>{
      if(res.isExecuted){
        res.data.tabIndex = index
        this.dialogRef.close(res.data);  
      }
      else{
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        })
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
