import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from 'src/app/init/auth.service';
import { CmAddNewItemToShipmentComponent } from '../cm-add-new-item-to-shipment/cm-add-new-item-to-shipment.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
];

@Component({
  selector: 'app-cm-shipping',
  templateUrl: './cm-shipping.component.html',
  styleUrls: ['./cm-shipping.component.scss']
})
export class CmShippingComponent implements OnInit {
  @ViewChild('freight_focus') freight_focus: ElementRef;
  IsLoading: any = false;
  displayedColumns: string[] = ['containerID',  'carrier', 'trackingNum', 'action'];
  tableData = ELEMENT_DATA;
  userData: any = {};
  orderNumber: any;
  shippingData: any[] = [];
  carriers: any[] = [];
  shippingComp: any = false;
  shippingPreferences: any = {};
  constructor(private Api: ApiFuntions, private authService: AuthService, private toast: ToastrService, private dialog: MatDialog,
    private global:GlobalService,
    private route: Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CmShippingComponent>,) {
    this.orderNumber = this.data.orderNumber;
    this.userData = this.authService.userData();
   
  }

  ngOnInit(): void { 

    this.shippingData = [];
    this.carriers = [];
     
    this.shippingComp = false;
    this.ShippingIndex();
  }
  ngAfterViewInit(): void {
    this.freight_focus.nativeElement.focus();
  }
  async ShippingIndex() {  
    if (this.orderNumber != "") {
      let obj: any = {
        orderNumber: this.orderNumber,
        userName: this.userData.userName,
        wsid: this.userData.wsid
      }
      this.IsLoading = true;
      this.Api.ShippingIndex(obj).subscribe((res: any) => {
        if (res?.isExecuted) {
          this.shippingData = res.data.shippingData;
          this.carriers = res.data.carriers;
          this.shippingPreferences = res.data.shippingPreferences;
          let indx=0;
          for (let key in this.shippingPreferences) { 
            if((this.displayedColumns.indexOf(key) <= -1) && this.shippingPreferences[key]){
          this.displayedColumns.splice((3+indx), 0, key);
          indx=indx+1;
            }
          }
         this.shippingComp = res.data.shippingComp;
          this.orderNumber = res.data.orderNumber;
          this.IsLoading = false; 
        }else  this.IsLoading = false; 
      });
    }
   
  }
  setNumericInRange(low: number, high: number | null): void {
    const element = document.getElementById('input') as HTMLInputElement;
    let value: any = element.value;
    while ((!$.isNumeric(value) && value.length > 0) || (parseInt(value) > high! && high !== null)) {
      value = value.substring(0, value.length - 1);
    };
    if (low !== null && value < low && value.trim() !== '') {
      value = low.toString();
    }
    element.value = value;
  }

  async DeleteItem(element: any,i:any=null) {
    let obj: any =
    {
      id: element.id,
      orderNumber: this.orderNumber,
      contId: element.containerID,
      carrier: element.carrier,
      trackingNum: element.trackingNum,
      user: this.userData.userName,
      wsid: this.userData.wsid
    }
    this.Api.ShipmentItemDelete(obj).subscribe((res: any) => {
      if (res?.isExecuted) {
        this.shippingData = this.shippingData.slice(0,i);
      }
    });
  }
  async updateShipmentItem(element: any) {
    let obj: any = {
      id: element.id,
      carrier: element.carrier,
      trackingNum: element.trackingNum,
      "freight": element.freight,
      "freight1": element.freight1,
      "freight2": element.freight2,
      "weight": element.weight,
      "length": element.length ? element.length : 0,
      "width": element.width ? element.width : 0,
      "height": element.height ? element.height : 0,
      "cube": element.cube
    }
    this.Api.ShipmentItemUpdate(obj).subscribe((res: any) => {
    });
  }
  async ShippingCompShip() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        message: "Are you sure you wish to complete this shipment?",
      },
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') { 
      let obj: any = {
        orderNumber: this.orderNumber
      }
      this.Api.SelCountOfOpenTransactionsTemp(obj).subscribe((res: any) => {
        if (res) {
          if (res.data == -1) {
            this.toast.error("An error has occurred", "Error", { positionClass: 'toast-bottom-right', timeOut: 2000 });
          } else if (res.data == 0) {
            //call function to complete shipment
            this.completeShipment();
          } else {
            //for temp
            let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              height: 'auto',
              width: '560px',
              autoFocus: '__non_existing_element__',
      disableClose:true,
              data: {
                message: "Back Orders exist for this order number. Still complete shipment?",
              },
            });
          
            dialogRef.afterClosed().subscribe((result) => {
              if (result == 'Yes') {  
              this.completeShipment();
            }})
          }
        }
      });
    
    }});
 

  }
  async completeShipment() {

    let obj: any = {
      orderNumber: this.orderNumber,
      userName: this.userData.userName,
      wsid: this.userData.wsid
    }
    this.Api.CompleteShipment(obj).subscribe((res: any) => {
      if (res?.isExecuted) {
        this.toast.success(`Order Number: ${this.orderNumber} is marked as Shipping Complete`, "Success", { positionClass: 'toast-bottom-right', timeOut: 2000 });
      } else {
        this.toast.error("An error has occurred", "Error", { positionClass: 'toast-bottom-right', timeOut: 2000 });
      }
    });
  }
  openCmAddNewItem() {
    let dialogRef = this.dialog.open(CmAddNewItemToShipmentComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: { orderNumber: this.orderNumber }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) this.ShippingIndex();
    })
  }

  calculateCube(element){
    this.shippingData.filter((x:any) => x.id == element.id)[0].cube = ((element.length * element.width * element.height) / 1728);
  }

  printAll(){
    this.global.Print(`FileName:PrintShipOrderPL|OrderNum:${this.orderNumber}`);
  }

  PrintItem(element: any,i:any=null){
    this.global.Print(`FileName:PrintShipContPL|OrderNum:${this.orderNumber}|ContID:${element.containerID}`);
  }
}
