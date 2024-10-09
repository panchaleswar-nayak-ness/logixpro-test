import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import {
  ToasterMessages,
  ToasterTitle,
  ToasterType,
  TableConstant,
  UniqueConstants,
  StringConditions,
} from 'src/app/common/constants/strings.constants';
import { Router } from '@angular/router';

export interface PeriodicElement {
  zone: string;
  locationName: string;
  locationType: string;
  stagingZone: string;
  selected: boolean;
  available: boolean;
}

@Component({
  selector: 'app-select-zones',
  templateUrl: './select-zones.component.html',
  styleUrls: ['./select-zones.component.scss'],
})
export class SelectZonesComponent implements OnInit {
  isNewBatch = false;
  public iInductionManagerApi: IInductionManagerApiService;
  elementData = [
    {
      zone: '',
      locationName: '',
      locationType: '',
      stagingZone: '',
      selected: false,
      available: false,
    },
  ];
  displayedColumns: string[] = [
    UniqueConstants.Select,
    TableConstant.zone,
    'locationdesc',
    'locationtype',
    'stagingzone',
    'flag',
  ];
  dataSource = new MatTableDataSource<PeriodicElement>(this.elementData);
  selection = new SelectionModel<PeriodicElement>(true, []);
  batchID = '';
  username = '';
  wsid = '';
  zoneDetails: any;
  alreadyAssignedZones: any;
  imPreferences: any;
  autoAssignAllZones: any;
  isNotToteInductionPreference: boolean;
  isPickToteInduction: boolean;
  isAdminPreferences: boolean;
  zoneList: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public inductionManagerApi: InductionManagerApiService,
    private global: GlobalService,
    public dialogRef: MatDialogRef<SelectZonesComponent>,
    private router: Router
  ) {
    this.iInductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    // this.elementData.length=0;
    // this.batchID = this.data.batchId;
    // this.isNewBatch=this.data.isNewBatch;
    // this.wsid=this.data.wsid;

    this.isNotToteInductionPreference = !this.router.url
      .toLowerCase()
      .includes('adminprefrences');
    this.isPickToteInduction = this.router.url
      .toLowerCase()
      .includes('picktoteinduction');
    this.isAdminPreferences = this.router.url
      .toLowerCase()
      .includes('adminprefrences');

    this.alreadyAssignedZones = this.data.assignedZones;
    this.getAvailableZones();
  }

  selectZone(row: any) {
    const index = this.elementData.findIndex((o) => o.zone === row.zone);
    if (index !== -1)
      this.elementData[index].selected = !this.elementData[index].selected;
    else console.log('Element not found:', row.zone);
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  AllRecordsChecked() {
    let selected = false;

    for (const element of this.elementData) {
      if (!(!element.selected && !element.available)) {
        if (!element.selected) {
          selected = false;
          break;
        } else {
          selected = true;
        }
      }
    }
    return selected;
  }

  // isAllReadyAssigned()
  // {
  //   if(this.alreadyAssignedZones.length==this.elementData.length)
  //   {
  //     return true;
  //   }
  //   else
  //   {
  //     return false;
  //   }
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows($event: any) {
    for (const element of this.elementData) {
      if (!(!element.selected && !element.available)) {
        element.selected = $event.checked;
      }
    }
    this.dataSource = new MatTableDataSource<any>(this.elementData);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${
        this.isAllSelected() ? 'deselect' : UniqueConstants.Select
      } all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : UniqueConstants.Select
    } row ${row.zone + 1}`;
  }

  selectStaging(staging = '0') {
    if (staging == '0') {
      //Auto select staging records
      let recordExists = 0;
      for (const element of this.elementData) {
        if (
          element.stagingZone == StringConditions.False &&
          !(!element.selected && !element.available)
        ) {
          element.selected = true;
          recordExists = 1;
        }
      }
      if (recordExists == 0) {
        this.global.ShowToastr(
          ToasterType.Error,
          'No non staging zones',
          ToasterTitle.Error
        );
      }
    } else {
      //Auto select staging records
      let recordExists = 0;
      for (const element of this.elementData) {
        if (element.stagingZone != StringConditions.False) {
          element.selected = true;
          recordExists = 1;
        }
      }

      if (recordExists == 0) {
        this.global.ShowToastr(
          ToasterType.Error,
          'No staging zones',
          ToasterTitle.Error
        );
      }
    }
  }

  updateZones() {
    let selectedRecords = [
      {
        zone: '',
        locationName: '',
        locationType: '',
        stagingZone: '',
        selected: false,
        available: false,
      },
    ];
    selectedRecords.shift();
    for (const element of this.elementData) {
      if (element.selected) {
        selectedRecords.push(element);
      }
    }
    this.dialogRef.close({
      selectedRecords: selectedRecords,
      zoneList: this.zoneList,
    });
  }

  close() {
    let selectedRecords = [
      {
        zone: '',
        locationName: '',
        locationType: '',
        stagingZone: '',
        selected: false,
        available: false,
      },
    ];
    for (const element of this.elementData) {
      if (element.selected) {
        selectedRecords.push(element);
      }
    }
    this.dialogRef.close({
      selectedRecords: selectedRecords,
      zoneList: this.zoneList,
    });
  }

  getAvailableZones() {
    this.elementData.length = 0;
    let payLoad = {
      batchID: this.batchID,
    };

    this.iInductionManagerApi.AvailableZone(payLoad).subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          this.zoneDetails = res.data.zoneDetails;

          for (const zoneDetail of this.zoneDetails) {
            if (
              this.alreadyAssignedZones != null &&
              this.alreadyAssignedZones?.length > 0
            ) {
              this.alreadyAssignedZones.find((o) => {
                if (o?.zone == zoneDetail?.zone && zoneDetail?.available)
                  zoneDetail.selected = true;
                return o?.zone == zoneDetail?.zone;
              });
            }

            this.elementData.push({
              zone: zoneDetail.zone,
              locationName: zoneDetail.locationName,
              locationType: zoneDetail.locationType,
              stagingZone: zoneDetail.stagingZone,
              selected: zoneDetail.selected,
              available: zoneDetail.available,
            });
          }

          this.preselectZonesBySelectedGroupName();
          this.dataSource = new MatTableDataSource<any>(this.elementData);
          this.selectZones();
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.SomethingWentWrong,
            ToasterTitle.Error
          );

          console.log('AvailableZone', res.responseMessage);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private preselectZonesBySelectedGroupName() {
    if (this.isPickToteInduction || this.isAdminPreferences) {
      if (this.data.zoneList) {
        this.data.zoneList.forEach((val) => {
          let element = this.elementData.find((f) => f.zone === val);

          if (element) {
            element.selected = true;
          }
        });
      }
    }
  }

  selectZones() {
    if (this.data) {
      this.zoneList = this.data;

      this.dataSource.data.forEach((x) => {
        if (this.data.assignedZones) {
          var availableZone = this.data.assignedZones.find(
            (y) => y.zone === x.zone
          );
        } else if (this.data.zoneList) {
          var availableZone = this.data.zoneList.find((y) => y === x.zone);
        }

        if (availableZone) {
          x.selected = true;
        }

        x.available = true;
      });
    }
  }
}
