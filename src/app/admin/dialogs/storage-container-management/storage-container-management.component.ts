import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-storage-container-management',
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

  containerTypes: string[] = ["Whole", "Half Shortways", "Half Longways", "Quartered", "Octa-divided"];

  constructor(
    private readonly dialog: MatDialog,
  ) { }

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
}
