import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SelectedDiscrepancy } from '../../common/interface/admin/ISelectedDiscrepancies';
import { SelectedCountQueue } from '../../common/interface/admin/ISelectedCountQueue';
import { CompareItem } from '../../common/interface/ccdiscrepancies/CompareItem';
import { PagingRequest } from '../../common/interface/ccdiscrepancies/PagingRequest';
import { ApiResult } from '../../common/types/CommonTypes';
import { CCDiscrepanciesApiService } from '../../common/services/ccdiscrepancies/ccdiscrepancies-api.service';

@Injectable({
  providedIn: 'root'
})
export class CycleCountDataService {
  private discrepanciesSource = new BehaviorSubject<SelectedDiscrepancy[]>([]);
  private countQueueSource = new BehaviorSubject<SelectedCountQueue[]>([]);

  discrepancies$ = this.discrepanciesSource.asObservable();
  countQueue$ = this.countQueueSource.asObservable();

  constructor(private ccDiscrepanciesApiService: CCDiscrepanciesApiService) {}

  // Get compared inventory items from API
  async getComparedInventoryItems(pagingRequest: PagingRequest): Promise<ApiResult<CompareItem[]>> {
    return await this.ccDiscrepanciesApiService.getComparedInventoryItems(pagingRequest);
  }

  // Update discrepancies data
  updateDiscrepancies(data: SelectedDiscrepancy[]) {
    this.discrepanciesSource.next(data);
  }

  // Update count queue data
  updateCountQueue(data: SelectedCountQueue[]) {
    this.countQueueSource.next(data);
  }

  // Move a single discrepancy to count queue
  moveToQueue(discrepancy: SelectedDiscrepancy) {
    // Remove from discrepancies
    const currentDiscrepancies = this.discrepanciesSource.value;
    const updatedDiscrepancies = currentDiscrepancies.filter(d => d.id !== discrepancy.id);
    this.updateDiscrepancies(updatedDiscrepancies);

    // Add to count queue
    const countQueueItem: SelectedCountQueue = {
      id: discrepancy.id,
      itemNumber: discrepancy.itemNumber,
      qtyLocation: Math.abs(discrepancy.qtyDifference), // Convert difference to positive quantity
      warehouse: discrepancy.warehouse,
      lotNo: discrepancy.lotNo,
      expirationDate: discrepancy.expirationDate,
      serialNo: discrepancy.serialNo
    };

    const currentQueue = this.countQueueSource.value;
    this.updateCountQueue([...currentQueue, countQueueItem]);
  }

  // Move all discrepancies to count queue
  moveAllToQueue() {
    const currentDiscrepancies = this.discrepanciesSource.value;
    const currentQueue = this.countQueueSource.value;

    // Convert all discrepancies to count queue items
    const newQueueItems: SelectedCountQueue[] = currentDiscrepancies.map(discrepancy => ({
      id: discrepancy.id,
      itemNumber: discrepancy.itemNumber,
      qtyLocation: Math.abs(discrepancy.qtyDifference),
      warehouse: discrepancy.warehouse,
      lotNo: discrepancy.lotNo,
      expirationDate: discrepancy.expirationDate,
      serialNo: discrepancy.serialNo
    }));

    // Update both sources
    this.updateDiscrepancies([]);
    this.updateCountQueue([...currentQueue, ...newQueueItems]);
  }

  // Helper method to convert queue item to discrepancy item
  private convertQueueItemToDiscrepancy(queueItem: SelectedCountQueue): SelectedDiscrepancy {
    return {
      id: queueItem.id,
      itemNumber: queueItem.itemNumber,
      qtyDifference: queueItem.qtyLocation, // Using the positive value as the difference
      warehouse: queueItem.warehouse,
      lotNo: queueItem.lotNo,
      expirationDate: queueItem.expirationDate,
      serialNo: queueItem.serialNo
    };
  }

  // Move a queue item back to discrepancies
  moveBackToDiscrepancies(queueItem: SelectedCountQueue) {
    // Remove from queue
    const currentQueue = this.countQueueSource.value;
    const updatedQueue = currentQueue.filter(q => q.id !== queueItem.id);
    this.updateCountQueue(updatedQueue);

    // Add to discrepancies
    const discrepancyItem = this.convertQueueItemToDiscrepancy(queueItem);
    const currentDiscrepancies = this.discrepanciesSource.value || [];
    this.updateDiscrepancies([...currentDiscrepancies, discrepancyItem]);
  }

  // Move all queue items back to discrepancies
  moveAllBackToDiscrepancies() {
    const currentQueue = this.countQueueSource.value;
    const currentDiscrepancies = this.discrepanciesSource.value || [];

    // Convert all queue items to discrepancies using the helper method
    const newDiscrepancies: SelectedDiscrepancy[] = currentQueue.map(queueItem => 
      this.convertQueueItemToDiscrepancy(queueItem)
    );

    // Update both sources
    this.updateCountQueue([]);
    this.updateDiscrepancies([...currentDiscrepancies, ...newDiscrepancies]);
  }
}
