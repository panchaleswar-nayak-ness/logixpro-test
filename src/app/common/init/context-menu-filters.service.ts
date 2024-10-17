import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuFiltersService {
  filterString : string = "";
  conditionSymbol: string = "";
  selectedItemFormat: string = "";
  selectedColumnFormat: string = "";

  onContextMenuCommand(selectedItem: any, filterColumnName: any, condition: any, type: any) : string {
    if(condition == "clear") this.filterString = "";
    else {
      this.selectedColumnFormat = this.getSelectedColumnFormat(type, filterColumnName);
      this.conditionSymbol = this.getConditionSymbol(condition);
      this.selectedItemFormat =  this.getSelectedItemFormat(type, selectedItem, condition);
        
      if(this.selectedColumnFormat != "" && this.conditionSymbol != "" && this.selectedItemFormat !== "")
        if(this.filterString != "" && this.filterString != "1 = 1") this.filterString = this.filterString + " AND " + this.selectedColumnFormat + this.conditionSymbol +  this.selectedItemFormat;
        else this.filterString = this.selectedColumnFormat + this.conditionSymbol +  this.selectedItemFormat;
      else this.filterString = "1 = 1";
    }
    return this.filterString;
  }

  clearSpecificColumnFilter(columnName: string): string {
    if (!this.filterString || this.filterString === "1 = 1") {
      this.filterString = "1 = 1"; // No filters to clear
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
  
      // Join the remaining filters, or reset to "1 = 1" if no filters remain
      this.filterString = filters.length > 0 ? filters.join(' AND ') : "1 = 1";
    }
  
    // Emit the updated filter string so that the API call can be made
   
  
    return this.filterString;
  }
  
  

  getType(val) : string {
    if(val == 'Expiration Date' ||  val == 'Put Away Date') return "date";
    else return typeof val;
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

  getSelectedItemFormat(valueType: any, valueText: any, condition: any) : string {
    if(valueType == "boolean")
      if(valueText) return "1";
      else return "0";
    else if(valueType == "date") return "'" + valueText + "'";
    else if(valueType == "number") return valueText;
    else if(valueType == "string")
      if(condition == "equals to" || condition == "is not equals to") return "'" + valueText + "'";
      else if(condition == "begins with" || condition == "does not begins with") return "'" + valueText + "%'";
      else if(condition == "ends with" || condition == "does not ends with") return "'%" + valueText + "'";
      else if(condition == "is like" || condition == "is not like" || condition == "contains" || condition == "does not contains") return "'%" + valueText + "%'";
      else return "";

    return "";
  }

  getSelectedColumnFormat(ColumnType: any, ColumnName:any) : string {
    if(ColumnType == 'string') return "ISNULL([" + ColumnName +"],'')";
    else if(ColumnType == 'boolean' || ColumnType == 'number' || ColumnType == 'date') return "["+ ColumnName +"]";
    return "";
  }
}
