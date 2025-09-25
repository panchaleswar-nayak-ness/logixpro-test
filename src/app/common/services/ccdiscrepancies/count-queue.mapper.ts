import { Injectable } from '@angular/core';
import { CompareItem } from '../../interface/ccdiscrepancies/CompareItem';
import { SelectedCountQueue } from '../../interface/admin/ISelectedCountQueue';

/**
 * Mapper service for transforming Count Queue API data to domain models.
 * Provides pure, testable transformation functions.
 */
@Injectable({
  providedIn: 'root'
})
export class CountQueueMapper {

  /**
   * Maps a single CompareItem to SelectedCountQueue domain model.
   * @param item - The CompareItem from API response
   * @returns The mapped domain model
   */
  mapToSelectedCountQueue(item: CompareItem): SelectedCountQueue {
    return {
      id: item.id,
      itemNumber: item.itemNumber,
      qtyLocation: item.quantityDifference,
      warehouse: item.warehouse,
      lotNo: item.lotNumber,
      expirationDate: item.expirationDate,
      serialNo: item.serialNumber
    };
  }

  /**
   * Maps an array of CompareItem to SelectedCountQueue domain models.
   * @param items - Array of CompareItems from API response
   * @returns Array of mapped domain models
   */
  mapToSelectedCountQueueArray(items: CompareItem[]): SelectedCountQueue[] {
    return items.map(item => this.mapToSelectedCountQueue(item));
  }
}
