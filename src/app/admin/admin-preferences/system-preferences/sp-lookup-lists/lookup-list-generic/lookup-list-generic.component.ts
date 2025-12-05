import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { catchError, of } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ResponseStrings, ToasterType, ToasterTitle, DialogConstants, UniqueConstants, Style, ColumnDef, SystemConstants, ToasterMessages } from 'src/app/common/constants/strings.constants';
import { ApiResponse } from 'src/app/common/types/CommonTypes';
import { LookupTableData, LookupTablePayload, LookupListConfig } from 'src/app/common/types/lookup-table.types';

@Component({
  selector: 'app-lookup-list-generic',
  templateUrl: './lookup-list-generic.component.html',
  styleUrls: ['./lookup-list-generic.component.scss']
})
export class LookupListGenericComponent implements OnInit, OnChanges {

  @Input() config!: LookupListConfig;

  public iAdminApiService: IAdminApiService;
  displayedColumns: string[] = [ColumnDef.StatusCode, ColumnDef.CodeValue, ColumnDef.DisplaySequence, ColumnDef.Actions];
  tableData: LookupTableData[] = [];
  OldtableData: LookupTableData[] = [];
  AddBtnDisabled: boolean = false;
  saveCheck: boolean = false;

  constructor(
    public global: GlobalService,
    public adminApiService: AdminApiService) {
      this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    if (this.config) {
      this.getTableData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config'] && !changes['config'].firstChange) {
      this.getTableData();
    }
  }

  getTableData(): void {
    this.iAdminApiService.getLookupTableData(this.config.listName).subscribe((res: ApiResponse<LookupTableData[]>) => {
      if (res.isExecuted && res.data) {
        this.OldtableData = [...res.data].sort((a, b) => a.sequence - b.sequence);
        this.tableData = structuredClone(this.OldtableData);
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      }
    });  
  }

  addEmptyRow(): void {
    this.AddBtnDisabled = true;
    const newObj: LookupTableData = {
      id: 0,
      valueName: '',
      value: '',
      sequence: this.tableData.length + 1 || 1,
    };
    this.tableData = [...this.tableData, newObj];
  }

  isSaveDisabled(element: LookupTableData, index: number): boolean {
    const isUnchanged = 
      this.OldtableData.length > index &&
      this.OldtableData[index].sequence === element.sequence &&
      this.OldtableData[index].value === element.value &&
      this.OldtableData[index].valueName === element.valueName;
    
    return isUnchanged || element.IsDisabled || element.value === '';
  }

  checkDuplicateFields(ele: LookupTableData, index: number): string[] {
    const duplicateFields: string[] = [];
  
    // Check if Status Code and Code Value are the same
    if (ele.valueName === ele.value) {
      duplicateFields.push('Status Code and Code Value');
    }
  
    // Build Sets of existing values
    const seenSequences = new Set<number>();
    const seenValueNames = new Set<string>();
    const seenValues = new Set<string>();

    for (let i = 0; i < this.tableData.length; i++) {
      if (i !== index) {
        const item = this.tableData[i];
        seenSequences.add(item.sequence);
        seenValueNames.add(item.valueName);
        seenValues.add(item.value);
      }
    }

    // Check for duplicates
    if (seenSequences.has(ele.sequence)) {
      duplicateFields.push('Sequence');
    }
    if (seenValueNames.has(ele.valueName)) {
      duplicateFields.push('Status Code');
    }
    if (seenValues.has(ele.value)) {
      duplicateFields.push('Code Value');
    }
  
    return duplicateFields;
  }

  saveRow(ele: LookupTableData, i: number): void {
    const duplicateFields = this.checkDuplicateFields(ele, i);
    if (duplicateFields.length > 0) {
      this.global.ShowToastr(ToasterType.Error, `${duplicateFields.join(', ')} must be unique`, ToasterTitle.Error);
      return;
    }

    const payload: LookupTablePayload = {
      id: ele.id,
      ValueName: ele.valueName,
      Value: ele.value,
      Sequence: ele.sequence,
      AppName: SystemConstants.Default,
      ListName: this.config.listName
    };
  
    const isCreate = ele.id === 0;
    const operation$ = isCreate 
      ? this.iAdminApiService.createLookupTableData(payload)
      : this.iAdminApiService.updateLookupTableData(payload);

    operation$.pipe(
      catchError((error) => {
        return of({ isExecuted: false } as ApiResponse<LookupTableData[]>);
      })
    ).subscribe((res: ApiResponse<LookupTableData[]>) => {
      if (res.isExecuted) {
        this.getTableData();
        this.AddBtnDisabled = false;
        ele.IsDisabled = true;
        const successMessage = isCreate 
          ? ToasterMessages.RecordCreatedSuccessful 
          : ToasterMessages.RecordUpdatedSuccessful;
        this.global.ShowToastr(ToasterType.Success, successMessage, ToasterTitle.Success);
      }
    });
  }  

  deleteRow(ele: LookupTableData): void {
    if (ele.id === 0) {
      this.tableData = this.tableData.filter((item) => item.id !== ele.id);
      this.AddBtnDisabled = false;
      return;
    }

    const dialogRef = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: DialogConstants.auto,
      width: Style.w600px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        action: UniqueConstants.delete,
        actionMessage: ` ${ele.value} from the ${this.config.deleteActionMessage}.. `
      },
    });
    dialogRef.afterClosed().subscribe((res: string) => {
      if (res === ResponseStrings.Yes) {
        this.iAdminApiService.deleteLookupTableData(ele.id).subscribe((res: ApiResponse<LookupTableData[]>) => {
          if (res.isExecuted) {
            this.getTableData();
            this.AddBtnDisabled = false;
          } else {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          }
        });
      }
    });
  }
}

