import { Injectable } from '@angular/core';
import { UniqueConstants } from '../constants/strings.constants';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuFiltersService {
  filterString : string = "";
  conditionSymbol: string = "";
  selectedItemFormat: string = "";
  selectedColumnFormat: string = "";

  onContextMenuCommand(selectedItem: any, filterColumnName: any, condition: any, type: any) : string {
    if (this.isClearCondition(condition)) {
      return this.handleClearCondition();
    }
    
    const newFilter = this.buildFilter(selectedItem, filterColumnName, condition, type);
    this.filterString = this.combineFilters(newFilter);
    
    return this.filterString;
  }

  private isClearCondition(condition: any): boolean {
    return condition === "clear";
  }

  private handleClearCondition(): string {
    this.filterString = "";
    return this.filterString;
  }

  private buildFilter(selectedItem: any, filterColumnName: any, condition: any, type: any): string {
    const columnType = this.getType(filterColumnName);
    const valueType = type || this.getType(selectedItem);
    const isEmptyValue = this.isValueEmpty(selectedItem);
    
    if (this.shouldUseEmptyDateFilter(isEmptyValue, columnType, condition)) {
      return this.getEmptyDateFilter(filterColumnName, condition);
    }
    
    return this.buildRegularFilter(selectedItem, filterColumnName, condition, columnType, valueType, isEmptyValue);
  }

  private isValueEmpty(selectedItem: any): boolean {
    return selectedItem == null || selectedItem === '';
  }

  private shouldUseEmptyDateFilter(isEmptyValue: boolean, columnType: string, condition: any): boolean {
    const isEqualityCondition = condition === "equals to" || condition === "is not equals to";
    return isEmptyValue && columnType === 'date' && isEqualityCondition;
  }

  private buildRegularFilter(
    selectedItem: any, 
    filterColumnName: any, 
    condition: any, 
    columnType: string, 
    valueType: string, 
    isEmptyValue: boolean
  ): string {
    this.selectedColumnFormat = this.getSelectedColumnFormat(columnType, filterColumnName, condition, isEmptyValue);
    this.conditionSymbol = this.getConditionSymbol(condition);
    const itemType = columnType === 'date' ? 'date' : valueType;
    this.selectedItemFormat = this.getSelectedItemFormat(itemType, selectedItem, condition, isEmptyValue);
    
    if (this.isValidFilterFormat()) {
      return this.selectedColumnFormat + this.conditionSymbol + this.selectedItemFormat;
    }
    
    return "";
  }

  private isValidFilterFormat(): boolean {
    return this.selectedColumnFormat !== "" && 
           this.conditionSymbol !== "" && 
           this.selectedItemFormat !== "";
  }

  private combineFilters(newFilter: string): string {
    if (newFilter === "") {
      return UniqueConstants.OneEqualsOne;
    }
    
    if (this.filterExists(this.filterString, newFilter)) {
      return this.filterString;
    }
    
    if (this.hasExistingFilters()) {
      return this.filterString + " AND " + newFilter;
    }
    
    return newFilter;
  }

  private hasExistingFilters(): boolean {
    return this.filterString !== "" && this.filterString !== UniqueConstants.OneEqualsOne;
  }

  filterExists(filterString: string, newFilter: string): boolean {
    if(!filterString || filterString === UniqueConstants.OneEqualsOne) return false;
    
    // Normalize both filters for comparison (remove extra spaces, normalize brackets)
    const normalizedNewFilter = newFilter.replace(/\s+/g, ' ').trim();
    const filters = filterString.split(/\s+AND\s+/i);
    
    // Check if the exact filter already exists
    return filters.some(filter => {
      const normalizedFilter = filter.replace(/\s+/g, ' ').trim();
      return normalizedFilter.toLowerCase() === normalizedNewFilter.toLowerCase();
    });
  }

  clearSpecificColumnFilter(columnName: string): string {
    if (!this.filterString || this.filterString === UniqueConstants.OneEqualsOne) {
      this.filterString = UniqueConstants.OneEqualsOne; // No filters to clear
    } else {
      // Directly use the filter string as it is, without decoding
      let filterString = this.filterString;
  
      console.log('Current Filter String: ', filterString);
  
      // Split by 'AND' to get individual filters
      let filters = filterString.split(' AND ');
  
      // Find and remove the specific column's filter
      filters = filters.filter(filter => {
        const normalizedFilterColumn = filter.match(/\[([^\]]+)\]/);
        if (normalizedFilterColumn && normalizedFilterColumn[1].trim() === columnName.trim()) {
          return false; // Remove the filter for the specific column
        }
        return true; // Keep other filters
      });
  
      // Join the remaining filters, or reset to OneEqualsOne if no filters remain
      this.filterString = filters.length > 0 ? filters.join(' AND ') : UniqueConstants.OneEqualsOne;
    }
  
    // Emit the updated filter string so that the API call can be made
   
  
    return this.filterString;
  }
  
  

  private readonly dateFields = new Set([
    'Expiration Date',
    'Put Away Date',
    'Import Date',
    'Required Date',
    'Completed Date',
    'Export Date',
    'Induction Date',
    'Date Stamp'
  ]);

  getType(val: string): string {
    return this.dateFields.has(val) ? 'date' : typeof val;
  }

  getConditionSymbol(conditionText: any) :string
  {
    switch(conditionText.toLowerCase())
    {
      case "equals to":
        return " = ";
      case "is not equals to":
        return " <> ";
      case "is greater than or equal to":
        return " >= ";
      case "is less than or equal to":
        return " <= ";
      case "is like":
      case "begins with":
      case "ends with":
      case "contains":
        return " like ";
      case "is not like":
      case "does not begins with":
      case "does not ends with":
      case "does not contains":
        return " not like ";
      case "is less than":
        return " < ";
      case "is greater than":
        return " > ";
      case "is between":
        return " Between ";
      default:
        return "";
    }
  }

  getSelectedItemFormat(valueType: any, valueText: any, condition: any, isEmptyValue: boolean = false) : string {
    if(valueType == "boolean")
      if(valueText) return "1";
      else return "0";
    else if(valueType == "date") {
      // For empty values in date columns, use empty string for ISNULL comparison
      if(isEmptyValue && (condition == "equals to" || condition == "is not equals to")) {
        return "''";
      }
      // For date "equals to" condition with non-empty values, use CONVERT format
      if(condition == "equals to" || condition == "is not equals to") {
        return "CONVERT(VARCHAR(19), CAST('" + valueText + "' AS DATETIME), 120)";
      }
      return "'" + valueText + "'";
    }
    else if(valueType == "number") return valueText;
    else if(valueType == "string")
      if(condition == "equals to" || condition == "is not equals to") return "'" + valueText + "'";
      else if(condition == "begins with" || condition == "does not begins with") return "'" + valueText + "%'";
      else if(condition == "ends with" || condition == "does not ends with") return "'%" + valueText + "'";
      else if(condition == "is like" || condition == "is not like" || condition == "contains" || condition == "does not contains") return "'%" + valueText + "%'";
      else if(condition == "is greater than" || condition == "is less than") return "'" + valueText + "'";
      else if(condition == "is between" || condition == "between") return   valueText  ;
      else return "";

    return "";
  }

  getSelectedColumnFormat(ColumnType: any, ColumnName:any, condition: any, isEmptyValue: boolean = false) : string {
    if(ColumnType == 'string') return "ISNULL([" + ColumnName +"],'')";
    else if(ColumnType == 'date') {
      // For date "equals to" condition with non-empty values, use CONVERT format
      if(condition == "equals to" || condition == "is not equals to") {
        return "CONVERT(VARCHAR(19), [" + ColumnName + "], 120)";
      }
      return "["+ ColumnName +"]";
    }
    else if(ColumnType == 'boolean' || ColumnType == 'number') return "["+ ColumnName +"]";
    return "";
  }

  getEmptyDateFilter(ColumnName: any, condition: any) : string {
    // For empty date values, only check for NULL (not empty string)
    if(condition == "equals to") {
      return "[" + ColumnName + "] IS NULL";
    } else if(condition == "is not equals to") {
      return "[" + ColumnName + "] IS NOT NULL";
    }
    return "";
  }
}
