import { Component, ViewChild, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { TableContextMenuComponentComponent } from '../table-context-menu-component/table-context-menu-component.component';
import { DirectFilterationColumnsService } from '../../services/direct-filteration-columns.service';
import { FilterationColumns } from '../../../dialogs/pick-tote-manager/pick-tote-manager.component';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';
import { DialogConstants } from '../../constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { ContextMenuFiltersService } from 'src/app/common/init/context-menu-filters.service';
import { TableContextMenuService } from '../table-context-menu-component/table-context-menu.service';

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
  override onContextMenuCommand(SelectedItem: any, FilterColumnName: string, Condition: string, Type: string) {
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
  override InputFilterSearch(FilterColumnName: any, Condition: any, TypeOfElement: any) {
    const dialogRef : any = this.global.OpenDialog(InputFilterComponent, {
      height: DialogConstants.auto,
      width: '480px',
      data:{
        FilterColumnName: FilterColumnName,
        Condition: Condition,
        TypeOfElement: TypeOfElement,
        butttonText: "Filter"
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result : any) => {
      if (result.SelectedColumn) {
        // For Between operations, we need to handle two values
        if (result.Condition.toLowerCase().includes('between')) {
          // If SelectedItem2 is not provided, split SelectedItem by ' and '
          if (!result.SelectedItem2 && typeof result.SelectedItem === 'string' && result.SelectedItem.includes(' and ')) {
            const parts = result.SelectedItem.split(' and ');
            result.SelectedItem = parts[0];
            result.SelectedItem2 = parts[1];
          }
          const filterationColumns = this.directFilterService.updateFilterationColumnWithInput(
            result.SelectedColumn, result.Condition, result.SelectedItem, result.SelectedItem2
          );
          this.filterationColumnsSelected.emit(filterationColumns);
        } else {
          const filterationColumns = this.directFilterService.createFilterationColumn(
            result.SelectedItem, result.SelectedColumn, result.Condition, result.Type
          );
          this.filterationColumnsSelected.emit(filterationColumns);
        }
      }
    });
  }
}