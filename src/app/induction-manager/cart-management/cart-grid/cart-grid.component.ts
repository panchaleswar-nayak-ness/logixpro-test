import { Component, Input, Output, EventEmitter, ViewChild, OnInit, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialogRef } from '@angular/material/dialog';
import { CartItem, PaginationConfig } from '../models/cart-management-models';
import { GlobalService } from 'src/app/common/services/global.service';
import { BuildNewCartComponent } from '../dialogs/build-new-cart/build-new-cart.component';
import { CartListRequest, CartManagementData, CartManagementResult, ViewDetailsResponse } from '../interfaces/cart-management.interface';
import { CartManagementApiService } from 'src/app/common/services/cart-management-api/cart-management-api.service';
import { ToasterType, ToasterTitle, Style, DialogConstants, StringConditions } from 'src/app/common/constants/strings.constants';
import { CartManagementGridDefaults } from 'src/app/common/constants/numbers.constants';
import { CartStatus, CartStatusClassMap, CartDialogConstants, CartManagementDialogConstants, DialogModes, BuildNewCartActionResults } from '../constants/string.constants';
import { UniqueConstants, ResponseStrings } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-cart-grid',
  templateUrl: './cart-grid.component.html',
  styleUrls: ['./cart-grid.component.scss']
})
export class CartGridComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private global: GlobalService,
    private cartApiService: CartManagementApiService
  ) {}

  @Input() searchTerm: string = '';
  @Input() selectedColumn: string = 'cartId';
  @Input() selectedStatus: string = CartStatus.All;
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

  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() viewDetails = new EventEmitter<CartItem>();
  @Output() editCart = new EventEmitter<CartItem>();
  @Output() deleteCart = new EventEmitter<CartItem>();
  @Output() dataLoaded = new EventEmitter<void>();

  ngOnInit(): void {
    // Initialize the data source
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
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
      SearchValue: this.searchTerm,
      SearchColumn: this.selectedColumn,
      SelectedPage: this.customPagination.pageIndex + 1,
      PageSize: this.customPagination.pageSize,
      SortBy: this.sortBy,
      SortDirection: this.sortDirection
    };
  
    this.cartApiService.getCarts(request).subscribe({
      next: (response) => {
        const mappedData = response.value.map(cart => ({
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
}
