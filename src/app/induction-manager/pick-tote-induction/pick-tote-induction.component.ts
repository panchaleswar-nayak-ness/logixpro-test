import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DialogConstants, Style, ToasterMessages, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { SelectZonesComponent } from 'src/app/dialogs/select-zones/select-zones.component';
import { PickToteInFilterComponent } from './pick-tote-in-filter/pick-tote-in-filter.component';
import { FilterOrderNumberComponent } from './filter-order-number/filter-order-number.component';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';

interface IZoneGroup {
  Id : number,
  ZoneGroup: string,
  Zone: string
}
@Component({
  selector: 'app-pick-tote-induction',
  templateUrl: './pick-tote-induction.component.html',
  styleUrls: ['./pick-tote-induction.component.scss']
})
export class PickToteInductionComponent implements OnInit {
  zoneGroupingsList: IZoneGroup[] = [];
  zoneAllGroupingsList: IZoneGroup[] = [];
  selectedZoneGrouping: IZoneGroup | undefined;
  zoneList: string[];
  constructor(private global: GlobalService,
    private Api: ApiFuntions){}
  displayedColumns: string[] = [
    'orderNumber',
    'startZone',
    'priority',
    'requiredDate',
    'totalOrderQty',
    'toteScanned',
  ];
  elementData = [
    { orderNumber: 'Zone 1', startZone: 'Location 1', priority: 'Location 1', requiredDate:'02/02/2024', totalOrderQty: "5" },
    { orderNumber: 'Zone 2', startZone: 'Location 2', priority: 'Location 1', requiredDate:'02/02/2024', totalOrderQty: "5" },
    { orderNumber: 'Zone 3', startZone: 'Location 3', priority: 'Location 1', requiredDate:'02/02/2024', totalOrderQty: "5" }
  ];
  dataSource = new MatTableDataSource(this.elementData);
  ngOnInit(): void {
    this.getZoneGroups();
  }
  showChange(selectedValue: any) {
    this.selectedZoneGrouping = this.zoneGroupingsList.find(x => x.Id === selectedValue);
    let selectedZones: IZoneGroup[] = [];
    if (this.selectedZoneGrouping) {
        selectedZones = this.zoneAllGroupingsList.filter(x => x.ZoneGroup === this.selectedZoneGrouping?.ZoneGroup);
    }
    this.zoneList = selectedZones.map(zone => zone.Zone);
    this.retrieveFilteredOrders(this.zoneList); // Call the function to filter orders
  }
  async getZoneGroups() {
    try {
      this.Api.GetZoneGroupings().subscribe((res: any) => {
        if (res.data && res.isExecuted) {          
          res.data.forEach((f) => {            
            const existingItem = this.zoneGroupingsList.find(item => item.ZoneGroup === f.zoneGroupName);  
            if (!existingItem) {
              this.zoneGroupingsList.push({ Id : f.id, ZoneGroup : f.zoneGroupName, Zone : f.zoneName });
            }
            this.zoneAllGroupingsList.push({ Id : f.id, ZoneGroup : f.zoneGroupName, Zone : f.zoneName });
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
  
  
 

  openColumnFilter(){
    const dialogRef:any = this.global.OpenDialog(PickToteInFilterComponent, {
      height: 'auto',
      width: Style.w786px,
      autoFocus: DialogConstants.autoFocus,
    disableClose:true,
    });
  }

  
  filterOrderNum(){
    const dialogRef:any = this.global.OpenDialog(FilterOrderNumberComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
    disableClose:true,
    });
  }


  openSelectZones() {
    const dialogRef: any = this.global.OpenDialog(SelectZonesComponent, {
        height: 'auto',
        width: '60%',
        data: this.zoneList,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
    });
    
    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
            const selectedZoneValues = result.selectedRecords.map(item => item.zone); // Get the list of selected zone values
            this.retrieveFilteredOrders(selectedZoneValues); // Call the function to filter orders
            this.zoneList = selectedZoneValues;
        }
    });
  }

  retrieveFilteredOrders(selectedZones: string[]) {
      
      this.Api.RetrieveNonSuperBatchOrders({Zones: selectedZones}).subscribe((filteredOrders) => {
          console.log(filteredOrders.data);
          this.dataSource = new MatTableDataSource(filteredOrders.data);
      });
  }


}
