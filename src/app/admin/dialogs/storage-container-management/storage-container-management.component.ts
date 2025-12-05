import { Component, ElementRef, Inject, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { HttpStatusCode } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiErrorMessages,ConfirmationMessages, DialogConstants, ResponseStrings, storageContainerDisabledFields, StringConditions, Style, ToasterMessages, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { BinCellLayout, CarouselZone, ContainerTypes, InventoryMap, InventoryRecord,InventoryMapRecordsResponse, StorageContainerLayout, ValidationErrorCodes, ConstraintViolations, InventoryMapRecordsDto} from 'src/app/common/Model/storage-container-management';
import { InventoryMapRecord } from 'src/app/common/interface/admin/inventory-map-record.interface';

@Component({
  selector: 'app-storage-container-management-modal',
  templateUrl: './storage-container-management.component.html',
  styleUrls: ['./storage-container-management.component.scss']
})
export class StorageContainerManagementModalComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  
  // Constants
  private readonly CONTAINER_ID_MAX_LENGTH = 5;
  scm = {
    carouselZone: new CarouselZone(),
    tray: "",
    containerType: 0,
    numberOfCells: 0
  }
  containerTypes: ContainerTypes[] = [];
  get inventoryMapRecords(): { count: number; label: string } {
    const count = this.scm.numberOfCells;
    const label = count === 1 ? 'record' : 'records';
    return {count, label};
  }
  carouselZones: CarouselZone[] = [];
  tableMatrix: string[][] = [];
  storageContainerLayout: StorageContainerLayout = new StorageContainerLayout();
  isExistingContainer: boolean = false;
  fromCells: number = 0;
  rowFieldAlias: string;
  sendToOutboundPort: boolean = false;
  binId: string;
  zone: string;

  // New properties for enhanced removal flow
  inventoryMapData: InventoryRecord[] = [];
  inventoryResponse: InventoryMapRecordsResponse = new InventoryMapRecordsResponse();
  constraintViolations: ConstraintViolations = {};
  isReadOnlyMode: boolean = false;
  totalRecordsToRemove: number = 0;
  filteredRecords: InventoryMapRecord[] = []; // Stores the filtered records passed from inventory map component

  @ViewChild('zone') zoneSelect!: MatSelect;
  @ViewChild('containerTypeDropdown') containerTypeSelect!: MatSelect;
  @ViewChild('storageContainer', {static: false}) storageContainer!: ElementRef;


  public iAdminApiService: IAdminApiService;
  storageContainerDisabledFields = storageContainerDisabledFields;

  constructor(
    private readonly dialog: MatDialog,
    public adminApiService: AdminApiService,
    private readonly global: GlobalService,
    private readonly dialogRef: MatDialogRef<StorageContainerManagementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.iAdminApiService = adminApiService;
    this.rowFieldAlias = data?.rowFieldAlias ?? '';
    this.sendToOutboundPort = data?.sendToOutboundPort ?? false;
    this.binId = data?.binId ?? '';
    this.zone = data?.zone ?? '';
    this.filteredRecords = data?.filteredRecords ?? [];
  }

  async ngOnInit(): Promise<void> {
    if(this.sendToOutboundPort){
      // Set to read-only mode and load inventory data
      this.isReadOnlyMode = true;
      
      // Load container types for fallback display
      await this.GetContainerLayoutsAsync();
      
      // Load inventory data for the bin
      await this.loadInventoryDataForBin();
    }else{
      await this.getCarouselZones();
      await this.GetContainerLayoutsAsync();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  async loadInventoryDataForBin(): Promise<void> {
    try {
      // Get inventory map records with full validation from backend
      this.inventoryResponse = await this.getInventoryMapRecordsForBin(this.binId, this.zone);
      this.inventoryMapData = this.inventoryResponse.records;
      this.totalRecordsToRemove = this.inventoryResponse.totalRecords;
      
      // Use backend validation results directly (no duplicate validation on frontend)
      this.buildConstraintViolationsFromBackend();
      
      // Set container info for display
      this.scm.carouselZone = { zone: this.zone, zoneName: this.zone };
      this.scm.tray = this.binId;
      
      // Get the existing container layout to build the table matrix (using existing pattern)
      await this.loadExistingContainerLayoutForReadOnlyMode();
      
    } catch (error: any) {
      this.handleStorageBinExitError(error);
    }
  }
  
  private mapInventoryRecord(record: any, binId: string, zone: string): InventoryRecord {
    return {
      bin: record.bin || binId,
      row: record.row || binId,
      zone: record.zone || zone,
      itemNumber: record.itemNumber || '',
      itemQuantity: record.itemQuantity || 0,
      quantityAllocatedPick: record.quantityAllocatedPick || 0,
      quantityAllocatedPutAway: record.quantityAllocatedPutAway || 0,
      dedicated: record.dedicated || false,
      cellId: record.cellId || `${record.bin || binId}-${record.row || binId}`,
      location: record.location || `${zone}-${record.row || binId}-${record.bin || binId}`,
      containerType: record.containerType || StringConditions.Unknown,
      cellSize: record.cellSize || '',
      constraintViolations: record.constraintViolations || [],
      hasConstraints: record.hasConstraints || false
    };
  }

  private async getInventoryMapRecordsForBin(binId: string, zone: string): Promise<InventoryMapRecordsResponse> {
    return new Promise((resolve, reject) => {
      this.iAdminApiService.GetInventoryMapRecordsForBin(binId, zone)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
        (response: InventoryMapRecordsDto ) => {
          // Backend now returns a complete InventoryMapRecordsResponse with validation
          if (response && response.value.records && Array.isArray(response.value.records)) {
            const inventoryResponse = new InventoryMapRecordsResponse();
            inventoryResponse.records = response.value.records.map((record: any) => this.mapInventoryRecord(record, binId, zone));
            inventoryResponse.totalRecords = response.value.totalRecords || response.value.records.length;
            inventoryResponse.recordsWithConstraints = response.value.recordsWithConstraints || 0;
            inventoryResponse.canProceedWithRemoval = response.value.canProceedWithRemoval !== undefined ? response.value.canProceedWithRemoval : true;
            inventoryResponse.globalConstraintViolations = response.value.globalConstraintViolations || [];
            resolve(inventoryResponse);
          } else if (response && (response as any).hasError) {
            reject(response);
          } else {
            // Return empty response for no data case
            resolve(new InventoryMapRecordsResponse());
          }
        },
        (error) => reject(error)
      );
    });
  }
  
  private async loadExistingContainerLayoutForReadOnlyMode(): Promise<void> {
    try {
      // Use the existing API pattern to get container layout
      const res = await this.iAdminApiService.getStorageContainerLayout(this.scm.tray, this.scm.carouselZone.zone);
      if (res?.status == HttpStatusCode.Ok && res?.body?.resource) {
        this.storageContainerLayout = res.body.resource;
        
        // Set container type info for display
        this.scm.containerType = this.storageContainerLayout.binLayout.id;
        
        // Use the existing createTableMatrix method with binCellLayouts
        if (this.storageContainerLayout.binLayout.binCellLayouts && this.storageContainerLayout.binLayout.binCellLayouts.length > 0) {
          this.createTableMatrix(this.storageContainerLayout.binLayout.binCellLayouts);
          this.scm.numberOfCells = this.storageContainerLayout.binLayout.binCellLayouts.length;
        }
      }
    } catch (error: unknown) {
      this.handleError(ApiErrorMessages.ErrorLoadingContainerLayout, error);
      // If we can't get the layout, create a simple matrix based on inventory data
      this.buildSimpleTableMatrixFallback();
    }
  }
  
  private buildSimpleTableMatrixFallback(): void {
    // Fallback method if we can't get the proper layout
    if (this.inventoryMapData.length === 0) {
      this.tableMatrix = [];
      return;
    }
    
    // Create a simple single row matrix with cell identifiers
    const cells = this.inventoryMapData.map(record => record.cellId || `${record.bin}-${record.row}`);
    this.tableMatrix = [cells];
    this.scm.numberOfCells = this.inventoryMapData.length;
  }

  private handleError(message: string, error: unknown): void {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    this.global.ShowToastr(ToasterType.Error, `${message}: ${errorMessage}`, ToasterTitle.Error);
  }
  
  /**
   * Build constraint violations map from backend response
   * No duplicate validation logic - backend handles all validation
   */
  private buildConstraintViolationsFromBackend(): void {
    this.constraintViolations = {};
    
    // Simply use the validated constraint data from backend
    this.inventoryMapData.forEach(record => {
      if (record.hasConstraints && record.constraintViolations && record.constraintViolations.length > 0) {
        this.constraintViolations[record.cellId] = record.constraintViolations;
      }
    });
  }

  getContainerTypeName(): string {
    if (this.storageContainerLayout?.binLayout?.description) {
      return this.storageContainerLayout.binLayout.description;
    }
    
    // Fallback to container types array if available
    if (this.scm.containerType && this.containerTypes.length > 0) {
      const containerType = this.containerTypes.find(ct => ct.id === this.scm.containerType);
      return containerType?.name || StringConditions.Unknown;
    }
    
    return StringConditions.Unknown;
  }
  
  getCellConstraintsTooltip(cellId: string): string {
    const constraints = this.getCellConstraints(cellId);
    // Use \n for proper line breaks (matTooltip supports this)
    return constraints.length > 0 ? constraints.join('\n') : '';
  }
  
  getCellConstraints(cellId: string): string[] {
    // First try direct match
    if (this.constraintViolations[cellId]) {
      return this.constraintViolations[cellId];
    }
    
    // Try to find a matching inventory record by bin/cell name
    const matchingRecord = this.inventoryMapData.find(record => 
      record.bin === cellId || 
      record.cellId === cellId ||
      record.cellId?.endsWith(cellId) ||
      record.location?.includes(cellId)
    );
    
    if (matchingRecord && this.constraintViolations[matchingRecord.cellId]) {
      return this.constraintViolations[matchingRecord.cellId];
    }
    
    return [];
  }
  
  hasCellConstraints(cellId: string): boolean {
    const constraints = this.getCellConstraints(cellId);
    return constraints.length > 0;
  }
  
  canProceedWithRemoval(): boolean {
    // Use backend validation result directly
    return this.inventoryResponse.canProceedWithRemoval;
  }
  
  proceedToRemovalConfirmation() {
    if (!this.canProceedWithRemoval()) {
      this.showConstraintViolationToasts();
      return;
    }
    
// Show deletion confirmation modal matching OT table style
            const dialogRef = this.global.OpenDialog(ConfirmationDialogComponent, {
              autoFocus: DialogConstants.autoFocus,
              height: DialogConstants.auto,
              width: Style.w560px,
              data: {
      message: ConfirmationMessages.ClickOkToOutboundPort(this.totalRecordsToRemove, this.binId),
      heading: ToasterMessages.SendToOutboundPort,
      checkBox: true,
                customButtonText: true,
                btn1Text: StringConditions.Yes,
                btn2Text: StringConditions.No
              },
            });
    
            dialogRef.afterClosed().subscribe((res) => {
              if (res === ResponseStrings.Yes) {
        this.requestStorageBinExit(this.binId, this.zone);
        }
      });
  }
  
  private showConstraintViolationToasts(): void {
    // Use the global constraint violations from backend response
    // Backend already provides user-friendly error messages
    const firstMessage = this.inventoryResponse.globalConstraintViolations[0];
    this.global.ShowToastr(ToasterType.Error, firstMessage, ToasterTitle.Error);
  }

  // Triggers the storage bin exit API call and subscribes for local success/error handling.
  private requestStorageBinExit(binId: string, zone: string): void {
    this.iAdminApiService.storageBinsExit(binId, zone)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
      (result) => this.handleStorageBinExitSuccess(result),
      (error) => this.handleStorageBinExitError(error)
    );
  }

  // On success, shows a success toast and closes the dialog; otherwise shows a failure toast.
  private handleStorageBinExitSuccess(result: { isSuccess: boolean, status?: number }) {
    if (result?.isSuccess) {
      this.global.ShowToastr(ToasterType.Success, ToasterMessages.StorageBinExitSuccessful, ToasterTitle.Success);
      // Delete inventory map records after successful storage bin exit
      this.deleteInventoryMapRecords();
    } else if (!result?.isSuccess && result?.status === 6) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.UnableToConnectToServer, ToasterTitle.Error);
    } else {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.FailedToRequestStorageBinExit, ToasterTitle.Error);
    }
  }

  // Delete all inventory map records after successful storage bin exit
  private async deleteInventoryMapRecords(): Promise<void> {
    if (this.filteredRecords.length === 0) {
      this.dialogRef.close(true);
      return;
    }

    // Filter records that have invMapID (the actual field name from inventory map API)
    const recordsToDelete = this.filteredRecords.filter(record => record.invMapID);
    
    if (recordsToDelete.length === 0) {
      this.dialogRef.close(true);
      return;
    }

    try {
      // Create an array of delete API calls
      const deletePromises = recordsToDelete.map(async (record) => {
        try {
          const result = await this.iAdminApiService.deleteInventoryMap({
            inventoryMapID: record.invMapID
          }).toPromise();
          return { isExecuted: true, result };
        } catch (error) {
          return { isExecuted: false, error };
        }
      });

      // Execute all delete calls in parallel
      const results = await Promise.all(deletePromises);
      
      const successCount = results.filter(result => result.isExecuted).length;
      const failureCount = results.length - successCount;

      if (failureCount === 0) {
        this.global.ShowToastr(
          ToasterType.Success,
          ToasterMessages.InventoryMapRecordsDeletedSuccessfully(successCount),
          ToasterTitle.Success
        );
      } else if (successCount > 0) {
        this.global.ShowToastr(
          ToasterType.Info,
          ToasterMessages.InventoryMapRecordsPartiallyDeleted(successCount, failureCount),
          ToasterTitle.Warning
        );
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.InventoryMapRecordsDeleteFailed,
          ToasterTitle.Error
        );
      }

      // Close the dialog to refresh the parent grid
      this.dialogRef.close(true);
    } catch (error) {
      this.global.ShowToastr(
        ToasterType.Error,
        ToasterMessages.ErrorDeletingInventoryMapRecords,
        ToasterTitle.Error
      );
      // Still close the dialog even on error
      this.dialogRef.close(true);
    }
  }

  // Maps HTTP errors to user-friendly toasts (500, 400, and generic fallback).
  private handleStorageBinExitError(error: { status?: number; error?: [] | string }) {
    if (error?.status === 500) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.UnableToConnectToServer, ToasterTitle.Error);
    } else if (error?.status === 400) {
      this.global.ShowToastr(ToasterType.Error, error.error as string, ToasterTitle.Error);
    } else {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.FailedToRequestStorageBinExit, ToasterTitle.Error);
    }
  }

  handleEnter() {
    this.validateScannedContainer();
  }

  async getCarouselZones() {
    let res = await this.iAdminApiService.getCarouselZones();
    if (res?.status == HttpStatusCode.Ok) {
      this.carouselZones = res?.body;
      if (this.carouselZones.length == 1) {
        this.scm.carouselZone = this.carouselZones[0];
        this.zoneChanged();
      }
    }
  }

  async GetContainerLayoutsAsync() {
    let res = await this.iAdminApiService.GetContainerLayoutsAsync();
    if (res?.status == HttpStatusCode.Ok) {
      if (res?.body?.length > 0) {
        res?.body?.forEach(element => {
          this.containerTypes.push({id: element.resource.id, name: element.resource.description});
        });
      }
    }
  }

  async validateScannedContainer(): Promise<void> {
    this.scm.tray = this.scm.tray.replace(/^[A-Za-z]+/, '');
    if (this.scm.tray.length > this.CONTAINER_ID_MAX_LENGTH) {
      this.scm.tray = this.scm.tray.substring(0, this.CONTAINER_ID_MAX_LENGTH);
    }
    this.tableMatrix = [];
    this.scm.containerType = 0;
    if (this.scm.tray === "") return;
    let res = await this.iAdminApiService.validateScannedContainer(this.scm.tray, this.scm.carouselZone.zone);
    
    // Check for error in response body (even if HTTP status is 200 OK)
    const errorData = res?.body?.hasError ? res?.body : res?.error;
    
    if (errorData?.hasError) {
      // Show error message toast for all error cases
      if (errorData?.errorMessage) {
        this.global.ShowToastr(ToasterType.Error, errorData.errorMessage, ToasterTitle.Error);
      }
      
      if (errorData?.validationErrorCode?.toString() === ValidationErrorCodes.NoLayoutAssignedToContainer) {
        this.reassigningContainerWithoutLayout();
        return;
      }

      this.scm.tray = "";
      this.scm.containerType = 0;
    } else if (res?.status == HttpStatusCode.Ok) {
      this.isExistingContainer = false;
      await this.getStorageContainerLayout();
    }
  }

  async reassigningContainerWithoutLayout() {
    const clearDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '560px',
      data: {
        heading: 'Storage Container Management',
        message: 'The storage container already exists but does not have a layout assigned. Proceeding will modify the inventory map records. Do you want to continue?',
        customButtonText: true,
        btn1Text: 'Yes',
        btn2Text: 'No'
      }
    });

    clearDialogRef.afterClosed().subscribe(async (resp) => {
      if (resp == "Yes") {
        this.isExistingContainer = true;
        this.containerTypeSelect.open();
      }
      else {
        this.scm.tray = "";
        this.scm.containerType = 0;
      }
    });
  }

  async getStorageContainerLayout() {
    if (!this.scm.tray) return;
    let res = await this.iAdminApiService.getStorageContainerLayout(this.scm.tray, this.scm.carouselZone.zone);
    if (res?.status == HttpStatusCode.Ok) {
      if (res?.body.resource == null) {
        this.scm.containerType = this.containerTypes[0].id;
        await this.containerTypeChanged();
        // @ts-ignore
        window.document.getElementById('saveBtn').focus();
        return;
      }
      const clearDialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: '560px',
        data: {
          heading: 'Storage Container Management',
          message: 'The storage container already exists. Proceeding will modify the inventory map records. Do you want to continue?',
          customButtonText: true,
          btn1Text: 'Yes',
          btn2Text: 'No'
        }
      });
      clearDialogRef.afterClosed().subscribe(async (resp) => {
        if (resp == "Yes") {
          this.storageContainerLayout = res.body.resource;
          this.scm.containerType = this.storageContainerLayout.binLayout.id;
          this.isExistingContainer = this.storageContainerLayout.binLayout.binCellLayouts.length > 0;
          this.fromCells = this.storageContainerLayout.binLayout.binCellLayouts.length;
          this.createTableMatrix(this.storageContainerLayout.binLayout.binCellLayouts);
          this.containerTypeSelect.open();

        }
        else {
          this.scm.tray = "";
          this.scm.containerType = 0;
        }
      });
    } else {
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
    }
  }

  createTableMatrix(binCellLayouts: BinCellLayout[]) {
    let positions: { row: number, col: number, binID: string }[] = [];

    binCellLayouts.forEach(item => {
      const posList = this.extractPositions(item.commandString);
      posList.forEach(pos => {
        positions.push({row: pos[0], col: pos[1], binID: item.binID ?? item.bin});
      });
    });

    const maxRows = Math.max(...positions.map(pos => pos.row));
    const maxCols = Math.max(...positions.map(pos => pos.col));

    this.tableMatrix = Array.from({length: maxRows}, () => Array(maxCols).fill(""));

    positions.forEach(({row, col, binID}) => {
      if (!this.tableMatrix[row - 1][col - 1]) {
        this.tableMatrix[row - 1][col - 1] = binID;
      }
    });

    this.tableMatrix = this.tableMatrix.map(row => [...new Set(row)]);
    this.tableMatrix = Array.from(new Set(this.tableMatrix.map(row => JSON.stringify(row))))
      .map(row => JSON.parse(row));
    this.tableMatrix.reverse();
  }

  extractPositions(commandString: string): number[][] {
    return commandString
      .replace(/\]\[/g, "];[")
      .split(/\r?\n|;/)
      .map(pair => pair.trim())
      .filter(pair => pair.length > 0)
      .map(pair => JSON.parse(pair));
  }

  async containerTypeChanged() {
    await this.GetBinCellsAsync();
  }

  async GetBinCellsAsync() {
    let res = await this.iAdminApiService.GetBinCellsAsync(this.scm.containerType);
    if (res?.status == HttpStatusCode.Ok) {
      if (res?.body?.length > 0) {
        this.scm.numberOfCells = res?.body.length;
        this.createTableMatrix(res?.body?.map(item => item.resource));
      }
    }
  }

  async save() {
    if (this.isExistingContainer) {
      await this.modifyExisting();
    }
    else {
      await this.addNew();
    }
  }

  async addNew() {
    const clearDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '560px',
      data: {
        heading: 'Storage Container Management',
        message: `Proceeding will add ${this.inventoryMapRecords.count} record(s) in the inventory map. Do you want to continue?`,
        customButtonText: true,
        btn1Text: 'Yes',
        btn2Text: 'No'
      }
    });
    clearDialogRef.afterClosed().subscribe(async (res) => {
      if (res == "Yes") {
        await this.addInventoryMapRecord();
      }
      if (this.scm.carouselZone) {
        this.storageContainer.nativeElement.focus();
      }
    });
  }

  async modifyExisting() {
    const clearDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '560px',
      data: {
        heading: 'Storage Container Management',
        message: `Proceeding will modify the location from ${this.fromCells} cell(s) to ${this.inventoryMapRecords.count} cell(s) in the inventory map records. Do you want to continue?`,
        customButtonText: true,
        btn1Text: 'Yes',
        btn2Text: 'No'
      }
    });
    clearDialogRef.afterClosed().subscribe(async (res) => {
      if (res == "Yes") {
        await this.updateStorageContainerLayout();
      }
      if (this.scm.carouselZone) {
        this.storageContainer.nativeElement.focus();
      }
    });
  }

  async updateStorageContainerLayout() {
    let res = await this.iAdminApiService.updateStorageContainerLayout(this.scm.tray, { BinLayoutId: this.scm.containerType,Zone: this.scm.carouselZone.zone});
    if (res?.status == HttpStatusCode.Ok && res?.body?.resource?.success) {
      this.clearAll();
      this.global.ShowToastr(ToasterType.Success, "Container Updated Successfully", ToasterTitle.Success);
    }
    else {
      this.global.ShowToastr(ToasterType.Error, res?.body?.resource?.errorMessage, ToasterTitle.Error);
    }
  }

  zoneChanged() {
    setTimeout(() => {
      if (this.storageContainer?.nativeElement) {
        this.storageContainer.nativeElement.focus();
      }
    }, 1);
  }

  checkDisabled(field: string): boolean {
    // In read-only mode (sendToOutboundPort), disable all input fields except the proceed button
    if (this.isReadOnlyMode) {
      // Disable proceed button if containerType is "Unknown"
      if (field === storageContainerDisabledFields.SENDTOOUTBOUNDPORT) {
        return this.getContainerTypeName() === StringConditions.Unknown;
      }
      return field !== storageContainerDisabledFields.SENDTOOUTBOUNDPORT;
    }
    
    const dependencies: { [key: string]: string[] } = {
      carouselZone: [],
      tray: [storageContainerDisabledFields.CAROUSELZONE],
      containerType: [storageContainerDisabledFields.CAROUSELZONE, storageContainerDisabledFields.TRAY],
      save: [storageContainerDisabledFields.CAROUSELZONE, storageContainerDisabledFields.TRAY, storageContainerDisabledFields.CONTAINERTYPE],
    };

    const requiredFields = dependencies[field] || [];

    return requiredFields.some(dep => {
      const value = dep === 'carouselZone' ? this.scm.carouselZone?.zone : this.scm[dep];
      return !value || value === 0 || value === '';
    });
  }

  async addInventoryMapRecord() {
    let inventoryMap: InventoryMap = new InventoryMap();
    inventoryMap.location = this.scm.carouselZone.zoneName;
    inventoryMap.zone = this.scm.carouselZone.zone;
    inventoryMap.row = this.scm.tray;
    inventoryMap.shelf = "";
    inventoryMap.carousel = "0";
    inventoryMap.cell = "F";
    inventoryMap.velocity = "1";
    inventoryMap.altLight = 1;
    let res = await this.iAdminApiService.createInventoryMapAsync(inventoryMap);
    if (res?.status == HttpStatusCode.Ok) {
      await this.updateStorageContainerLayout();
    }
    else{
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
    }
  }

  clearAll() {
    this.scm.carouselZone = new CarouselZone();
    if (this.carouselZones.length == 1) {
      this.scm.carouselZone = this.carouselZones[0];
    }
    this.scm.tray = "";
    this.scm.containerType = 0;
    this.tableMatrix = [];
  }
}
