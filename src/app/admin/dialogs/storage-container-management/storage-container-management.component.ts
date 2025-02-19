import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSelect } from '@angular/material/select';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { HttpStatusCode } from '@angular/common/http';
import { BinCellLayout, ContainerTypes, StorageContainerLayout } from 'src/app/common/Model/storage-container-management';

@Component({
  selector: 'app-storage-container-management-modal',
  templateUrl: './storage-container-management.component.html',
  styleUrls: ['./storage-container-management.component.scss']
})
export class StorageContainerManagementModalComponent implements OnInit {
  scm = {
    zone: "",
    tray: "",
    containerType: 0
  }
  errorText: string = "Storage Container/Tray cannot exceed 5 characters. Please enter a valid value.";
  rows = [
    ['A02', 'B02', 'C02', 'D02'], // Row 1
    ['A01', 'B01', 'C01', 'D01'], // Row 2
  ];
  containerTypes: ContainerTypes[] = [];
  get inventoryMapRecords(): { count: number; label: string } {
    const count = this.scm.containerType === 1
      ? 1
      : this.scm.containerType === 2 || this.scm.containerType === 3
        ? 2
        : this.scm.containerType === 4
          ? 4
          : 8; // Default for 'Octa-divided' or others

    const label = count === 1 ? 'record' : 'records';
    return { count, label };
  }
  carouselZones: string[] = [];
  tableMatrix: string[][] = [];
  storageContainerLayout: StorageContainerLayout = new StorageContainerLayout();
  storageContainerLayouts: StorageContainerLayout[] = [];
  isExistingContainer: boolean = false;
  fromCells: number = 0;

  @ViewChild('zone') zoneSelect!: MatSelect;
  @ViewChild('storageContainer', { static: false }) storageContainer!: ElementRef;

  public iAdminApiService: IAdminApiService;

  constructor(
    private readonly dialog: MatDialog,
    public adminApiService: AdminApiService,
    private readonly global: GlobalService,
  ) {
    this.iAdminApiService = adminApiService;
  }

  async ngOnInit(): Promise<void> {
    await this.getCarouselZones();
    await this.GetContainerLayoutsAsync();
  }

  ngAfterViewInit(): void {
    this.zoneSelect.focus();
  }

  async getCarouselZones() {
    let res = await this.iAdminApiService.getCarouselZones();
    if (res?.status == HttpStatusCode.Ok) {
      this.carouselZones = res?.body;
      if (this.carouselZones.length == 1) {
        this.scm.zone = this.carouselZones[0];
        this.zoneChanged();
      }
    }
  }

  async GetContainerLayoutsAsync() {
    let res = await this.iAdminApiService.GetContainerLayoutsAsync();
    if (res?.status == HttpStatusCode.Ok) {
      if (res?.body?.length > 0) {
        res?.body?.forEach(element => {
          this.containerTypes.push({ id: element.resource.id, name: element.resource.description });
        });
      }
    }
  }

  async validateScannedContainer() {
    this.tableMatrix = [];
    this.scm.containerType = 0;
    if (this.scm.tray === "") return;
    let res = await this.iAdminApiService.validateScannedContainer(this.scm.tray);
    if (res?.status == HttpStatusCode.Ok) {
      this.isExistingContainer = false;
      await this.getStorageContainerLayout();
    }
    else if (res?.error?.hasError) {
      this.scm.tray = "";
      this.scm.containerType = 0;
      this.global.ShowToastr(ToasterType.Error, res?.error?.errorMessage, ToasterTitle.Error);
    }
  }

  async getStorageContainerLayout() {
    if (!this.scm.tray) return;
    let res = await this.iAdminApiService.getStorageContainerLayout(this.scm.tray);
    if (res?.status == HttpStatusCode.Ok) {
      if(res?.body.resource == null) return;
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
        positions.push({ row: pos[0], col: pos[1], binID: item.binID });
      });
    });

    const maxRows = Math.max(...positions.map(pos => pos.row));
    const maxCols = Math.max(...positions.map(pos => pos.col));

    this.tableMatrix = Array.from({ length: maxRows }, () => Array(maxCols).fill(""));

    positions.forEach(({ row, col, binID }) => {
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
        await this.updateStorageContainerLayout();
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
    });
  }

  async updateStorageContainerLayout() {
    let res = await this.iAdminApiService.updateStorageContainerLayout(this.scm.tray, { BinLayoutId: this.scm.containerType });
    if (res?.status == HttpStatusCode.Ok && res?.body?.resource?.success) {
      this.global.ShowToastr(ToasterType.Success, "Container Updated Successfully", ToasterTitle.Success);
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
    const dependencies: { [key: string]: string[] } = {
      zone: [],
      tray: ['zone'],
      containerType: ['zone', 'tray'],
      save: ['zone', 'tray', 'containerType'],
    };

    const requiredFields = dependencies[field] || [];
    return requiredFields.some(dep => this.scm[dep] === '' || this.scm[dep] === 0);
  }
}
