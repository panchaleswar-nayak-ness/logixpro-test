import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table'; 
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject';
import { AuthService } from '../../common/init/auth.service';
import { AddFilterFunction } from '../add-filter-function/add-filter-function.component';
import labels from 'src/app/common/labels/labels.json';
import { DeleteConfirmationComponent } from '../../../app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { MatSelect } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatOption } from '@angular/material/core';
import { MatSort } from '@angular/material/sort';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { PickToteManagerService } from 'src/app/common/services/pick-tote-manager.service'
import {  TableConstant ,ToasterTitle,ResponseStrings,Column,ToasterType,zoneType,DialogConstants,ColumnDef,UniqueConstants,Style,StringConditions, Placeholders, ToasterMessages, FIELDS_DEFAULT_AN, ConfirmationMessages, FormatValues, ConfirmationHeadings, DISABLED_FIELDS} from 'src/app/common/constants/strings.constants';
import { FilterOrder, FilterTransaction, SavedFilterChangeEvent, FilterData, OrderData } from 'src/app/common/types/pick-tote-manager.types';
import { InputType } from 'src/app/common/enums/CommonEnums';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-pick-tote-manager',
  templateUrl: './pick-tote-manager.component.html',
  styleUrls: ['./pick-tote-manager.component.scss'],
})
export class PickToteManagerComponent implements OnInit {
fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
ItemNumber: string = this.fieldMappings.itemNumber;
UnitOfMeasure: string = this.fieldMappings.unitOfMeasure;
UserField1:string = this.fieldMappings.userField1;
UserField2:string = this.fieldMappings.userField2;
UserField3:string = this.fieldMappings.userField3;
UserField4:string = this.fieldMappings.userField4;
UserField5:string = this.fieldMappings.userField5;
UserField6:string = this.fieldMappings.userField6;
UserField7:string = this.fieldMappings.userField7;
UserField8:string = this.fieldMappings.userField8;
UserField9:string = this.fieldMappings.userField9;
UserField10:string = this.fieldMappings.userField10;
 DATE_FIELDS = new Set<string>([
  Column.RequiredDate,
  Column.ImportDate
]);

  placeholders = Placeholders;
  ELEMENT_DATA: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  ];

  @ViewChild('field_focus') field_focus: ElementRef;

  isFilter: string = StringConditions.filter;
  savedFilterList: any[] = [];
  filteredOptions: Observable<any[]>;
  savedFilter = new FormControl('');
  userData: any;
  filterData: any[] = [];
  orderByData: any[] = [];
  filterBatchData: any[] = [];
  filterBatchDataZone: any[] = [];
  useDefaultFilter;
  useDefaultZone;
  batchByZoneData: any[] = []; 
  tabIndex: number = 0;
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
 
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
 
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : UniqueConstants.Select} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : UniqueConstants.Select} row ${
      row.position + 1
    }`;
  }

  dataSource: any;
  orderBydataSource: any;
  pickBatchFilter: any;
  batchByZoneSource: any;
  filterBatchOrders: any;
  filterBatchOrdersZone: any;
  pickBatchOrder: any;
  tempHoldEle: any;
  filterOrderTransactionSource: any;
  zoneOrderTransactionSource: any;
  selectedOrders: any[] = [];
  allSelectOrders: any[] = [];
  selectedZoneOrders: any[] = [];
  filterSeq: any = '0';
  orderBySeq: any = '0';
  isFilterAdd: boolean = false;
  isOrderByAdd: boolean = false;
  isOrderSelect: boolean = true;
  isOrderSelectZone: boolean = true;
  onDestroy$: Subject<boolean> = new Subject();
  selection = new SelectionModel<PeriodicElement>(true, []);
  disFilterColumns: string[] = [
    'sequence',
    'field',
    'format',
    'criteria',
    'value',
    'andOr',
    ColumnDef.Actions,
  ];
  disOrderColumns: string[] = [
    'sequence',
    'field',
    'sortOrder',
    'id',
    ColumnDef.Actions,
  ];

  displayedColumns1: string[] = [UniqueConstants.position, 'toteid', 'orderno', 'other'];
  dataSource1 = new MatTableDataSource<PeriodicElement>(this.ELEMENT_DATA);

  @ViewChild('matRef') matRef: MatSelect;
  @ViewChild('orderRef') orderRef: MatSelect;
  @ViewChild('orderZoneRef') orderZoneRef: MatSelect;
  @ViewChild(MatSort) viewFilterTransSort: MatSort;
  @ViewChild(MatSort) viewZoneTransSort: MatSort;

  displayedColumns2: string[] = ['orderno', 'requireddate','transactionsline',UniqueConstants.Priority];
  filterBatchOrderColums: string[] = ['orderno', 'requireddate', 'transactionsline',UniqueConstants.Priority];

  displayedColumns3: string[] = [
    'orderno',
    'itemno',
    'transaction',
    TableConstant.Location,
  ];
  filterBatchTransColumns = [
    {
      columnDef: UniqueConstants.OrderNumber,
      header: Column.OrderNumber,
      cell: (element: any) => `${element.orderNumber}`,
    },
    {
      columnDef: 'itemNumber',
      header: this.ItemNumber,
      cell: (element: any) => `${element.itemNumber}`,
    },
    {
      columnDef: ColumnDef.TransactionQuantity,
      header: TableConstant.TransactionQuantity,
      cell: (element: any) => `${element.transactionQuantity}`,
    },
    {
      columnDef: TableConstant.Location,
      header: Column.Location,
      cell: (element: any) => `${element.location}`,
    },
    {
      columnDef: TableConstant.completedQuantity,
      header: 'Completed Quantity',
      cell: (element: any) => `${element.completedQuantity}`,
    },
    {
      columnDef: UniqueConstants.Description,
      header: Column.Description,
      cell: (element: any) => `${element.description}`,
    },
    {
      columnDef: TableConstant.ImportDate,
      header: 'Import Date',
      cell: (element: any) => `${element.importDate}`,
    },
    {
      columnDef: UniqueConstants.Priority,
      header: 'Priority',
      cell: (element: any) => `${element.priority}`,
    },
    {
      columnDef: ColumnDef.RequiredDate,
      header: 'Required Date',
      cell: (element: any) => `${element.requiredDate}`,
    },
    {
      columnDef: TableConstant.LineNumber,
      header: 'Line Number',
      cell: (element: any) => `${element.lineNumber}`,
    },
    {
      columnDef: TableConstant.LineSequence,
      header: 'Line Sequence',
      cell: (element: any) => `${element.lineSequence}`,
    },
    {
      columnDef: TableConstant.SerialNumber,
      header: ColumnDef.SerialNumber,
      cell: (element: any) => `${element.serialNumber}`,
    },
    {
      columnDef: TableConstant.LotNumber,
      header: Column.LotNumber,
      cell: (element: any) => `${element.lotNumber}`,
    },
    {
      columnDef: ColumnDef.ExpirationDate,
      header: TableConstant.ExpirationDate,
      cell: (element: any) => `${element.expirationDate}`,
    },
    {
      columnDef: 'completedDate',
      header: TableConstant.CompletedDate,
      cell: (element: any) => `${element.completedDate}`,
    },
    {
      columnDef: 'completedBy',
      header: 'Completed By',
      cell: (element: any) => `${element.completedBy}`,
    },
    {
      columnDef: TableConstant.BatchPickID,
      header: ColumnDef.BatchPickID,
      cell: (element: any) => `${element.batchPickID}`,
    },
    {
      columnDef: ColumnDef.UnitOfMeasure,
      header: this.UnitOfMeasure,
      cell: (element: any) => `${element.unitOfMeasure}`,
    },
    {
      columnDef: ColumnDef.userField1,
      header: this.UserField1,
      cell: (element: any) => `${element.userField1}`,
    },
    {
      columnDef: ColumnDef.userField2,
      header: this.UserField2,
      cell: (element: any) => `${element.userField2}`,
    },
    {
      columnDef: ColumnDef.userField3,
      header: this.UserField3,
      cell: (element: any) => `${element.userField3}`,
    },
    {
      columnDef: ColumnDef.userField4,
      header: this.UserField4,
      cell: (element: any) => `${element.userField4}`,
    },
    {
      columnDef: ColumnDef.userField5,
      header: this.UserField5,
      cell: (element: any) => `${element.userField5}`,
    },
    {
      columnDef: ColumnDef.userField6,
      header: this.UserField6,
      cell: (element: any) => `${element.userField6}`,
    },
    {
      columnDef: ColumnDef.userField7,
      header: this.UserField7,
      cell: (element: any) => `${element.userField7}`,
    },
    {
      columnDef: ColumnDef.userField8,
      header: this.UserField8,
      cell: (element: any) => `${element.userField8}`,
    },
    {
      columnDef: ColumnDef.userField9,
      header: this.UserField9,
      cell: (element: any) => `${element.userField9}`,
    },
    {
      columnDef: ColumnDef.userField10,
      header: this.UserField10,
      cell: (element: any) => `${element.userField10}`,
    },
    {
      columnDef: ColumnDef.Revision,
      header: TableConstant.Revision,
      cell: (element: any) => `${element.revision}`,
    },
    {
      columnDef: ColumnDef.ToteID,
      header: Column.ToteID,
      cell: (element: any) => `${element.toteID}`,
    },
    {
      columnDef: 'toteNumber',
      header: 'Tote Number',
      cell: (element: any) => `${element.toteNumber}`,
    },
    {
      columnDef: Column.cell,
      header: TableConstant.Cell,
      cell: (element: any) => `${element.cell}`,
    },
    {
      columnDef: ColumnDef.HostTransactionId,
      header: TableConstant.HostTransactionID,
      cell: (element: any) => `${element.hostTransactionID}`,
    },
    { columnDef: 'id', header: 'ID', cell: (element: any) => `${element.id}` },
    {
      columnDef: TableConstant.zone,
      header: ColumnDef.Zone,
      cell: (element: any) => `${element.zone}`,
    },
    {
      columnDef: zoneType.carousel,
      header: this.fieldMappings?.carousel || TableConstant.Carousel,
      cell: (element: any) => `${element.carousel}`,
    },
    {
      columnDef: Column.Row,
      header: this.fieldMappings?.row || TableConstant.Row,
      cell: (element: any) => `${element.row}`,
    },
    {
      columnDef: TableConstant.shelf,
      header: this.fieldMappings?.shelf || TableConstant.shelf,
      cell: (element: any) => `${element.shelf}`,
    },
    {
      columnDef: ColumnDef.Bin,
      header: this.fieldMappings?.bin || TableConstant.Bin,
      cell: (element: any) => `${element.bin}`,
    },
    {
      columnDef: TableConstant.WareHouse,
      header: ColumnDef.Warehouse,
      cell: (element: any) => `${element.warehouse}`,
    },
    {
      columnDef: 'invMapID',
      header: 'Inventory Map ID',
      cell: (element: any) => `${element.invMapID}`,
    },
    {
      columnDef: TableConstant.ImportBy,
      header: 'Import By',
      cell: (element: any) => `${element.importBy}`,
    },
    {
      columnDef: 'importFilename',
      header: 'Import Filename',
      cell: (element: any) => `${element.importFilename}`,
    },
    {
      columnDef: TableConstant.Notes,
      header: 'Notes',
      cell: (element: any) => `${element.notes}`,
    },
    {
      columnDef: UniqueConstants.emergency,
      header: ColumnDef.Emergency,
      cell: (element: any) => `${element.emergency}`,
    },
    {
      columnDef: 'masterRecord',
      header: 'Master Record',
      cell: (element: any) => `${element.masterRecord}`,
    },
    {
      columnDef: 'masterRecordID',
      header: 'Master Record ID',
      cell: (element: any) => `${element.masterRecordID}`,
    },
    {
      columnDef: 'exportBatchID',
      header: 'Export Batch ID',
      cell: (element: any) => `${element.exportBatchID}`,
    },
    {
      columnDef: 'exportDate',
      header: 'Export Date',
      cell: (element: any) => `${element.exportDate}`,
    },
    {
      columnDef: 'exportedBy',
      header: 'Exported By',
      cell: (element: any) => `${element.exportedBy}`,
    },
    {
      columnDef: 'statusCode',
      header: 'Status Code',
      cell: (element: any) => `${element.statusCode}`,
    },
  ];

  displayedTransColumns = this.filterBatchTransColumns.map((c) => c.columnDef);

  displayedColumns4: string[] = [
    UniqueConstants.Select,
    TableConstant.zone,
    'batchtype',
    'totalorders',
    'totallocations',
    'other',
  ];
  batchByOrderColumns: string[] = [
    'default',
    TableConstant.zone,
    'batchtype',
    'totalorders',
    'totallocations',
    ColumnDef.Actions,
  ];
  @ViewChild('filterBatchOrder') filterBatchOrder: MatPaginator;
  @ViewChild('filterBatchTrans') filterBatchTrans: MatPaginator;
  @ViewChild('zoneBatchOrder') zoneBatchOrder: MatPaginator;
  @ViewChild('zoneBatchTrans') zoneBatchTrans: MatPaginator;
  @ViewChild('batchByZonePaginator', { static: false })
  set paginator(value: MatPaginator) {
    this.batchByZoneSource.paginator = value;
  }
  public iInductionManagerApi: IInductionManagerApiService;
  constructor(
    private pickToteManagerService: PickToteManagerService,
    private global: GlobalService,
    public inductionManagerApi: InductionManagerApiService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.iInductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.savedFilterList = [];
    this.userData = this.authService.userData();
    this.getSavedFilters();
    this.dataSource = new MatTableDataSource<any>(this.filterData);
    this.dataSource1 = new MatTableDataSource<any>(this.filterData);
    this.orderBydataSource = new MatTableDataSource<any>(this.orderByData);
    this.pickBatchZonesSelect();
    if (this.data.useDefaultFilter) {
      this.isFilter = StringConditions.filter;
    } else {
      this.isFilter = TableConstant.zone;
    }
    
    this.allSelectOrders = this.data.allOrders;
  }

  pickBatchZonesSelect() {
    let paylaod = {};
    this.iInductionManagerApi.PickBatchZonesSelect(paylaod).subscribe((res) => {
      if (res.isExecuted && res.data) {
        this.batchByZoneData = res.data;
        this.batchByZoneSource = new MatTableDataSource<any>(
          this.batchByZoneData
        );
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.field_focus.nativeElement.focus();
    }, 500);
  }
  getSavedFilters() {
    let paylaod = {
      filter: '',
    };
    this.iInductionManagerApi
      .PickBatchFilterTypeAhead(paylaod)
      .subscribe((res) => {
        if (res.isExecuted && res.data.batchDescriptions) {
          this.savedFilterList = res.data.batchDescriptions;
          this.pickBatchFilter = res.data.pickBatchFilter;
          this.pickBatchOrder =  res.data.pickBatchOrder;
          this.filterData = [];
          if (Array.isArray(this.pickBatchFilter) && this.pickBatchFilter.length > 0) {
            const description = this.pickBatchFilter[0].description;
            this.savedFilter.patchValue(description);
            this.onSavedFilterChange({ option: { value: description } });
            this.onAddFilter(this.pickBatchFilter);
          }          
        this.orderByData = [];

          if (!this.pickBatchOrder) {
            this.onAddOrderBy(this.orderByData);
          }
          else{
              this.onAddOrderBy(this.pickBatchOrder);
          }
          this.filteredOptions = this.savedFilter.valueChanges.pipe(
            startWith(''),
            map((value) => value),
            map((name) =>
              name ? this._filter(name) : this.savedFilterList.slice()
            )
          );
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
        }
      });
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.savedFilterList.filter(
      (option) => option.toLowerCase().indexOf(filterValue) === 0
    );
  }


  getDefaultFormat(field: string): string {
    return DISABLED_FIELDS.includes(field) ? FormatValues.NUMERIC : (FIELDS_DEFAULT_AN.has(field) ? FormatValues.ALPHA_NUMERIC : '');
  }

  onAddFilter(filterData?: FilterData[]): void {
    if (filterData?.length) {
      const formattedFilters = filterData.map((filter) => {
        const formattedValue = this.normalizeDateField(filter.field, filter.value);
  
        return {
          sequence: filter.sequence,
          field: filter.field,
          criteria: filter.criteria,
          value: formattedValue,
          andOr: filter.andOr,
          isSaved: true,
          is_db: true,
          format: filter.isNumericFormat ? FormatValues.NUMERIC : FormatValues.ALPHA_NUMERIC, // Set format based on isNumericFormat
        };
      });
  
      this.filterData.push(...formattedFilters);
      this.filterSeq = filterData[filterData.length - 1].sequence;
    } else {
      this.filterData.push({
        sequence: this.filterSeq + 1,
        field: ColumnDef.Emergency,
        criteria: 'Equals',
        value: '',
        andOr: 'And',
        isSaved: false,
        format: this.getDefaultFormat(ColumnDef.Emergency),
      });
  
      this.isFilterAdd = false;
    }
  
    this.updateDataSource();
  }
  
  /**
   * Normalize date string to 'YYYY-MM-DD' if the field is date-related.
   */
  private normalizeDateField(field: string, value: string): string {
    const dateFields = new Set<string>([Column.RequiredDate, Column.ImportDate]);
  
    if (dateFields.has(field) && value && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const dateParts = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
      if (dateParts) {
        const [, month, day, year] = dateParts;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
  
    return value;
  }
  
  private updateDataSource(): void {
    this.dataSource = new MatTableDataSource<FilterData>([...this.filterData]);
  }
  
  onAddOrderBy(filterData?: OrderData[]): void {
    if (filterData) {
      filterData.map((obj) => {
        this.orderByData.push({
          id: obj.id,
          sequence: obj.sequence,
          field: obj.field,
          sortOrder: obj.order,
          isSaved: true,
        });
        this.orderBySeq = obj.sequence;
      });
    } else {
      this.orderByData.push({
        sequence: this.orderBySeq + 1,
        field: Column.OrderNumber,
        sortOrder: 'DESC',
        isSaved: false,
      });
      this.isOrderByAdd = false;
    }
    this.orderBydataSource = new MatTableDataSource<OrderData>(this.orderByData);
  }
  /**
   * Validates if the filter element is valid
   * @param element The filter element to validate
   * @returns boolean indicating if the element is valid
   */
  private isValidFilterElement(element: FilterData | null | undefined): element is FilterData {
    const isValid = !!element?.field?.trim();
    if (!isValid) {
      this.global.ShowToastr(
        ToasterType.Error,
        ToasterMessages.InvalidInputForFilter,
        ToasterTitle.Error
    );
    }
    return isValid;
  }

  /**
   * Applies the default format to disabled fields
   * @param element The filter element to check and update
   * @returns boolean indicating if the field was a disabled field
   */
  private applyDisabledFieldFormatting(element: FilterData): boolean {
    if (DISABLED_FIELDS.includes(element.field)) {
      element.format = FormatValues.NUMERIC;
      return true;
    }
    return false;
  }

  /**
   * Gets all filter rows with the same field as the given element
   * @param element The element to find matches for
   * @returns Array of matching filter data
   */
  private getSameFieldRows(element: FilterData): FilterData[] {
    return this.filterData.filter(
      (row) => row.field === element.field && row !== element
    );
  }

  /**
   * Handles format synchronization between related filter fields
   * @param element The current filter element
   * @param sameFieldRows Other rows with the same field
   */
  private handleFormatSynchronization(element: FilterData, sameFieldRows: FilterData[]): void {
    // Get the most common format from existing rows
    const formatCounts = sameFieldRows.reduce((acc, row) => {
      if (row.format) {
        acc[row.format] = (acc[row.format] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    const mostCommonFormat = Object.entries(formatCounts)
      .sort((a, b) => b[1] - a[1])[0]?.[0];

    // If current element has a different format than the most common one
    if (element.format && mostCommonFormat && element.format !== mostCommonFormat) {
      this.showFormatMismatchDialog(element, sameFieldRows, mostCommonFormat);
      return;
    }

    // If current element has no format but others do, sync it
    if (mostCommonFormat && !element.format) {
      element.format = mostCommonFormat;
    }
  }

  /**
   * Handles changes to filter fields, ensuring format consistency
   * @param element The filter element that was changed
   */
  onChangeFunctionsFields(element: FilterData): void {
    // Validate input
    if (!this.isValidFilterElement(element)) {
      return;
    }
  
    // Mark element as unsaved
    element.isSaved = false;
  
    // Apply numeric format for disabled fields
    if (this.applyDisabledFieldFormatting(element)) {
      return;
    }
  
    // Find rows with the same field (excluding the current row)
    const sameFieldRows = this.getSameFieldRows(element);
  
    // No related rows, no further action needed
    if (sameFieldRows.length === 0) {
  return;
}

    // Handle format synchronization
    this.handleFormatSynchronization(element, sameFieldRows);
}
  clearMatSelectList() {
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  orderActionRefresh() {
    this.orderRef.options.forEach((data: MatOption) => data.deselect());
  }
  orderActionRefreshZone() {
    this.orderZoneRef.options.forEach((data: MatOption) => data.deselect());
  }
  onFilterAction(option: any) {
    if (option.value === 'add_new_filter') {
      const dialogRef: any = this.global.OpenDialog(AddFilterFunction, {
        height: 'auto',
        width: '500px',
        autoFocus: DialogConstants.autoFocus,
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          if (result) {
            this.savedFilterList.push(result);
            this.savedFilter.setValue(result);
            this.isFilterAdd = true;
            this.isOrderByAdd = true;
            this.filterSeq = '0';
            this.orderBySeq = '0';
            this.clearMatSelectList();
            this.pickBatchFilterOrderData(result, 'filter');
            this.pickBatchFilterOrderData(result, 'order');
          }
        });
    }
    if (option.value === 'rename') {
      const dialogRef: any = this.global.OpenDialog(AddFilterFunction, {
        height: 'auto',
        width: '500px',
        data: {
          savedFilter: this.savedFilter.value,
        },
        autoFocus: DialogConstants.autoFocus,
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          this.savedFilterList = this.savedFilterList.filter(
            (item) => item !== result.oldFilter
          );
          this.savedFilterList.push(result.newFilter);
          this.savedFilter.setValue(result.newFilter);
          const matSelect: MatSelect = option.source;
          matSelect.writeValue(null);
        });
    }
    if (option.value === 'set_default') {
      const dialogRef: any = this.global.OpenDialog(
        ConfirmationDialogComponent,
        {
          height: 'auto',
          width: Style.w480px,
          data: {
            message: 'Mark this filter as the default one ?',
          },
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result === ResponseStrings.Yes) {
          let paylaod = {
            Description: this.savedFilter.value,
          };
          this.iInductionManagerApi
            .PickBatchDefaultFilterMark(paylaod)
            .subscribe((res) => {
              if (res.isExecuted) {
                this.global.ShowToastr(
                  ToasterType.Success,
                  labels.alert.update,
                  ToasterTitle.Success
                );
              } else {
                this.global.ShowToastr(
                  ToasterType.Error,
                  this.global.globalErrorMsg(),
                  ToasterTitle.Error
                );
              }
            });
        }
        const matSelect: MatSelect = option.source;
        matSelect.writeValue(null);
      });
    }
    if (option.value === 'clear_default') {
      let paylaod = {};
      this.iInductionManagerApi
        .PickBatchDefaultFilterClear(paylaod)
        .subscribe((res) => {
          if (res.isExecuted) {
            this.global.ShowToastr(ToasterType.Success, labels.alert.update, ToasterTitle.Success);
            const matSelect: MatSelect = option.source;
            matSelect.writeValue(null);
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
          }
        });
    }
    if (option.value === 'view_default') {
      let paylaod = {};
      this.iInductionManagerApi
        .PickBatchDefaultFilterSelect(paylaod)
        .subscribe((res) => {
          if (res.data) {
            this.savedFilter.setValue(res.data);
            this.isFilterAdd = true;
            this.isOrderByAdd = true;
            this.filterSeq = '0';
            this.orderBySeq = '0';
            this.pickBatchFilterOrderData(res.data, 'filter');
            this.pickBatchFilterOrderData(res.data, 'order');
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              ToasterMessages.NoDefaultFilter,
              ToasterTitle.Warning
            );
          }
          const matSelect: MatSelect = option.source;
          matSelect.writeValue(null);
        });
    }
    if (option.value === 'delete_selected_filter') {
      const dialogRef: any = this.global.OpenDialog(
        DeleteConfirmationComponent,
        {
          height: 'auto',
          width: Style.w480px,
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
        }
      );
      dialogRef.afterClosed().subscribe((result) => {
        if (result === ResponseStrings.Yes) {
          let paylaod = {
            Description: this.savedFilter.value,
          };
          this.iInductionManagerApi
            .PickBatchFilterBatchDelete(paylaod)
            .subscribe((res) => {
              if (res.isExecuted) {
                this.global.ShowToastr(
                  ToasterType.Success,
                  labels.alert.delete,
                  ToasterTitle.Success
                );
                this.savedFilterList = this.savedFilterList.filter(
                  (item) => item !== this.savedFilter.value
                );
                this.savedFilter.setValue('');
                this.savedFilClosed();
                const matSelect: MatSelect = option.source;
                matSelect.writeValue(null);
              } else {
                this.global.ShowToastr(
                  ToasterType.Error,
                  this.global.globalErrorMsg(),
                  ToasterTitle.Error
                );
              }
            });
        }
      });
    }
  }
  // Assign/map User Fields
userFields = Array.from({ length: 9 }, (_, i) => ({
  value: `User Field${i + 1}`,
  placeholder: this[`UserField${i + 1}`],
  replacePlaceholder: `placeholders.userField${i + 1}`,
  fallbackPlaceholder: `placeholders.userField${i + 1}Fallback`
}));

  onSavedFilterChange(val: SavedFilterChangeEvent) {
    // Clear the order selection
    this.clearOrderSelection();
    if (val.option.value) {
      this.isFilterAdd = true;
      this.isOrderByAdd = true;
      this.filterSeq = '0';
      this.orderBySeq = '0';
      this.pickBatchFilterOrderData(val.option.value, 'filter');
      this.pickBatchFilterOrderData(val.option.value, 'order');
      this.ordersFilterZoneSelect();
    }
  }
  private resetPagination(paginator: MatPaginator) {
    if (paginator) {
      paginator.firstPage();
      paginator.pageSize = 10;
    }
  }

  ordersFilterZoneSelect(zone = '', rp = false, type = '') {
    let payload;
    this.filterBatchDataZone = [];
    this.filterOrderTransactionSource = [];
    this.zoneOrderTransactionSource = [];
    if (zone == '') {
      payload = {
        Filter: this.savedFilter.value,
        Zone: '',
        BatchType: '',
        UseDefFilter: 0,
        UseDefZone: 0,
        RP: false,
      };
      this.iInductionManagerApi
        .OrdersFilterZoneSelect(payload)
        .subscribe((res) => {
          if (res.isExecuted && res.data) {
            this.filterBatchData =[];
            res.data.map((val) => {
              this.filterBatchData.push({
                orderNumber: val.orderNumber,
                reqDate: val.reqDate,
                priority: val.priority,
                otLines: val.otLines,
                isSelected: false,
              });
            });
            if (this.data.allOrders.length > 0) {
              const selectedArr = this.filterBatchData.filter((element) =>
                this.data.allOrders.includes(element.orderNumber)
              );

              selectedArr.forEach((ele) => {
                ele.isSelected = true;
                this.selectedOrders.push(ele.orderNumber);
              });
              this.selectedOrders = [...new Set(this.selectedOrders)];
            }
            this.filterBatchOrders = new MatTableDataSource<FilterOrder>(
              this.filterBatchData
            );
            this.filterBatchOrders.paginator = this.filterBatchOrder;
            this.resetPagination(this.filterBatchOrder);
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
          }
        });
    } else {
      payload = {
        Filter: '',
        Zone: zone,
        BatchType: type,
        UseDefFilter: 0,
        UseDefZone: 0,
        RP: rp,
      };
      this.iInductionManagerApi
        .OrdersFilterZoneSelect(payload)
        .subscribe((res) => {
          if (res.isExecuted && res.data) {
            res.data.map((val) => {
              this.filterBatchDataZone.push({
                orderNumber: val.orderNumber,
                reqDate: val.reqDate,
                priority: val.priority,
                otLines: val.otLines,
                isSelected: false,
              });
            });
            if (this.data.allOrders.length > 0) {
              const selectedArr = this.filterBatchDataZone.filter((element) =>
                this.data.allOrders.includes(element.orderNumber)
              );

              selectedArr.forEach((ele) => {
                ele.isSelected = true;
                this.selectedOrders.push(ele.orderNumber);
              });
              this.selectedOrders = [...new Set(this.selectedOrders)];
            }
            this.filterBatchOrdersZone = new MatTableDataSource<FilterOrder>(
              this.filterBatchDataZone
            );
            this.filterBatchOrdersZone.paginator = this.zoneBatchOrder;
            this.resetPagination(this.zoneBatchOrder);
            this.tabIndex = 1;
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
          }
        });
    }
  }

  viewReplenishZoneRecord(element: any, rp: any, viewReplenish = '') {
    if (viewReplenish == '') {
      this.ordersFilterZoneSelect(element.zone, true, element.type);
    } else {
      this.ordersFilterZoneSelect(element.zone, false, element.type);
    }
  }

  onOrderSelect(row: any) {
    
    if (this.selectedOrders.includes(row.orderNumber)) {
      this.filterBatchData.forEach((val) => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = false;
          this.filterOrderTransactionSource = [];
          this.isOrderSelect = false;
          this.onCloseAllPickToteManager();
        }
      });
      this.selectedOrders = this.selectedOrders.filter(
        (item) => item !== row.orderNumber
      );
      if (this.selectedOrders.length === 0) {
        this.isOrderSelect = true;
      }
    } else if (this.selectedOrders.length >= this.data.pickBatchQuantity) {
      this.global.ShowToastr(
        ToasterType.Error,
        ToasterMessages.NoOpenTote,
        ToasterTitle.BatchFilled
      );
    } else {
      this.filterBatchData.forEach((v) => {
        if (this.selectedOrders.includes(v.orderNumber)) {
          v.isSelected = true;
        } else {
          v.isSelected = false;
        }
      });
      this.tempHoldEle = row;

      this.filterBatchData.forEach((val) => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = true;
        }
      });
      this.isOrderSelect = false;
      let paylaod = {
        Draw: 0,
        OrderNumber: row.orderNumber,
        sRow: 1,
        eRow: 10,
        SortColumnNumber: 0,
        SortOrder: UniqueConstants.Asc,
        Filter: UniqueConstants.OneEqualsOne
      };
      this.iInductionManagerApi.PickToteTransDT(paylaod).subscribe((res) => {
        if (res) {
          this.filterOrderTransactionSource = new MatTableDataSource<any>(
            res.data.pickToteManTrans
          );
          this.filterOrderTransactionSource.paginator = this.filterBatchTrans;
          this.filterOrderTransactionSource.sort = this.viewFilterTransSort;
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
        }
      });
    }
  }

  onOrderSelectZone(row: any) {
    if (this.selectedOrders.includes(row.orderNumber)) {
      this.filterBatchDataZone.forEach((val) => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = false;
          this.zoneOrderTransactionSource = [];
          this.isOrderSelectZone = false;
          this.onCloseAllPickToteManager();
        }
      });
      this.selectedOrders = this.selectedOrders.filter(
        (item) => item !== row.orderNumber
      );

      if (this.selectedOrders.length === 0) {
        this.isOrderSelectZone = true;
      }
    } else if (this.selectedOrders.length >= this.data.pickBatchQuantity) {
      this.global.ShowToastr(
        ToasterType.Error,
        'No open totes in batch',
        'Batch is Filled.'
      );
    } else {
      this.filterBatchDataZone.forEach((v) => {
        if (this.selectedOrders.includes(v.orderNumber)) {
          v.isSelected = true;
        } else {
          v.isSelected = false;
        }
      });
      this.tempHoldEle = row;

      this.filterBatchDataZone.forEach((val) => {
        if (val.orderNumber === row.orderNumber) {
          val.isSelected = true;
        }
      });
      this.isOrderSelectZone = false;
      let paylaod = {
        Draw: 0,
        OrderNumber: row.orderNumber,
        sRow: 1,
        eRow: 10,
        SortColumnNumber: 0,
        SortOrder: UniqueConstants.Asc,
        Filter: UniqueConstants.OneEqualsOne
      };
      this.iInductionManagerApi.PickToteTransDT(paylaod).subscribe((res) => {
        if (res) {
          this.zoneOrderTransactionSource = new MatTableDataSource<any>(
            res.data.pickToteManTrans
          );
          this.zoneOrderTransactionSource.paginator = this.zoneBatchTrans;
          this.zoneOrderTransactionSource.sort = this.viewZoneTransSort;
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
        }
      });
    }
  }
  pickBatchFilterOrderData(filter: string | null, target: 'filter' | 'order') {
    let payload = {
        filter: filter,
    };
    this.iInductionManagerApi
        .PickBatchFilterOrderData(payload)
        .subscribe((res) => {
            if (res.isExecuted && res.data) {
                if (target === 'filter') {
                    this.filterData = [];
                    this.pickBatchFilter = res.data.pickBatchFilter;
                    if (Array.isArray(this.pickBatchFilter) && this.pickBatchFilter.length === 0) {
                        this.onAddFilter();
                    } else {
                        this.onAddFilter(this.pickBatchFilter);
                    }
                } else if (target === 'order') {
                    this.orderByData = [];
                    this.pickBatchOrder = res.data.pickBatchOrder;
                    if (Array.isArray(this.pickBatchOrder) && this.pickBatchOrder.length === 0) {
                      this.onAddOrderBy(this.orderByData);
                    }
                    else{
                        this.onAddOrderBy(this.pickBatchOrder);
                    }
                }
            } else {
                this.global.ShowToastr(
                    ToasterType.Error,
                    res.responseMessage?? this.global.globalErrorMsg(),
                    ToasterTitle.Error
                );
            }
        });
}
  savedFilClosed(): void {
    if (!this.savedFilter?.value) {
      this.resetFilterAndOrderData();
    }
  }

  private resetFilterAndOrderData(): void {
    this.isFilterAdd = false;
    this.isOrderByAdd = false;
    this.filterData = [];
    this.orderByData = [];
    this.orderBydataSource = new MatTableDataSource<OrderData>(this.orderByData);
    this.dataSource = new MatTableDataSource<FilterData>(this.filterData);
    this.refreshOrderAndTransactionData();
  }

  refreshOrderAndTransactionData() {
  // Clear the orders table
  this.filterBatchData = [];
  this.filterBatchOrders = new MatTableDataSource<FilterOrder>(this.filterBatchData);

  // Clear the transactions tables
  this.filterOrderTransactionSource = new MatTableDataSource<FilterTransaction>([]);
  this.zoneOrderTransactionSource = new MatTableDataSource<FilterTransaction>([]);
}
clearOrderSelection() {
  // Clear selection in filterBatchData
  if (this.filterBatchData && this.filterBatchData.length) {
    this.filterBatchData.forEach(order => order.isSelected = false);
  }
  // Clear selection in zone data if needed
  if (this.filterBatchDataZone && this.filterBatchDataZone.length) {
    this.filterBatchDataZone.forEach(order => order.isSelected = false);
  }
  // Clear the selectedOrders array
  this.selectedOrders = [];
}

  onChangeOrderAction(option: any) {
    if (option === 'fill_top_orders') {
      for (let index = 0; index < this.data.pickBatchQuantity; index++) {
        if (this.filterBatchData[index]) {
          this.filterBatchData[index].isSelected = true;
          this.selectedOrders.push(this.filterBatchData[index].orderNumber);
        }
      }
      this.isOrderSelect = false;
      this.onCloseAllPickToteManager();
    }
    if (option === 'unselect_all_orders') {
      this.filterBatchData.forEach((ele) => {
        ele.isSelected = false;
        ele.priority = '';
        this.selectedOrders = [];
      });
      this.isOrderSelect = true;
      this.onCloseAllPickToteManager();
    }
    if (option === 'select_order') {
      if (this.tempHoldEle) {
        this.tempHoldEle.isSelected = true;
        if (!this.selectedOrders.includes(this.tempHoldEle.orderNumber)) {
          this.selectedOrders.push(this.tempHoldEle.orderNumber);
        }
      }

      this.onCloseAllPickToteManager();
    }
    this.orderActionRefresh();
  }

  onChangeOrderActionZone(option: any) {
    if (option === 'fill_top_orders') {
      for (let index = 0; index < this.data.pickBatchQuantity; index++) {
        if (this.filterBatchDataZone[index]) {
          this.filterBatchDataZone[index].isSelected = true;
          this.selectedOrders.push(this.filterBatchDataZone[index].orderNumber);
        }
      }
      this.isOrderSelectZone = true;
      this.onCloseAllPickToteManager();
    }
    if (option === 'unselect_all_orders') {
      this.filterBatchDataZone.forEach((ele) => {
        ele.isSelected = false;
        ele.priority = '';
        this.selectedOrders = [];
      });
      this.isOrderSelectZone = true;
      this.onCloseAllPickToteManager();
    }
    if (option === 'select_order') {
      if (this.tempHoldEle) {
        this.tempHoldEle.isSelected = true;
        if (!this.selectedOrders.includes(this.tempHoldEle.orderNumber)) {
          this.selectedOrders.push(this.tempHoldEle.orderNumber);
        }
      }
      this.onCloseAllPickToteManager();
    }
    this.orderActionRefreshZone();
  }
  onViewOrderLineZone(event) {
    let orderNum = '';
    this.filterBatchDataZone.forEach((val) => {
      orderNum += val.orderNumber + ',';
    });

    if (event.value === 'vAllOrderZone') {
      let paylaod = {
        Draw: 0,
        OrderNumber: orderNum,
        sRow: 1,
        eRow: 10,
        SortColumnNumber: 0,
        SortOrder: UniqueConstants.Asc,
        Filter: UniqueConstants.OneEqualsOne
      };
      this.iInductionManagerApi.PickToteTransDT(paylaod).subscribe((res) => {
        if (res.data.pickToteManTrans?.length > 0) {
          this.zoneOrderTransactionSource = new MatTableDataSource<any>(
            res.data.pickToteManTrans
          );
          this.zoneOrderTransactionSource.paginator = this.zoneBatchTrans;
          this.zoneOrderTransactionSource.sort = this.viewZoneTransSort;
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
        }
      });
    }
    if (event.value === 'vSelectedOrderZone') {
      orderNum = '';
      this.filterBatchDataZone.forEach((val) => {
        if (val.isSelected) {
          orderNum += val.orderNumber + ',';
        }
      });
      if (orderNum !== '') {
        let paylaod = {
          Draw: 0,
          OrderNumber: orderNum,
          sRow: 1,
          eRow: 10,
          SortColumnNumber: 0,
          SortOrder: UniqueConstants.Asc,
          Filter: UniqueConstants.OneEqualsOne
        };
        this.iInductionManagerApi.PickToteTransDT(paylaod).subscribe((res) => {
          if (res.data.pickToteManTrans?.length > 0) {
            this.zoneOrderTransactionSource = new MatTableDataSource<any>(
              res.data.pickToteManTrans
            );
            this.zoneOrderTransactionSource.paginator = this.zoneBatchTrans;
            this.zoneOrderTransactionSource.sort = this.viewZoneTransSort;
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
          }
        });
      } else {
        this.zoneOrderTransactionSource = [];
      }
    }
  }
  onViewOrderLineFilter(event) {
    let orderNum = '';
    this.filterBatchData.forEach((val) => {
      orderNum += val.orderNumber + ',';
    });

    if (event.value === 'vAllOrderFilter') {
      let paylaod = {
        Draw: 0,
        OrderNumber: orderNum ?? 'EAGLES',
        sRow: 1,
        eRow: 10,
        SortColumnNumber: 0,
        SortOrder: UniqueConstants.Asc,
        Filter: UniqueConstants.OneEqualsOne
      };
      this.iInductionManagerApi.PickToteTransDT(paylaod).subscribe((res) => {
        if (res.data.pickToteManTrans?.length > 0) {
          this.filterOrderTransactionSource = new MatTableDataSource<any>(
            res.data.pickToteManTrans
          );
          this.filterOrderTransactionSource.paginator = this.filterBatchTrans;
          this.filterOrderTransactionSource.sort = this.viewFilterTransSort;
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            this.global.globalErrorMsg(),
            ToasterTitle.Error
          );
        }
      });
    }
    if (event.value === 'vSelectedOrderFilter') {
      orderNum = '';
      this.filterBatchData.forEach((val) => {
        if (val.isSelected) {
          orderNum += val.orderNumber + ',';
        }
      });
      if (orderNum !== '') {
        let paylaod = {
          Draw: 0,
          OrderNumber: orderNum,
          sRow: 1,
          eRow: 10,
          SortColumnNumber: 0,
          SortOrder: UniqueConstants.Asc,
          Filter: UniqueConstants.OneEqualsOne
        };
        this.iInductionManagerApi.PickToteTransDT(paylaod).subscribe((res) => {
          if (res.data.pickToteManTrans?.length > 0) {
            this.filterOrderTransactionSource = new MatTableDataSource<any>(
              res.data.pickToteManTrans
            );
            this.filterOrderTransactionSource.paginator = this.filterBatchTrans;
            this.filterOrderTransactionSource.sort = this.viewFilterTransSort;
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              this.global.globalErrorMsg(),
              ToasterTitle.Error
            );
          }
        });
      } else {
        this.filterOrderTransactionSource = [];
      }
    }
  }

  onSaveSingleFilter(element: any) {
    if (element.value === '' || element.format === '') {
        this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.InvalidInputForFilter,
            ToasterTitle.Error
        );
    } else {
        let payload = {
            Sequence: element.sequence,
            Field: element.field,
            IsNumericFormat : element.format == FormatValues.NUMERIC ? true : false,
            Criteria: element.criteria,
            Value: element.value,
            AndOr: element.andOr,
            Description: this.savedFilter.value,
        };
            if (element.is_db) {
                this.iInductionManagerApi
                    .PickBatchFilterUpdate(payload)
                    .subscribe((res) => {
                        if (res.isExecuted) {
                            this.isFilterAdd = true;
                            this.global.ShowToastr(
                                ToasterType.Success,
                                labels.alert.update,
                                ToasterTitle.Success
                            );
                            this.filterSeq = element.sequence;
                            this.refreshFilterDataGrid();
                            // Update format based on API response
                            element.format = res.data.isNumericFormat ? FormatValues.NUMERIC : FormatValues.ALPHA_NUMERIC;
                        } else {
                            this.global.ShowToastr(
                                ToasterType.Error,
                                res.responseMessage?? this.global.globalErrorMsg(),
                                ToasterTitle.Error
                            );
                        }
                    });
            } else {
                this.iInductionManagerApi
                    .PickBatchFilterInsert(payload)
                    .subscribe((res) => {
                        if (res.isExecuted) {
                            this.isFilterAdd = true;
                            this.global.ShowToastr(
                                ToasterType.Success,
                                labels.alert.success,
                                ToasterTitle.Success
                            );
                            this.filterSeq = element.sequence;
                            this.refreshFilterDataGrid();
                            // Update format based on API response
                            element.format = res.data.isNumericFormat ? FormatValues.NUMERIC : FormatValues.ALPHA_NUMERIC;
                        } else {
                            this.global.ShowToastr(
                                ToasterType.Error,
                                this.global.globalErrorMsg(),
                                ToasterTitle.Error
                            );
                        }
                    });
            };
    }
}
onSaveSingleOrder(element: any) {
  if (element.id) {
      let payload = {
          id: +element.id,
          Sequence: element.sequence,
          Field: element.field,
          Order: element.sortOrder,
          Description: this.savedFilter.value,
      };
      this.iInductionManagerApi
          .PickBatchOrderUpdate(payload)
          .subscribe((res) => {
              if (res.isExecuted) {
                  this.isOrderByAdd = true;
                  this.global.ShowToastr(ToasterType.Success, labels.alert.update, ToasterTitle.Success);
                  this.refreshOrderDataGrid();
              } else {
                  this.global.ShowToastr(
                      ToasterType.Error,
                      this.global.globalErrorMsg(),
                      ToasterTitle.Error
                  );
              }
          });
  } else {
      let payload = {
          Sequence: element.sequence,
          Field: element.field,
          Order: element.sortOrder,
          Description: this.savedFilter.value,
      };
      this.iInductionManagerApi
          .PickBatchOrderInsert(payload)
          .subscribe((res) => {
              if (res.isExecuted) {
                  this.isOrderByAdd = true;
                  this.global.ShowToastr(ToasterType.Success, labels.alert.success, ToasterTitle.Success);
                  element.id = res.data;
                  this.orderBySeq = element.sequence;
                  this.refreshOrderDataGrid();
              } else {
                  this.global.ShowToastr(
                      ToasterType.Error,
                      this.global.globalErrorMsg(),
                      ToasterTitle.Error
                  );
              }
          });
  }
  this.isUniqueSeq(element);
}
isUniqueSeq(element: any) {
  let res: any[] = [];
  this.orderBydataSource.filteredData.map((item) => {
      let existItem = res.find((x: any) => x.sequence == item.sequence);
      if (existItem) {
          this.global.ShowToastr(
              ToasterType.Error,
              "Can't have conflicting sequences within the order rows. A new sequence has been provided",
              ToasterTitle.Error
          );
          element.sequence = +existItem.sequence + 1;
      } else {
          res.push(item);
      }
  });
}
refreshFilterDataGrid() {
  this.pickBatchFilterOrderData(this.savedFilter.value, 'filter');
  this.ordersFilterZoneSelect();
}

refreshOrderDataGrid() {
  this.pickBatchFilterOrderData(this.savedFilter.value, 'order');
  this.ordersFilterZoneSelect();
}
  onDeleteSingleFilter(element: any) {
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: Style.w480px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        if(!element.is_db){
          this.refreshFilterDataGrid();
          this.isFilterAdd = true;
          return;
        }
        let payload = {
          Sequence: element.sequence,
          Description: this.savedFilter.value,
        };
        this.iInductionManagerApi
          .PickBatchFilterDelete(payload)
          .subscribe((res) => {
            if (res.isExecuted) {
              this.isFilterAdd = true;
              this.global.ShowToastr(
                ToasterType.Success,
                labels.alert.delete,
                ToasterTitle.Success
              );
              this.refreshFilterDataGrid();
            } else {
              this.global.ShowToastr(
                ToasterType.Error,
                this.global.globalErrorMsg(),
                ToasterTitle.Error
              );
            }
          });
      }
    });
  }
  onDeleteSingleOrder(element: any) {
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: Style.w480px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        ErrorMessage: 'Are you sure you want to delete this order by row?',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        if(!element.id){
          this.refreshOrderDataGrid();
          this.isOrderByAdd = true;
          return;
        }
        let payload = {
          id: element.id,
        };
        this.iInductionManagerApi
          .PickBatchOrderDelete(payload)
          .subscribe((res) => {
            if (res.isExecuted) {
              this.isOrderByAdd = true;
              this.global.ShowToastr(
                ToasterType.Success,
                labels.alert.delete,
                ToasterTitle.Success
              );
              this.refreshOrderDataGrid();
            } else {
              this.global.ShowToastr(
                ToasterType.Error,
                this.global.globalErrorMsg(),
                ToasterTitle.Error
              );
            }
          });
      }
    });
  }

  onClosePickToteManager() {
    
    let selectedObj: any = [];
    let currentObjArr: any = [];
    if (this.isFilter === StringConditions.filter) {
      if (this.allSelectOrders.length > 0) {
        selectedObj = this.filterBatchData.filter((element) =>
          this.allSelectOrders.includes(element.orderNumber)
        );
        selectedObj = [
          ...new Map(
            selectedObj.map((item) => [item.orderNumber, item])
          ).values(),
        ];

        let orderNumbers = new Set(selectedObj.map((d) => d.orderNumber));
        currentObjArr = [
          ...selectedObj,
          ...this.data.resultObj.filter(
            (d) => !orderNumbers.has(d.orderNumber)
          ),
        ];
      }
    } else if (this.allSelectOrders.length > 0) {
      selectedObj = this.filterBatchDataZone.filter((element) =>
        this.allSelectOrders.includes(element.orderNumber)
      );
      selectedObj = [
        ...new Map(
          selectedObj.map((item) => [item.orderNumber, item])
        ).values(),
      ];

      let orderNumbers = new Set(selectedObj.map((d) => d.orderNumber));
      currentObjArr = [
        ...selectedObj,
        ...this.data.resultObj.filter((d) => !orderNumbers.has(d.orderNumber)),
      ];
    }
    this.dialogRef.close(currentObjArr);
  }

  onCloseAllPickToteManager() {
   
    this.allSelectOrders = this.selectedOrders;
  }

  onSelectBatchZone(row) {
    const dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w480px,
      data: {
        message: 'Mark this filter as a default one ?',
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === ResponseStrings.Yes) {
        let payload = {
          zone: row.zone,
          type: row.type,
        };
        this.iInductionManagerApi
          .PickBatchZoneDefaultMark(payload)
          .subscribe((res) => {
            if (res.isExecuted) {
              this.global.ShowToastr(
                ToasterType.Success,
                labels.alert.update,
                ToasterTitle.Success
              );
            } else {
              this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
            }
          });
      }
    });
  }
  
  //Determines the appropriate HTML input type (date, number, or text) 
  // based on the field name and its format in filterData.  
  getInputType(field: string): InputType {
    // Date fields take priority
    if (this.DATE_FIELDS.has(field)) {
      return InputType.Date;
      }
      
      const elementFormat = this.filterData.find(el => el.field === field)?.format;
      
      return elementFormat === FormatValues.NUMERIC
      ? InputType.Number
      : InputType.Text;
      }
  
  isTooltipDisabled(value: string): boolean {
    return value.length < 25;
    
  }
  isFormatDisabled(field: string): boolean {
    // Case-insensitive check for robustness
    return DISABLED_FIELDS.some(f => f.toLowerCase() === (field || '').toLowerCase());
  }

  /**
 * Handles format changes for a filter, ensuring consistency across filters with the same field.
 * @param newFormat - The newly selected format value
 * @param element - The filter data being modified
 * @param index - The index of the filter in the filterData array
 */
onFormatChange(newFormat: string, element: FilterData, index: number): void {
  // Validate input
  if (!element || !newFormat) {
    this.global.ShowToastr(
      ToasterType.Error,
      ToasterMessages.InvalidInputForFilter,
      ToasterTitle.Error
  );
    return;
  }

  // Get related rows with the same field (excluding current)
  const relatedRows: FilterData[] = this.filterData.filter(
    (row, idx) => row.field === element.field && idx !== index
  );

  // If no related rows, apply change and exit
  if (!relatedRows.length) {
    this.onChangeFunctionsFields(element);
    return;
  }

  const existingFormat = relatedRows[0]?.format;

  // Check for format mismatch
  if (existingFormat && newFormat !== existingFormat) {
    this.showFormatMismatchDialog(element, relatedRows, existingFormat);
    return;
  }

  // No mismatch, proceed with change
  this.onChangeFunctionsFields(element);
}
  
/**
 * Displays a confirmation dialog for format mismatch and handles user response.
 * @param element - The filter data with the new format
 * @param relatedRows - Other filters with the same field
 * @param existingFormat - The current format of related filters
 */
private showFormatMismatchDialog(
  element: FilterData,
  relatedRows: FilterData[],
  existingFormat: string
): void {
  // Validate inputs
  if (!element || !relatedRows || !existingFormat) {
    this.global.ShowToastr(
      ToasterType.Error,
      ToasterMessages.InvalidInputForFilter,
      ToasterTitle.Error
  );
    return;
  }

  const dialogRef = this.global.OpenDialog(ConfirmationDialogComponent, {
    height: 'auto',
    autoFocus: DialogConstants.autoFocus,
    data: {
      message: ConfirmationMessages.InconsistentFormat(element.field),
      heading : ConfirmationHeadings.ChangeFormatType,
      customButtonText: true,
      btn1Text: StringConditions.Yes,
      btn2Text: StringConditions.No
    },
  });

  dialogRef.afterClosed().subscribe((result: string) => {
    if (result === StringConditions.Yes) {
      // Update format for the current element and related rows
      this.onSaveSingleFilter(element);
      relatedRows.forEach((row) => {
        row.format = element.format;
        this.onSaveSingleFilter(row);
      });
    } else {
      // Revert to existing format
      element.format = existingFormat;
    }

    // Trigger change handling regardless of user choice
    this.onChangeFunctionsFields(element);
  });
}
  
}

