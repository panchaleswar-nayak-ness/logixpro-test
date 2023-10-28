import { Component } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-item-num-update-confirmation',
  templateUrl: './item-num-update-confirmation.component.html',
  styleUrls: []
})
export class ItemNumUpdateConfirmationComponent{

  isChecked = true;

  constructor(
    public dialogRef: MatDialogRef<ItemNumUpdateConfirmationComponent>,
  ) { }

 
  checkOptions(event: MatCheckboxChange): void {
    if(event.checked){
     this.isChecked = false;
    }
    else{
     this.isChecked = true;
    }
   }

   onConfirm(){
    this.dialogRef.close("Yes");
   }
   
}
