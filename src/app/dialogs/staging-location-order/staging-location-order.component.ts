import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-staging-location-order',
  templateUrl: './staging-location-order.component.html',
  styleUrls: []
})
export class StagingLocationOrderComponent {
  @ViewChild('field_focus') field_focus: ElementRef;

  Order :any;  
  constructor(public dialogRef: MatDialogRef<any>) { }

  

  ngAfterViewInit(): void {
    this.field_focus.nativeElement.focus();
  }
async SubmitOrder(){ 
  if(this.Order) this.dialogRef.close(this.Order);  
}
closeOrder(){
   this.dialogRef.close(false);  
}
}
