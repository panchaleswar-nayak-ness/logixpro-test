import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ElementRef,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { DeleteConfirmationComponent } from '../../../app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../common/init/auth.service';
import labels from 'src/app/common/labels/labels.json';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import {  ToasterTitle ,ResponseStrings,ToasterType,KeyboardKeys,DialogConstants,Style} from 'src/app/common/constants/strings.constants';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { LocationZone } from 'src/app/common/interface/admin/location-zones.interface';
import { ApiResponse } from 'src/app/common/types/CommonTypes';
import { ZoneFilterType } from 'src/app/common/enums/CommonEnums';

@Component({
  selector: 'app-workstation-zones',
  templateUrl: './workstation-zones.component.html',
  styleUrls: ['./workstation-zones.component.scss'],
})
export class WorkstationZonesComponent implements OnInit {
  @ViewChild('fieldFocus') fieldFocus: ElementRef;

  public workstationZones: any[] = [];
  onDestroy$: Subject<boolean> = new Subject();
  public userData: any;
  public selectedZone: any = '';
  public allZoneList: any[] = [];
  public zones: any[] = [];
  @ViewChild('btnSave') button;
  public iInductionManagerApi: IInductionManagerApiService;
  public iAdminApiService: IAdminApiService;

  locationZones: LocationZone[] = [];
  activeFilters: Set<ZoneFilterType> = new Set([ZoneFilterType.All]);
  ZoneFilterType = ZoneFilterType; // Expose enum to template

  @ViewChild('searchauto', { static: false })
  autocompleteOpened: MatAutocomplete;
  zoneSelectOptions: any[] = [];
  onSearchSelect(e: any) {
    this.selectedZone = e.option.value;
    if (this.validateZone()) {
      this.saveVlCode();
    }
  }


  constructor(
    public commonAPI: CommonApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    public inductionManagerApi: InductionManagerApiService,
    private adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<any>,
    private global: GlobalService
  ) {
    this.iCommonAPI = commonAPI;
    this.iInductionManagerApi = inductionManagerApi;
    this.iAdminApiService = adminApiService;
  }

  public iCommonAPI: ICommonApi;

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getWorkstationZones();
    this.getLocationZones();
  }
  ngAfterViewInit(): void {
    this.fieldFocus?.nativeElement.focus();
    console.log(this.zoneSelectOptions);
    this.zoneSelectOptions = this.zones;
  }

  validateZone() {
    if (
      this.workstationZones.filter(
        (x: any) =>
          x.zone.toLowerCase() == this.selectedZone.trim().toLowerCase()
      ).length > 0
    ) {
      this.global.ShowToastr(
        ToasterType.Error,
        'This Zone is already selected for this workstation',
        ToasterTitle.Error
      );
      return false;
    }
    if (this.zones.filter((x: any) => x == this.selectedZone).length == 0) {
      this.global.ShowToastr(ToasterType.Error, 'This zone does not exist', ToasterTitle.Error);
      return false;
    }
    return true;
  }

  searchItem(event: any) {
      if (event.key == KeyboardKeys.Enter) {
        if (this.validateZone()) {
          this.saveVlCode();
        }
      } else {
        this.zoneSelectOptions = this.zones.filter(
          (x: any) =>
            x.trim().toLowerCase().indexOf(this.selectedZone.trim().toLowerCase()) != -1 &&
            this.workstationZones.filter(
              (y: any) => y.zone.toLowerCase() == x.toLowerCase()
            ).length == 0
        );
      }
  }
  clearAllZones() {
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        mode: 'release-all-orders',
        ErrorMessage: 'Remove All Zones for this workstation?',
        action: 'remove',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        this.iInductionManagerApi.ClrWSPickZone().subscribe((res) => {
          if (res.isExecuted && res.data) {
            this.getWorkstationZones();
            this.getAllZoneList();
            this.global.ShowToastr(ToasterType.Success, labels.alert.remove, ToasterTitle.Success);
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              'Failed to remove Zones from workstation',
              'Remove Failed'
            );
            console.log('ClrWSPickZone', res.responseMessage);
          }
        });
      }
    });
  }

  getWorkstationZones() {
    let paylaod = {};
    this.workstationZones = [];
    this.iInductionManagerApi.WSPickZoneSelect(paylaod).subscribe((res) => {
      if (res.isExecuted && res.data) {
        res.data.map((val) => {
          this.workstationZones.push({ zone: val, isSaved: true });
        });
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log('WSPickZoneSelect', res.responseMessage);
      }
    });
  }
  getAllZoneList() {
    let paylaod = {};
    this.workstationZones = [];
    this.iInductionManagerApi.LocationZonesSelect(paylaod).subscribe((res) => {
      if (res.isExecuted && res.data) {
        this.zones = res.data;
        this.zoneSelectOptions = this.zones.filter(
          (x: any) =>
            this.workstationZones.filter(
              (y: any) => y.zone.toLowerCase() == x.toLowerCase()
            ).length == 0
        );
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log('LocationZonesSelect', res.responseMessage);
      }
    });
  }

  getLocationZones() {
    this.iAdminApiService.LocationZone().subscribe((res : ApiResponse<LocationZone[]>) => {
      if (res.isExecuted && res.data) {
        this.locationZones = res.data;
        this.zones = [];
        res.data.forEach((zone: LocationZone, i) => {          
          this.zones.push(zone.zone);
        });
        this.updateZoneSelectOptions(); 
        this.toggleFilter(ZoneFilterType.Carousel, true);
        this.toggleFilter(ZoneFilterType.CartonFlow, true);
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log('LocationZone', res.responseMessage);
      }
    });
  }

  toggleFilter(filterType: ZoneFilterType, isChecked: boolean): void {
    if (filterType === ZoneFilterType.All) {
      if (isChecked) {
        this.activeFilters.clear();
        this.activeFilters.add(ZoneFilterType.All);
      } else {
        this.activeFilters.delete(ZoneFilterType.All);
      }
    } else {
      this.activeFilters.delete(ZoneFilterType.All);
      
      if (isChecked) {
        this.activeFilters.add(filterType);
      } else {
        this.activeFilters.delete(filterType);
      }
    }
    
    this.applyFilters();
  }

  isFilterActive(filterType: ZoneFilterType): boolean {
    return this.activeFilters.has(filterType);
  }

  private applyFilters(): void {
    if (this.activeFilters.size === 0) {
      // No filters active, show empty list
      this.zones = [];
    } else if (this.activeFilters.has(ZoneFilterType.All)) {
      this.zones = this.locationZones.map(zone => zone.zone);
    } else {
      this.zones = this.locationZones
        .filter(zone => this.matchesAnyActiveFilter(zone))
        .map(zone => zone.zone);
    }
    
    this.updateZoneSelectOptions();
  }

  private matchesAnyActiveFilter(zone: LocationZone): boolean {
    for (const filterType of this.activeFilters) {
      if (this.matchesFilterType(zone, filterType)) {
        return true;
      }
    }
    return false;
  }

  private matchesFilterType(zone: LocationZone, filterType: ZoneFilterType): boolean {
    switch (filterType) {
      case ZoneFilterType.All:
        return true;
      case ZoneFilterType.Carousel:
        return zone.carousel || zone.includeCFCarouselPick;
      case ZoneFilterType.CartonFlow:
        return zone.cartonFlow;
      case ZoneFilterType.Bulk:
        return !zone.carousel && !zone.includeCFCarouselPick && !zone.cartonFlow;
      default:
        return false;
    }
  }

  updateZoneSelectOptions() {
    this.zoneSelectOptions = this.zones.filter(
      (x: any) =>
        this.workstationZones.filter(
          (y: any) => y.zone.toLowerCase() == x.toLowerCase()
        ).length == 0
    );
  }

  addVLRow() {
    this.selectedZone = '';
    this.allZoneList.unshift([]);
  }
  dltZone() {

  }
  onSelectZone(val: string) {
    this.selectedZone = val;
  }
  saveVlCode() {
    if (this.selectedZone) {
      let paylaod = {
        zone: this.selectedZone,
      };
      this.iInductionManagerApi.WSPickZoneInsert(paylaod).subscribe((res) => {
        if (res.isExecuted && res.data) {
          this.global.ShowToastr(ToasterType.Success, labels.alert.success, ToasterTitle.Success);
          this.getWorkstationZones();
          this.zoneSelectOptions = this.zoneSelectOptions.filter(x => x !== this.selectedZone);
          this.selectedZone = '';
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            'This Zone is already selected for this workstation.',
            ToasterTitle.Error
          );
          console.log('WSPickZoneInsert', res.responseMessage);
        }
      });
    } else {
      this.global.ShowToastr(ToasterType.Error, 'Please select any zone,', ToasterTitle.Error);
    }
  }
  dltVlCode(vlCode: any) {
    if (vlCode) {
      const dialogRef: any = this.global.OpenDialog(
        DeleteConfirmationComponent,
        {
          height: 'auto',
          width: Style.w480px,
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result === ResponseStrings.Yes) {
          let paylaod = {
            velocity: vlCode,
          };
          this.iCommonAPI.dltVelocityCode(paylaod).subscribe((res) => {
            this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);

            this.getWorkstationZones();
          });
        }
      });
    } else {
      this.workstationZones.shift();
    }
  }

  delete(event: any) {
    let dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w480px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: 'Remove Zone ' + event + ' from picking for this workstation?',
      },
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        if (result === ResponseStrings.Yes) {
          let paylaod = {
            Zone: event,
          };
          this.iInductionManagerApi
            .WSPickZoneDelete(paylaod)
            .subscribe((res) => {
              if (res.isExecuted) {
                this.global.ShowToastr(
                  ToasterType.Success,
                  labels.alert.delete,
                  ToasterTitle.Success
                );
                this.getWorkstationZones();
                this.zoneSelectOptions.push(event);
                this.zoneSelectOptions.sort();


              } else {
                this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
                console.log('WSPickZoneDelete', res.responseMessage);
              }
            });
        }
      });
  }

  valueEntered() {
    this.button.nativeElement.disabled = true;
  }

  selectVlCode(selectedVL: any) {
    this.dialogRef.close(selectedVL.value);
  }
  clearVlCode() {
    this.dialogRef.close('');
  }

  closeBatchDialog() {
    this.dialogRef.close(this.workstationZones);
  }
}
