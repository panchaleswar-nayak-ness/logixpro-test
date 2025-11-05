import { Component, ViewChild, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { GlobalService } from 'src/app/common/services/global.service';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';
import { ContextMenuFiltersService } from 'src/app/common/init/context-menu-filters.service';
import { TableContextMenuService } from './table-context-menu.service';
import { OperationTypes } from './../../enums/CommonEnums';
import { Operations } from './../../types/CommonTypes';
import { DialogConstants, FILTRATION_GRID_OPERATION_KEYS } from '../../constants/strings.constants';

@Component({
  selector: 'app-table-context-menu-component',
  templateUrl: './table-context-menu-component.component.html',
  styleUrls: []
})
export class TableContextMenuComponentComponent implements OnInit{

  public OperationTypes = OperationTypes;

  matMenuContentItem : Operations[] = [
    { condition: "equals to", title: "Equals", type: OperationTypes.EQUALS },
    { condition: "is not equals to", title: "Not Equals", type: OperationTypes.EQUALS },
    { condition: "is greater than or equal to", title: "Greater than or Equal", type: OperationTypes.NUMERIC },
    { condition: "is less than or equal to", title: "Less than or Equal", type: OperationTypes.NUMERIC },
    { condition: "is greater than", title: "Greater than", type: OperationTypes.DATE },
    { condition: "is less than", title: "Less than", type: OperationTypes.DATE },
    { condition: "is like", title: "Like", type: OperationTypes.STRING },
    { condition: "is not like", title: "Not Like", type: OperationTypes.STRING }
  ];

  matMenuContentCategory : Operations[] = [
    { condition: "equals to", title: "Equals", type: OperationTypes.EQUALS },
    { condition: "is not equals to", title: "Not Equals", type: OperationTypes.EQUALS },
    { condition: "begins with", title: "Begins", type: OperationTypes.STRING },
    { condition: "does not begins with", title: "Does Not Begin", type: OperationTypes.STRING },
    { condition: "ends with", title: "Ends With", type: OperationTypes.STRING },
    { condition: "does not ends with", title: "Does Not End With", type: OperationTypes.STRING },
    { condition: "contains", title: "Contains", type: OperationTypes.STRING },
    { condition: "does not contains", title: "Does Not Contain", type: OperationTypes.STRING },
    { condition: "is less than", title: "Less Than", type: OperationTypes.NUMERIC },
    { condition: "is greater than", title: "Greater Than", type: OperationTypes.NUMERIC },
    { condition: "is between", title: "Between" , type: OperationTypes.NUMERIC }
  ];

  contextMenuPosition = { x: '0px', y: '0px' };
  filterString : string = "1 = 1";
  
  @Input() componentName : string = "";
  
  @Output() optionSelected = new EventEmitter<string>();

  @ViewChild('trigger') trigger: MatMenuTrigger;

  constructor(
    public global : GlobalService,
    private filterService : ContextMenuFiltersService,
    public contextMenuService : TableContextMenuService
  ) {
  }

  ngOnInit(): void {
    this.contextMenuService.contextMenuObserver.subscribe(() => {
      const { event, SelectedItem, FilterColumnName, FilterConditon, FilterItemType } = this.contextMenuService;
      this.onContextMenu(event, SelectedItem, FilterColumnName, FilterConditon, FilterItemType);
    });
  }

  onMenuOpened(): void {
    this.filterString = "1 = 1";
    this.trigger.closeMenu();
  }

  onMenuClosed(): void {
    this.filterString = "1 = 1";
    this.trigger.closeMenu();
  }

  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.trigger.menuData = { item: {SelectedItem: SelectedItem, FilterColumnName : FilterColumnName, FilterConditon: FilterConditon, FilterItemType : FilterItemType }};
    this.trigger.menu?.focusFirstItem('mouse');
    this.trigger.openMenu();
  }
  
  InputFilterSearch(FilterColumnName: any, Condition: any, TypeOfElement: any) {
    const dialogRef : any = this.global.OpenDialog(InputFilterComponent, {
      height: DialogConstants.auto,
      width: '480px',
      data:{
        FilterColumnName: FilterColumnName,
        Condition: Condition,
        TypeOfElement:TypeOfElement,
        butttonText:"Filter"
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });

    dialogRef.afterClosed().subscribe((result : any) => {
      if(result.SelectedColumn) this.onContextMenuCommand(result.SelectedItem, result.SelectedColumn, result.Condition,result.Type);
    });
  }

  getType(val) : string {
     return this.filterService.getType(val);
  }

  onContextMenuCommand(SelectedItem: any, FilterColumnName: any, Condition: any, Type: any) 
  {
 if (this.isPrimaryComponent(this.componentName)) {
      if(SelectedItem != undefined && Condition !== FILTRATION_GRID_OPERATION_KEYS.Clear) {
        this.filterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, Condition, Type);
      }
      
      if (FilterColumnName && Condition === FILTRATION_GRID_OPERATION_KEYS.Clear) {
        this.filterString = this.filterService.clearSpecificColumnFilter(FilterColumnName);
        this.optionSelected.emit(this.filterString);
      } 
      this.filterString = this.filterString != "" ? this.filterString : "1 = 1";
    } 
    else if(this.componentName == 'deAllOrd' || this.componentName == 'openTransOnHold' || this.componentName == 'transOrders' || this.componentName == 'transHistory' || this.componentName == 'ReprocessTransaction') 
    {
      if(FilterColumnName != "" && Condition == FILTRATION_GRID_OPERATION_KEYS.Clears) {
        this.filterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, Condition, Type);
        this.filterString = this.filterString != "" ? this.filterString : "1=1";
      }

      else  if (FilterColumnName && Condition === FILTRATION_GRID_OPERATION_KEYS.Clear) {
        this.filterString = this.filterService.clearSpecificColumnFilter(FilterColumnName);
      } else if (SelectedItem != undefined) {
        this.filterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, Condition, Type);
      }
  
      this.filterString = this.filterString != "" ? this.filterString : "1 = 1"; 
      
    }
    else {
      // Default handling for any other component - build filter if selection is made
      if (SelectedItem != undefined && Condition !== FILTRATION_GRID_OPERATION_KEYS.Clear && Condition !== FILTRATION_GRID_OPERATION_KEYS.Clears) {
        this.filterString = this.filterService.onContextMenuCommand(SelectedItem, FilterColumnName, Condition, Type);
      } else if (FilterColumnName && Condition === FILTRATION_GRID_OPERATION_KEYS.Clear) {
        this.filterString = this.filterService.clearSpecificColumnFilter(FilterColumnName);
      } else if (Condition === FILTRATION_GRID_OPERATION_KEYS.Clears) {
        this.filterString = "1 = 1";
      }
      this.filterString = this.filterString != "" ? this.filterString : "1 = 1";
    }
    
    this.optionSelected.emit(this.filterString);
  }
  private isPrimaryComponent(name: string): boolean {
 const primaryComponents = [
    'InvMap',
    'moveItem',
    'sysRepCurOrd',
    'sysRepNewOrd',
    'omCreateOrd',
    'omOrderManager',
    'eventLog',
    'toteTransManager',
    'orderTransactions'
 ];
  return primaryComponents.includes(name);
}
}
