import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectZonesComponent } from '../select-zones/select-zones.component';
import {
  DialogConstants,
  ToasterMessages,
  ToasterTitle,
  ToasterType,
} from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-zone-groups',
  templateUrl: './zone-groups.component.html',
  styleUrls: ['./zone-groups.component.scss'],
})
export class ZoneGroupsComponent implements OnInit {
  public iInductionManagerApi: IInductionManagerApiService;
  displayedColumns: string[] = [
    // 'select',
    'zoneGroupName',
    'selectedZone',
    'actions',
  ];
  form: FormGroup;
  public dataSource: any;
  assignedZonesArray: { zone: string }[] = [{ zone: '' }];
  assignedZones: string = '';

  constructor(
    private fb: FormBuilder,
    private global: GlobalService,
    public inductionManagerApi: InductionManagerApiService,
    public dialogRef: MatDialogRef<ZoneGroupsComponent>
  ) {
    this.iInductionManagerApi = inductionManagerApi;

    this.form = this.fb.group({
      items: this.fb.array([]),
    });
  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  ngOnInit(): void {
    this.rebind();
    this.getZoneGroupings();
  }

  getGroupedData(data: any[]) {
    let groupedData = {};

    data.forEach((item) => {
      const key = item.zoneGroupName;

      if (!groupedData[key]) {
        groupedData[key] = [];
      }

      groupedData[key].push(item.zoneName);
    });

    return groupedData;
  }

  getGroupedZoneGroupings(data: any) {
    let grouped = this.getGroupedData(data);
    let res: any[] = [];

    Object.entries(grouped).forEach(function (val: any[], index) {
      let selZone = val[1].join(' ');

      res.push({
        available: false,
        selectedZones: '',
        zoneName: '',
        zoneGroupName: val[0],
        selectedZone: selZone,
      });
    });

    return res;
  }

  getZoneGroupings() {
    try {
      this.iInductionManagerApi.GetZoneGroupings().subscribe((res: any) => {
        if (res.data && res.isExecuted) {
          let data = res.data;
          let groupedZoneGroupings = this.getGroupedZoneGroupings(data);

          groupedZoneGroupings.forEach((f: any, index: number) => {
            this.addRow();
            let items = this.form.controls['items'] as FormArray;
            items.controls[index].patchValue(f);
          });
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.SomethingWentWrong,
            ToasterTitle.Error
          );

          console.log('Get Zone Groups', res.responseMessage);
        }
      });
    } catch (error) {}
  }

  openSelectZones(index: string | number) {
    let zoneList: any[] = [];
    let { selectedZone } = this.form.value.items[index];
    selectedZone.split(' ').forEach((val) => {
      zoneList.push(val);
    });

    const dialogRef: any = this.global.OpenDialog(SelectZonesComponent, {
      height: 'auto',
      width: '60%',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        assignedZones: this.assignedZonesArray,
        zoneList: zoneList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        let zones = '';

        const isSelectedZoneNotEmpty =
          result.selectedRecords.length > 0 &&
          result.selectedRecords.every((e) => e.zone !== '');

        if (isSelectedZoneNotEmpty) {
          this.assignedZonesArray = result.selectedRecords;
          for (const element of result.selectedRecords) {
            zones = `${zones} ${element.zone}`;
          }
          this.assignedZones = zones.trim();

          this.items.controls[index]
            .get('selectedZones')
            ?.patchValue(this.assignedZonesArray);
          this.items.controls[index]
            .get('selectedZone')
            ?.patchValue(this.assignedZones);

          this.assignedZones = '';
          this.assignedZonesArray = [];
        }
      }
    });
  }

  refreshZones() {
    this.dialogRef.close({
      confirm: true,
    });
  }

  createFormGroup(): FormGroup {
    let formGroup = this.fb.group({
      zoneName: new FormControl('', []),
      zoneGroupName: new FormControl('', []),
      selectedZone: new FormControl('', []),
      selectedZones: new FormControl('', []),
      available: new FormControl(false, []),
    });

    return formGroup;
  }

  get getFormControls() {
    const control = this.form.get('items') as FormArray;
    return control;
  }

  private rebind() {
    let formArray = this.form.controls['items'] as FormArray;
    let formArrayValue = formArray.value;
    this.dataSource = new MatTableDataSource(formArrayValue);
  }

  addRow() {
    const control = this.form.get('items') as FormArray;
    control.push(this.createFormGroup());
    this.rebind();
  }

  checkAll(event: MatCheckboxChange) {
    this.getFormControls.controls.forEach((formGroup) => {
      formGroup.get('available')?.setValue(event.checked);
    });
    this.rebind();
  }
  isRowDirty(index: number): boolean {
    const formRow = this.items.at(index) as FormGroup;
    return formRow.dirty;
  }
  
  saveItem(index: number) {
    const formRow = this.form.value.items[index];
    const allItems = this.form.value.items;
    const duplicateItems = allItems.filter(
      (item: any) => JSON.stringify(item) === JSON.stringify(formRow)
    );
  
    // Check if there is more than one occurrence of the item in the array
    if (duplicateItems.length > 1) {
      this.global.ShowToastr(
        ToasterType.Error,
        'Duplicate record found. Please remove duplicates.',
        ToasterTitle.Error
      );
      return; // Prevent the save operation
    }
    this.iInductionManagerApi
      .SaveZoneGrouping(formRow)
      .subscribe((res: any) => {
        if (res.data && res.isExecuted) {
          this.global.ShowToastr(
            ToasterType.Success,
            'Your details have been saved',
            ToasterTitle.Success
          );
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.SomethingWentWrong,
            ToasterTitle.Error
          );
        }
      });
  }

  removeItem(index: number) {
    const control = this.form.get('items') as FormArray;
    let valueToRemove = control.value[index];
    control.removeAt(index);
    this.rebind();

    if (valueToRemove.zoneGroupName) {
      this.iInductionManagerApi
        .RemoveZoneGrouping(valueToRemove.zoneGroupName)
        .subscribe((res: any) => {
          if (res.data && res.isExecuted) {
            this.global.ShowToastr(
              ToasterType.Success,
              'Your details have been deleted',
              ToasterTitle.Success
            );
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              ToasterMessages.SomethingWentWrong,
              ToasterTitle.Error
            );
          }
        });
    }
  }


}
