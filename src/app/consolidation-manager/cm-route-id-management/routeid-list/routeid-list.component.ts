import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  SimpleChanges,
  ChangeDetectorRef,
  Input,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { FloatLabelType } from "@angular/material/form-field";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatSelect } from "@angular/material/select";
import { Sort, MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router } from "@angular/router";
import { Subject } from "rxjs/internal/Subject";
import { takeUntil } from "rxjs/internal/operators/takeUntil";
import { MatAutocompleteTrigger } from "@angular/material/autocomplete";
import { IConHeaderResponse } from "../routeid-header/Irouteid-list";

import { ConfirmationDialogComponent } from "../../../admin/dialogs/confirmation-dialog/confirmation-dialog.component";
import { RouteManagementDetailViewComponent } from "../../../admin/dialogs/route-management-detail-view/route-management-detail-view.component";
import { RouteHistoryService } from "src/app/common/services/route-history.service";
import { GlobalService } from "src/app/common/services/global.service";
import { CurrentTabDataService } from "../../../admin/inventory-master/current-tab-data-service";
import { ConsolidationApiService } from "src/app/common/services/consolidation-api/consolidation-api.service";
import { TableContextMenuService } from "src/app/common/globalComponents/table-context-menu-component/table-context-menu.service";
import { ColumnFilterComponentComponent } from "src/app/common/globalComponents/column-filter-component/column-filter-component.component";

import {
  DialogConstants,
  ColumnDef,
  UniqueConstants,
  ToasterMessages,
  ToasterTitle,
  ToasterType,
  Placeholders,
  RouteIdManagement
} from "src/app/common/constants/strings.constants";
import { AppRoutes } from "src/app/common/constants/menu.constants";
import { IConsolidationApi } from "src/app/common/services/consolidation-api/consolidation-api-interface";
import { FieldMappingService } from "src/app/common/services/field-mapping/field-mapping.service";
import { SharedService } from 'src/app/common/services/shared.service';

type RouteIDItem = {
  RouteID: string;
  StatusDate: string;
  rawStatusDate: string;
  ConsolidationStatus: string;
  RouteIDStatus: string;
  ConsolidationProgress: string;
  showRequestReleaseButton?: boolean;
};

@Component({
  selector: "app-routeid-list",
  templateUrl: "./routeid-list.component.html",
  styleUrls: ["./routeid-list.component.scss"],
})
export class RouteidListComponent implements OnInit, OnDestroy {
  params: {
    page: number;
    pageSize: number;
    searchColumn?: string;
    searchValue?: string;
    sortColumn?: string;
    sortOrder?: string;
  } = {
    page: 1,
    pageSize: 10,
    searchColumn: "",
    searchValue: "",
    sortColumn: "",
    sortOrder: "",
  };
  intervalId: number | null = null;
  isAutoRefreshEnabled: boolean = true;
  isAutoRefreshActive: boolean = false;
  @Input() selectedZone: string;
  zone: string;
  routeIdListData: {
    RouteID: string;
    StatusDate: string;
    rawStatusDate: string;
    ConsolidationStatus: string;
    RouteIDStatus: string;
    ConsolidationProgress: string;
  }[] = [];
  placeholders = Placeholders;
  headingRouteIDList: string = '';
  headingRouteID: string = '';
  statusDate: string = '';
  consolidationStatus: string = '';
  routeIDStatus: string = '';
  consolidationProgress: string = '';
  routeIdListColumn: { colHeader: string; colDef: string; colTitle: string }[] = [];
  columnNames: string[] = [
    "RouteID",
    "StatusDate",
    "ConsolidationStatus",
    "RouteIDStatus",
    "ConsolidationProgress",
  ];
  private columnMap: Record<string, string> = {};
  isActiveTrigger: boolean = false;
  onDestroy$: Subject<boolean> = new Subject();
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl("auto" as FloatLabelType);
  setStorage;
  fieldNames: string;
  isClearWholeLocationAvailable: boolean = false;
  // Define column names as an array of strings (Correct Type)
  displayedColumns: { colHeader: string; colDef: string; colTitle: string }[] =
    [];
  public dataSource: MatTableDataSource<{
    RouteID: string;
    StatusDate: string;
    rawStatusDate: string;
    ConsolidationStatus: string;
    RouteIDStatus: string;
    ConsolidationProgress: string;
  }>;
  customPagination: {
    total: string;
    recordsPerPage: number;
    startIndex: number;
    endIndex: number;
  } = {
    total: "",
    recordsPerPage: 10,
    startIndex: 0,
    endIndex: 0,
  };
  columnSearch: {
    searchColumn: { colHeader: string; colDef: string };
    searchValue: string;
  } = {
    searchColumn: { colHeader: "", colDef: "" },
    searchValue: "",
  };
  pageEvent: PageEvent;
  searchAutocompleteList: [];
  public iConsolidationApi: IConsolidationApi;
  public columnValues: string[] = [];
  public isSearchColumn: boolean = false;

  transHistory: boolean = false;
  clickTimeout: ReturnType<typeof setTimeout>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("matRef") matRef: MatSelect;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteInventory: MatAutocompleteTrigger;
  @ViewChild(ColumnFilterComponentComponent)
  filterCmp: ColumnFilterComponentComponent;
  private hasSubscribedToRefresh = false;
  //---------------------for mat menu End ----------------------------
  previousUrl: string;
  constructor(
    private global: GlobalService,
    public consolidationApiService: ConsolidationApiService,
    private dialog: MatDialog,
    private router: Router,
    private routeHistoryService: RouteHistoryService,
    private currentTabDataService: CurrentTabDataService,
    private contextMenuService: TableContextMenuService,
    private cdr: ChangeDetectorRef,
    private fieldNameMappingService: FieldMappingService,
    private refreshService: SharedService
  ) {
    this.previousUrl = this.routeHistoryService.getPreviousUrl();
    this.iConsolidationApi = consolidationApiService;
    this.fieldNameMappingService=fieldNameMappingService;
    if (
      this.router.getCurrentNavigation()?.extras?.state?.[
        UniqueConstants.searchValue
      ]
    ) {
      this.columnSearch.searchValue =
        this.router.getCurrentNavigation()?.extras?.state?.[
          UniqueConstants.searchValue
        ];
      this.columnSearch.searchColumn = {
        colDef: this.router.getCurrentNavigation()?.extras?.state?.["colDef"],
        colHeader:
          this.router.getCurrentNavigation()?.extras?.state?.["colHeader"],
      };
      this.isSearchColumn = true;
    } else if (
      this.currentTabDataService.savedItem[
        this.currentTabDataService.INVENTORY_MAP
      ]
    ) {
      this.isSearchColumn = true;
    }
    if (router.url == AppRoutes.OrderManagerInventoryMap) {
      this.transHistory = true;
    } else if (
      router.url == AppRoutes.AdminInventoryMap ||
      AppRoutes.InductionManagerAdminInventoryMap
    ) {
      this.transHistory = false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["selectedZone"] && changes["selectedZone"].currentValue) {
      this.zone = changes["selectedZone"].currentValue;
      this.refreshData()
    }
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.setFieldNameMapping()
    this.initializePagination();
    this.loadInitialData();
    this.setupFilterPredicate();
  }

// to refresh table data in every 5 seconds  
refreshData() {
  // Only subscribe once
  if (this.hasSubscribedToRefresh) return;
  this.hasSubscribedToRefresh = true;

  // Fetch once immediately
  if (this.isAutoRefreshEnabled) {
    this.fetchConsolidationTableData(this.zone);
  }

  // Start polling

  this.refreshService.start();

  this.refreshService.refresh$
    .pipe(takeUntil(this.onDestroy$))
    .subscribe(() => {
      if (this.isAutoRefreshEnabled) {
        this.fetchConsolidationTableData(this.zone);
      }
    });
}

 //Sets up field name mappings and initializes related configurations.
  private setFieldNameMapping(): void {
  // Retrieve field mappings from the FieldMappingService
  const fieldMapping = this.fieldNameMappingService.getFieldMappingAlias();

  if (fieldMapping) {
    // Assign field mapping values to component properties
    this.headingRouteIDList = fieldMapping['con.HeaderList'];
    this.headingRouteID = fieldMapping.routeId;
    this.statusDate = fieldMapping.statusDate;
    this.consolidationStatus = fieldMapping.consolidationStatus;
    this.routeIDStatus = fieldMapping.routeIdStatus;
    this.consolidationProgress = fieldMapping.consolidationProgress;

    // Define the columns for the Route ID list table using the mapped field names
    this.routeIdListColumn = [
      {
        colHeader: "RouteID",
        colDef: this.headingRouteID,
        colTitle: this.headingRouteID,
      },
      {
        colHeader: "StatusDate",
        colDef: this.statusDate,
        colTitle: this.statusDate,
      },
      {
        colHeader: "ConsolidationStatus",
        colDef: this.consolidationStatus,
        colTitle: this.consolidationStatus,
      },
      {
        colHeader: "RouteIDStatus",
        colDef: this.routeIDStatus,
        colTitle: this.routeIDStatus,
      },
      {
        colHeader: "ConsolidationProgress",
        colDef: "",
        colTitle: this.consolidationProgress,
      },
    ];

    // Initialize the column mapping for filtering and sorting functionalities
    this.columnMap = {
      [this.statusDate]: 'StatusDate',
      [this.headingRouteID]: 'RouteID',
      [this.consolidationStatus]: 'ConsolidationStatus',
      [this.routeIDStatus]: 'RouteIDStatus',
    };
  }
}


  private initializePagination(): void {
    this.customPagination = {
      total: "",
      recordsPerPage: 10,
      startIndex: 0,
      endIndex: 10,
    };
  }
  
  private loadInitialData(): void {
    this.fetchConsolidationTableData(this.zone);
    this.getColumnsData();
  }
  
  private setupFilterPredicate(): void {
    this.dataSource.filterPredicate = (data: RouteIDItem, filter: string) => {
      const searchTerms = JSON.parse(filter);
      const rawValue = data[searchTerms.column];
      const columnValue = rawValue ? rawValue.toString().toLowerCase() : "";
      return columnValue.includes(searchTerms.value.toLowerCase());
    };
  }
  
  onClearFilter() {
    this.isAutoRefreshEnabled = true;
    
    this.reset();
  }

  getColumnsData() {
    this.displayedColumns = this.routeIdListColumn;
    this.columnValues = this.columnNames;
    this.columnValues.push(ColumnDef.Actions);
    this.getContentData();
  }

  getContentData() {
    const currentFilter = this.dataSource.filter;

    this.dataSource.data = this.routeIdListData;
    this.customPagination.total = this.routeIdListData.length.toString();
    this.dataSource.sort = this.sort;
    this.customPagination.total = this.routeIdListData.length.toString();

    if (currentFilter) {
      this.dataSource.filter = currentFilter;
    }
  }

  searchColumn() {
    this.isAutoRefreshEnabled = false;
    if (
      this.columnSearch.searchColumn &&
      this.columnSearch.searchColumn.colDef === ""
    ) {
      // Corrected comparison: compare the colDef string
      this.isSearchColumn = false;
      this.getContentData();
    } else {
      this.isSearchColumn = true;
    }

    this.searchAutocompleteList = [];
    if (this.columnSearch.searchValue) {
      this.columnSearch.searchValue = "";
      this.getContentData();
    }
  }

  closeAutoMenu() {
    this.autocompleteInventory.closePanel();
  }

  onSelectionChange(selectedValue: string): void {
    if (selectedValue) {
      this.searchColumn();
      this.reset();
      this.columnSearch.searchColumn.colDef = selectedValue;
      this.columnSearch.searchValue = "";
    }
  }

  onSearchKeyUp(Value: string): void {
    // If user cleared input (e.g., with backspace), reset filter and refresh
    if (Value.trim() === "") {
      this.isAutoRefreshEnabled = true;
      this.resetPagination();
      this.reset();
      this.fetchConsolidationTableData(this.zone); // Refresh without filter
    }
  }

  onContextMenu(
    event: MouseEvent,
    SelectedItem: string | number | boolean | null | undefined,
    FilterColumnName?: string,
    FilterConditon?: string,
    FilterItemType?: string
  ): void {
    event.preventDefault();
    this.isActiveTrigger = true;
    setTimeout(() => {
      this.contextMenuService.updateContextMenuState(
        event,
        SelectedItem,
        FilterColumnName,
        FilterConditon,
        FilterItemType
      );
    }, 100);
  }

  filterString: string = UniqueConstants.OneEqualsOne;

  optionSelected(filter: string) {
    this.filterString = filter;
    this.getContentData();
    this.isActiveTrigger = false;
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? "auto";
  }

  get hasValidColumns(): boolean {
    return !!this.columnValues?.length && !!this.displayedColumns?.length;
  }

  async fetchConsolidationTableData(selectedZone: string) {
    try {
      const response =
        await this.iConsolidationApi.GetSelectedConZoneConHeadersData(
          selectedZone,
          this.params
        );
      const fullItems = response?.body;
      const paginationHeader = response.headers.get("X-Pagination");
      const pagination = JSON.parse(paginationHeader);
      this.customPagination.total = pagination.TotalCount.toString();

      if (Array.isArray(fullItems)) {
        const resources = fullItems.map((x) => x.resource);
        this.processConsolidationData(resources);
      }
    } catch {
      this.global.ShowToastr(
        ToasterType.Error,
        ToasterMessages.ConheaderData,
        ToasterTitle.Error
      );
    }
  }

  // Format and emit route ID list data
  processConsolidationData(data: IConHeaderResponse["resource"][]): void {
    const newData = data.map((item) => ({
      RouteID: item.routeID,
      StatusDate: item.statusDate
      ? this.global.getFormattedDate(new Date(item.statusDate)): "",
      rawStatusDate: item.statusDate,
      ConsolidationStatus: item.consolidationStatus ?? "",
      RouteIDStatus: item.routeIdStatus ?? "",
      ConsolidationProgress: item.consolidationProgress ?? "-",
    }));

    let dataChanged =
      !Array.isArray(this.routeIdListData) ||
      JSON.stringify(this.routeIdListData) !== JSON.stringify(newData);
    this.routeIdListData = newData;

    const previousColumn = this.columnSearch.searchColumn?.colDef;
    const previousValue = this.columnSearch.searchValue;
    // Add the conditional property directly in the dataSource
    this.routeIdListData.forEach((item: RouteIDItem) => {
      item.showRequestReleaseButton = item.RouteIDStatus === RouteIdManagement.RouteIdStatus;
    });

    // Refresh the dataSource with new data
    this.dataSource = new MatTableDataSource(this.routeIdListData);

    // Set custom filter predicate for column-based filtering
    this.dataSource.filterPredicate = (data: RouteIDItem, filter: string) => {
      const filterObj = JSON.parse(filter); // Convert filter string back to object
      const columnValue =
        data[filterObj.column]?.toString().toLowerCase() || "";
      return columnValue.includes(filterObj.value.toLowerCase());
    };

    // Reapply pagination and sorting
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }

    // Reapply filter if it was set before
    // Keep current search state without triggering another fetch
    this.columnSearch.searchColumn.colDef = previousColumn;
    this.columnSearch.searchValue = previousValue;

    // Mark for check to trigger change detection
    this.cdr.markForCheck();
  }

  getConsolidationStatusClass(
    col: { colHeader: string; colDef: string },
    element: RouteIDItem
  ): string {
    if (col.colDef !== this.consolidationStatus) {
      return '';
    }
  
    const rawStatus = element[col.colHeader]?.toLowerCase().trim();
  
    const statusClassMap: { [key: string]: string } = {
      initialized: 'label-blue2',
      'induction started': 'label-yellow',
      'consolidation complete': 'label-green'
    };
  
    const statusClass = statusClassMap[rawStatus ?? ''];
    return statusClass ? `br-14 label px-3 f-16 ${statusClass}` : '';
  }
  

  edit(event: RouteIDItem) {
    const dialogRef = this.global.OpenDialog(
      RouteManagementDetailViewComponent,
      {
        height: DialogConstants.auto,
        width: "640px",
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          detailData: event,
          fieldName: this.fieldNames,
        },
      }
    );
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((result) => {
        this.getContentData();
        this.fetchConsolidationTableData(this.zone);
      });
  }

  RequestRelease(event: RouteIDItem) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "560px",
      data: {
        heading: "",
        message: "Are you sure you want to Request Release",
        customButtonText: true,
        btn1Text: "Yes",
        btn2Text: "No",
      },
    });

    dialogRef.afterClosed().subscribe(async (resp) => {
      if (resp == "Yes") {
        // Get the first column dynamically
        const firstColumnKey = Object.keys(event)[0]; // Get the first column name
        const conHeaderID = event[firstColumnKey]; // Get its value

        const payload = {
          ConHeaderID: conHeaderID,
          ReleaseStatus: { Key: "Release Requested" },
        };

        try {
          const response =
            await this.consolidationApiService.ConHeadersRequestRelease(
              conHeaderID
            );

          if (response.status === 200) {
            this.global.ShowToastr(
              ToasterType.Success,
              ToasterMessages.RequestReleaseSuccess,
              ToasterTitle.Success
            );
          }
        } catch (error) {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.RequestReleaseFailed,
            ToasterTitle.Error
          );
        }
      }

      this.getContentData(); // Refresh data in both cases
    });
  }

  announceSortChange(e: Sort) {
    this.resetPagination();
    this.params.sortColumn = e.active;
    this.params.sortOrder = e.direction;

    this.fetchConsolidationTableData(this.zone);
  }

  searchData() {
    this.isAutoRefreshEnabled = false;

    const searchParams = this.extractSearchParams();
    if (!searchParams) return;

    this.resetPagination();

    this.params.searchColumn = searchParams.columnKey;
    this.params.searchValue = searchParams.searchValue;
    this.params.page = 1;

    this.fetchConsolidationTableData(this.zone);
  }

  private extractSearchParams(): { columnKey: string; searchValue: string } | null {
  const { searchColumn, searchValue } = this.columnSearch;

  if (!searchColumn?.colDef || !searchValue?.trim()) {
    return null;
  }

  const columnKey = this.columnMap[searchColumn.colDef];
  if (!columnKey) {
    return null;
  }

  let trimmedValue = searchValue.trim();

  if (columnKey === "StatusDate") {
    const formatted = this.global.formatDateToYyyyMmDd(trimmedValue);
    if (!formatted) {
      return null;
    }
    trimmedValue = formatted;
  }

  return { columnKey, searchValue: trimmedValue };
}


  handlePageEvent(e: PageEvent): void {
    this.pageEvent = e;

    this.params = {
      ...this.params, // preserve existing search/sort params
      page: e.pageIndex + 1,
      pageSize: e.pageSize,
    };

    // Track visible record range (for UI display)
    this.customPagination = {
      total: this.customPagination.total, // keep total as-is
      recordsPerPage: e.pageSize,
      startIndex: e.pageIndex * e.pageSize + 1,
      endIndex: Math.min(
        (e.pageIndex + 1) * e.pageSize,
        parseInt(this.customPagination.total || "0")
      ),
    };

    this.fetchConsolidationTableData(this.zone);
  }

  resetPagination() {
    this.params.page = 1;
    this.params.pageSize = 10;
    this.customPagination.startIndex = 0;
    this.customPagination.endIndex = 10;
    this.paginator.pageIndex = 0;
  }

  reset() {
    this.resetPagination();
    this.columnSearch.searchValue = "";
    this.columnSearch.searchColumn = { colHeader: "", colDef: "" };
    this.dataSource.filter = "";
    this.params.searchColumn = "";
    this.params.searchValue = "";
    this.params.page = 1;
    // Immediately fetch unfiltered data
    this.fetchConsolidationTableData(this.zone);
  }

   
  

  ngOnDestroy(): void {
    this.onDestroy$.next(true);
    this.onDestroy$.complete();
    this.refreshService.stop(); // clean up interval
  }
}
