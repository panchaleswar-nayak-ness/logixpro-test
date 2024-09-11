import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectZonesComponent } from '../select-zones/select-zones.component';
import { DialogConstants } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-zone-groups',
  templateUrl: './zone-groups.component.html',
  styleUrls: ['./zone-groups.component.scss']
})
export class ZoneGroupsComponent implements OnInit {

  constructor(private global: GlobalService,) { }

  displayedColumns: string[] = ["select", "zoneGroupName", "selectedZone", "actions"];
  elementData = [
    { zoneGroupName: 'Zone 1', selectedZone: 'Location 1', selected: false },
    { zoneGroupName: 'Zone 2', selectedZone: 'Location 2', selected: false },
    { zoneGroupName: 'Zone 3', selectedZone: 'Location 3', selected: false }
  ];
  dataSource = new MatTableDataSource(this.elementData);

  ngOnInit(): void {
  }


  openSelectZones(){
    const dialogRef:any = this.global.OpenDialog(SelectZonesComponent, {
      height: 'auto',
      width: '60%',
      autoFocus: DialogConstants.autoFocus,
    disableClose:true,
   
    });
  }
}
