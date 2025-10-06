import { Component, Input } from '@angular/core';
import { CartStatusTooltipText } from '../constants/string.constants';
import { CartStatusSummary } from '../interfaces/cart-management.interface';

@Component({
  selector: 'app-cart-status-summary',
  templateUrl: './cart-status-summary.component.html',
  styleUrls: ['./cart-status-summary.component.scss']
})
export class CartStatusSummaryComponent {
  @Input() statusSummary: CartStatusSummary = {
    inducting: 0,
    inducted: 0,
    inProgress: 0,
    available: 0
  };

  readonly statusTooltipText = CartStatusTooltipText;

  getStatusValue(key: keyof CartStatusSummary): string {
    return this.statusSummary?.[key]?.toString() ?? '0';
  }
}
