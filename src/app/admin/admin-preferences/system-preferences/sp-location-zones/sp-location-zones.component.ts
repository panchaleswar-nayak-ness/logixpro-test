import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/common/init/auth.service';
import { LocationNameComponent } from 'src/app/admin/dialogs/location-name/location-name.component';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';

import { KanbanZoneAllocationConflictComponent } from 'src/app/admin/dialogs/kanban-zone-allocation-conflict/kanban-zone-allocation-conflict.component';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { zoneType, ToasterMessages, ToasterType ,ToasterTitle,ResponseStrings,DialogConstants,UniqueConstants,TableConstant,Style} from 'src/app/common/constants/strings.constants';
import { ApiResponse, ColumnAlias, UserSession } from 'src/app/common/types/CommonTypes';
import { Zone } from 'src/app/bulk-process/preferences/preference.models';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sp-location-zones',
  templateUrl: './sp-location-zones.component.html',
  styleUrls: ['./sp-location-zones.component.scss'],
})
export class SpLocationZonesComponent implements OnInit, OnDestroy {
  prevLocation : string;
  fieldMappings : ColumnAlias = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');

  // Case Label dropdown options
  caseLabelOptions = [
    { value: '', label: '' },
    { value: 'User Field 1', label: 'User Field 1' },
    { value: 'User Field 2', label: 'User Field 2' },
    { value: 'User Field 3', label: 'User Field 3' },
    { value: 'User Field 4', label: 'User Field 4' },
    { value: 'User Field 5', label: 'User Field 5' },
    { value: 'User Field 6', label: 'User Field 6' },
    { value: 'User Field 7', label: 'User Field 7' },
    { value: 'User Field 8', label: 'User Field 8' },
    { value: 'User Field 9', label: 'User Field 9' },
    { value: 'User Field 10', label: 'User Field 10' }
  ];

  toggleSwitches = [
    { label: this.fieldMappings?.carousel || TableConstant.Carousel, name: zoneType.carousel, property: zoneType.carousel },
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
      name: 'includeCfCarouselPick',
      property: 'includeCfCarouselPick',
    },
    {
      label: 'Allow Pick Allocation',
      name: 'allocable',
      property: 'allocable',
    },
    {
      label: 'Allow Clear Whole Location',
      name: 'allowWholeClearLocation',
      property: 'allowWholeClearLocation',
    },

  ];
  
  public userData: UserSession;
  public newLocationVal = '';
  public newLocation = false;
  public locationSaveBtn = true;
  public iAdminApiService: IAdminApiService;
  includeCf: boolean = false;

  locationzone: Zone[] = [];
  duplicateLocationZone: Zone[] = [];
  
  // RxJS Subject for debouncing all field changes (toggles and inputs)
  private zoneChangeSubject = new Subject<{zone: Zone, property?: string}>();
  private readonly destroy$ = new Subject<void>();
  constructor(
   
    public authService: AuthService,
    public global: GlobalService,
    public adminApiService: AdminApiService
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getLocationZones();
    
    // Setup debounced subscription for all field changes (toggles, inputs, selects)
    // Uses takeUntil pattern for automatic cleanup - Angular best practice
    this.zoneChangeSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged((prev, curr) => {
        // Compare zone IDs - must be same zone
        if (prev.zone.id !== curr.zone.id) return false;
        
        // If property is specified (for toggles), compare that specific property value
        if (prev.property && curr.property && prev.property === curr.property) {
          return prev.zone[prev.property] === curr.zone[curr.property];
        }
        
        // For general field changes without property, always allow through
        // The debounceTime will handle preventing rapid calls
        return false;
      }),
      takeUntil(this.destroy$)
    ).subscribe(({zone, property}) => {
      this.zoneChange(zone, false, property);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Generic method to handle all field changes with debouncing
  // Works for toggles (with property) and input/select fields (without property)
  onFieldChange(zone: Zone, property?: string): void {
    this.zoneChangeSubject.next({zone, property});
  }


  conflictCheck(zone: Zone) {
    if (zone.allocable && zone.kanbanZone) {
      const originalZone = this.duplicateLocationZone.find((x: Zone) => x.id === zone.id);
      const prevAllocable = originalZone?.allocable ?? false;
      const prevKanban = originalZone?.kanbanZone ?? false;
      
      let dialogRef: any = this.global.OpenDialog(
        KanbanZoneAllocationConflictComponent,
        {
          height: DialogConstants.auto,
          width: Style.w56vw,
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          zone.allocable = result.allocation;
          zone.kanbanZone = result.kanban;
          this.zoneChange(zone, false);
        } else {
          zone.allocable = prevAllocable;
          zone.kanbanZone = prevKanban;
        }
      });
    }
  }

  zoneChange(zone: Zone, check, type?) {
    
    if (!check) {
      // Check for conflict BEFORE API call when type is 'kanbanZone' or 'allocable'
      if (type == 'kanbanZone' || type == 'allocable') {
        if (zone.allocable && zone.kanbanZone) {
          this.conflictCheck(zone);
          return; // No API call if conflict exists
        }
      }

      if (type === zoneType.carousel) {
        if (zone.carousel) {
          this.alterParentZones(true, zone.zone);
          if (zone.cartonFlow) {
            zone.cartonFlow = false;
          }
          if (zone.includeCfCarouselPick) {
            zone.includeCfCarouselPick = false;
          }
          // Reset Case Label when Carousel is enabled
          zone.caseLabel = '';
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
      if (type === 'includeCfCarouselPick') {
        if (zone.includeCfCarouselPick) {
          if (!zone.cartonFlow) {
            this.alterParentZones(false, zone.zone);
            zone.cartonFlow = true;
          }
          if (zone.carousel) {
            zone.carousel = false;
          }
          // Reset Case Label when Include CF Carousel Pick is enabled
          zone.caseLabel = '';
        } else {
          // Clear Parent Zone when Include CF Carousel Pick is disabled
          zone.parentZone = '';
        }
      }
      let oldZone: string = this.duplicateLocationZone.filter(
        (x: Zone) => x.id == zone.id
      )[0].zone;
      let newZone: string = zone.zone;
      let seq = zone.sequence;
      if (newZone == '') {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.BlankZone,
          ToasterTitle.Error
        );
        zone.zone = oldZone;
        return;
      } else if (seq < 0) {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.SequenceMustEqualOrGreaterZero,
            ToasterTitle.Error
        );
        return;
      }

      let check = oldZone.toLowerCase() != newZone.toLowerCase();
      if (check) {
        let test = this.duplicateLocationZone.find(
          (x: Zone) => x.zone == newZone
        );
        if (test) {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.BlankZone,
            ToasterTitle.Error
          );
        }
      }

      let payload: any = {
        oldZone: oldZone,
        locationZone: zone,
      };

      this.iAdminApiService.LocationZoneSave(payload).subscribe((res) => {
          // --- UPDATE FRONTEND WITH SERVER VALUES ---
           const updatedZone = res.data?.locationZone;

            if (res.isExecuted && updatedZone) {
              this.applyServerUpdate(zone, updatedZone);

              this.global.ShowToastr(
                ToasterType.Success,
                ToasterMessages.ZoneUpdatedSuccessfully,
                ToasterTitle.Success
              );
            } else {
              this.revertZone(zone);

              this.global.ShowToastr(
                ToasterType.Error,
                res.responseMessage,
                ToasterTitle.Error
              );
            }
          });
    }
  }

  private applyServerUpdate(zone, updatedZone) {
  const { id, ...cleanData } = updatedZone; // prevent ID overwrite

  // Update main zone
  Object.assign(zone, cleanData);

  // Update duplicate zone
  const dupIndex = this.duplicateLocationZone.findIndex(x => x.id === zone.id);
  if (dupIndex > -1) {
    this.duplicateLocationZone[dupIndex] = {
      ...this.duplicateLocationZone[dupIndex],
      ...cleanData
    };
  }
}

private revertZone(zone) {
  const original = this.duplicateLocationZone.find(x => x.id === zone.id);
  if (original) {
    Object.assign(zone, original);
  }
}

  parentZones: string[] = [];
  getLocationZones() {
    this.iAdminApiService.LocationZone().subscribe((res : ApiResponse<Zone[]>) => {
      if (res.isExecuted && res.data) {
        this.locationzone = [];
        res.data.forEach((zone: Zone, i) => {
          // TODO: Correct this field name in the backend. Current mapping kept temporarily to avoid wider impact.
          if ("includeCFCarouselPick" in zone) {
            zone.includeCfCarouselPick = Boolean((zone as any)["includeCFCarouselPick"]);
          }
          zone.id = i + 1;
          if (zone.carousel && zone.zone != '') {
            this.parentZones.push(zone.zone);

          }
          this.locationzone.push(zone);
        });

        this.duplicateLocationZone = this.locationzone.map(zone => Object.assign({}, zone));
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log('LocationZone', res.responseMessage);
      }
    });
  }

  locationName(item: Zone) {
    this.prevLocation=item.locationName;
    let dialogRef: any = this.global.OpenDialog(LocationNameComponent, {
      height: DialogConstants.auto,
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

  delLocationZone(zone: string) {
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: DialogConstants.auto,
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
              ToasterMessages.ZoneDeletedSuccessfully,
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

  alterParentZones(add: boolean, item: string) { 
    if (add && item != '') {
      let parentzone = this.parentZones;
      const isNumberExist = (item: string, parentzone: string[]) => {
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
        (x: Zone) => x.zone == this.newLocationVal
      );
      if (test) {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.ZoneWouldBeADuplicateAndCannotBeAdded,
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
        this.newLocation = false;
        this.getLocationZones();
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.CannotInsertDuplicateZone,
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
