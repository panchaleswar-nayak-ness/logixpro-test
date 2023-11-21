import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit , Inject} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IInductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

export interface PeriodicElement {
  zone: string
  locationName: string
  locationType: string
  stagingZone:string
  selected: boolean,
  available: boolean
}

@Component({
  selector: 'app-select-zones',
  templateUrl: './select-zones.component.html',
  styleUrls: ['./select-zones.component.scss']
})
export class SelectZonesComponent implements OnInit {
  isNewBatch=false;
  public iInductionManagerApi:IInductionManagerApiService;
  elementData = [{ zone: '',locationName:'',locationType:'',stagingZone:'',selected: false,available: false}];
  displayedColumns: string[] = ['select', 'zone', 'locationdesc', 'locationtype', 'stagingzone' , 'flag'];
  dataSource = new MatTableDataSource<PeriodicElement>(this.elementData);
  selection = new SelectionModel<PeriodicElement>(true, []);
  batchID="";
  username="";
  wsid="";
  zoneDetails :any;
  alreadyAssignedZones :any;
  imPreferences: any;
  autoAssignAllZones: any;

  selectZone(row:any){
    const index = this.elementData.findIndex(o => o.zone === row.zone);
    if (index !== -1) this.elementData[index].selected = !this.elementData[index].selected;
    else console.log('Element not found:', row.zone);
  }

 
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  AllRecordsChecked()
  {
    let selected=false;
    for (const element of this.elementData) 
    {
      if(!(! element.selected && ! element.available))
      {
        if(!element.selected)
        {
          selected = false;
          break;
        }
        else 
        {
          selected = true;
        }
      }
    }
    return selected;
  }

  isAllReadyAssigned()
  {
    if(this.alreadyAssignedZones.length==this.elementData.length)
    {
      return true;
    }
    else 
    {
      return false;
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows($event:any) {
    for (const element of this.elementData) {
      if(!(!element.selected && !element.available))
      {
        element.selected=$event.checked;
      }
    }
    this.dataSource = new MatTableDataSource<any>(this.elementData);
    


  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.zone + 1}`;
  }

  selectStaging(staging="0")
  {
  if(staging=="0")
  {
  //Auto select staging records
  let recordExists=0;
  for (const element of this.elementData) {
  if(element.stagingZone=='False' && !(!element.selected && !element.available))
  {
    element.selected=true;
    recordExists=1;
  }
  
  }
  if(recordExists==0)
  {
    this.global.ShowToastr('error','No non staging zones', 'Error!' );
  }
  }
  else 
  {
  //Auto select staging records
  let recordExists=0;
  for (const element of this.elementData) {
  if(element.stagingZone!='False')
  {
    element.selected=true;
    recordExists=1;
  }
  
  }

  if(recordExists==0)
  {
    this.global.ShowToastr('error','No staging zones', 'Error!' );
  }
  
  }
  }

  updateZones()
  {
    let selectedRecords=[{zone:'',locationName:'',locationType:'',stagingZone:'',selected: false,available: false}];
    selectedRecords.shift();
    for (const element of this.elementData) {
    if(element.selected)
    {
    selectedRecords.push(element);
    }
    }
    this.dialogRef.close(selectedRecords);
  }

  close()
  {
    this.dialogRef.close();
  }


  getAvailableZones()
  {
    this.elementData.length=0;
    let payLoad =
    {
      batchID: this.batchID,
    };
    this.iInductionManagerApi.AvailableZone(payLoad).subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
        this.zoneDetails = res.data.zoneDetails; 
        for (const zoneDetail of this.zoneDetails) {
          if(this.alreadyAssignedZones!=null && this.alreadyAssignedZones?.length>0)
          {
            this.alreadyAssignedZones.find((o) => {
              if(o.zone == zoneDetail.zone && zoneDetail.available) zoneDetail.selected = true;
              return o.zone == zoneDetail.zone;
            });
          }
          this.elementData.push(
            { 
              zone: zoneDetail.zone,
              locationName:zoneDetail.locationName,
              locationType:zoneDetail.locationType,
              stagingZone:zoneDetail.stagingZone,
              selected:zoneDetail.selected,
              available: zoneDetail.available
            }
            );
        }
        this.dataSource = new MatTableDataSource<any>(this.elementData);

        } else {
          this.global.ShowToastr('error','Something went wrong', 'Error!');
          console.log("AvailableZone",res.responseMessage);
        }
      },
      (error) => { 
        console.log(error);
      }
    );

  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,  public inductionManagerApi: InductionManagerApiService, 
  private global: GlobalService,public dialogRef: MatDialogRef<SelectZonesComponent>) {
    this.iInductionManagerApi = inductionManagerApi;
   }

  ngOnInit(): void {
    this.elementData.length=0;
    this.batchID = this.data.batchId;
    this.username= this.data.userId;
    this.isNewBatch=this.data.isNewBatch;
    this.wsid=this.data.wsid;
    this.alreadyAssignedZones = this.data.assignedZones;
    this.getAvailableZones();
  }
  

}
