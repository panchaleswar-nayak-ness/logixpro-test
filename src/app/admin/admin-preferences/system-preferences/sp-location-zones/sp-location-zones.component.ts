import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/init/auth.service';
import { LocationNameComponent } from 'src/app/admin/dialogs/location-name/location-name.component';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';

import { KanbanZoneAllocationConflictComponent } from 'src/app/admin/dialogs/kanban-zone-allocation-conflict/kanban-zone-allocation-conflict.component';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { zoneType, ToasterMessages, ToasterType ,ToasterTitle,ResponseStrings,DialogConstants,UniqueConstants,TableConstant,Style} from 'src/app/common/constants/strings.constants';


@Component({
  selector: 'app-sp-location-zones',
  templateUrl: './sp-location-zones.component.html',
  styleUrls: ['./sp-location-zones.component.scss'],
})
export class SpLocationZonesComponent implements OnInit {
  toggleSwitches = [
    { label: TableConstant.Carousel, name: zoneType.carousel, property: zoneType.carousel },
    { label: 'Staging Zone', name: 'stagingZone', property: 'stagingZone' },
    {
      label: 'CCS Auto Induct',
      name: 'includeInTransactions',
      property: 'includeInTransactions',
    },
    { label: 'Kanban Zone', name: 'kanbanZone', property: 'kanbanZone' },
    { label: 'Carton Flow', name: 'cartonFlow', property: 'cartonFlow' },
    {
      label: 'Include Zone in Auto Batch',
      name: 'includeInAutoBatch',
      property: 'includeInAutoBatch',
    },
    {
      label: 'Dynamic Warehouse',
      name: 'dynamicWarehouse',
      property: 'dynamicWarehouse',
    },
    {
      label: 'Kanban Replenishment Zone ',
      name: 'kanbanReplenishmentZone',
      property: 'kanbanReplenishmentZone',
    },
    {
      label: 'Replenishment Source',
      name: 'replenishmentZone',
      property: 'replenishmentZone',
    },
    {
      label: 'Include CF Carousel Pick',
      name: 'includeCFCarouselPick',
      property: 'includeCFCarouselPick',
    },
    {
      label: 'Allow Pick Allocation',
      name: 'allocable',
      property: 'allocable',
    },
  ];
  formFields = [
    { label: 'Label1', ngModel: 'i.label1' },
    { label: 'Label2', ngModel: 'i.label2' },
    { label: 'Label3', ngModel: 'i.label3' },
    { label: 'Label4', ngModel: 'i.label4' },
  ];
  public userData: any;
  public zone: any;
  public newLocationVal = '';
  public newLocation = false;
  public locationSaveBtn = true;
  public iAdminApiService: IAdminApiService;
  includeCf: false;

  locationzone: any = [];
  duplicateLocationZone: any = [];
  constructor(
   
    public authService: AuthService,
    private global: GlobalService,
    private adminApiService: AdminApiService
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getLocationZones();
  }

  conflictCheck(zone: any) {
    if (zone.allocable && zone.kanbanZone) {
      let dialogRef: any = this.global.OpenDialog(
        KanbanZoneAllocationConflictComponent,
        {
          height: 'auto',
          width: '56vw',
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          zone.allocable = result.allocation;
          zone.kanbanZone = result.kanban;
          this.zoneChange(zone, false);
        }
      });
    }
  }

  zoneChange(zone: any, check, type?) {
    if (!check) {
      if (type === zoneType.carousel) {
        if (zone.carousel) {
          this.alterParentZones(true, zone.zone);
          if (zone.cartonFlow) {
            zone.cartonFlow = false;
          }
          if (zone.includeCFCarouselPick) {
            zone.includeCFCarouselPick = false;
          }
        } else {
          this.alterParentZones(false, zone.zone);
          if (zone.cartonFlow) {
            zone.cartonFlow = false;
          }
        }
      }
      if (type === zoneType.cartonFlow) {
        if (zone.cartonFlow) {
          this.alterParentZones(false, zone.zone);
          if (zone.carousel) {
            zone.carousel = false;
          }
        }
      }
      if (type === zoneType.includePick) {
        if (zone.includeCFCarouselPick) {
          if (!zone.cartonFlow) {
            this.alterParentZones(false, zone.zone);
            zone.cartonFlow = true;
          }
          if (zone.carousel) {
            zone.carousel = false;
          }
        }
      }
      let oldZone: any = this.duplicateLocationZone.filter(
        (x: any) => x.ID == zone.ID
      )[0].zone;
      let newZone: any = zone.zone;
      let seq = zone.sequence;
      if (newZone == '') {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.BlankZone,
          ToasterTitle.Error
        );
        zone.zone = oldZone;
        return;
      } else if (seq < 0 || seq == '') {
        if (seq < 0) {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.SequenceMustEqualOrGreaterZero,
            ToasterTitle.Error
          );
          return;
        }
      }

      let check = oldZone.toLowerCase() != newZone.toLowerCase();
      if (check) {
        let test = this.duplicateLocationZone.find(
          (x: any) => x.zone == newZone
        );
        if (test) {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.BlankZone,
            ToasterTitle.Error
          );
        }
      }
      let locationZone = JSON.parse(JSON.stringify(zone));
      Object.keys(locationZone).forEach((k) => {
        locationZone[k] = '' + locationZone[k];
      });
      const updatedObj = {};
      for (const key in locationZone) {
        const updatedKey = key.charAt(0).toUpperCase() + key.slice(1);
        updatedObj[updatedKey] = locationZone[key];
      }

      let payload: any = {
        oldZone: oldZone,
        locationZone: updatedObj,
      };

      this.iAdminApiService.LocationZoneSave(payload).subscribe((res) => { });
    }
    if (type == 'kanbanZone' || type=='allocable'){
      this.conflictCheck(zone);
    }
  else {
      return;
    }
  }

  parentZones: any = [];
  getLocationZones() {
    this.iAdminApiService.LocationZone().subscribe((res) => {
      if (res.isExecuted && res.data) {
        this.locationzone = [];
        res.data.forEach((zone: any, i) => {
          zone.ID = i + 1;
          if (zone.carousel && zone.zone != '') {
            this.parentZones.push(zone.zone);
          }
          this.locationzone.push(zone);
        });
        this.duplicateLocationZone = JSON.parse(
          JSON.stringify(this.locationzone)
        );
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log('LocationZone', res.responseMessage);
      }
    });
  }

  locationName(item: any) {
    let dialogRef: any = this.global.OpenDialog(LocationNameComponent, {
      height: 'auto',
      width: Style.w786px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        item.locationName = result;
        this.zoneChange(item, false);
      } else if (result == null) {
        item.locationName = '';
        this.zoneChange(item, false);
      }
    });
  }

  delLocationZone(zone) {
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: Style.w600px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        action: UniqueConstants.delete,
      },
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res === ResponseStrings.Yes) {
        let payload = {
          zone: zone,
        };
        this.iAdminApiService.LocationZoneDelete(payload).subscribe((res) => {
          if (res.isExecuted) {
            this.getLocationZones();
            this.global.ShowToastr(
              ToasterType.Success,
              'Deleted successfully',
              ToasterTitle.Success
            );
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              `Location Zone ${zone} cannot be deleted because there are allocated quantities in an Inventory Map location matching the zone`,
              ToasterTitle.Error
            );
            console.log('LocationZone', res.responseMessage);
          }
        });
      }
    });
  }

  alterParentZones(add, item) {
    if (add && item != '') {
      let parentzone = this.parentZones;
      const isNumberExist = (item, parentzone) => {
        return parentzone.some((element) => element === item);
      };
      if (!isNumberExist(item, parentzone)) {
        this.parentZones.push(item);
      }
    } else {
      let newArray = this.parentZones.filter((number) => number != item);
      this.parentZones = newArray;
    }
  }

  addNewLocation() {
    this.newLocation = true;
  }

  newLocationValue() {
    if (this.newLocationVal != '') {
      this.locationSaveBtn = false;
      let test = this.duplicateLocationZone.find(
        (x: any) => x.zone == this.newLocationVal
      );
      if (test) {
        this.global.ShowToastr(
          ToasterType.Error,
          'Zone would be a duplicate and cannot be added.',
          ToasterTitle.Error
        );
      }
    } else {
      this.locationSaveBtn = true;
    }
  }

  saveNewLocation() {
    let payload = {
      zone: this.newLocationVal,
    };
    this.iAdminApiService.LocationZoneNewSave(payload).subscribe((res) => {
      if (res.isExecuted) {
        this.global.ShowToastr(
          ToasterType.Success,
          `Location Zone: ${this.newLocationVal} added succesfully`,
          ToasterTitle.Success
        );
        this.getLocationZones();
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          'Cannot insert duplicate Zone',
          ToasterTitle.Error
        );
        console.log('LocationZoneNewSave', res.responseMessage);
      }
    });
  }

  closeNewLocation() {
    this.newLocation = false;
  }
}
