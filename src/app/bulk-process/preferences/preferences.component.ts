import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { IBulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api-interface';
import { BulkProcessApiService } from 'src/app/common/services/bulk-process-api/bulk-process-api.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {

  zoneOptions: any= [];
  displayedColumns: string[] = ['Zone'];
  bulkZones: any = [];

  public iBulkProcessApiService: IBulkProcessApiService;
  constructor(
    public bulkProcessApiService: BulkProcessApiService
  ) { 
    this.iBulkProcessApiService = bulkProcessApiService;
  }

  ngOnInit(): void {
    this.bulkPickBulkZone();
  }

  bulkPickZones(){
    this.iBulkProcessApiService.bulkPickZones().subscribe((res: any) => {
      if (res) {
        this.zoneOptions = res;
      }
    });
  }

  bulkPickBulkZone(){
    this.iBulkProcessApiService.bulkPickBulkZone().subscribe((res: any) => {
      if (res) {
        this.bulkZones = res;
        this.bulkPickZones();
      }
    });
  }

  addRecord(){
    // this.bulkZones = [...this.bulkZones,{zone:''}];
    // this.bulkZones.push({zone:''});
  }

}


