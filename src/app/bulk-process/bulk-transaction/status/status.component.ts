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
  @Input() bulkTransactionType: string;
  BulkTransactionType = BulkTransactionType;

  constructor() { }

}
