import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-zone-groups',
  templateUrl: './zone-groups.component.html',
  styleUrls: ['./zone-groups.component.scss'],
})
export class ZoneGroupsComponent implements OnInit {
  public iInductionManagerApi: IInductionManagerApiService;
  public dataSource: any;
  displayedColumns: string[] = [
    // 'select',
    'zoneGroupName',
    'selectedZone',
    'actions',
  ];
  form: FormGroup;
  assignedZonesArray: { zone: string }[] = [{ zone: '' }];
  assignedZones: string = '';
  initialFormValues: any;

  constructor(
    private fb: FormBuilder,
    private global: GlobalService,
    public inductionManagerApi: InductionManagerApiService,
    public dialogRef: MatDialogRef<ZoneGroupsComponent>,
    public dialog: MatDialog 
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
    let groupedData: { [key: string]: any[] } = {};
  
    data.forEach((item) => {
      const key = item.zoneGroupName;
  
      if (!groupedData[key]) {
        groupedData[key] = [];
      }
  
      groupedData[key].push(item);
    });
  
    return groupedData;
  }
  
  getGroupedZoneGroupings(data: any) {
    let grouped = this.getGroupedData(data);
    let res: any[] = [];
  
    Object.entries(grouped).forEach(function (val: any[], index) {
      // Accessing zoneName from each item in the array
      let selZone = val[1].map((item: any) => item.zoneName).join(' ');
      let id = val[1][0]?.id || 0;
      res.push({
        available: false,
        selectedZones: '',
        zoneName: '',
        id: id,
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

          if (!this.initialFormValues)
            this.initialFormValues = this.form.value.items;
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

 openSelectZones(index: number) {
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

        // Patch the values
        this.items.controls[index]
          .get('selectedZones')
          ?.patchValue(this.assignedZonesArray);
        this.items.controls[index]
          .get('selectedZone')
          ?.patchValue(this.assignedZones);

        // Mark selectedZone as dirty
        this.items.controls[index].get('selectedZone')?.markAsDirty();

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
      id: new FormControl(0, []),
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
    return formRow.dirty; // Only enable save if the row is dirty
  }

  saveItem(index: number) {
    const formRow = this.form.value.items[index];
    const allItems = this.form.value.items;
  
    // Convert zone group names to lowercase for case-insensitive comparison
    const formRowZoneGroupNameLower = formRow.zoneGroupName.toLowerCase();
  
    // Check for duplicate Zone Group Names (case-insensitive) before saving
    const duplicateItems = allItems.filter(
      (item: any, i: number) =>
        item.zoneGroupName.toLowerCase() === formRowZoneGroupNameLower && i !== index
    );
  
    // If duplicates are found, show an error message and prevent save
    if (duplicateItems.length > 0) {
      this.global.ShowToastr(
        ToasterType.Error,
        'Duplicate Zone Group Name found (case-insensitive). Please remove duplicates.',
        ToasterTitle.Error
      );
      return; // Prevent the save operation
    }
  
    if (
      this.initialFormValues &&
      this.initialFormValues.length > 0 &&
      this.initialFormValues[index]
    ) {
      formRow.oldZoneGroupName = this.initialFormValues[index].zoneGroupName;
    } else {
      formRow.oldZoneGroupName = '';
    }
  
    if (formRow.selectedZones && formRow.selectedZones.length > 0) {
      formRow.selectedZones = formRow.selectedZones;
    } else {
      formRow.selectedZones = [];
    }
  
    // If no duplicates, proceed to save the item
    this.iInductionManagerApi.SaveZoneGrouping(formRow).subscribe((res: any) => {
      if (res.data && res.isExecuted) {
        this.global.ShowToastr(
          ToasterType.Success,
          'Your details have been saved',
          ToasterTitle.Success
        );

        if (this.initialFormValues[index])
          this.initialFormValues[index].zoneGroupName=formRowZoneGroupNameLower;
        
        // Reset the dirty state after successful save
        const formGroup = this.items.at(index) as FormGroup;
        formGroup.markAsPristine();  // Reset dirty state
        let formArray = this.form.controls['items'] as FormArray;
  
        formGroup.patchValue({ id: res.data }); // Update the id in the form
      
        formGroup.value.id = res.data;
        this.rebind();  // Refresh the dataSource
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
  
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '460px',
      disableClose: true,
      data: {
        actionMessage: ` the item from the list`,
        action: 'delete',
      },
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'Yes') {  // Proceed only if the user confirms
        control.removeAt(index);
        this.rebind();
  
        if (valueToRemove.id !== 0) {
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
    });
  }
}
