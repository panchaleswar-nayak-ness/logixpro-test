import { Injectable } from '@angular/core';
import { FiltrationDataTypes } from '../enums/CommonEnums';
import { FilterationColumns } from '../Model/pick-Tote-Manager';
import { DATE_COLUMNS, FILTRATION_GRID_OPERATION_KEYS, OPERATION_CONDITIONS } from '../constants/strings.constants';
import { AllDataTypeValues } from '../types/pick-tote-manager.types';

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
  createFilterationColumn(selectedItem: AllDataTypeValues, filterColumnName: string, condition: string, type: string): FilterationColumns[] {
    if (condition === FILTRATION_GRID_OPERATION_KEYS.Clear) {
      // Clear specific column filter
      this.clearColumnFilter(filterColumnName);
      return this.filterationColumns;
    }
    
    if (condition === FILTRATION_GRID_OPERATION_KEYS.Clears) {
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
    let columnType = this.determineColumnType(filterColumnName, type);
    
    // Determine grid operation based on condition
    const gridOperation = this.mapConditionToGridOperation(condition);
    
    // Format the value based on type and condition
    const value = this.formatValue(selectedItem, type);
    
    // For between operations, we need a second value (will be filled by user input)
    let value2 = null;
    let isInput = condition.includes( FILTRATION_GRID_OPERATION_KEYS.Between);

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
  isNullOrEmpty(str: AllDataTypeValues): boolean {
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
  updateFilterationColumnWithInput(columnName: string, condition: string, value: AllDataTypeValues, value2?: AllDataTypeValues): FilterationColumns[] {
    
    // Determine column type based on value
    let columnType = FiltrationDataTypes.String;
    if (typeof value === FiltrationDataTypes.Number || !isNaN(Number(value))) {
      columnType = FiltrationDataTypes.Integer;
    } else if (this.isDateString(value as string)) {
      columnType = FiltrationDataTypes.Datetime;
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
      IsInput: condition.toLowerCase().includes(FILTRATION_GRID_OPERATION_KEYS.Between)
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
    return OPERATION_CONDITIONS[condition.toLowerCase()] ?? FILTRATION_GRID_OPERATION_KEYS.Equals;
  }
  
  /**
   * Determines the column type based on the value type and column name
   * @param type The type of the value
   * @param columnName The column name
   * @returns The column type
   */
  
  private determineColumnType(columnName: string, type?: string): FiltrationDataTypes {
    
    if ((!type || type.trim() !== '') && DATE_COLUMNS.has(columnName)) {
      return  FiltrationDataTypes.Datetime;
    }
  
    if (type === FiltrationDataTypes.Number) return   FiltrationDataTypes.Integer;
    if (type ===  FiltrationDataTypes.Boolean) return   FiltrationDataTypes.Boolean;
  
    return  FiltrationDataTypes.String;
  }

  private formatValue(value: AllDataTypeValues, type: string): AllDataTypeValues {
    if (value == null) return null;

    return value;
  }
  
  /**
   * Checks if a string is a valid date
   * @param dateStr The string to check
   * @returns True if the string is a valid date
   */
  private isDateString(dateStr: string): boolean {
    if (typeof dateStr !== FiltrationDataTypes.String) return false;
    
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  }
}