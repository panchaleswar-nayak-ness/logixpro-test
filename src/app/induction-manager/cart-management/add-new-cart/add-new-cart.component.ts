import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FocusMonitor } from '@angular/cdk/a11y';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterType, ToasterTitle, ToasterMessages, Style } from 'src/app/common/constants/strings.constants';
import { AlertConfirmationComponent } from '../../../dialogs/alert-confirmation/alert-confirmation.component';
import { ConfirmationHeadings, ConfirmationMessages } from 'src/app/common/constants/strings.constants';
import { TotePosition } from '../tote-position-grid/tote-position-grid.component';
import { AddCartRequest, AddCartResponse, ValidateCartIdResponse } from '../interfaces/cart-management.interface';
import { CartManagementApiService } from 'src/app/common/services/cart-management-api/cart-management-api.service';
import { ICartManagementApiService } from 'src/app/common/services/cart-management-api/cart-management-api.interface';

// Constants for this component
const VALIDATION_LIMITS = {
  POSITION_COUNT_MIN: 1,
  POSITION_COUNT_MAX: 8,
  SHELVE_COUNT_MIN: 1,
  SHELVE_COUNT_MAX: 5,
  CART_ID_MAX_LENGTH: 50
} as const;

@Component({
  selector: 'app-add-new-cart',
  templateUrl: './add-new-cart.component.html',
  styleUrls: ['./add-new-cart.component.scss']
})
export class AddNewCartComponent implements OnInit {
  // Form and state management
  cartForm: FormGroup;
  showAdditionalFields: boolean = false;
  showToteGrid: boolean = false;
  isLoading: boolean = false;
  
  // Input values
  positionCountInput: number | null = null;
  shelveCountInput: number | null = null;
  
  // Grid configuration
  cols: number = 4;
  rows: number = 3;
  positions: TotePosition[] = [];
  selectedPosition: number = 0;

  // ViewChild for Cart ID input
  @ViewChild('cartInputFocus', { static: true }) cartIdInputRef!: ElementRef<HTMLInputElement>;

  // ViewChild for position count input focus
  @ViewChild('positionCountInputRef', { static: false }) positionCountInputRef!: ElementRef<HTMLInputElement>;

  // API service
  public iCartManagementApiService: ICartManagementApiService;

  constructor(
    private fb: FormBuilder,
    private global: GlobalService,
    private cartApiService: CartManagementApiService,
    private focusMonitor: FocusMonitor,
    private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AddNewCartComponent>
  ) {
    this.iCartManagementApiService = cartApiService;
    this.initializeForm();
  }

  private initializeForm(): void {
    this.cartForm = this.fb.group({
      cartId: ['', [
        Validators.required, 
        Validators.maxLength(VALIDATION_LIMITS.CART_ID_MAX_LENGTH)
      ]]
    });
  }

  ngOnInit(): void {
    this.focusCartIdInput();
    this.showAdditionalFields = true;
  }

  private focusCartIdInput(): void {
    if (this.cartIdInputRef?.nativeElement) {
      this.focusMonitor.focusVia(this.cartIdInputRef, 'program');
      this.cartIdInputRef.nativeElement.select();
    }
  }

  async onCartIdEnter(): Promise<void> {
    if (!(await this.isCartIdValid())) {
      return;
    }
    this.showAdditionFields();
  }

  async showAdditionFields() {
    this.showAdditionalFields = true;
    // Force change detection to ensure DOM is updated
    this.cdr.detectChanges();
    this.focusPositionCountInput();
    this.positionCountInput = 4;
    this.shelveCountInput = 3;
    this.onBothFieldsEnter();
  }

  private async isCartIdValid(): Promise<boolean> {
    
    const cartIdControl = this.cartForm.get('cartId');
    const cartId = cartIdControl?.value?.trim()?.toUpperCase() || '';
    cartIdControl?.setValue(cartId, { emitEvent: false });
    
    if (!cartId) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.PleaseEnterCartId, ToasterTitle.Error);
      return false;
    }

    try {
      const response: ValidateCartIdResponse = await this.iCartManagementApiService.validateCartId(cartId);
      if (response.value) {
        // Cart ID is valid (unique and available) - can proceed
        return true;
      } else {
        // Cart ID already exists or is invalid - cannot proceed
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.PleaseEnterValidCartId, ToasterTitle.Error);
        return false;
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.UnableToValidateCartID, ToasterTitle.Error);
      return false;
    }
  }

  private focusPositionCountInput(): void {
    // Use requestAnimationFrame to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      if (this.positionCountInputRef?.nativeElement) {
        this.focusMonitor.focusVia(this.positionCountInputRef, 'program');
        this.positionCountInputRef.nativeElement.select();
      }
    });
  }

  onBothFieldsEnter(): void {
    if (!this.validateDimensions()) {
      return;
    }

    this.createGrid();
  }

  private validateDimensions(): boolean {
    // Check if both fields are filled
    if (!this.positionCountInput || !this.shelveCountInput) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.PleaseEnterBothPositionAndShelveCount, ToasterTitle.Error);
      return false;
    }

    // Validate column range
    if (this.positionCountInput < VALIDATION_LIMITS.POSITION_COUNT_MIN || 
        this.positionCountInput > VALIDATION_LIMITS.POSITION_COUNT_MAX) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.PositionCountMustBeBetween1And8, ToasterTitle.Error);
      return false;
    }
    
    // Validate row range
    if (this.shelveCountInput < VALIDATION_LIMITS.SHELVE_COUNT_MIN || 
        this.shelveCountInput > VALIDATION_LIMITS.SHELVE_COUNT_MAX) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.ShelveCountMustBeBetween1And5, ToasterTitle.Error);
      return false;
    }

    return true;
  }

  onPositionChange(value: number, min: number, max: number) {
  if (value >= min && value <= max) {
    this.createGrid();
  }
}

  private createGrid(): void {
    this.cols = this.positionCountInput!;
    this.rows = this.shelveCountInput!;
    this.initializeTotePositions();
    this.showToteGrid = true;
  }

  private initializeTotePositions(): void {
    const total = this.cols * this.rows;
    this.positions = Array.from({ length: total }, (_, i) => this.createTotePosition(i + 1));
  }

  private createTotePosition(position: number): TotePosition {
    const { row, col } = this.getRowAndColumn(this.rows, this.cols, position);
    return {
      position,
      toteId: '',
      isSelected: false,
      isDisabled: false,
      status: '',
      cartRow: row.toString(),
      cartColumn: col.toString(),
      hasError: false
    };
  }

  private getRowAndColumn(totalRows: number, totalColumns: number, number: number) {
    if (number < 1 || number > totalRows * totalColumns) {
      throw new Error("Selected number is out of range.");
    }

    const row = Math.floor((number - 1) / totalColumns) + 1;
    const col = ((number - 1) % totalColumns) + 1;

    return { row, col };
  }

  getLayoutInstructionText(): string {
    const total = this.cols * this.rows;
    return `Selected layout includes ${total} tote positions.`;
  }


  onClose(): void {
    if (this.hasAnyData()) {
      const dialogRef = this.global.OpenDialog(AlertConfirmationComponent, {
        width: Style.w560px,
        data: {
          heading: ConfirmationHeadings.CancelCartCreation,
          message: ConfirmationMessages.CancelCartCreationMessage,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  private hasAnyData(): boolean {
    const cartId = this.cartForm.get('cartId')?.value?.trim();
    return !!(cartId || this.positionCountInput || this.shelveCountInput);
  }

  async onAdd(): Promise<void> {
    if (!(await this.isFormValid())) {
      return;
    }

    this.isLoading = true;

    try {
      let payload: AddCartRequest = {
        cartId: this.cartForm.get('cartId')?.value?.trim(),
        positionCount: this.positionCountInput ?? 0,
        shelveCount: this.shelveCountInput ?? 0
      };

      const res = await this.iCartManagementApiService.addCart(payload);

      if (res) {
        if (res.isSuccess) {
          // Cart created successfully
          this.global.ShowToastr(ToasterType.Success, ToasterMessages.CartCreatedSuccessfully.replace('{{cartId}}', res.value), ToasterTitle.Success);
          // Close dialog with success result
          this.dialogRef.close({ success: true, cartId: res.value });
        } else {
          // Cart creation failed
          this.global.ShowToastr(ToasterType.Error, res.message || ToasterMessages.FailedToCreateCart, ToasterTitle.Error);
        }
      } else {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.FailedToCreateCart, ToasterTitle.Error);
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.FailedToCreateCart, ToasterTitle.Error);
    } finally {
      this.isLoading = false;
    }
  }

  async isFormValid(): Promise<boolean> {
    return this.showAdditionalFields && 
           (await this.isCartIdValid()) && 
           this.areDimensionsValid();
  }

  areDimensionsValid(): boolean {
    return !!(this.positionCountInput && 
              this.shelveCountInput && 
              this.positionCountInput >= VALIDATION_LIMITS.POSITION_COUNT_MIN &&
              this.positionCountInput <= VALIDATION_LIMITS.POSITION_COUNT_MAX &&
              this.shelveCountInput >= VALIDATION_LIMITS.SHELVE_COUNT_MIN &&
              this.shelveCountInput <= VALIDATION_LIMITS.SHELVE_COUNT_MAX);
  }
}
