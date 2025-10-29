import { Component, Input } from '@angular/core';
import { BulkTransactionType } from 'src/app/common/constants/bulk-process/bulk-transactions';
import { OrderBatchToteQtyResponse } from 'src/app/common/Model/bulk-transactions';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent {
  @Input() status: OrderBatchToteQtyResponse = new OrderBatchToteQtyResponse();
  @Input() isQuickPick: boolean;
  @Input() isEmergencyPick: boolean;
  @Input() bulkTransactionType: string;
  BulkTransactionType = BulkTransactionType;

  constructor() { }

  // Validation function to determine if Batches count should be shown
  shouldShowBatchesCount(): boolean {
    // Show Batches count when:
    // 1. NOT in Pick mode (other transaction types always show)
    // 2. OR Quick Pick is disabled (normal pick mode shows all counts)
    // 3. OR Emergency Pick is enabled (emergency overrides quick pick and shows all counts)
    return this.bulkTransactionType !== BulkTransactionType.PICK || !this.isQuickPick || this.isEmergencyPick;
  }

  // Validation function to determine if Totes count should be shown
  shouldShowTotesCount(): boolean {
    // Show Totes count when:
    // 1. NOT in Pick mode (other transaction types always show)
    // 2. OR Quick Pick is disabled (normal pick mode shows all counts)
    // 3. OR Emergency Pick is enabled (emergency overrides quick pick and shows all counts)
    return this.bulkTransactionType !== BulkTransactionType.PICK || !this.isQuickPick || this.isEmergencyPick;
  }

}
