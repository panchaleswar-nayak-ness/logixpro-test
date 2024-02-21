import { Component, OnInit } from '@angular/core';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
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

  public iBulkProcessApiService: IBulkProcessApiService;
  constructor(
    public bulkProcessApiService: BulkProcessApiService,
    private global: GlobalService,
  ) {
    this.iBulkProcessApiService = bulkProcessApiService;
  }

  async ngOnInit(): Promise<void> {
    await this.bulkPickBulkZone();
  }

  async bulkPickZones() {
    let res: any = await this.iBulkProcessApiService.bulkPickZones();
    if (res?.status == 200) {
      this.zoneOptions = res.body;
    }
  }

  async bulkPickBulkZone() {
    let res: any = await this.iBulkProcessApiService.bulkPickBulkZone();
    if (res?.status == 200) {
      this.bulkZones = res.body;
      this.bulkZones.forEach(element => {
        element.isNew = false;
        element.oldZone = element.zone;
      });
      this.bulkPickZones();
      this.newRecord = false;
    }
  }

  addRecord() {
    if (!this.newRecord) {
      this.bulkZones = [{ isNew: true }, ...this.bulkZones];
      this.newRecord = true;
    }
  }

  async addupdateBulkPickBulkZone(event: any, index: any) {
    if (this.bulkZones[index].isNew) {
      let payload: any = {
        "zone": event.value,
      }
      let res: any = await this.iBulkProcessApiService.addBulkPickBulkZone(payload);
      if (res?.status == 200) {
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
      if (res?.status == 200) {
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
      if (res?.status == 200) {
        this.bulkPickBulkZone();
        this.global.ShowToastr(ToasterType.Success, "Zone Deleted Successfully", ToasterTitle.Success);
      }
    }
  }
}


