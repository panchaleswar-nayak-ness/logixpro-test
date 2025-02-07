import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatSelect } from '@angular/material/select';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { HttpStatusCode } from '@angular/common/http';

@Component({
  selector: 'app-storage-container-management-modal',
  templateUrl: './storage-container-management.component.html',
  styleUrls: ['./storage-container-management.component.scss']
})
export class StorageContainerManagementModalComponent implements OnInit {

  scm = {
    zone: "",
    tray: "",
    containertype: ""
  }
  errorText: string = "Storage Container/Tray cannot exceed 5 characters. Please enter a valid value.";
  rows = [
    ['A02', 'B02', 'C02', 'D02'], // Row 1
    ['A01', 'B01', 'C01', 'D01'], // Row 2
  ];
  containerTypes: string[] = ["Whole", "Half Shortways", "Half Longways", "Quartered", "Octa-divided"];
  get inventoryMapRecords(): { count: number; label: string } {
    const count = this.scm.containertype === 'Whole'
      ? 1
      : this.scm.containertype === 'Half Shortways' || this.scm.containertype === 'Half Longways'
        ? 2
        : this.scm.containertype === 'Quartered'
          ? 4
          : 8; // Default for 'Octa-divided' or others

    const label = count === 1 ? 'record' : 'records';
    return { count, label };
  }
  carouselZones: string[] = [];

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
      console.log(this.carouselZones);
    }
  }

  async validateScannedContainer() {
    if (this.scm.tray === "") return;
    let res = await this.iAdminApiService.validateScannedContainer(this.scm.tray);
    if (res?.status == HttpStatusCode.Ok) {
      await this.getStorageContainerLayout();
    } else {
      this.global.ShowToastr(ToasterType.Error, res?.error?.errorMessage, ToasterTitle.Error);
    }
  }

  async getStorageContainerLayout() {
    if (!this.scm.tray) return;
    let res = await this.iAdminApiService.getStorageContainerLayout(this.scm.tray);
    if (res?.status == HttpStatusCode.Ok) {
      console.log(res.hasError);
    } else {
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
    }
  }



  zoneChanged() {
    if (this.storageContainer && this.storageContainer.nativeElement) {
      this.storageContainer.nativeElement.focus();
    }
  }

  getVisibleCells(row: string[]): string[] {
    // Dynamically filter cells based on the containertype
    const { containertype } = this.scm;

    return row.filter((cell, index) => {
      switch (containertype) {
        case 'Whole':
          return index === 0;
        case 'Half Shortways':
          return index <= 1;
        case 'Half Longways':
          return index === 0 || index === 2;
        case 'Quartered':
          return index <= 3;
        case 'Octa-divided':
          return true;
        default:
          return false;
      }
    });
  }

  addNewCarousel() {
    const clearDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '560px',
      data: {
        heading: 'Add New Carousel',
        message: 'Are you sure you want to add this carousel?',
        customButtonText: true,
        btn1Text: 'Yes',
        btn2Text: 'No'
      }
    });
    clearDialogRef.afterClosed().subscribe((res) => { });
  }

  addNewShelf() {
    const clearDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '560px',
      data: {
        heading: 'Add New Shelf',
        message: 'Are you sure you want to add this shelf?',
        customButtonText: true,
        btn1Text: 'Yes',
        btn2Text: 'No'
      }
    });
    clearDialogRef.afterClosed().subscribe((res) => { });
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

  exstingTray() {
    const clearDialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '560px',
      data: {
        heading: 'Storage Container Management',
        message: 'The scanned Storage Container/Tray already exists. Do you want to confirm that the Inventory Map records will be modified?',
        customButtonText: true,
        btn1Text: 'Yes',
        btn2Text: 'No'
      }
    });
    clearDialogRef.afterClosed().subscribe((res) => { });
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
