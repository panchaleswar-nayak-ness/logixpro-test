import { Component, ViewChild, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { TableContextMenuComponentComponent } from '../table-context-menu-component/table-context-menu-component.component';
import { DirectFilterationColumnsService } from '../../services/direct-filteration-columns.service';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';
import { DialogConstants, FILTRATION_GRID_OPERATION_KEYS, StringConditions, Style } from '../../constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { ContextMenuFiltersService } from 'src/app/common/init/context-menu-filters.service';
import { TableContextMenuService } from '../table-context-menu-component/table-context-menu.service';
import { FilterationColumns, InputDialogResult } from '../../Model/pick-Tote-Manager';
import { AllDataTypeValues, FiltrationDataTypes } from '../../enums/CommonEnums';

@Component({
  selector: 'app-direct-filteration-columns-menu',
  templateUrl: '../table-context-menu-component/table-context-menu-component.component.html',
  styleUrls: []
})
export class DirectFilterationColumnsMenuComponent extends TableContextMenuComponentComponent implements OnInit {
  
  @Output() filterationColumnsSelected = new EventEmitter<FilterationColumns[]>();

  constructor(
    private directFilterService: DirectFilterationColumnsService,
    override global: GlobalService,
    filterService: ContextMenuFiltersService,
    contextMenuService: TableContextMenuService
  ) {
    super(global, filterService, contextMenuService);
  }

  /**
   * Override the onContextMenuCommand method to create FilterationColumns objects directly
   */
  override onContextMenuCommand(SelectedItem: AllDataTypeValues, FilterColumnName: string, Condition: string, Type: string) {

    // Now create FilterationColumns objects directly
    const filterationColumns = this.directFilterService.createFilterationColumn(
      SelectedItem, FilterColumnName, Condition, Type
    );
    
    // Emit the FilterationColumns objects
    this.filterationColumnsSelected.emit(filterationColumns);
  }

  /**
   * Override the InputFilterSearch method to handle input filters
   */
override InputFilterSearch(FilterColumnName: string, Condition: string, TypeOfElement: string) {
  const dialogRef = this.global.OpenDialog(InputFilterComponent, {
    height: DialogConstants.auto,
    width: Style.w480px,
    data: {
      FilterColumnName,
      Condition,
      TypeOfElement,
      butttonText: StringConditions.Filter
    },
    autoFocus: DialogConstants.autoFocus,
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe((result: InputDialogResult) => {
    if (result.SelectedColumn) {
      this.handleDialogResult(result);
    }
  });
}

private handleDialogResult(result: InputDialogResult): void {
  if (result.Condition.includes(FILTRATION_GRID_OPERATION_KEYS.Between)) {
    this.handleBetweenCondition(result);
  } else {
    this.handleOtherConditions(result);
  }
}

private handleBetweenCondition(result: InputDialogResult): void {
  if (!result.SelectedItem2 && typeof result.SelectedItem === FiltrationDataTypes.String && result.SelectedItem.includes(FILTRATION_GRID_OPERATION_KEYS.And)) {
    const parts = result.SelectedItem.split(FILTRATION_GRID_OPERATION_KEYS.And);
    result.SelectedItem = parts[0];
    result.SelectedItem2 = parts[1];
  }

  const filterationColumns = this.directFilterService.updateFilterationColumnWithInput(
    result.SelectedColumn, result.Condition, result.SelectedItem, result.SelectedItem2
  );

  this.filterationColumnsSelected.emit(filterationColumns);
}

private handleOtherConditions(result: InputDialogResult): void {
  const filterationColumns = this.directFilterService.createFilterationColumn(
    result.SelectedItem, result.SelectedColumn, result.Condition, result.Type
  );

  this.filterationColumnsSelected.emit(filterationColumns);
}
}