import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContextMenuFiltersService {
    FilterString : string = "";
    ConditionSymbol: string = "";
    SelectedItemFormat: string = "";
    SelectedColumnFormat: string = "";

    onContextMenuCommand(SelectedItem: any, FilterColumnName: any, Condition: any, Type: any) : string {
      
      if(Condition == "clear")
      {
        this.FilterString = "";
      }
      else
      {
        
        this.SelectedColumnFormat = this.getSelectedColumnFormat(Type,FilterColumnName)
        this.ConditionSymbol = this.getConditionSymbol(Condition);
        this.SelectedItemFormat =  this.getSelectedItemFormat(Type,SelectedItem,Condition)
         
        if(this.SelectedColumnFormat != "" && this.ConditionSymbol != "" && this.SelectedItemFormat != "")
        {
          if(this.FilterString != "" && this.FilterString != "1 = 1")
          {
            this.FilterString = this.FilterString + " AND " + this.SelectedColumnFormat + this.ConditionSymbol +  this.SelectedItemFormat;
          }
          else
          {
              this.FilterString =  this.SelectedColumnFormat + this.ConditionSymbol +  this.SelectedItemFormat;
          }
        }
  
       else
       {
        this.FilterString = "1 = 1";
       }
  
      }
      return this.FilterString;
    }

    getType(val) : string
    {
      if(val == 'Expiration Date' ||  val == 'Put Away Date')
      {
        return "date";
      }
      else
      {
        return typeof val;
      }
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
    getSelectedItemFormat(ValueType: any, valueText: any, Condition: any) : string{
      if(ValueType == "boolean")
      {
        if(valueText)
        {
          return "1";
        }
        else
        {
          return "0"
        }
      }
      else if(ValueType == "date")
      {
          return "'" + valueText + "'";
      }
      else if(ValueType == "number")
      {
          return valueText;
      }
      else if(ValueType == "string")
      {
            if(Condition == "equals to" || Condition == "is not equals to")
            {
                return "'" + valueText + "'";
            }
            else if(Condition == "begins with" || Condition == "does not begins with")
            {
              return "'" + valueText + "%'";
            }
            else if(Condition == "ends with" || Condition == "does not ends with")
            {
              return "'%" + valueText + "'";
            }
            else if(Condition == "is like" || Condition == "is not like" ||
              Condition == "contains" || Condition == "does not contains")
            {
              return "'%" + valueText + "%'";
            }
            else{
              return "";
            }
      }
  
      return "";
    }
  
    getSelectedColumnFormat(ColumnType: any, ColumnName:any) : string{
      
      if(ColumnType == 'string')
      {
        return "ISNULL([" + ColumnName +"],'')";
      }
      else if(ColumnType == 'boolean' || ColumnType == 'number' || ColumnType == 'date')
      {
        return "["+ ColumnName +"]";
      }
      return "";
    }
    
   
  
}
