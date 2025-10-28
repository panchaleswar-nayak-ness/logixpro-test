import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FocusMonitor } from '@angular/cdk/a11y';
import { GlobalService } from 'src/app/common/services/global.service';
import { BuildNewCartComponent } from '../dialogs/build-new-cart/build-new-cart.component';
import { CartManagementData, ValidationRequest, ValidationResponse } from '../interfaces/cart-management.interface';
import { DialogConstants, Style, ToasterTitle, ToasterType, ToasterMessages } from 'src/app/common/constants/strings.constants';
import { CartManagementApiService } from 'src/app/common/services/cart-management-api/cart-management-api.service';
import { ICartManagementApiService } from 'src/app/common/services/cart-management-api/cart-management-api.interface';

@Component({
  selector: 'app-induct-cart',
  templateUrl: './induct-cart.component.html',
  styleUrls: ['./induct-cart.component.scss']
})
export class InductCartComponent implements OnInit, AfterViewInit {

  cartId: string = '';

  // ViewChild reference for cart input
  @ViewChild('cartInputRef', { static: false }) cartInputRef!: ElementRef<HTMLInputElement>;

  // Emit when cart ID is validated successfully so parent can refresh grid
  @Output() cartValidated = new EventEmitter<string>();

  public iCartManagementApiService: ICartManagementApiService;

  constructor(
    private global: GlobalService,
    private cartApiService: CartManagementApiService,
    private focusMonitor: FocusMonitor
  ) {
    this.iCartManagementApiService = cartApiService;
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.focusCartIdInput();
  }

  private focusCartIdInput(): void {
    if (this.cartInputRef?.nativeElement) {
      this.focusMonitor.focusVia(this.cartInputRef, 'program');
      this.cartInputRef.nativeElement.select();
    }
  }

  async onInductCart(): Promise<void> {
    if (!this.cartId?.trim()){
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.PleaseEnterCartId, ToasterTitle.Error);
      return;
    }
    try {
      const payload: ValidationRequest = {
        cartId: this.cartId.trim(),
        workstationName: this.global.getCookie('WSName')
      };

      const res = await this.iCartManagementApiService.validateCart(payload);
      const details: ValidationResponse | undefined = res?.body?.value;

      if (details && details.status === 'Available') {
        // notify parent to refresh cart grid immediately
        this.cartValidated.emit(this.cartId.trim());
        const dialogData: CartManagementData = {
          mode: 'create',
          cartId: this.cartId.trim(),
          rows: details.cartRows || 3,
          cols: details.cartColumns || 4,
          isReadonly: true
        };

        const dialogRef = this.global.OpenDialog(BuildNewCartComponent, {
          data: dialogData,
          width: Style.w560px,
          height: DialogConstants.auto,
          disableClose: true
        }) as MatDialogRef<BuildNewCartComponent>;

        // Mirror parent subscriptions so grid reflects changes/cancellations
        const instance = dialogRef.componentInstance as BuildNewCartComponent;
        if (instance) {
          instance.cartDeleted.subscribe(() => this.cartValidated.emit(this.cartId.trim()));
          instance.cartUpdated.subscribe(() => this.cartValidated.emit(this.cartId.trim()));
        }
        dialogRef.afterClosed().subscribe(() => {
          // Ensure grid refresh on close (including cancel path)
          this.cartValidated.emit(this.cartId.trim());
          // Clear input and refocus for next scan/entry
          this.cartId = '';
          this.focusCartIdInput();
        });
      } else {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.InvalidCartID, ToasterTitle.Error);
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.UnableToValidateCartID, ToasterTitle.Error);
    }
  }

 

}
