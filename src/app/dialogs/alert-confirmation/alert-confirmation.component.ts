import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert-confirmation',
  templateUrl: './alert-confirmation.component.html',
  styleUrls: ['./alert-confirmation.component.scss'],
})
export class AlertConfirmationComponent implements OnInit {
  message: any = '';
  heading: any = '';
  buttonFields: any = false;
  disableCancel=false;
  isAlert=false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>
  ) {}

  ngOnInit(): void {
    this.message=this.data.message;
    this.heading=this.data.heading;
    this.buttonFields=this.data.buttonField;
    this.isAlert=this.data && this.data.notificationPrimary;
  }
  ngAfterViewInit(){
    this.disableCancel=this.data.disableCancel?this.data.disableCancel:false;
    
  }
}
