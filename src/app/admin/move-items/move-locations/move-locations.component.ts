import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';

@Component({
  selector: 'app-move-locations',
  templateUrl: './move-locations.component.html',
  styleUrls: ['./move-locations.component.scss']
})
export class MoveLocationsComponent implements OnInit {

  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);

  @Input() itemSelected : boolean = false;
  
  @Input() itemNo : string = "";
  @Input() viewAll : boolean = false;
  @Input() isViewAll : boolean = false;
  @Input() tabIndex : number = 0;
  @Input() dataSource;
  @Input() searchAutocompletItemNo;
  @Input() displayedColumns;
  @Input() recordsFiltered : number = 0;
  @Input() moveToDatasource;
  @Input() recordsFilteredTo : number = 0;
  @Input() paginator : any;
  @Input() paginatorTo : any;
  @Input() paginators : any;

  @Output() onChangeLocationEmit = new EventEmitter();
  @Output() tabChangedEmit = new EventEmitter();
  @Output() sortChangeEmit = new EventEmitter();
  @Output() clearItemNumEmit = new EventEmitter();
  @Output() searchDataEmit = new EventEmitter();
  @Output() handlePageEventEmit = new EventEmitter();
  @Output() getMoveFromDetailsEmit : EventEmitter<{ element, i : number, tableName : string }> = new EventEmitter();
  @Output() sortChangeToItemsEmit = new EventEmitter();
  @Output() handlePageEventToEmit = new EventEmitter();
  @Output() itemNumberSearchEmit = new EventEmitter();

  constructor(
    private contextMenuService : TableContextMenuService
  ) { }

  ngOnInit(): void {
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  onChangeLocation(event) {
    this.onChangeLocationEmit.emit();
  }

  tabChanged(event) {
    this.tabChangedEmit.emit(event);
  }

  sortChange(event) {
    this.sortChangeEmit.emit(event);
  }
  
  clearItemNum() {
    this.clearItemNumEmit.emit();
  }

  searchData(event) {
    this.searchDataEmit.emit(event);
  }

  handlePageEvent(event) {
    this.handlePageEventEmit.emit(event);
  }

  getMoveFromDetails(element, i : number, tableName : string) {
    this.getMoveFromDetailsEmit.emit({ element, i, tableName });
  }

  sortChangeToItems(event) {
    this.sortChangeToItemsEmit.emit(event);
  }

  handlePageEventTo(event) {
    this.handlePageEventToEmit.emit(event);
  }

  itemNumberSearch() {
    this.itemNumberSearchEmit.emit(this.itemNo)
  }

  onContextMenu(event: MouseEvent, SelectedItem: any, FilterColumnName?: any, FilterConditon?: any, FilterItemType?: any) {
    this.contextMenuService.updateContextMenuState(event, SelectedItem, FilterColumnName, FilterConditon, FilterItemType);
  }

  isQuantityGreater(quantity: number): boolean {
    return quantity >= 2;
  }

}
