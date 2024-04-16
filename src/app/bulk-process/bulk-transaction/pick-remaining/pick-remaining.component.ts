import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef  } from '@angular/material/dialog'; 

@Component({
  selector: 'app-pick-remaining',
  templateUrl: './pick-remaining.component.html',
  styleUrls: ['./pick-remaining.component.scss'],
})
export class PickRemainingComponent implements OnInit {
   ordersDisplayedColumns: string[] = ["zone", "orderNumber", "toteNumber", "toteID", "picksQTY"];
  orders:any = []; 
  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any ,
    public dialogRef: MatDialogRef<PickRemainingComponent>
  ) {  
    this.orders = this.data;
  }

  ngOnInit(): void {
 
  }
  ClosePopup(){
      this.dialogRef.close("Yes");
  }
}
