import { Injectable } from '@angular/core';
import { FilterationColumns } from '../../dialogs/pick-tote-manager/pick-tote-manager.component';

@Injectable({
  providedIn: 'root'
})
export class DirectFilterationColumnsService {
  private filterationColumns: FilterationColumns[] = [];

  constructor() { }

  /**
   * Creates a FilterationColumns object directly from context menu selection
   * @param selectedItem The selected item value
   * @param filterColumnName The column name to filter on
   * @param condition The condition text (e.g., "equals to", "is like")
   * @param type The type of the value
   * @returns The updated array of FilterationColumns objects
   */
  createFilterationColumn(selectedItem: any, filterColumnName: string, condition: string, type: string): FilterationColumns[] {
    if (condition === 'clear') {
      // Clear specific column filter
      this.clearColumnFilter(filterColumnName);
      return this.filterationColumns;
    }
    
    if (condition === 'clears') {
      // Clear all filters
      this.filterationColumns = [];
      return this.filterationColumns;
    }

    if (this.isNullOrEmpty(selectedItem) || !filterColumnName) {
      return this.filterationColumns;
    }
    
    // Determine column type based on the value type
    let columnType = this.determineColumnType(type, filterColumnName);
    
    // Determine grid operation based on condition
    const gridOperation = this.mapConditionToGridOperation(condition);
    
    // Format the value based on type and condition
    const value = this.formatValue(selectedItem, type, condition);
    
    // For between operations, we need a second value (will be filled by user input)
    let value2 = null;
    let isInput = condition.toLowerCase().includes('between');

    // Create the FilterationColumns object
    const filterationColumn: FilterationColumns = {
      ColumnName: filterColumnName,
      ColumnType: columnType,
      Value: value,
      Value2: value2 || '',
      GridOperation: gridOperation,
      IsInput: isInput
    };

    this.filterationColumns.push(filterationColumn);

    return [...this.filterationColumns];
  }
  /**
   * Checks if a string is null, undefined, empty, or an empty string
   * @param str The string to check
   * @returns True if the string is null, undefined, empty, or an empty string
   */ 
  isNullOrEmpty(str: string | null | undefined): boolean {
    return str == null || str.length === 0;
  }

  /**
   * Updates a FilterationColumns object with input values (for operations like Between)
   * @param columnName The column name
   * @param condition The condition text
   * @param value The first value
   * @param value2 The second value (for Between operations)
   * @returns The updated array of FilterationColumns objects
   */
  updateFilterationColumnWithInput(columnName: string, condition: string, value: any, value2?: any): FilterationColumns[] {
    
    // Determine column type based on value
    let columnType = 'string';
    if (typeof value === 'number' || !isNaN(Number(value))) {
      columnType = 'int';
    } else if (this.isDateString(value)) {
      columnType = 'datetime';
    }
    
    // Determine grid operation based on condition
    const gridOperation = this.mapConditionToGridOperation(condition);
    
    // Create the FilterationColumns object
    const filterationColumn: FilterationColumns = {
      ColumnName: columnName,
      ColumnType: columnType,
      Value: value,
      Value2: value2 || '',
      GridOperation: gridOperation,
      IsInput: condition.toLowerCase().includes('between')
    };

    // Check if we already have a filter for this column
    const existingIndex = this.filterationColumns.findIndex(f => f.ColumnName === columnName);
    if (existingIndex >= 0) {
      // Replace existing filter
      this.filterationColumns[existingIndex] = filterationColumn;
    } else {
      // Add new filter
      this.filterationColumns.push(filterationColumn);
    }

    return [...this.filterationColumns];
  }

  /**
   * Clears the filter for a specific column
   * @param columnName The column name to clear filter for
   * @returns The updated array of FilterationColumns objects
   */
  clearColumnFilter(columnName: string): FilterationColumns[] {
    if (!columnName) {
      return this.filterationColumns;
    }

    this.filterationColumns = this.filterationColumns.filter(f => f.ColumnName !== columnName);
    return [...this.filterationColumns];
  }

  /**
   * Gets the current array of FilterationColumns objects
   * @returns The current array of FilterationColumns objects
   */
  getFilterationColumns(): FilterationColumns[] {
    return [...this.filterationColumns];
  }

  /**
   * Resets all filters
   */
  resetFilters(): void {
    this.filterationColumns = [];
  }

  /**
   * Maps a condition text to a GridOperation value
   * @param condition The condition text
   * @returns The corresponding GridOperation value
   */
  private mapConditionToGridOperation(condition: string): string {
    switch (condition.toLowerCase()) {
      case 'equals to':
        return 'Equals';
      case 'is not equals to':
        return 'NotEquals';
      case 'is greater than or equal to':
        return 'GreaterThanOrEqual';
      case 'is less than or equal to':
        return 'LessThanOrEqual';
      case 'is greater than':
        return 'GreaterThan';
      case 'is less than':
        return 'LessThan';
      case 'is like':
        return 'Like';
        case 'contains':
          return 'Contains';
      case 'is not like':
        return 'NotLike';
        case 'does not contains':
          return 'DoesNotContain';
      case 'begins with':
        return 'Begins';
      case 'does not begins with':
        return 'DoesNotBegin';
      case 'ends with':
        return 'EndsWith';
      case 'does not ends with':
        return 'DoesNotEndWith';
      case 'is between':
      case 'between':
        return 'Between';
      default:
        return 'Equals';
    }
  }

  /**
   * Determines the column type based on the provided type and column name.
   * If type is not provided, checks for known date column names.
   * @param type The explicit type of the value (e.g., 'number', 'boolean', etc.)
   * @param columnName The name of the column
   * @returns The determined column type as a string
   */
  private determineColumnType(type: string, columnName: string): string {
    // List of column names that should be treated as datetime
    const dateColumnNames = [
      'expirationDate',
      'putAwayDate',
      'importDate',
      'requiredDate',
      'completedDate',
      'exportDate',
      'inductionDate',
    ];

    // If type is not provided and columnName matches a known date column, return 'datetime'
    if (!type && dateColumnNames.includes(columnName)) {
      return 'datetime';
    }

    // Otherwise, use the explicit type if provided
    switch (type) {
      case 'number':
        return 'int';
      case 'boolean':
        return 'boolean';
      default:
        return 'string';
    }
  }

  /**
   * Formats a value based on its type and the condition
   * @param value The value to format
   * @param type The type of the value
   * @param condition The condition text
   * @returns The formatted value
   */
  private formatValue(value: any, type: string, condition: string): any {
    if (type === 'boolean') {
      return value ? 1 : 0;
    } else if (type === 'number') {
      return value;
    } else if (type === 'date') {
      return value;
    } else {
      // For string values, we don't need to add wildcards here as that's handled by the GridOperation
      return value;
    }
  }

  /**
   * Checks if a string is a valid date
   * @param dateStr The string to check
   * @returns True if the string is a valid date
   */
  private isDateString(dateStr: string): boolean {
    if (typeof dateStr !== 'string') return false;
    
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  }
}