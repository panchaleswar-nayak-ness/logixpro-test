import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  zoneOptions: any = [];
  displayedColumns: string[] = ['Zone'];
  bulkZones: any = [];
  newRecord: boolean = false;
  companyInfo: any;
  orderSortOptions: any;

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

  async getOrderSort() {
    this.iAdminApiService.ordersort().subscribe(async (res: any) => {
      if (res.isExecuted && res.data) {
        this.orderSortOptions = res.data;
        await this.getCompanyInfo();
      }
    })
  }

  async getCompanyInfo() {
    this.iAdminApiService.AdminCompanyInfo().subscribe((response: any) => {
      if (response.isExecuted && response.data) {
        this.companyInfo = response.data;
      }
    });
  }

  payload(){
    const payload: any = {
      "preference": [
        this.companyInfo.orderSort,this.companyInfo.cartonFlowDisplay,this.companyInfo.autoDisplayImage,
      ],
      "panel": 4
    };
    this.iAdminApiService.GeneralPreferenceSave(payload).subscribe((res: any) => {});
  }

  async bulkPickZones() {
    let res: any = await this.iBulkProcessApiService.bulkPickZones();
    // Temporary Fix need to revisit
    if (true) { // res?.status == HttpStatusCode.Ok
      this.zoneOptions = res.body;
    }
  }

  async bulkPickBulkZone() {
    let res: any = await this.iBulkProcessApiService.bulkPickBulkZone();
    // Temporary Fix need to revisit
    if (true) { // res?.status == HttpStatusCode.Ok
      this.bulkZones = res.body;
      await this.bulkPickZones();
      let wsZones = this.bulkZones.map((bulkZone) => bulkZone.zone);
      this.bulkZones.forEach(element => {
        element.isNew = false;
        element.oldZone = element.zone;
        element.options = [...this.zoneOptions.filter((bulkZone) => !wsZones.includes(bulkZone.zone)), ...this.zoneOptions.filter((bulkZone) => bulkZone.zone == element.zone)].sort((a, b) => (a.zone > b.zone) ? 1 : ((b.zone > a.zone) ? -1 : 0));
      });
      this.newRecord = false;
    }
  }

  addRecord() {
    if (!this.newRecord) {
      let wsZones = this.bulkZones.map((bulkZone) => bulkZone.zone);
      this.bulkZones = [{ isNew: true, options: this.zoneOptions.filter((option) => !wsZones.includes(option.zone)) }, ...this.bulkZones];
      this.newRecord = true;
    }
  }

  async addupdateBulkPickBulkZone(event: any, index: any) {
      if (this.bulkZones[index].isNew) {
        let payload: any = {
          "zone": event.value,
        }
        let res: any = await this.iBulkProcessApiService.addBulkPickBulkZone(payload);
        if (res?.status == HttpStatusCode.Ok) {
          this.bulkPickBulkZone();
          this.global.ShowToastr(ToasterType.Success, "Zone Added Successfully", ToasterTitle.Success);
        }
      }
      else {
        let payload: any = {
          "oldzone": this.bulkZones[index].oldZone,
          "newzone": event.value
        }
        let res: any = await this.iBulkProcessApiService.updateBulkPickBulkZone(payload);
        if (res?.status == HttpStatusCode.Ok) {
          this.bulkPickBulkZone();
          this.global.ShowToastr(ToasterType.Success, "Zone updated Successfully", ToasterTitle.Success);
        }
    }
  }

  async deleteBulkPickBulkZone(index: any) {
      if (this.bulkZones[index].isNew) {
        this.bulkZones = this.bulkZones.filter((x: any) => !x.isNew);
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
          this.global.ShowToastr(ToasterType.Success, "Zone Deleted Successfully", ToasterTitle.Success);
      }
    }
  }
}


