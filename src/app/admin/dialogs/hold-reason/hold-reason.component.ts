import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';

import { AuthService } from 'src/app/init/auth.service';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-hold-reason',
  templateUrl: './hold-reason.component.html',
  styleUrls: [],
})
export class HoldReasonComponent implements OnInit {
  @ViewChild('order_text') order_text: ElementRef;

  payload;
  userData;
  reason;
  public iAdminApiService: IAdminApiService;
  reasonTextForm = new FormGroup({
    reason: new FormControl('' ,[Validators.pattern(/\s/), Validators.required])
  
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private adminApiService: AdminApiService,
    private global:GlobalService,
    public dialogRef: MatDialogRef<HoldReasonComponent>,
    private authService: AuthService,
    private Api: ApiFuntions,
   ) {
    this.iAdminApiService = adminApiService;

  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }

  ngAfterViewInit() {
    
    this.order_text.nativeElement.focus();
  }
  close(){
    this.dialogRef.close({ isExecuted: false });

  }
  onSubmit() {
    this.payload = {
      Reel: this.data.reel,
      OrderItem: this.data.orderItem,
      Order: this.data.Order,
      Reason: this.reason,
      ID: this.data.id,
      UserName: this.data.reel,
    };
    
    this.iAdminApiService
      .DeallocateTransactions(this.payload)
      .subscribe((res: any) => {
        if (res.isExecuted) {
          this.global.ShowToastr('success',res.responseMessage, 'Success!');
          this.dialogRef.close({ isExecuted: true });
        } else {
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
          this.dialogRef.close({ isExecuted: false });
        }
      });
  }
}
