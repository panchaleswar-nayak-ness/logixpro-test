import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToasterMessages, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiResponse } from 'src/app/common/types/CommonTypes';
import { Zone, BulkZone }  from 'src/app/bulk-process/preferences/preference.models'



@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})



export class PreferencesComponent implements OnInit {


  
  zoneOptions: Zone[] = [];
  displayedColumns: string[] = ['Zone'];
  bulkZones: BulkZone[] = [];
  newRecord: boolean = false;
  companyInfo: any;
  orderSortOptions: any;
  availableZones: Zone[] = [];

  allZonesFilter: string = '';
  selectedZonesFilter: string = '';


  get filteredAvailableZones(): Zone[] {
    if (!this.allZonesFilter) return this.availableZones;
    const filterValue = this.allZonesFilter.toLowerCase();
    return this.availableZones.filter(zone =>
      zone.zone.toLowerCase().includes(filterValue)
    );
  }

  get filteredBulkZones(): BulkZone[] {
    if (!this.selectedZonesFilter) return this.bulkZones;
    const filterValue = this.selectedZonesFilter.toLowerCase();
    return this.bulkZones.filter(zone =>
      zone.zone.toLowerCase().includes(filterValue)
    );
  }

  async addAllZones() {
    const zonesToAdd = this.availableZones.map(z => z.zone);

    if (!Array.isArray(this.availableZones) || zonesToAdd.length === 0) {
      this.global.ShowToastr(ToasterType.Info, ToasterMessages.NoRecordFound, ToasterTitle.Info);
      return;
    }

    try {
      const res: ApiResponse<number> = (await this.iBulkProcessApiService.addAllBulkPickBulkZone(zonesToAdd)).body;
      if (res?.isExecuted) {
        await this.bulkPickBulkZone(); // Refresh
        this.global.ShowToastr(ToasterType.Success, ToasterMessages.RecordsAddedSuccessfully, ToasterTitle.Success);
      } else {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.AddAllFailed, ToasterTitle.Error);
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
    }
  }


// Removes all selected bulk zones in a single API call
async removeAllZones() {
  const zonesToDelete = this.bulkZones
    .filter((z: BulkZone) => !z.isNew)
    .map((z: BulkZone) => z.zone);

  // Remove unsaved (isNew) zones from frontend
  this.bulkZones = this.bulkZones.filter((z: BulkZone) => !z.isNew);
  this.newRecord = false;
  if (!Array.isArray(this.availableZones) || zonesToDelete.length > 0) {
    try {
      const res: ApiResponse<number> = (await this.iBulkProcessApiService.deleteAllBulkPickBulkZone(zonesToDelete)).body;
      if (res?.isExecuted) {
        await this.bulkPickBulkZone(); 
        this.global.ShowToastr(ToasterType.Success, ToasterMessages.DeleteAllSuccess, ToasterTitle.Success);
      } else {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.DeleteFailed, ToasterTitle.Error);
      }
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.DeleteFailed, ToasterTitle.Error);
    }
  } else {
    await this.bulkPickBulkZone(); 
    this.global.ShowToastr(ToasterType.Info, ToasterMessages.APIErrorMessage, ToasterTitle.Info);
  }
}



  public iBulkProcessApiService: IBulkProcessApiService;
  public iAdminApiService: IAdminApiService;
  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    public adminApiService: AdminApiService,
    private global: GlobalService,
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
    this.iAdminApiService = adminApiService;
  }

  async ngOnInit(): Promise<void> {
    await this.bulkPickBulkZone();
    await this.getOrderSort();
  }

  // Fetches order sort preferences and triggers company info load
  async getOrderSort() {
    this.iAdminApiService.ordersort().subscribe(async (res: any) => {
      if (res.isExecuted && res.data) {
        this.orderSortOptions = res.data;
        await this.getCompanyInfo();
      }
    })
  }

  // Fetches company info from admin API
  async getCompanyInfo() {
    this.iAdminApiService.AdminCompanyInfo().subscribe((response: any) => {
      if (response.isExecuted && response.data) {
        this.companyInfo = response.data;
      }
    });
  }

  // Constructs and saves general preference payload
  payload(){
    const payload: any = {
      "preference": [
        this.companyInfo.orderSort,this.companyInfo.cartonFlowDisplay,this.companyInfo.autoDisplayImage,
      ],
      "panel": 4
    };
    this.iAdminApiService.GeneralPreferenceSave(payload).subscribe((res: any) => {});
  }

  // Fetches all available zones from the API
  async bulkPickZones() {
    let res: any = await this.iBulkProcessApiService.bulkPickZones();
    // Temporary Fix need to revisit
    if (true) { // res?.status == HttpStatusCode.Ok
      this.zoneOptions = res.body;
    }
  }

  // Fetches and initializes selected bulk zones, then configures dropdown options
  async bulkPickBulkZone() {
  let res: { body: BulkZone[]; status: number } = await this.iBulkProcessApiService.bulkPickBulkZone();
  if (true) {
    this.bulkZones = res.body;
    await this.bulkPickZones();
    let wsZones = this.bulkZones.map((bulkZone) => bulkZone.zone);
    
    // For dropdowns
    this.bulkZones.forEach(element => {
      element.isNew = false;
      element.oldZone = element.zone;
      element.options = [
        ...this.zoneOptions.filter((bulkZone) => !wsZones.includes(bulkZone.zone)),
        ...this.zoneOptions.filter((bulkZone) => bulkZone.zone == element.zone)
      ].sort((a, b) => (a.zone > b.zone ? 1 : -1));
    });

    // Zones not selected yet
    this.availableZones = this.zoneOptions.filter((option: any) => !wsZones.includes(option.zone));
    this.newRecord = false;
  }
}

// Adds a single zone to the selected bulk zones
async addZone(zone: Zone) {
  let payload: {zone: string} = { zone: zone.zone };
  let res: any = await this.iBulkProcessApiService.addBulkPickBulkZone(payload);
  if (res?.status == HttpStatusCode.Ok) {
    await this.bulkPickBulkZone();
    this.global.ShowToastr(ToasterType.Success, ToasterMessages.ZoneAddedSuccessfully, ToasterTitle.Success);
  }
}

// Adds a new empty record for a zone selection
  addRecord() {
    if (!this.newRecord) {
      let wsZones = this.bulkZones.map((bulkZone) => bulkZone.zone);
      this.bulkZones = [{
        wsid: '',
        zone: '',
        isNew: true,
        options: this.zoneOptions.filter((option) => !wsZones.includes(option.zone))
      }, ...this.bulkZones];
      this.newRecord = true;
    }
  }

  
  // Handles both add and update logic for a selected bulk zone
  async addupdateBulkPickBulkZone(event: { value: string }, index: number) {
      if (this.bulkZones[index].isNew) {
        let payload: {zone: string} = {
          "zone": event.value,
        }
        let res: ApiResponse<void> = await this.iBulkProcessApiService.addBulkPickBulkZone(payload);
        if (res?.statusCode == HttpStatusCode.Ok) {
          this.bulkPickBulkZone();
          this.global.ShowToastr(ToasterType.Success, ToasterMessages.ZoneAddedSuccessfully, ToasterTitle.Success);
        }
      }
      else {
        let payload: {oldzone: string, newzone: string} = {
          "oldzone": this.bulkZones[index].oldZone ?? '',
          "newzone": event.value
        }
        let res: ApiResponse<void> = await this.iBulkProcessApiService.updateBulkPickBulkZone(payload);
        if (res?.statusCode == HttpStatusCode.Ok) {
          this.bulkPickBulkZone();
          this.global.ShowToastr(ToasterType.Success, ToasterMessages.ZoneUpdatedSuccessfully, ToasterTitle.Success);
        }
    }
  }

  // Deletes a single selected bulk zone (new or saved)
  async deleteBulkPickBulkZone(index: number) {
      if (this.bulkZones[index].isNew) {
        this.bulkZones = this.bulkZones.filter((x: BulkZone) => !x.isNew);
        this.newRecord = false;
    }
    else {
        let payload: any = {
          "zone": this.bulkZones[index].zone,
        }
        let res: any = await this.iBulkProcessApiService.deleteBulkPickBulkZone(payload);
        // Need to Fix Status codes
        if (true) {
          this.bulkPickBulkZone();
          this.global.ShowToastr(ToasterType.Success, ToasterMessages.ZoneDeletedSuccessfully, ToasterTitle.Success);
      }
    }
  }
}


