import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service';
import { FormControl, FormGroup,Validators } from '@angular/forms';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

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
  reasonTextForm = new FormGroup({
    reason: new FormControl('' ,[Validators.pattern(/\s/), Validators.required])
  
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<HoldReasonComponent>,
    private authService: AuthService,
    private Api: ApiFuntions,
    private toastr: ToastrService
  ) {}

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
    
    this.Api
      .DeallocateTransactions(this.payload)
      .subscribe((res: any) => {
        if (res.isExecuted) {
          this.toastr.success(res.responseMessage, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
          this.dialogRef.close({ isExecuted: true });
        } else {
          this.toastr.error(res.responseMessage, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
          this.dialogRef.close({ isExecuted: false });
        }
      });
  }
}
