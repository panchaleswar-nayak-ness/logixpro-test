import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ItemNumUpdateConfirmationComponent } from '../item-num-update-confirmation/item-num-update-confirmation.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { Placeholders, StringConditions ,Style} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-item-number',
  templateUrl: './item-number.component.html',
  styleUrls: ['./item-number.component.scss']
})
export class ItemNumberComponent implements OnInit {
  placeholders = Placeholders;
  @ViewChild('itm_nmb') itmNmb: ElementRef;

  addItem : boolean = true;
  submit: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:GlobalService
  ) { }

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
    else if (this.data.addItem) {
      this.addItem = true;
      this.data.itemNumber="";
      this.data.description="";
    } 
    else {
      this.addItem = false;
    }   
     
  }
  ngAfterViewInit() {
    this.itmNmb.nativeElement.focus();
  }

  onNoClick(onsubmit: any, status : any): void {
    if(status == 'createNew'){
      this.submit = true;
      if(this.addItem && onsubmit){
        if(this.data.itemNumber && this.data.description){
          this.dialogRef.close(  {itemNumber : this.data.itemNumber, description : this.data.description} );
        }
      }
    } else if ( status == 'update'){
      if(this.data.newItemNumber){
        const confirmationdialogRef:any = this.dialog.OpenDialog(ItemNumUpdateConfirmationComponent, { width: Style.w560px });

        confirmationdialogRef.afterClosed().subscribe((res) => {
          if(res == StringConditions.Yes) this.dialogRef.close( this.data.newItemNumber );
        })
      }
    }
  }

}
