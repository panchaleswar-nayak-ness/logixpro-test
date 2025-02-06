import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AuthService } from "src/app/common/init/auth.service";
import { CmAddNewItemToShipmentComponent } from "../cm-add-new-item-to-shipment/cm-add-new-item-to-shipment.component";
import { ConfirmationDialogComponent } from "src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component";
import { GlobalService } from "src/app/common/services/global.service";
import { IConsolidationApi } from "src/app/common/services/consolidation-api/consolidation-api-interface";
import { ConsolidationApiService } from "src/app/common/services/consolidation-api/consolidation-api.service";
import {
  ResponseStrings,
  ToasterType,
  ToasterTitle,
  DialogConstants,
  Style,
  ColumnDef,
} from "src/app/common/constants/strings.constants";
import { MatSelectChange } from "@angular/material/select";

import { FormControl } from "@angular/forms";
import { MatChipInputEvent } from "@angular/material/chips";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: "app-cm-shipping",
  templateUrl: "./cm-shipping.component.html",
  styleUrls: ["./cm-shipping.component.scss"],
})
export class CmShippingComponent implements OnInit {
  // for multi select start
  itemControl = new FormControl("");
  separatorKeysCodes: number[] = [ENTER, COMMA];
  selectedOrders: string[] = [];
  allOrders: string[] = [];
  filteredOrders: Observable<string[]>;
  // for multi select end

  orders: string[] = [];
  lastSelectedValue: string | null = null;
  ListOrderNumber: string[] = [];
  ListPreviousOrders: string[] = [];
  ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: "Hydrogen", weight: 1.0079, symbol: "H" },
    { position: 2, name: "Helium", weight: 4.0026, symbol: "He" },
    { position: 3, name: "Lithium", weight: 6.941, symbol: "Li" },
    { position: 4, name: "Beryllium", weight: 9.0122, symbol: "Be" },
  ];
  ContainerArray: any = [];
  dublicateContainerArray: any = [];
  isLoading: any = false;
  displayedColumns: string[] = [
    "containerID",
    "carrier",
    "trackingNum",
    ColumnDef.Action,
  ];
  tableData = this.ELEMENT_DATA;
  userData: any = {};
  orderNumber: any;
  shippingData: any[] = [];
  carriers: any[] = [];
  shippingComp: any = false;
  orderShipHidden: any = true;
  shippingPreferences: any = {};
  totalOrderCount: number = 0;
  oldOrderNum: string | null = null; // Global variable for initial value
  newOrderNum: string | null = null; // Global variable for newly added value

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
    this.filteredOrders = this.itemControl.valueChanges.pipe(
      startWith(""),
      map((value: string | null) =>
        value ? this.filterOrders(value) : this.allOrders.slice()
      )
    );
  }

  filterOrders(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allOrders.filter((order) =>
      order.toLowerCase().includes(filterValue)
    );
  }

  addOrderFromInput(event: MatChipInputEvent, input: HTMLInputElement): void {
    const value = (event.value || "").trim();
    // Allow only items that exist in the `allOrders` array
    const lastOrder = this.selectedOrders[this.selectedOrders.length - 1];

    if (
      value &&
      this.allOrders.includes(value) &&
      !this.selectedOrders.includes(value)
    ) {
      this.selectedOrders.push(value);
    }

    if (value !== lastOrder) {
      const Addobj = { newOrderNum: value, oldOrderNum: lastOrder };

      this.iConsolidationAPI
        .insertOrderShipping(Addobj)
        .subscribe((res: any) => {
          if (res?.isExecuted) {
            console.log("AddNewOrder", res.responseMessage);

            // Update oldOrderNum to the newly added value
            this.oldOrderNum = this.newOrderNum;

            // Update ListPreviousOrders to include the newly added order
            // this.ListPreviousOrders.push(newOrderNumbers);
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
            console.log("error: ", res.responseMessage);
          }
        });
    }

    // Clear the input field
    input.value = "";
    this.itemControl.setValue("");
  }

  addOrderFromAutocomplete(
    event: MatAutocompleteSelectedEvent,
    input: HTMLInputElement
  ): void {
    const value = event.option.value;
    // Clear the input field
    const lastOrder = this.selectedOrders[this.selectedOrders.length - 1];

    if (value && !this.selectedOrders.includes(value)) {
      this.selectedOrders.push(value);
    }

    if (value !== lastOrder) {
      const Addobj = { newOrderNum: value, oldOrderNum: lastOrder };

      this.iConsolidationAPI
        .insertOrderShipping(Addobj)
        .subscribe((res: any) => {
          if (res?.isExecuted) {
            console.log("AddNewOrder", res.responseMessage);

            // Update oldOrderNum to the newly added value
            this.oldOrderNum = this.newOrderNum;

            // Update ListPreviousOrders to include the newly added order
            // this.ListPreviousOrders.push(newOrderNumbers);
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
            console.log("error: ", res.responseMessage);
          }
        });
    }

    input.value = "";
    this.itemControl.setValue("");
  }

  removeOrder(item: string): void {
    const index = this.selectedOrders.indexOf(item);
    console.log("remove this item " + item);
    if (index >= 0) {
      if (this.selectedOrders.length === 1) {
        // Restrict removing the last item
        this.global.ShowToastr(
          ToasterType.Error,
          "At least one order must be selected.",
          ToasterTitle.Error
        );
        return;
      }
      this.selectedOrders.splice(index, 1);
      this.DeleteOrder(item);
    }
    console.log("After removal:", this.selectedOrders);
  }

  async DeleteOrder(OrderNumber: any) {

    let obj: any = {
      id: 0,
      orderNumber: OrderNumber,
      contId: "",
      carrier: "",
      trackingNum: "",
      CheckContId: false,
    };

    this.iConsolidationAPI.ShipmentItemDelete(obj).subscribe((res: any) => {
      if (res?.isExecuted) {
        console.log("Order deleted", res.responseMessage);
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          this.global.globalErrorMsg(),
          ToasterTitle.Error
        );
        console.log("ShipmentItemDelete", res.responseMessage);
      }
    });
  }

  ngOnInit(): void {
    // Ensure filteredOrders is initialized
    this.FilterDataInitialization();
    this.shippingData = [];
    this.carriers = [];

    // Load shipping data
    this.ShippingIndex();
    this.getShippingData();

  }

  FilterDataInitialization(){

    this.filteredOrders = this.itemControl.valueChanges.pipe(
      startWith(""),
      map((value: string | null) =>
        value ? this.filterOrders(value) : this.allOrders.slice()
      )
    );

    // Populate initial selectedOrders with this.orderNumber
    if (this.orderNumber && !this.selectedOrders.includes(this.orderNumber)) {
      this.selectedOrders.push(this.orderNumber);
    }

    // Ensure this.orderNumber exists in allOrders
    if (this.orderNumber && !this.allOrders.includes(this.orderNumber)) {
      this.allOrders.push(this.orderNumber);
    }
  }

  ShippingIndex() {
    if (this.orderNumber !== "") {
      let obj: any = { orderNumber: this.orderNumber };
      this.isLoading = true; // Start the loading indicator

      this.iConsolidationAPI.ShippingIndex(obj).subscribe(
        (res: any) => {
          try {
            if (res.isExecuted) {
              if (res?.data) {
                // Assign fetched data to component properties
                this.shippingData = res.data.shippingData;
                this.carriers = res.data.carriers;
                this.shippingPreferences = res.data.shippingPreferences;

                // Populate orders and allOrders arrays
                this.allOrders = res.data.orderNumbersList || [];

                this.filteredOrders = this.itemControl.valueChanges.pipe(
                  startWith(""),
                  map((value: string | null) =>
                    value ? this.filterOrders(value) : this.allOrders.slice()
                  )
                );

                this.shippingComp = res.data.shippingComp;
                this.orderShipHidden=this.shippingComp;
                this.orderNumber = res.data.orderNumber;
                this.isLoading = false;
              } else {
                // Handle case when `data` is null or undefined
                console.error("No data found in the response.");
              }
            } else {
              // Handle case when `isExecuted` is false
              this.global.ShowToastr(
                ToasterType.Error,
                this.global.globalErrorMsg(),
                ToasterTitle.Error
              );
              console.error("Error response:", res.responseMessage);
            }
          } catch (error) {
            // Catch any unexpected errors during processing
            console.error(
              "An error occurred while processing the ShippingIndex response:",
              error
            );
          } finally {
            // End the loading indicator
            this.isLoading = false;
          }
        },
        (error: any) => {
          // Handle HTTP or API call errors
          console.error("API Error:", error);
          this.global.ShowToastr(
            ToasterType.Error,
            "Failed to fetch shipping data.",
            ToasterTitle.Error
          );
          this.isLoading = false; // End the loading indicator
        }
      );
    } else {
      console.warn("Order number is empty. Skipping API call.");
    }
  }

  setNumericInRange(low: number, high: number | null): void {
    const element = document.getElementById("input") as HTMLInputElement;
    let value: any = element.value;
    while (
      (!$.isNumeric(value) && value.length > 0) ||
      (parseInt(value) > high! && high !== null)
    )
      value = value.substring(0, value.length - 1);
    if (low !== null && value < low && value.trim() !== "")
      value = low.toString();
    element.value = value;
  }

  async DeleteItem(element: any = null, i: any = null) {
    let obj: any = {
      id: i.ID,
      orderNumber: this.selectedOrders.map((order) => order.trim()).join(", "),
      contId: i.ContainerID,
      carrier: i.Carrier,
      trackingNum: i.TrackingNumber,
      CheckContId: true,
    };

    this.iConsolidationAPI.ShipmentItemDelete(obj).subscribe((res: any) => {
      if (res?.isExecuted) {
        this.shippingData = this.shippingData.slice(0, i);
        this.getShippingData();
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          this.global.globalErrorMsg(),
          ToasterTitle.Error
        );
        console.log("ShipmentItemDelete", res.responseMessage);
      }
    });
  }

  async updateShipmentItem(element: any) {
    let obj: any = {
      OrderNumber: this.selectedOrders.map((order) => order.trim()).join(", "),
      ContainerId: element.ContainerID,
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
      userField1: element.UserField1,
      userField2: element.UserField2,
      userField3: element.UserField3,
      userField4: element.UserField4,
      userField5: element.UserField5,
      userField6: element.UserField6,
      userField7: element.UserField7,
    };
    this.iConsolidationAPI.ShipmentItemUpdate(obj).subscribe((res: any) => {});
  }

  async ShippingCompShip() {
    if (this.ContainerArray.length === 0) {
      this.global.ShowToastr(ToasterType.Error, "Please add at least one container", ResponseStrings.Error);
      return;
    }
  
    const userConfirmed = await this.openConfirmationDialog("Are you sure you wish to complete this shipment?");
    if (!userConfirmed) return;
  
    let successOrders: string[] = [];
    let failedOrders: string[] = [];
  
    for (const orderNumber of this.selectedOrders) {
      try {
        const res: any = await this.iConsolidationAPI.SelCountOfOpenTransactionsTemp({ orderNumber }).toPromise();
  
        if (!res.isExecuted) {
          console.error("SelCountOfOpenTransactionsTemp", res.responseMessage);
          failedOrders.push(orderNumber);
          continue;
        }
  
        if (res.data === -1) {
          failedOrders.push(orderNumber);
        } else if (res.data === 0) {
          const isSuccess = await this.completeShipment(orderNumber);
          if (isSuccess) successOrders.push(orderNumber);
          else failedOrders.push(orderNumber);
        } else {
          const proceedWithShipment = await this.openConfirmationDialog(
            `Back Orders exist for this order: ${orderNumber}. Still complete shipment?`
          );
          if (proceedWithShipment) {
            const isSuccess = await this.completeShipment(orderNumber);
            if (isSuccess) successOrders.push(orderNumber);
            else failedOrders.push(orderNumber);
          } else {
            failedOrders.push(orderNumber);
          }
        }
      } catch (error) {
        console.error("API Error:", error);
        failedOrders.push(orderNumber);
      }
    }
  
    // Show final toaster messages after all orders are processed
    if (successOrders.length > 0) {
      this.global.ShowToastr(
        ToasterType.Success,
        `Orders marked as Shipping Complete: ${successOrders.join(", ")}`,
        "Success"
      );
    }
    if (failedOrders.length > 0) {
      this.global.ShowToastr(
        ToasterType.Error,
        `Failed to complete orders: ${failedOrders.join(", ")}`,
        ResponseStrings.Error
      );
    }
  
    this.ShippingIndex(); // Execute after all orders processed
  }
  
  async completeShipment(OrderNumber: any): Promise<boolean> {
    try {
      const res: any = await this.iConsolidationAPI.CompleteShipment({ orderNumber: OrderNumber }).toPromise();
      if (res?.isExecuted) {
        return true; // Success
      } else {
        console.error("CompleteShipment", res.responseMessage);
        return false; // Failed
      }
    } catch (error) {
      console.error("CompleteShipment API Error:", error);
      return false;
    }
  }
  
  async openConfirmationDialog(message: string): Promise<boolean> {
    const dialogRef = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: "auto",
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: { message },
    });
  
    return new Promise((resolve) => {
      dialogRef.afterClosed().subscribe((result) => resolve(result === ResponseStrings.Yes));
    });
  }
  
  openCmAddNewItem() {
    let dialogRef: any = this.global.OpenDialog(
      CmAddNewItemToShipmentComponent,
      {
        height: "auto",
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: { orderNumber: this.selectedOrders.join(", ") },
      }
    );
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.ShippingIndex();
        this.getShippingData();
      }
    });
  }

  calculateCube(element: any) {
    const matchedshippingData = this.shippingData.find(
      (x: any) => x.id === element.ID
    );
    const matchedContainerArray = this.ContainerArray.find(
      (x: any) => x.ID === element.ID
    );

    if (matchedshippingData) {
      matchedshippingData.cube =
        (element.Length * element.Width * element.Height) / 1728;
    } else {
      console.warn(`No matching shipping data found for ID: ${element.ID}`);
    }

    if (matchedContainerArray) {
      matchedContainerArray.Cube =
        (element.Length * element.Width * element.Height) / 1728;
    } else {
      console.warn(`No matching shipping data found for ID: ${element.ID}`);
    }
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
    this.iConsolidationAPI
      .viewShipping({ orderNum: this.orderNumber })
      .subscribe((res: any) => {
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
            Length: container.length,
          }));

          this.dublicateContainerArray = JSON.parse(
            JSON.stringify(this.ContainerArray)
          );
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
          console.log("ContainerData", res.responseMessage);
        }
      });
  }
}
