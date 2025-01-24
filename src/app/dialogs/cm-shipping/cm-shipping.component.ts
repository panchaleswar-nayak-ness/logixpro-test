import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/common/init/auth.service';
import { CmAddNewItemToShipmentComponent } from '../cm-add-new-item-to-shipment/cm-add-new-item-to-shipment.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import {  ResponseStrings ,ToasterType,ToasterTitle,DialogConstants,Style,ColumnDef} from 'src/app/common/constants/strings.constants';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-cm-shipping',
  templateUrl: './cm-shipping.component.html',
  styleUrls: ['./cm-shipping.component.scss'],
})
export class CmShippingComponent implements OnInit {
  ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  ];
  ContainerArray: any = [];
  dublicateContainerArray: any = [];
  isLoading: any = false;
  displayedColumns: string[] = [
    'containerID',
    'carrier',
    'trackingNum',
    ColumnDef.Action,
  ];
  tableData = this.ELEMENT_DATA;
  userData: any = {};
  orderNumber: any;
  shippingData: any[] = [];
  carriers: any[] = [];
  shippingComp: any = false;
  shippingPreferences: any = {};

  public iConsolidationAPI: IConsolidationApi;

  constructor(
    public consolidationAPI: ConsolidationApiService,
    private authService: AuthService,
    private global: GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CmShippingComponent>
  ) {
    this.orderNumber = this.data.orderNumber;
    this.userData = this.authService.userData();
    this.iConsolidationAPI = consolidationAPI;
  }

  ngOnInit(): void {
    this.shippingData = [];
    this.carriers = [];
    this.shippingComp = false;
    this.ShippingIndex();
    this.getShippingData();
  }

  async ShippingIndex() {
    if (this.orderNumber != '') {
      let obj: any = { orderNumber: this.orderNumber };
      this.isLoading = true;
      this.iConsolidationAPI.ShippingIndex(obj).subscribe((res: any) => {
        if (res.isExecuted)
          if (res?.data) {
            this.shippingData = res.data.shippingData;
            this.carriers = res.data.carriers;
            this.shippingPreferences = res.data.shippingPreferences;
            let indx = 0;
            for (let key in this.shippingPreferences) {
              if (this.displayedColumns.indexOf(key) <= -1 && this.shippingPreferences[key] ) {
                this.displayedColumns.splice(3 + indx, 0, key);
                indx = indx + 1;
              }
            }
            this.displayedColumns = this.displayedColumns.filter((x: string) => !x.includes("Alias"));
            this.shippingComp = res.data.shippingComp;
            this.orderNumber = res.data.orderNumber;
            this.isLoading = false;
          } else this.isLoading = false;
        else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
          console.log('ShippingIndex', res.responseMessage);
        }
      });
    }
  }

  setNumericInRange(low: number, high: number | null): void {
    const element = document.getElementById('input') as HTMLInputElement;
    let value: any = element.value;
    while (
      (!$.isNumeric(value) && value.length > 0) ||
      (parseInt(value) > high! && high !== null)
    )
      value = value.substring(0, value.length - 1);
    if (low !== null && value < low && value.trim() !== '')
      value = low.toString();
    element.value = value;
  }

  async DeleteItem(element: any=null, i: any = null) {
    
    let obj: any = {
      id: i.ID,
      orderNumber: this.orderNumber,
      contId: i.ContainerID,
      carrier: i.Carrier,
      trackingNum: i.TrackingNumber,
    };
  
    this.iConsolidationAPI.ShipmentItemDelete(obj).subscribe((res: any) => {
      if (res?.isExecuted) {
       this.shippingData = this.shippingData.slice(0, i);
       this.getShippingData();
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log('ShipmentItemDelete', res.responseMessage);
      }
    });
  }

  async updateShipmentItem(element: any) {
    let obj: any = {
      id: element.ID,
      carrier: element.Carrier,
      trackingNum: element.TrackingNumber,
      freight: element.Freight,
      freight1: element.Freight1,
      freight2: element.Freight2,
      weight: element.Weight,
      length: element.Length ? element.Length : 0,
      width: element.Width ? element.Width : 0,
      height: element.Height ? element.Height : 0,
      cube: element.Cube,
      userField1:element.UserField1,
      userField2:element.UserField2,
      userField3:element.UserField3,
      userField4:element.UserField4,
      userField5:element.UserField5,
      userField6:element.UserField6,
      userField7:element.UserField7,
    };
    this.iConsolidationAPI.ShipmentItemUpdate(obj).subscribe((res: any) => {});
  }

  async ShippingCompShip() {
    let dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: 'Are you sure you wish to complete this shipment?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == ResponseStrings.Yes) {
        let obj: any = { orderNumber: this.orderNumber };
        this.iConsolidationAPI.SelCountOfOpenTransactionsTemp(obj).subscribe(
          (res: any) => {
            if (res.isExecuted) {
              if (res.data == -1)
                this.global.ShowToastr(
                  ToasterType.Error,
                  'An error has occurred',
                  ResponseStrings.Error
                );
              else if (res.data == 0) this.completeShipment();
              else {
                let dialogRef: any = this.global.OpenDialog(
                  ConfirmationDialogComponent,
                  {
                    height: 'auto',
                    width: Style.w560px,
                    autoFocus: DialogConstants.autoFocus,
                    disableClose: true,
                    data: {
                      message:
                        'Back Orders exist for this order number. Still complete shipment?',
                    },
                  }
                );

                dialogRef.afterClosed().subscribe((result) => {
                  if (result == ResponseStrings.Yes) this.completeShipment();
                });
              }
            } else {
              this.global.ShowToastr(
                ToasterType.Error,
                this.global.globalErrorMsg(),
                ToasterTitle.Error
              );
              console.log(
                'SelCountOfOpenTransactionsTemp',
                res.responseMessage
              );
            }
          }
        );
      }
    });
  }

  async completeShipment() {
    let obj: any = { orderNumber: this.orderNumber };
    this.iConsolidationAPI.CompleteShipment(obj).subscribe((res: any) => {
      if (res?.isExecuted) {
        this.global.ShowToastr(
          ToasterType.Success,
          `Order Number: ${this.orderNumber} is marked as Shipping Complete`,
          'Success'
        );
        this.ShippingIndex();
      } else {
        this.global.ShowToastr(ToasterType.Error, 'An error has occurred', ResponseStrings.Error);
        console.log('CompleteShipment', res.responseMessage);
      }
    });
  }

  openCmAddNewItem() {
    let dialogRef: any = this.global.OpenDialog(
      CmAddNewItemToShipmentComponent,
      {
        height: 'auto',
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: { orderNumber: this.orderNumber },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
         this.ShippingIndex();
         this.getShippingData();
      }
    });
  }

  calculateCube(element) {
    this.shippingData.filter((x: any) => x.id == element.id)[0].cube =
      (element.length * element.width * element.height) / 1728;
  }

  printAll() {
    this.global.Print(`FileName:PrintShipOrderPL|OrderNum:${this.orderNumber}`);
  }

  PrintItem(element: any, i: any = null) {
    this.global.Print(
      `FileName:PrintShipContPL|OrderNum:${this.orderNumber}|ContID:${i.ContainerID}`
    );
  }
  parentContainers: any = [];
  getShippingData() {
    
    this.iConsolidationAPI.viewShipping({ orderNum: this.orderNumber }).subscribe(
      (res: any) => {

        if (res.isExecuted && res.data.shipTable) {
          
          this.ContainerArray = [];

          res.data.shipTable.forEach((container: any, i) => {
           
            this.parentContainers.push(container.containerID);
            this.ContainerArray.push(container.containerID);
          
          });

          this.ContainerArray = res.data.shipTable.map((container: any) => ({
            ID: container.id,
            ContainerID: container.containerID, // Ensure the property matches
            Carrier: container.carrierName,
            TrackingNumber: container.trackingNumber,
            Freight: container.freight,
            Freight1: container.freight1,
            Freight2: container.freight2,
            Weight: container.weight,
            Width: container.width,
            Height: container.height,
            UserField1: container.userField1,
            UserField2: container.userField2,
            UserField3: container.userField3,
            UserField4: container.userField4,
            UserField5: container.userField5,
            UserField6: container.userField6,
            UserField7: container.userField7,
            Cube: container.cube,
            Length:container.length
            }));
            
          this.dublicateContainerArray = JSON.parse(
            JSON.stringify(this.ContainerArray)
          );
        } 
        
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log('ContainerData', res.responseMessage);
        }
      }
    );
  }
}
