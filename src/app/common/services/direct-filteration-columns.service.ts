import { Injectable } from '@angular/core';
import { OperationTypes } from '../enums/CommonEnums';
import { FilterationColumns } from '../Model/pick-Tote-Manager';
import { filtrationDatatypes, filtrationGridOperationKeys } from '../constants/strings.constants';

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
  createFilterationColumn(selectedItem: string | number | boolean | Date | null | undefined, filterColumnName: string, condition: string, type: string): FilterationColumns[] {
    if (condition === filtrationGridOperationKeys.Clear) {
      // Clear specific column filter
      this.clearColumnFilter(filterColumnName);
      return this.filterationColumns;
    }
    
    if (condition === filtrationGridOperationKeys.Clears) {
      // Clear all filters
      this.filterationColumns = [];
      return this.filterationColumns;
    }
      /**
   * Checks if a string is null, undefined, empty, or an empty string
   * @param str The string to check
   * @returns True if the string is null, undefined, empty, or an empty string
   */ 
    if (this.isNullOrEmpty(selectedItem) || !filterColumnName) {
      return this.filterationColumns;
    }

    // Determine column type based on the value type
    let columnType = this.determineColumnType(type, filterColumnName);
    
    // Determine grid operation based on condition
    const gridOperation = this.mapConditionToGridOperation(condition);
    
    // Format the value based on type and condition
    const value = this.formatValue(selectedItem, type);
    
    // For between operations, we need a second value (will be filled by user input)
    let value2 = null;
    let isInput = condition.toLowerCase().includes( filtrationGridOperationKeys.Between);

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
  isNullOrEmpty(str: string | number | boolean | Date | null | undefined): boolean {
    return str == null || str == undefined;
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
    let columnType = filtrationDatatypes.String;
    if (typeof value === filtrationDatatypes.Number || !isNaN(Number(value))) {
      columnType = filtrationDatatypes.Integer;
    } else if (this.isDateString(value)) {
      columnType = filtrationDatatypes.Datetime;
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
      IsInput: condition.toLowerCase().includes(filtrationGridOperationKeys.Between)
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
    const conditionMap: Record<string, string> = {
      'equals to': 'Equals',
      'is not equals to': 'NotEquals',
      'is greater than or equal to': 'GreaterThanOrEqual',
      'is less than or equal to': 'LessThanOrEqual',
      'is greater than': 'GreaterThan',
      'is less than': 'LessThan',
      'is like': 'Like',
      'contains': 'Contains',
      'is not like': 'NotLike',
      'does not contains': 'DoesNotContain',
      'begins with': 'Begins',
      'does not begins with': 'DoesNotBegin',
      'ends with': 'EndsWith',
      'does not ends with': 'DoesNotEndWith',
      'is between': 'Between',
      'between': 'Between'
    };
  
    return conditionMap[condition.toLowerCase()] ?? 'Equals';
  }
  
  /**
   * Determines the column type based on the value type and column name
   * @param type The type of the value
   * @param columnName The column name
   * @returns The column type
   */
  private determineColumnType(type: string | null | undefined, columnName: string): 'datetime' | 'int' | 'boolean' | 'string' {
    const dateColumns = new Set([
      'expirationDate',
      'putAwayDate',
      'importDate',
      'requiredDate',
      'completedDate',
      'exportDate',
      'inductionDate'
    ]);
  
    if ((!type || type.trim() !== '') && dateColumns.has(columnName)) {
      return  'datetime';
    }
  
    if (type === filtrationDatatypes.Number) return 'int';
    if (type ===  filtrationDatatypes.Boolean) return 'boolean';
  
    return 'string';
  }

  private formatValue(value: string | number | boolean | Date | null | undefined, type: string): string | number | boolean | Date | null {
    if (value == null) return null;

    return value;
  }
  
  /**
   * Checks if a string is a valid date
   * @param dateStr The string to check
   * @returns True if the string is a valid date
   */
  private isDateString(dateStr: string): boolean {
    if (typeof dateStr !== filtrationDatatypes.String) return false;
    
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  }
}