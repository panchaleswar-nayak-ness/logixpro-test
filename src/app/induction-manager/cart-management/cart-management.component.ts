import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from 'src/app/common/services/global.service';
import { BuildNewCartComponent } from './dialogs/build-new-cart/build-new-cart.component';
import { CartManagementData, CartManagementResult, CartStatusSummary } from './interfaces/cart-management.interface';
import { CartManagementApiService } from 'src/app/common/services/cart-management-api/cart-management-api.service';
import { Subscription } from 'rxjs';
import { CartGridComponent } from './cart-grid/cart-grid.component';
import { CartGridConfig } from './models/cart-management-models';
import { CartStatus, CartStatusClassMap, CartStatusTooltipText } from './constants/string.constants';
import { DialogConstants, Style } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-cart-management',
  templateUrl: './cart-management.component.html',
  styleUrls: ['./cart-management.component.scss']
})
export class CartManagementComponent implements OnInit, OnDestroy {
  @ViewChild(CartGridComponent) cartGrid!: CartGridComponent;

  // Hard-coded for now (can come from API later)
  grid4x3: CartGridConfig = { cols: 4, rows: 3 };
  grid1x3: CartGridConfig = { cols: 1, rows: 3 };
  grid3x3: CartGridConfig = { cols: 3, rows: 3 };

  // Current selection
  currentGrid: CartGridConfig = this.grid4x3;

  // Search and filter properties
  searchTerm: string = '';
  selectedColumn: string = 'cartID';
  selectedStatus: string = CartStatus.All;

  // Status summary
  statusSummary: CartStatusSummary = {
    inducting: 0,
    inducted: 0,
    inProgress: 0,
    available: 0
  };


  readonly statusTooltipText = CartStatusTooltipText;

  private subscriptions = new Subscription();

  constructor(
    private global: GlobalService,
    private cartApiService: CartManagementApiService
  ) { }

  ngOnInit(): void {
    this.loadStatusSummary();

  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadStatusSummary(): void {
    this.cartApiService.getCartStatusSummary().subscribe({
      next: (summary) => {
        this.statusSummary = summary;
      },
      error: (error) => {
        console.error('Error loading status summary:', error);
        // Error loading status summary
      }
    });
  }


  onCartDataLoaded(): void {
    // Refresh status summary when cart data is loaded
    this.loadStatusSummary();
  }

  onBuildNewCart(): void {
    const dialogData: CartManagementData = { mode: 'create', rows: this.currentGrid.rows, cols: this.currentGrid.cols };

    const dialogRef = this.global.OpenDialog(BuildNewCartComponent, {
      data: dialogData,
      width: Style.w560px,
      height: DialogConstants.auto,
      disableClose: true
    }) as MatDialogRef<BuildNewCartComponent>;

    // Subscribe to cart draft creation (when cart ID is entered)
    dialogRef.componentInstance!.cartDraftCreated.subscribe((cart) => {
      // Refresh the grid to show the newly created cart draft
      this.refreshGrid();
    });

    // Subscribe to cart deletion (when user cancels cart creation)
    dialogRef.componentInstance!.cartDeleted.subscribe((cartId) => {
      // Refresh the grid to remove the deleted cart
      this.refreshGrid();
    });

    // Subscribe to cart updates (when cart is updated)
    dialogRef.componentInstance!.cartUpdated.subscribe((result) => {
      // Refresh the grid to show the updated cart
      this.refreshGrid();
    });

    // Subscribe to real-time tote quantity changes
    dialogRef.componentInstance!.toteQuantityChanged.subscribe((change) => {
      // Update the specific cart's quantity in the grid without full refresh
      this.updateCartQuantityInGrid(change.cartId, change.quantity);
    });

    dialogRef.afterClosed().subscribe((result: CartManagementResult) => {
      if (result && (result.action === 'create' || result.action === 'update')) {
        // Refresh the grid to show the new/updated cart
        this.refreshGrid();
      }
    });
  }

  private refreshGrid(): void {
    // Refresh the grid component directly
    if (this.cartGrid) {
      this.cartGrid.refresh();
    }
    // Also refresh the status summary when grid data changes
    this.loadStatusSummary();
  }

  // Public wrapper for template event
  onCartValidated(): void {
    this.refreshGrid();
  }

  private updateCartQuantityInGrid(cartId: string, quantity: number): void {
    // Update the specific cart's quantity in the grid without full refresh
    if (this.cartGrid) {
      this.cartGrid.updateCartQuantity(cartId, quantity);
    }
  }

  getStatusClass(status: string): string {
    return CartStatusClassMap[status] || '';
  }

}
