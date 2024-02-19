import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
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

  ngOnInit(): void {
    this.bulkPickBulkZone();
  }

  bulkPickZones() {
    this.iBulkProcessApiService.bulkPickZones().subscribe((res: any) => {
      if (res) {
        this.zoneOptions = res;
      }
    });
  }

  bulkPickBulkZone() {
    this.iBulkProcessApiService.bulkPickBulkZone().subscribe((res: any) => {
      if (res) {
        this.bulkZones = res;
        this.bulkZones.forEach(element => {
          element.isNew = false;
          element.oldZone = element.zone;
        });
        this.bulkPickZones();
        this.newRecord = false;
      }
    });
  }

  addRecord() {
    if (!this.newRecord) {
      this.bulkZones = [{ isNew: true }, ...this.bulkZones];
      this.newRecord = true;
    }
  }

  addupdateBulkPickBulkZone(event: any, index: any) {
    if (this.bulkZones[index].isNew) {
      let payload: any = {
        "zone": event.value,
      }
      this.iBulkProcessApiService.addBulkPickBulkZone(payload).subscribe((res: any) => {
        if (res) {
          this.bulkPickBulkZone();
          this.global.ShowToastr(ToasterType.Success, "Zone Added Successfully", ToasterTitle.Success);
        }
      });
    }
    else {
      let payload: any = {
        "oldzone": this.bulkZones[index].oldZone,
        "newzone": event.value
      }
      this.iBulkProcessApiService.updateBulkPickBulkZone(payload).subscribe((res: any) => {
        if (res) {
          this.bulkPickBulkZone();
          this.global.ShowToastr(ToasterType.Success, "Zone updated Successfully", ToasterTitle.Success);
        }
      });
    }
  }

  deleteBulkPickBulkZone(index: any) {
    if (this.bulkZones[index].isNew) {
      this.bulkZones = this.bulkZones.filter((x:any) => !x.isNew); 
      this.newRecord = false;
    }
    else {
      let payload: any = {
        "zone": this.bulkZones[index].zone,
      }
      this.iBulkProcessApiService.deleteBulkPickBulkZone(payload).subscribe((res: any) => {
        if (res) {
          this.bulkPickBulkZone();
          this.global.ShowToastr(ToasterType.Success, "Zone Deleted Successfully", ToasterTitle.Success);
        }
      });
    }
  }
}


