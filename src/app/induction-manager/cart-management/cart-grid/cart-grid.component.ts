import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { CartItem, PaginationConfig } from '../models/cart-management-models';
import { GlobalService } from 'src/app/common/services/global.service';
import { BuildNewCartComponent } from '../dialogs/build-new-cart/build-new-cart.component';
import { AddNewCartComponent } from '../add-new-cart/add-new-cart.component';
import { CartListRequest, CartManagementData, CartManagementResult, ViewDetailsResponse, DeleteCartResponse } from '../interfaces/cart-management.interface';
import { CartManagementApiService } from 'src/app/common/services/cart-management-api/cart-management-api.service';
import { ToasterType, ToasterTitle, ToasterMessages, Style, DialogConstants, StringConditions, Mode, ConfirmationMessages, AccessLevel } from 'src/app/common/constants/strings.constants';
import { CartManagementPermissions } from 'src/app/common/constants/cart-management/cart-management-constant';
import { CartManagementGridDefaults } from 'src/app/common/constants/numbers.constants';
import { CartStatus, CartStatusClassMap, CartDialogConstants, CartManagementDialogConstants, DialogModes, BuildNewCartActionResults } from '../constants/string.constants';
import { UniqueConstants, ResponseStrings, PermissionMessages } from 'src/app/common/constants/strings.constants';
import { NgZone } from '@angular/core';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { FilterationColumns } from 'src/app/common/Model/pick-Tote-Manager';
import { AllDataTypeValues } from 'src/app/common/types/pick-tote-manager.types';
import { AuthService } from 'src/app/common/init/auth.service';
import { UserSession } from 'src/app/common/types/CommonTypes';
import { TableHeaderDefinitions } from 'src/app/common/types/CommonTypes';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DirectFilterationColumnsService } from 'src/app/common/services/direct-filteration-columns.service';

@Component({
  selector: 'app-cart-grid',
  templateUrl: './cart-grid.component.html',
  styleUrls: ['./cart-grid.component.scss']
})
export class CartGridComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private global: GlobalService,
    private cartApiService: CartManagementApiService,
    private ngZone: NgZone,
    private contextMenuService: TableContextMenuService,
    public authService: AuthService,
    private directFilterService: DirectFilterationColumnsService
  ) {}

  @Input() searchTerm: string = '';
  @Input() selectedColumn: string = 'Cart ID';
  @Input() selectedStatus: string = CartStatus.All;
  
  // Internal property to track the actual API column name
  private apiColumnName: string = 'cartId';
  sortBy: string = 'CartID';
  sortDirection: string = 'asc';
  
  dataSource: MatTableDataSource<CartItem> = new MatTableDataSource<CartItem>([]);
  displayedColumns: string[] = ['cartId', 'cartStatus', 'statusDate', 'toteQty', 'location', 'actions'];
  customPagination: PaginationConfig = {
    total: 0,
    pageSize: CartManagementGridDefaults.DefaultPageSize,
    pageIndex: CartManagementGridDefaults.DefaultPageIndex,
  };
  isLoading: boolean = false;
  hasError: boolean = false;

  // Track selected record for highlighting
  selectedRecord: CartItem | null = null;

  // Context menu properties
  isActiveTrigger: boolean = false;

  // Filters array - updated reactively from service (single source of truth)
  filterationColumns: FilterationColumns[] = [];
  private filtersSubscription: Subscription;

  // Column display mapping for filter chips
  // Maps both API column names and service-transformed column names to user-friendly display names
  readonly columnDisplayMap: Record<string, string> = {
    // Mapped column names (from mapFilterColumn - service transforms these)
    'SortBar.SortBar1': 'Cart ID',
    'SortBar.Status': 'Status',
    'SortBar.StatusDate': 'Status Date/Time',
    'ToteQty': 'Tote Quantity',
    'SortBar.SortBarLocation': 'Location',
    // Direct column names (from tableColumns)
    'cartId': 'Cart ID',
    'cartStatus': 'Status',
    'statusDate': 'Status Date/Time',
    'toteQty': 'Tote Quantity',
    'location': 'Location'
  };

  // User access properties
  userData: UserSession;
  public readonly permissionMessages = PermissionMessages;
  public readonly permissions = CartManagementPermissions;

  // Column definitions - used for both search dropdown and display names
  readonly columns = {
    cartId: { colHeader: 'cartId', colTitle: 'Cart ID', colDef: 'Cart ID' },
    cartStatus: { colHeader: 'cartStatus', colTitle: 'Status', colDef: 'Status' },
    toteQty: { colHeader: 'toteQty', colTitle: 'Tote Quantity', colDef: 'Tote Quantity' },
    location: { colHeader: 'location', colTitle: 'Location', colDef: 'Location' }
  };

  // Column filter properties (array format for search dropdown)
  tableColumns: TableHeaderDefinitions[] = [
    this.columns.cartId,
    this.columns.cartStatus,
    this.columns.toteQty,
    this.columns.location
  ];
  searchAutocompleteList: string[] = [];
  searchByInput = new Subject<string>();
  private searchSubscription: Subscription;
  isLoadingSuggestions: boolean = false;

  // Centralized column mapping for consistent usage
  private readonly columnMapping = {
    'Cart ID': 'cartId',
    'Status': 'cartStatus',
    'Tote Quantity': 'toteQty',
    'Location': 'location'
  } as const;

  // Property mapping for dynamic cart property access
  private readonly cartPropertyMap = {
    cartId: 'cartID',
    cartStatus: 'cartStatus',
    location: 'location',
    toteQty: 'totesQty'
  } as const;

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() viewDetails = new EventEmitter<CartItem>();
  @Output() editCart = new EventEmitter<CartItem>();
  @Output() deleteCart = new EventEmitter<CartItem>();
  @Output() dataLoaded = new EventEmitter<void>();

  ngOnInit(): void {
    
    // Initialize user data
    this.userData = this.authService.userData();
    
    // Subscribe to filters from service (single source of truth)
    // Component updates reactively only when filters actually change
    this.filtersSubscription = this.directFilterService.getFilterationColumns$().subscribe(
      filters => {
        this.filterationColumns = filters;
      }
    );
    
    // Initialize the data source
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
    
    // Initialize API column name mapping
    this.initializeColumnMapping();
    
    // Initialize search subscription for autocomplete
    this.searchSubscription = this.searchByInput
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(searchTerm => {
        this.loadAutocompleteSuggestions(searchTerm);
      });
    
    this.loadCarts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Reload carts when search inputs change
    if (changes['searchTerm'] || changes['selectedColumn'] || changes['selectedStatus']) {
      this.customPagination.pageIndex = CartManagementGridDefaults.DefaultPageIndex; // Reset to first page
      this.loadCarts();
    }
  }

  ngAfterViewInit(): void {
    // Set up sorting and pagination after view is initialized
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
    
    // Force table refresh to ensure data is displayed
    if (this.dataSource && this.dataSource.data.length > 0) {
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.filtersSubscription) {
      this.filtersSubscription.unsubscribe();
    }
    this.searchByInput.complete();
  }

  // Initialize column mapping based on the current selectedColumn
  private initializeColumnMapping(): void {
    this.apiColumnName = this.columnMapping[this.selectedColumn] || 'cartId';
  }

  getStatusClass(status: string): string {
    return CartStatusClassMap[status] || '';
  }

  // Status constants to avoid hard-coded values
  readonly STATUS_INDUCTED = CartStatus.Inducting;
  readonly STATUS_IN_QUEUE = CartStatus.Inducted;
  readonly STATUS_IN_PROGRESS = CartStatus.InProgress;
  readonly STATUS_COMPLETE = CartStatus.Available;
  readonly LOCATION_IN_TRANSIT = 'In Transit';

  onPageChange(event: PageEvent): void {
    this.customPagination.pageIndex = event.pageIndex;
    this.customPagination.pageSize = event.pageSize;
    this.loadCarts();
  }

  loadCarts(): void {
    this.isLoading = true;
    this.hasError = false;
    
    const request: CartListRequest = {
      Search: {
        Value: this.searchTerm,
        Column: this.apiColumnName
      },
      sort: {
        Direction: this.sortDirection,
        Column: this.sortBy
      },
      SelectedPage: this.customPagination.pageIndex + 1,
      PageSize: this.customPagination.pageSize,
      Filters: this.filterationColumns
    };

  
    this.cartApiService.getCarts(request).subscribe({
      next: (response) => {
        const mappedData: CartItem[] = response.value.map(cart => ({
          cartId: cart.cartID, // Map cartID to cartId for component compatibility
          cartStatus: cart.cartStatus, // Map cartStatus to status for component compatibility
          statusDate: cart.cartStatusDate, // Map cartStatusDate to inductedDateTime for component compatibility
          toteQty: cart.totesQty, // Map totesQty to toteQuantity for component compatibility
          location: cart.location
        }));
        
        this.dataSource.data = mappedData;
  
        this.customPagination.total = response.pagingInfo.totalCount ?? 0;
        this.customPagination.pageIndex = response.pagingInfo.page - 1; // Convert to 0-based index
        this.customPagination.pageSize = request.PageSize || CartManagementDialogConstants.DEFAULT_PAGE_SIZE;
        this.isLoading = false;
        
        // Force table refresh
        this.dataSource.data = [...this.dataSource.data];
        
        // Emit event to notify parent that data has been loaded
        this.dataLoaded.emit();
      },
      error: (error) => {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        this.isLoading = false;
        this.hasError = true;
      }
    });
  }

  announceSortChange(sort: Sort): void {
    this.sortBy = sort.active;
    this.sortDirection = sort.direction;
    this.loadCarts();
  }

  async onViewDetails(record: CartItem): Promise<void> {
    try {
      const viewDetails: ViewDetailsResponse = await this.cartApiService.getCartById(record.cartId);
      
      // Check if cart data is valid
      if (!viewDetails) {
        throw new Error('No cart data received from server');
      }
      
      if (!viewDetails.cartId) {
        throw new Error('Cart ID is missing from server response');
      }
      
      // Check if dimensions are valid
      if (!viewDetails.cartColumns || !viewDetails.cartRows) {
        throw new Error('Invalid cart dimensions received from server');
      }
      
      const cols = viewDetails.cartColumns;
      const rows = viewDetails.cartRows;
      
      if (cols <= 0 || rows <= 0) {
        throw new Error('Invalid cart dimensions values');
      }
      
      // Convert totePositions to assignments format
      const assignments: Record<number, {toteId: string, status?: string}> = {};
      if (viewDetails.totePositions && Array.isArray(viewDetails.totePositions)) {
        viewDetails.totePositions.forEach(tote => {
          const position = (tote.rowNumber - 1) * viewDetails.cartColumns + tote.columnNumber;
          if (tote.toteId) {
            assignments[position] = {
              toteId: tote.toteId,
              status: tote.status
            };
          }
        });
      }
      
      const dialogData: CartManagementData = {
        mode: DialogModes.VIEW,
        cartId: viewDetails.cartId,
        existingAssignments: assignments,
        rows: rows,
        cols: cols
      };

      const dialogRef = this.global.OpenDialog(BuildNewCartComponent, {
        data: dialogData,
        width: Style.w560px,
        height: DialogConstants.auto,
        disableClose: false
      });

      dialogRef.afterClosed().subscribe((result: CartManagementResult) => {
        if (result && result.action === BuildNewCartActionResults.CLOSE) {
          // View details closed
        }
      });
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg() || 'Failed to load cart details', ToasterTitle.Error);
    }
  }


  async onEditCart(record: CartItem): Promise<void> {
    try {
      const viewDetails: ViewDetailsResponse = await this.cartApiService.getCartById(record.cartId);
      
      // Check if cart data is valid
      if (!viewDetails || !viewDetails.cartId) {
        throw new Error('Invalid cart data received from server');
      }
      
      // Check if dimensions are valid
      if (!viewDetails.cartColumns || !viewDetails.cartRows) {
        throw new Error('Invalid cart dimensions received from server');
      }
      
      const cols = viewDetails.cartColumns;
      const rows = viewDetails.cartRows;
      
      if (cols <= 0 || rows <= 0) {
        throw new Error('Invalid cart dimensions values');
      }
      
      // Convert totePositions to assignments format
      const assignments: Record<number, {toteId: string, status?: string}> = {};
      if (viewDetails.totePositions && Array.isArray(viewDetails.totePositions)) {
        viewDetails.totePositions.forEach(tote => {
          const position = (tote.rowNumber - 1) * viewDetails.cartColumns + tote.columnNumber;
          if (tote.toteId) {
            assignments[position] = {
              toteId: tote.toteId,
              status: tote.status
            };
          }
        });
      }
      
      const dialogData: CartManagementData = {
        mode: DialogModes.EDIT,
        cartId: viewDetails.cartId,
        existingAssignments: assignments,
        rows: rows,
        cols: cols
      };

      const dialogRef = this.global.OpenDialog(BuildNewCartComponent, {
        data: dialogData,
        width: Style.w560px,
        height: DialogConstants.auto,
        disableClose: true
      }) as MatDialogRef<BuildNewCartComponent>;

      // Subscribe to cart updates (when cart is updated)
      dialogRef.componentInstance!.cartUpdated.subscribe((result) => {
        // Refresh the grid to show the updated cart
        this.loadCarts();
      });

      // Subscribe to real-time tote quantity changes
      dialogRef.componentInstance!.toteQuantityChanged.subscribe((change) => {
        // Update the specific cart's quantity in the grid without full refresh
        this.updateCartQuantity(change.cartId, change.quantity);
      });

      dialogRef.afterClosed().subscribe((result: CartManagementResult) => {
        if (result && result.action === BuildNewCartActionResults.UPDATE) {
          this.editCart.emit(record); // Notify parent to refresh
        }
      });
    } catch (error) {
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg() || 'Failed to load cart details', ToasterTitle.Error);
    }
  }

  onDeleteCart(record: CartItem): void {
    const dialogData = {
      action: 'delete',
      actionMessage: ` cart "${record.cartId}"`,
      message: ConfirmationMessages.IrreversibleActionWarning,
      mode: Mode.DeleteCart,
      cartId: record.cartId
    };

    const dialogRef = this.global.OpenDialog(DeleteConfirmationComponent, {
      data: dialogData,
      width: Style.w480px,
      height: DialogConstants.auto,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((result: { isExecuted: boolean } | undefined) => {
      if (result && result.isExecuted) {
        // Just refresh the grid - API call handled in DeleteConfirmationComponent
        this.loadCarts();
      }
    });
  }

  
  // Column filter component event handlers
  onColumnSelectionChange(event: Event | string): void {
    // Extract the selected value from the event
    let selectedDisplayName: string;
    
    if (typeof event === 'string') {
      selectedDisplayName = event;
    } else {
      // Handle Event object - extract value from target
      const target = event.target as HTMLSelectElement;
      selectedDisplayName = target.value;
    }
    
    this.selectedColumn = selectedDisplayName; // Keep display name for UI
    this.apiColumnName = this.columnMapping[selectedDisplayName] || selectedDisplayName; // Store API name
    this.searchTerm = '';
    this.searchAutocompleteList = [];
    // Don't call loadCarts() here - let user search first
  }

  onSearchInput(searchTerm: string): void {
    this.searchTerm = searchTerm;
    // Only trigger autocomplete for meaningful search terms
    if (searchTerm) {
      this.searchByInput.next(searchTerm);
    } else {
      this.searchAutocompleteList = [];
    }
  }

  onOptionSelected(selectedValue: string): void {
    this.searchTerm = selectedValue;
    this.loadCarts();
  }

  onClearSearch(): void {
    this.searchTerm = '';
    this.selectedColumn = '';
    this.apiColumnName = '';
    this.searchAutocompleteList = [];
    this.loadCarts();
  }

  // Load autocomplete suggestions based on search term and selected column
  private loadAutocompleteSuggestions(searchTerm: string): void {
    if (!searchTerm || !this.apiColumnName) {
      this.searchAutocompleteList = [];
      return;
    }

    this.isLoadingSuggestions = true;

    // Create a request to get suggestions for the specific column
    const request: CartListRequest = {
      Search: {
        Value: searchTerm,
        Column: this.apiColumnName
      },
      sort: {
        Direction: 'asc',
        Column: this.apiColumnName
      },
      SelectedPage: 1,
      PageSize: 50, 
      Filters: []
    };

    this.cartApiService.getCarts(request).subscribe({
      next: (response) => {
        const suggestions: Set<string> = new Set<string>();
        const property: string = this.cartPropertyMap[this.apiColumnName];
        
        response.value.forEach(cart => {
          const value = cart[property]?.toString() || '';
          
          if (value && value.toLowerCase().includes(searchTerm.toLowerCase())) {
            suggestions.add(value);
          }
        });
        
        this.searchAutocompleteList = Array.from(suggestions).slice(0, 10);
        this.isLoadingSuggestions = false;
      },
      error: (error) => {
        this.handleAutocompleteError(error);
        this.isLoadingSuggestions = false;
      }
    });
  }

  onSearchChange(searchData: { searchTerm: string, column: string }): void {
    this.searchTerm = searchData.searchTerm;
    this.selectedColumn = searchData.column;
    this.loadCarts();
  }

  // Centralized error handling for autocomplete
  private handleAutocompleteError(error: Error | unknown): void {
    console.error('Error loading autocomplete suggestions:', error);
    this.searchAutocompleteList = [];
    // Could add user-friendly notification here if needed
  }

  onRowClick(record: CartItem): void {
    this.selectedRecord = record;
  }

  // Helper method to format tote quantity display
  formatToteQuantity(quantity: number | null): string {
    return quantity == null ? '-' : quantity.toString();
  }

  // Public method to refresh the grid data
  refresh(): void {
    this.loadCarts();
  }

  // Public method to update a specific cart's quantity in real-time
  updateCartQuantity(cartId: string, quantity: number): void {
    const cartIndex = this.dataSource.data.findIndex(cart => cart.cartId === cartId);
    if (cartIndex !== -1) {
      // Update the quantity in the data source
      this.dataSource.data[cartIndex].toteQty = quantity;
      
      // Trigger change detection by creating a new array reference
      this.dataSource.data = [...this.dataSource.data];
    }
  }

  // Context menu functionality
  onContextMenu(event: MouseEvent, selectedItem: AllDataTypeValues, filterColumnName?: string, filterCondition?: string | undefined, filterItemType?: AllDataTypeValues): void {
    event.preventDefault();
    this.isActiveTrigger = true;
    this.ngZone.run(() => {
      // Pass display name to context menu (don't map yet - mapping happens when creating filter)
      this.contextMenuService.updateContextMenuState(event, selectedItem, filterColumnName, filterCondition, filterItemType);
    });
  }

  // Handle filteration columns selection from context menu
  directFilterationColumnsSelected(filterationColumns: FilterationColumns[]): void {
    // Map display column names to API filter names before storing
    const mappedFilters = filterationColumns.map(filter => ({
      ...filter,
      ColumnName: this.mapFilterColumn(filter.ColumnName) || filter.ColumnName
    }));
    
    // Service will emit new value via BehaviorSubject, component will update reactively
    this.directFilterService.setFilters(mappedFilters);
    // Reset to first page when filter is applied (filtered data may have fewer pages)
    this.customPagination.pageIndex = CartManagementGridDefaults.DefaultPageIndex;
    this.loadCarts();
    this.isActiveTrigger = false;
  }
  private mapFilterColumn(filterColumnName?: string): string | undefined {
    if (!filterColumnName) return undefined;
    
    const columnMapping = {
      cartId: "SortBar.SortBar1",
      cartStatus: "SortBar.Status",
      statusDate: "SortBar.StatusDate",
      toteQty: "ToteQty",
      location: "SortBar.SortBarLocation"
    } as const;
    
    // If it's a display name, convert to property name first
    const propertyName = this.columnMapping[filterColumnName] || filterColumnName;
    
    // Then map property name to API filter name
    return columnMapping[propertyName] ?? filterColumnName;
  }

    onAddNewCart(): void {
    const dialogRef = this.global.OpenDialog(AddNewCartComponent, {
      // width: Style.w560px,
      // maxWidth: Style.w1080px,
      width: 'auto',
      minWidth: Style.w560px,
      height: DialogConstants.auto,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Handle the result from the Add New Cart dialog
        this.loadCarts();
      }
    });
  }

  // Check if current user is administrator
  isAdministrator(): boolean {
    return this.userData?.accessLevel?.toLowerCase() === AccessLevel.Administrator.toLowerCase();
  }

  // Check if user can delete a specific cart
  hasDeletePermission(): boolean {
    return this.authService.isAuthorized(CartManagementPermissions.DeleteCart);
  }

  canDeleteCart(record: CartItem): boolean {
    const hasDeletePermission = this.hasDeletePermission();
    if (!hasDeletePermission) {
      return false;
    }
    return this.isAdministrator() && record.cartStatus === 'Available';
  }
  isAddDisabled(): boolean {
    return !this.authService.isAuthorized(this.permissions.AddCart);
  }

  // Clears all applied filters
  onClearAllFilters(): void {
    // Service will emit new value via BehaviorSubject, component will update reactively
    this.directFilterService.resetFilters();
    this.customPagination.pageIndex = CartManagementGridDefaults.DefaultPageIndex;
    this.loadCarts();
  }

  // Removes a single filter
  onClearSingleFilter(filter: FilterationColumns): void {
    // Service will emit new value via BehaviorSubject, component will update reactively
    this.directFilterService.removeFilter(filter);
    this.customPagination.pageIndex = CartManagementGridDefaults.DefaultPageIndex;
    this.loadCarts();
  }
}
