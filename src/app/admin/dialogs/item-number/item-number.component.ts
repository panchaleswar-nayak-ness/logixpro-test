import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ItemNumUpdateConfirmationComponent } from '../item-num-update-confirmation/item-num-update-confirmation.component';

@Component({
  selector: 'app-item-number',
  templateUrl: './item-number.component.html',
  styleUrls: []
})
export class ItemNumberComponent implements OnInit {
  @ViewChild('itm_nmb') itm_nmb: ElementRef;
  // updateItemNumber : boolean = true;
  addItem : boolean = true;
  submit: boolean = false;

  constructor(
              public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private confirmationdialog: MatDialog) { }

  ngOnInit(): void { 

    if(this.data.fromPutaways){
      this.addItem = true;
      this.data.description="";
    }
    else if(this.data.fromInventoryMaster)
    {
      this.data.itemNumber = "";
      this.data.description = "";
    }
    else 
    {
      
    
    if (this.data.addItem) {
      this.addItem = true;
      this.data.itemNumber="";
      this.data.description="";
    } else {
      this.addItem = false;
    }   
    }
     
  }
  ngAfterViewInit() {
    this.itm_nmb.nativeElement.focus();
  }

  onNoClick(onsubmit: any, status : any): void {
    
    
    if(status == 'createNew'){
    this.submit= true;
    if(this.addItem && onsubmit){
      if(this.data.itemNumber && this.data.description){
      
        this.dialogRef.close(  {itemNumber : this.data.itemNumber, description : this.data.description} );
      }
    } else {
      this.dialogRef.close();
    }
    } else if ( status == 'update'){
      if(this.data.newItemNumber){
      const confirmationdialogRef = this.confirmationdialog.open(ItemNumUpdateConfirmationComponent, {
        width: '560px'
      });
      confirmationdialogRef.afterClosed().subscribe((res) => {
        if(res=='Yes'){
          this.dialogRef.close( this.data.newItemNumber );
        }
      })
    }
    }
  }

}
