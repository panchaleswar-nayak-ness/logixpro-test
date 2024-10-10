import { Component, OnInit, ViewChild } from '@angular/core';
import {
  DialogConstants,
  Style,
  ToasterMessages,
  ToasterTitle,
  ToasterType,
} from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { SelectZonesComponent } from 'src/app/dialogs/select-zones/select-zones.component';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NonSuperBatchOrdersComponent } from './non-super-batch-orders/non-super-batch-orders.component';
import { SuperBatchOrdersComponent } from './super-batch-orders/super-batch-orders.component';
import { PickToteInFilterComponent } from './pick-tote-in-filter/pick-tote-in-filter.component';
import { PickToteInductionFilter } from '../models/PickToteInductionModel';
import { FilterOrderNumberComponent } from './filter-order-number/filter-order-number.component';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';

interface IZoneGroup {
  Id: number;
  ZoneGroup: string;
  Zone: string;
}
@Component({
  selector: 'app-pick-tote-induction',
  templateUrl: './pick-tote-induction.component.html',
  styleUrls: ['./pick-tote-induction.component.scss'],
})
export class PickToteInductionComponent implements OnInit {
  constructor(private global: GlobalService, private Api: ApiFuntions) {}

  zoneGroupingsList: IZoneGroup[] = [];
  zoneAllGroupingsList: IZoneGroup[] = [];
  selectedZoneGrouping: IZoneGroup | undefined;
  zoneList: string[];
  selectedZones: string = '';
  activeTab: MatTabChangeEvent;
  @ViewChild(NonSuperBatchOrdersComponent, { static: true })
  NonSuperBatchOrdersComponent: NonSuperBatchOrdersComponent;
  @ViewChild(SuperBatchOrdersComponent, { static: true })
  SuperBatchOrdersComponent: SuperBatchOrdersComponent;

  ngOnInit(): void {
    this.getZoneGroups();
  }

  showChange(selectedValue: any) {
    this.selectedZoneGrouping = this.zoneGroupingsList.find(
      (x) => x.Id === selectedValue
    );
    let selectedZones: IZoneGroup[] = [];

    if (this.selectedZoneGrouping) {
      selectedZones = this.zoneAllGroupingsList.filter(
        (x) => x.ZoneGroup === this.selectedZoneGrouping?.ZoneGroup
      );
    }

    this.zoneList = selectedZones.map((zone) => zone.Zone);
    this.selectedZones = this.zoneList.join(' ');

    // Call the function to filter orders
    if (this.NonSuperBatchOrdersComponent) {
      this.NonSuperBatchOrdersComponent.retrieveFilteredNonSuperBatchOrders(
        this.zoneList
      );
      this.NonSuperBatchOrdersComponent.rebind();
    }

    if (this.SuperBatchOrdersComponent) {
      this.SuperBatchOrdersComponent.retrieveFilteredSuperBatchOrders(
        this.zoneList
      );
      this.SuperBatchOrdersComponent.rebind();
    }
  }

  async getZoneGroups() {
    try {
      this.Api.GetZoneGroupings().subscribe((res: any) => {
        if (res.data && res.isExecuted) {
          res.data.forEach((f) => {
            const existingItem = this.zoneGroupingsList.find(
              (item) => item.ZoneGroup === f.zoneGroupName
            );

            if (!existingItem) {
              this.zoneGroupingsList.push({
                Id: f.id,
                ZoneGroup: f.zoneGroupName,
                Zone: f.zoneName,
              });
            }

            this.zoneAllGroupingsList.push({
              Id: f.id,
              ZoneGroup: f.zoneGroupName,
              Zone: f.zoneName,
            });

            this.zoneList = [];
          });
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.SomethingWentWrong,
            ToasterTitle.Error
          );
        }
      });
    } catch (error) {}
  }

  openSelectZones() {
    const dialogRef: any = this.global.OpenDialog(SelectZonesComponent, {
      height: 'auto',
      width: '60%',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        zoneList: this.zoneList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedZoneValues = result.selectedRecords.map(
          (item) => item.zone
        );

        this.zoneList = selectedZoneValues;
        this.selectedZones = this.zoneList.join(' ');

        // Get the list of selected zone values
        // Call the function to filter orders
        if (this.NonSuperBatchOrdersComponent) {
          this.NonSuperBatchOrdersComponent.retrieveFilteredNonSuperBatchOrders(
            selectedZoneValues
          );
          this.NonSuperBatchOrdersComponent.rebind();
        }

        if (this.SuperBatchOrdersComponent) {
          this.SuperBatchOrdersComponent.retrieveFilteredSuperBatchOrders(
            selectedZoneValues
          );
          this.SuperBatchOrdersComponent.rebind();
        }
      }
    });
  }

  refreshOrders() {}

  clearFilters() {

    const dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: '60%',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: '',
        heading: 'Do you want to clear all filters?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
      
      }
    });
  }

  onTabClick($event: MatTabChangeEvent) {
    this.activeTab = $event;
  }
}
