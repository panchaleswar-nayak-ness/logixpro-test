import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSelect } from '@angular/material/select';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { HttpStatusCode } from '@angular/common/http';
import { StorageContainerLayout } from 'src/app/common/Model/storage-container-management';
import { el } from 'date-fns/locale';

@Component({
  selector: 'app-storage-container-management-modal',
  templateUrl: './storage-container-management.component.html',
  styleUrls: ['./storage-container-management.component.scss']
})
export class StorageContainerManagementModalComponent implements OnInit {

  scm = {
    zone: "",
    tray: "",
    containertype: 0
  }
  errorText: string = "Storage Container/Tray cannot exceed 5 characters. Please enter a valid value.";
  rows = [
    ['A02', 'B02', 'C02', 'D02'], // Row 1
    ['A01', 'B01', 'C01', 'D01'], // Row 2
  ];
  containerTypes = [
    { "id": 1, "name": "Whole" },
    { "id": 2, "name": "Half Shortways" },
    { "id": 3, "name": "Half Longways" },
    { "id": 4, "name": "Quartered" },
    { "id": 5, "name": "Octa-divided" }
  ];
  get inventoryMapRecords(): { count: number; label: string } {
    const count = this.scm.containertype === 1
      ? 1
      : this.scm.containertype === 2 || this.scm.containertype === 3
        ? 2
        : this.scm.containertype === 4
          ? 4
          : 8; // Default for 'Octa-divided' or others

    const label = count === 1 ? 'record' : 'records';
    return { count, label };
  }
  carouselZones: string[] = [];
  tableMatrix: string[][] = [];
  storageContainerLayout: StorageContainerLayout = new StorageContainerLayout();

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

  async validateScannedContainer() {
    if (this.scm.tray === "") return;
    let res = await this.iAdminApiService.validateScannedContainer(this.scm.tray);
    if (res?.status == HttpStatusCode.Ok) {
      await this.getStorageContainerLayout();
    } else {
      this.storageContainerAlreadyExists();
      this.global.ShowToastr(ToasterType.Error, res?.error?.errorMessage, ToasterTitle.Error);
    }
  }

  async getStorageContainerLayout() {
    if (!this.scm.tray) return;
    let res = await this.iAdminApiService.getStorageContainerLayout(this.scm.tray);
    if (res?.status == HttpStatusCode.Ok) {
      this.storageContainerLayout = res.body;
      this.scm.containertype = this.storageContainerLayout.binLayout.id;
      this.createTableMatrix();
    } else {
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
    }
  }


  createTableMatrix() {
    let positions: { row: number, col: number, binID: string }[] = [];

    this.storageContainerLayout.binLayout.binCellLayouts.forEach(item => {
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






  zoneChanged() {
    setTimeout(() => {
      if (this.storageContainer?.nativeElement) {
        this.storageContainer.nativeElement.focus();
      }
    }, 1);
  }

  newTray() {
    const clearDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '560px',
      data: {
        heading: 'Storage Container Management',
        message: 'The scanned Storage Container/Tray is new and will add {X} record(s) to the inventory. Do you want to confirm the addition?',
        customButtonText: true,
        btn1Text: 'Yes',
        btn2Text: 'No'
      }
    });
    clearDialogRef.afterClosed().subscribe((res) => { });
  }

  async storageContainerAlreadyExists() {
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
    clearDialogRef.afterClosed().subscribe(async (res) => {
      if(res == "Yes"){
        await this.getStorageContainerLayout();
      }
      else{
        this.scm.tray = "";
        this.scm.containertype = 0;
      } 
    });
  }

  checkDisabled(field: string): boolean {
    const dependencies: { [key: string]: string[] } = {
      zone: [],
      tray: ['zone'],
      containertype: ['zone', 'tray'],
      save: ['zone', 'tray', 'containertype'],
    };

    const requiredFields = dependencies[field] || [];
    return requiredFields.some(dep => this.scm[dep] === '');
  }
}
