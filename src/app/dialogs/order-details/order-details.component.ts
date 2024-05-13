import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderLine } from 'src/app/common/Model/bulk-transactions';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})
export class OrderDetailsComponent implements OnInit {

  ordersDisplayedColumns: string[] = ["orderNumber", "location", "itemNumber", "description", "userField1", 
    "transactionQuantity", "priority", "transactionType", "unitOfMeasure", "expirationDate", "lotNumber", 
    "serialNumber", "notes", "warehouse", "userField2", "toteId"];
  orders: OrderLine[]; 

  constructor( 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OrderDetailsComponent>
  ) {
    this.orders = data.details;
  }

  ngOnInit(): void {
  }

  closePopup(){
      this.dialogRef.close("Yes");
  }

}
