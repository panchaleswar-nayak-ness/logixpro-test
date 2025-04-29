import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CycleCountConfirmMessageDialogData } from 'src/app/common/Model/cycle-count';

@Component({
  selector: 'app-cycle-count-confirm-message-dialog',
  templateUrl: './cycle-count-confirm-message-dialog.component.html',
  styleUrls: ['./cycle-count-confirm-message-dialog.component.scss']
})
export class CycleCountConfirmMessageDialogComponent implements OnInit {
  dialogHeading: string = '';
  notFoundLabel: string = ''; // For "Not Found in the System" or "The following location(s) were not found in the system"
  notFoundDetails: string = ''; // For the list of items/locations
  cycleCountMessage: string = '';
  workstationMessages: string[] = [];
  importType: string = 'Location';
  isJustNotFound: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CycleCountConfirmMessageDialogData,
    public dialogRef: MatDialogRef<CycleCountConfirmMessageDialogComponent>
  ) {}

  ngOnInit(): void {
    this.initializeDialogData();
  }

  private initializeDialogData(): void {
    this.dialogHeading = this.data?.heading || 'Location(s) Not Found';
    this.importType = this.data?.importType || 'Location';

    const notFoundLocations = Array.isArray(this.data?.notFoundLocations) ? this.data.notFoundLocations : [];
    const cycleCountLocations = Array.isArray(this.data?.cycleCountLocations) ? this.data.cycleCountLocations : [];
    const workstationGroups = Array.isArray(this.data?.workstationGroups) ? this.data.workstationGroups : [];
    const notFoundItems = Array.isArray(this.data?.notFoundItems) ? this.data.notFoundItems : [];
    const cycleCountItems = Array.isArray(this.data?.cycleCountItems) ? this.data.cycleCountItems : [];
    const itemWorkstationGroups = Array.isArray(this.data?.itemWorkstationGroups) ? this.data.itemWorkstationGroups : [];

    if (this.importType === 'Location') {
      this.isJustNotFound = notFoundLocations.length > 0 && cycleCountLocations.length === 0 && workstationGroups.length === 0;

      if (notFoundLocations.length > 0) {
        this.notFoundLabel = this.isJustNotFound ? 'The following location(s) were not found in the system' : 'Not Found in the System';
        this.notFoundDetails = notFoundLocations.join(', ');
      }

      if (cycleCountLocations.length > 0) {
        this.cycleCountMessage = `Existing Cycle Count Transaction: ${cycleCountLocations.join(', ')}`;
      }

      if (workstationGroups.length > 0) {
        this.workstationMessages = workstationGroups.map(group => {
          const workstation = group.workstation || 'Unknown Workstation';
          const locations = Array.isArray(group.locations) ? group.locations.join(', ') : '';
          return `Assigned to Workstation ${workstation}: ${locations}`;
        });
      }
    } else {
      // Item case
      this.isJustNotFound = notFoundItems.length > 0 && cycleCountItems.length === 0 && itemWorkstationGroups.length === 0;

      if (notFoundItems.length > 0) {
        this.notFoundLabel = this.isJustNotFound ? 'The following item(s) were not found in the system' : 'Not Found in the System';
        this.notFoundDetails = notFoundItems.join(', ');
      }

      if (cycleCountItems.length > 0) {
        this.cycleCountMessage = `Existing Cycle Count Transaction: ${cycleCountItems.join(', ')}`;
      }

      if (itemWorkstationGroups.length > 0) {
        this.workstationMessages = itemWorkstationGroups.map(group => {
          const workstation = group.workstation || 'Unknown Workstation';
          const items = Array.isArray(group.items) ? group.items.join(', ') : '';
          return `Assigned to Workstation ${workstation}: ${items}`;
        });
      }
    }
  }

  confirmOK(): void {
    this.dialogRef.close('Ok');
  }
}