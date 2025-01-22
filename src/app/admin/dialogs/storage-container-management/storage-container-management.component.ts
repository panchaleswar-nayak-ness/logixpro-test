import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { el } from 'date-fns/locale';

@Component({
  selector: 'app-storage-container-management-modal',
  templateUrl: './storage-container-management.component.html',
  styleUrls: ['./storage-container-management.component.scss']
})
export class StorageContainerManagementModalComponent {

  scm = {
    zone: "",
    carousel: "",
    shelf: "",
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

  constructor(
    private readonly dialog: MatDialog,
  ) { }

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
      carousel: ['zone'],
      shelf: ['zone', 'carousel'],
      tray: ['zone', 'carousel', 'shelf'],
      containertype: ['zone', 'carousel', 'shelf', 'tray'],
      save: ['zone', 'carousel', 'shelf', 'tray', 'containertype'],
    };

    const requiredFields = dependencies[field] || [];
    return requiredFields.some(dep => this.scm[dep] === '');
  }
}
