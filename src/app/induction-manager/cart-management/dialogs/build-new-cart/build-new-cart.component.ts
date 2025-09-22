import { Component, EventEmitter, Inject, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TotePosition } from '../../tote-position-grid/tote-position-grid.component';
import { CartManagementApiService } from 'src/app/common/services/cart-management-api/cart-management-api.service';
import { ICartManagementApiService } from 'src/app/common/services/cart-management-api/cart-management-api.interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { AlertConfirmationComponent } from '../../../../dialogs/alert-confirmation/alert-confirmation.component';
import { ToasterTitle, ToasterType, ConfirmationHeadings, ConfirmationMessages, UniqueConstants, ToasterMessages, Style } from 'src/app/common/constants/strings.constants';
import { CartStatus, CartManagementDialogConstants, DialogTitles, PrimaryButtonTexts, DialogModes, ClearButtonTexts, ToteStatuses } from '../../constants/string.constants';
import { CartManagementData, CartManagementResult, CartDraftData, ValidationRequest, ValidationResponse, ValidateToteRequest, RemoveCartContentRequest, ToteAssignments, ValidateToteResponse } from '../../interfaces/cart-management.interface';
import { TotePostionInfo } from '../../models/cart-management-models';

@Component({
  selector: 'app-cart-management-dialog',
  templateUrl: './build-new-cart.component.html',
  styleUrls: ['./build-new-cart.component.scss']
})
export class BuildNewCartComponent implements OnInit {
  cartForm: FormGroup;
  positions: TotePosition[] = [];
  selectedPosition: number = 0;
  toteIdInput: string = '';
  isReadonly: boolean = false;
  isLoading: boolean = false;
  cartIdEntered: boolean = false;
  showToteGrid: boolean = false;
  // keep a private handle; setter fires when the element is created/destroyed
  private _toteInputFocus?: ElementRef<HTMLInputElement>;
  private _cartInputFocus?: ElementRef<HTMLInputElement>;

  @ViewChild('toteInputFocus', { static: false })
  set toteInputFocus(el: ElementRef<HTMLInputElement> | undefined) {
    this._toteInputFocus = el;
    if (el) {
      el.nativeElement.focus();
      el.nativeElement.select();
    }
  }

  get toteInputFocus(): ElementRef<HTMLInputElement> | undefined {
    return this._toteInputFocus;
  }
  @ViewChild('cartInputFocus', { static: true })
  set cartInputFocus(el: ElementRef<HTMLInputElement> | undefined) {
    this._cartInputFocus = el;
    if (el) {
      el.nativeElement.focus();
      el.nativeElement.select();
    }
  }

  get cartInputFocus(): ElementRef<HTMLInputElement> | undefined {
    return this._cartInputFocus;
  }
  // hold effective dims
  cols: number = 4;
  rows: number = 3;
  StorageLocationId : string = "";

  // Emits when a valid Cart ID is first entered so the parent grid can add a draft row
  public cartDraftCreated: EventEmitter<CartDraftData> = new EventEmitter<CartDraftData>();
  // Emits when a cart is deleted so the parent grid can remove the row
  public cartDeleted: EventEmitter<string> = new EventEmitter<string>();
  // Emits when a cart is updated so the parent grid can refresh
  public cartUpdated: EventEmitter<CartManagementResult> = new EventEmitter<CartManagementResult>();
  // Emits when tote quantity changes in real-time
  public toteQuantityChanged: EventEmitter<{cartId: string, quantity: number}> = new EventEmitter<{cartId: string, quantity: number}>();
  currentCartIdInput: string = '';

  get isCreateMode(): boolean { 
    return this.data.mode === DialogModes.CREATE; 
  }

  get isEditMode(): boolean { 
    return this.data.mode === DialogModes.EDIT; 
  }

  get isViewMode(): boolean { 
    return this.data.mode === DialogModes.VIEW; 
  }

  get dialogTitle(): string {
    switch (this.data.mode) {
      case DialogModes.CREATE: return DialogTitles.CREATE;
      case DialogModes.EDIT: return DialogTitles.EDIT;
      case DialogModes.VIEW: return DialogTitles.VIEW;
      default: return DialogTitles.DEFAULT;
    }
  }

  get primaryButtonText(): string {
    switch (this.data.mode) {
      case DialogModes.CREATE: return PrimaryButtonTexts.CREATE;
      case DialogModes.EDIT: return PrimaryButtonTexts.EDIT;
      case DialogModes.VIEW: return PrimaryButtonTexts.VIEW;
      default: return PrimaryButtonTexts.DEFAULT;
    }
  }

  get clearButtonText(): string {
    switch (this.data.mode) {
      case DialogModes.CREATE: return ClearButtonTexts.CREATE;
      case DialogModes.EDIT: return ClearButtonTexts.EDIT;
      default: return ClearButtonTexts.DEFAULT;
    }
  }
  
  get showToteInput(): boolean { return !this.isViewMode && this.cartIdEntered && this.showToteGrid; }
  get showClearAllButton(): boolean { return !this.isViewMode; }
  get showSaveButton(): boolean { return this.isEditMode; }
  get isGridDisabled(): boolean { return !this.cartIdEntered; }
  
  get saveButtonText(): string {
    if (this.selectedPosition) {
      const selectedPos = this.positions.find(p => p.position === this.selectedPosition);
      return selectedPos?.toteId ? 'Update' : 'Save';
    }
    return 'Save';
  }

  existingAssignments:ToteAssignments[];

  public iCartManagementApiService: ICartManagementApiService;
  constructor(
    private fb: FormBuilder,
    private global: GlobalService,
    private cartApiService: CartManagementApiService,
    public dialogRef: MatDialogRef<BuildNewCartComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CartManagementData
  ) {
    this.iCartManagementApiService = cartApiService;
    this.cartForm = this.fb.group({
      cartId: ['', [Validators.required, Validators.maxLength(CartManagementDialogConstants.CART_ID_MAX_LENGTH)]]
    });
  }

  ngOnInit(): void {
    this.rows = Math.max(1, this.data.rows ?? 3);
    this.cols = Math.max(1, this.data.cols ?? 4);
    this.initializePositions();
    this.setupForm();
    this.setReadonlyMode();
    this.setExistingAssignments();

    
    this.cartInputFocus?.nativeElement.focus();
    this.cartInputFocus?.nativeElement.select();
  }

  setExistingAssignments(): void {
    const rec = this.data.existingAssignments ?? {}; // handle undefined
    this.existingAssignments = Object.keys(rec)
      .sort((a, b) => Number(a) - Number(b)) // preserve numeric slot order
      .map(k => {
        const v = rec[Number(k)];
        return { toteId: v.toteId, status: v.status ?? '' }; // default for optional status
      });
  }

  private initializePositions(): void {
    const total = this.cols * this.rows;
    this.positions = Array.from({ length: total }, (_, i) => {
      const position = i + 1;
      const { row, col } = this.getRowAndColumn(this.rows, this.cols, position);
      return {
        position: position,
        toteId: '',
        isSelected: false,
        isDisabled: false,
        status: '',
        cartRow: row.toString(),
        cartColumn: col.toString(),
        hasError: false
      };
    });

    if (this.data.existingAssignments) {
      Object.entries(this.data.existingAssignments).forEach(([position, assignmentData]) => {
        const pos = parseInt(position);
        if (pos >= 1 && pos <= total) {
          this.positions[pos - 1].toteId = assignmentData.toteId;
          this.positions[pos - 1].status = assignmentData.status || '';
        }
      });
    }
  }

  private setupForm(): void {
    if (this.data.cartId) {
      this.cartForm.get('cartId')?.setValue(this.data.cartId);
      this.currentCartIdInput = this.data.cartId; // Set the current cart ID input
    }

    if(this.isCreateMode) {
      this.cartInputFocus?.nativeElement.focus();
      this.cartInputFocus?.nativeElement.select();
    }

    if (this.isViewMode || this.isEditMode) {
      // Disable input in view/edit mode using reactive form
      this.cartForm.get('cartId')?.disable();
      // Set cartIdEntered to true for edit mode so the grid is enabled
      if (this.isEditMode && this.data.cartId) {
        this.cartIdEntered = true;
        this.showToteGrid = true; // Show grid in edit mode
        // Select the first available position in edit mode
        const firstAvailablePosition = this.findFirstAvailablePosition();
        if (firstAvailablePosition) {
          this.onPositionSelect(firstAvailablePosition);
        }
      }
      if (this.isViewMode && this.data.cartId) {
        this.cartIdEntered = true;
        this.showToteGrid = true; // Show grid in view mode
      }
    }
    // In edit mode with existing cart ID, focus on tote ID input after a delay
    if (this.isEditMode && this.data.cartId) {
      this.toteInputFocus?.nativeElement.focus();
    }
  }

  private setReadonlyMode(): void {
    this.isReadonly = this.isViewMode;
  }

  async onCartIdEnter() {
    const value = this.cartForm.get('cartId')?.value.trim() || ''; //cartIdValue?.trim() || '';
    
    if (!value) {
      this.global.ShowToastr(ToasterType.Error, 'Please enter a valid Cart ID', ToasterTitle.Error);
      return;
    }

    if (!this.isCreateMode) {
      return;
    }

    // Set the cart ID input immediately
    this.currentCartIdInput = value;

    if (value && value.length > 0) {
      this.cartIdEntered = true;
    }
    
    const wsName = this.global.getCookie("WSName");

    let payload: ValidationRequest = {
      cartId: value,
      workstationName: wsName
    };

    const res = await this.iCartManagementApiService.validateCart(payload);
    if (res?.body) {
      const cartDetails: ValidationResponse = res.body.value;
      if(cartDetails)
      {
        if(cartDetails.status == 'Available'){
          // Update grid dimensions from API response
          this.rows = cartDetails.cartRows || 3;
          this.cols = cartDetails.cartColumns || 4;
          
          // Re-initialize positions with new dimensions
          this.initializePositions();
          
          // Show the tote grid only after successful validation
          this.showToteGrid = true;
          
          this.cartDraftCreated.emit();
          this.emitToteQuantityChange();
          this.onPositionSelect(1);
        }
        else{
          this.currentCartIdInput = '';
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
        }
    }
    else{
      this.currentCartIdInput = '';
      this.cartForm.get('cartId')?.setValue("");
      this.global.ShowMultipleToastMessages(ToasterType.Error, res?.body?.errors, ToasterTitle.Error);
    }
  }

  } 

  selectedTote:string;
  onSelectTote(tote:string){
    this.selectedTote = tote;
  }

  getDisabledState(): boolean {
    if(this.isViewMode) {
      return false;
    }

    if(this.isEditMode) {
      return this.toteIdInput ? true : false;
    }

    if(this.isCreateMode) {
      return !this.cartIdEntered;
    }

    return true;
  }

  generateStorageLocationId(totePostionInfo: TotePostionInfo){
    this.StorageLocationId = this.currentCartIdInput + "_" + totePostionInfo.col + "_" + totePostionInfo.row;
  }

  private getRowAndColumn(totalRows: number, totalColumns: number, number: number) {
    if (number < 1 || number > totalRows * totalColumns) {
      throw new Error("Selected number is out of range.");
    }

    // Row is determined by dividing (0-based index) then shifting to 1-based
    const row = Math.floor((number - 1) / totalColumns) + 1;

    // Column is determined by modulus (0-based index) then shifting to 1-based
    const col = ((number - 1) % totalColumns) + 1;

    return { row, col };
  }

  onPositionSelect(position: number): void {
    if (this.isReadonly || this.isGridDisabled) return;

    // Clear error states and invalid tote IDs from all positions when selecting a new position
    this.positions.forEach(pos => {
      if (pos.hasError) {
        pos.hasError = false;
        pos.toteId = ''; // Clear the invalid tote ID
      }
    });

    this.selectedPosition = position;
    
    const selectedPos = this.positions.find(p => p.position === position);
    if (selectedPos?.toteId) {
      this.toteIdInput = selectedPos.toteId;
    } else {
      this.toteIdInput = '';
    }
    
    // Generate StorageLocationId using cartRow and cartColumn from the position
    if (selectedPos?.cartRow && selectedPos?.cartColumn) {
      const totePositionInfo: TotePostionInfo = {
        row: parseInt(selectedPos.cartRow),
        col: parseInt(selectedPos.cartColumn)
      };
      this.generateStorageLocationId(totePositionInfo);
    }
    
    this.toteInputFocus?.nativeElement.focus();
    this.toteInputFocus?.nativeElement.select();
     
  }

  onPositionClear(position: number): void {
    if (this.isReadonly || this.isGridDisabled) return;

    const pos = this.positions.find(p => p.position === position);
    if (pos) {
      pos.toteId = '';
      pos.status = '';
      pos.hasError = false; // Clear error state
      if (this.selectedPosition === position) {
        this.selectedPosition = 0;
        this.toteIdInput = '';
      }
      
      // Emit real-time quantity change
      this.emitToteQuantityChange();
    }
  }

  async onClearToteInput() {
    if(this.selectedTote){
      const cartContentRemoved = await this.removeCartContent([this.selectedTote], this.isCreateMode ? false : this.getUpdateStatus());
      if(cartContentRemoved){
        this.existingAssignments = this.existingAssignments.filter(x => x.toteId !== this.selectedTote);
        this.toteIdInput = '';
        this.emitToteQuantityChange();
        const currentPosition = this.selectedPosition || 1;
        this.onPositionClear(currentPosition);
        this.onPositionSelect(currentPosition);
        this.cartUpdated.emit();
      }
    }
    else{
      this.toteIdInput = '';
    }
  }

  onBackspaceCheck() {
    if ((this.toteIdInput ?? '').trim().length === 0) {
      this.onClearToteInput();
    }
  }

  async onClearCartId() {
    if(!this.currentCartIdInput) return;
    const toteIds = this.existingAssignments.map(({ toteId }) => toteId);
    const cartContentRemoved = await this.removeCartContent(toteIds,this.getUpdateStatus());
    if(cartContentRemoved){
      this.clearAllPositions();
      this.selectedPosition = 0;
      this.toteIdInput = '';
      this.cartIdEntered = false;
      this.showToteGrid = false; 
      this.currentCartIdInput = '';
      if (this.cartInputFocus?.nativeElement) {
        this.cartInputFocus.nativeElement.value = '';
      }
      this.emitToteQuantityChange();
      this.onPositionSelect(1);
    }
  }

  private findFirstAvailablePosition(): number {
    const totalPositions = this.cols * this.rows;
    
    for (let i = 1; i <= totalPositions; i++) {
      const pos = this.positions.find(p => p.position === i);
      if (pos && !pos.toteId) {
        return i;
      }
    }
    
    return 1;
  }

  private findNextAvailablePosition(currentPosition: number): number {
    const totalPositions = this.cols * this.rows;
    
    for (let i = currentPosition + 1; i <= totalPositions; i++) {
      const pos = this.positions.find(p => p.position === i);
      if (pos && !pos.toteId) {
        return i;
      }
    }
    
    for (let i = 1; i <= totalPositions; i++) {
      const pos = this.positions.find(p => p.position === i);
      if (pos && !pos.toteId) {
        return i;
      }
    }
    
    return 1;
  }

  async onSaveTote() {
    if (!await this.validateToteInput()) {
      return;
    }

    const pos = this.positions.find(p => p.position === this.selectedPosition);
    if (!pos) {
      return;
    }

    const oldToteId = pos.toteId;
    const isUpdate = !!oldToteId;
    
    pos.toteId = this.toteIdInput.trim();
    this.toteIdInput = '';
    
    this.moveToNextPosition();
    
    if(this.isEditMode){
      const message = isUpdate 
      ? `Tote ID updated from ${oldToteId} to ${pos.toteId} at position ${pos.position}`
      : `Tote ${pos.toteId} assigned to position ${pos.position}`;
      
      this.global.ShowToastr(ToasterType.Success, message, ToasterTitle.Success);
    }
    
    // Emit real-time quantity change
    this.emitToteQuantityChange();
  }

  getUpdateStatus() {
    if(this.existingAssignments?.length == 0) return true;
    const hasClosed = this.existingAssignments?.some(i => i.status === 'Closed') ?? false;
    if(hasClosed){
      return false;
    }
    else{
      return true;
    }
  }

  async onClearAll() {
    const dialogRef = this.global.OpenDialog(AlertConfirmationComponent, {
      width: Style.w560px,
      data: {
        heading: ConfirmationHeadings.ClearAll,
        message: ConfirmationMessages.ClearAllTotesMessage,
      }
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result === true) {
        const toteIds = this.existingAssignments
          .filter(({ status }) => status !== ToteStatuses.Closed)
          .map(({ toteId }) => toteId);
        const cartContentRemoved = await this.removeCartContent(toteIds,this.isCreateMode ? false : this.getUpdateStatus());
        if(cartContentRemoved){
          this.clearAllPositions();
          this.selectedPosition = 0;
          this.toteIdInput = '';
          this.global.ShowToastr(ToasterType.Success, 'All tote assignments cleared', ToasterTitle.Success);
          this.emitToteQuantityChange();
          const firstAvailablePosition = this.findFirstAvailablePosition();
          if (firstAvailablePosition) {
            this.onPositionSelect(firstAvailablePosition);
          }
          this.cartUpdated.emit();
        }
      }
    });
  }

  onPrimaryAction(): void {
    if (this.isViewMode || this.isEditMode) {
      this.dialogRef.close({ action: 'close' } as CartManagementResult);
      return;
    }

    if (this.isEditMode && this.cartForm.disabled) {
      this.cartForm.enable({ emitEvent: false });
    }

    if (!this.currentCartIdInput?.trim()) {
      this.global.ShowToastr(ToasterType.Error, 'Please enter a valid Cart ID', ToasterTitle.Error);
      return;
    }

    const assignments = this.getAssignments();
    
    if (this.isCreateMode && Object.keys(assignments).length === 0) {
      this.global.ShowToastr(ToasterType.Error, 'Please assign at least one tote to complete the cart', ToasterTitle.Error);
      return;
    }

    this.isLoading = true;
    const toteQuantity = Object.keys(assignments).length;

    // Call the new completeCart API
    this.cartApiService.completeCart(this.currentCartIdInput.trim()).then((result) => {
      this.isLoading = false;
      if (result.isSuccess) {
          const result: CartManagementResult = {
            action: this.isCreateMode ? 'create' : 'update',
            cartId: this.currentCartIdInput.trim(),
            status: CartStatus.Inducted,
            quantity: toteQuantity,
            assignments: assignments
          };
          
          // Emit cart update event to notify parent grid
          this.cartUpdated.emit(result);
          
          this.dialogRef.close(result);
          this.global.ShowToastr(ToasterType.Success, this.isCreateMode ? 'Cart completed successfully' : 'Cart updated successfully', ToasterTitle.Success);
        } else {
          this.global.ShowToastr(ToasterType.Error, 'Failed to complete cart', ToasterTitle.Error);
        }
      }).catch((error) => {
        this.isLoading = false;
        this.global.ShowToastr(ToasterType.Error, this.isCreateMode ? 'Failed to complete cart' : 'Failed to update cart', ToasterTitle.Error);
      });
  }

   async onClose() {
    if (this.isCreateMode && this.currentCartIdInput?.trim()) {
      const dialogRef = this.global.OpenDialog(AlertConfirmationComponent, {
        width: Style.w560px,
        data: {
          heading: ConfirmationHeadings.CancelCartCreation,
          message: ConfirmationMessages.CancelCartCreationMessage,
        }
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result === true) {
          const toteIds = this.existingAssignments.map(({ toteId }) => toteId);
          const cartContentRemoved = await this.removeCartContent(toteIds,this.getUpdateStatus());
          if(cartContentRemoved){
            this.clearAllPositions();
            this.selectedPosition = 0;
            this.toteIdInput = '';
            this.global.ShowToastr(ToasterType.Success, 'All tote assignments cleared', ToasterTitle.Success);
            this.emitToteQuantityChange();
            this.onPositionSelect(1);
            this.cartUpdated.emit();
            if(this.getUpdateStatus()){
              this.dialogRef.close({ action: 'close' } as CartManagementResult);
            }
          } 
        }
      });
    } 
    else if (this.isEditMode && this.toteIdInput?.trim()) {
      const dialogRef = this.global.OpenDialog(AlertConfirmationComponent, {
        width: Style.w560px,
        data: {
          heading: ConfirmationHeadings.CancelCartUpdate,
          message: ConfirmationMessages.CancelCartUpdateMessage,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.dialogRef.close({ action: 'close' } as CartManagementResult);
        }
      });
    }
    else {
      this.dialogRef.close({ action: 'close' } as CartManagementResult);
    }
  }

  getInstructionText(): string {
    return 'Select a tote position and scan/type tote ID to add tote to the cart';
  }

  getAssignedToteCount(): number {
    return this.positions.filter(p => p.status !== ToteStatuses.Closed && !!p.toteId).length;
  }

  private getAssignments(): Record<number, string> {
    const assignments: Record<number, string> = {};
    this.positions.forEach(pos => {
      if (pos.toteId) {
        assignments[pos.position] = pos.toteId;
      }
    });
    return assignments;
  }

  private async validateToteInput():Promise<boolean>{
    const payload: ValidateToteRequest = {
      cartId: this.currentCartIdInput,
      toteId: this.toteIdInput,
      storageLocationId : this.StorageLocationId
    };
    const res  : ValidateToteResponse = await this.iCartManagementApiService.validateTotes(payload);
    if (res?.isSuccess) {
      this.existingAssignments.push({toteId:this.toteIdInput,status:""});
      // Clear any error state from the current position
      if (this.selectedPosition) {
        this.cartUpdated.emit();
        const pos = this.positions.find(p => p.position === this.selectedPosition);
        if (pos) {
          pos.hasError = false;
        }
      }
      return true;
    }
    else{
      // Set error state on the current position
      if (this.selectedPosition) {
        const pos = this.positions.find(p => p.position === this.selectedPosition);
        if (pos && !pos?.toteId) {
          pos.hasError = true;
          pos.toteId = this.toteIdInput; // Show the invalid tote ID
        }
        this.toteIdInput = "";
      }
      this.global.ShowMultipleToastMessages(ToasterType.Error, [res?.message || 'Tote validation failed'], ToasterTitle.Error);
      return false;
    }

  }

  private moveToNextPosition(): void {
    const nextPosition = this.findNextAvailablePosition(this.selectedPosition!);

    const selectedPos = this.positions.find(p => p.position === nextPosition);
    
    // Generate StorageLocationId using cartRow and cartColumn from the position
    if (selectedPos?.cartRow && selectedPos?.cartColumn) {
      const totePositionInfo: TotePostionInfo = {
        row: parseInt(selectedPos.cartRow),
        col: parseInt(selectedPos.cartColumn)
      };
      this.generateStorageLocationId(totePositionInfo);
    }

    if (nextPosition) {
      this.selectedPosition = nextPosition;
      this.toteInputFocus?.nativeElement.focus();
    } else {
      this.selectedPosition = 0;
    }
  }

  private clearAllPositions(): void {
    this.positions.forEach(pos => {
      if (pos.status !== ToteStatuses.Closed) {
        pos.toteId = '';
        pos.status = '';
        pos.hasError = false;
      }
    });
  }

  private emitToteQuantityChange(): void {
    if (this.currentCartIdInput?.trim()) {
      const currentQuantity = this.getAssignedToteCount();
      this.toteQuantityChanged.emit({
        cartId: this.currentCartIdInput.trim(),
        quantity: currentQuantity
      });
    }
  }

  private async removeCartContent(toteIds: string[], updateStatus:boolean){
    const payload: RemoveCartContentRequest = {
      cartId: this.currentCartIdInput,
      toteIds: toteIds,
      updateStatus : updateStatus
    };
    const res = await this.iCartManagementApiService.removeCartContent(payload);
    if (res?.body?.isSuccess) {
      this.cartDraftCreated.emit();
      return true;
    }
    else{
      this.global.ShowMultipleToastMessages(ToasterType.Error, res?.body?.errors, ToasterTitle.Error);
      return false;
    }
  }

  @HostListener('window:beforeunload', [UniqueConstants.event])
  onbeforeunload(event) {
    if (!this.isViewMode) {
      event.preventDefault();
      event.returnValue = '';
    }
  }
}
