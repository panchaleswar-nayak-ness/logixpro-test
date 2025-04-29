import { Component, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { MatPaginator } from '@angular/material/paginator';
import { MatTab, MatTabChangeEvent } from '@angular/material/tabs';
import { Placeholders, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-move-locations',
  templateUrl: './move-locations.component.html',
  styleUrls: ['./move-locations.component.scss']
})
export class MoveLocationsComponent {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  itemNumber: string = this.fieldMappings.itemNumber;
  UnitOfMeasure: string = this.fieldMappings.unitOfMeasure;
  UserField1:string = this.fieldMappings.userField1;
  UserField2:string = this.fieldMappings.userField2;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  selectedWarehouse: string = 'ALL';
  warehouses: string[] = [];
  placeholders = Placeholders;
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

  @ViewChild('paginatorMoveFrom') paginator: MatPaginator;
  @ViewChild('paginatorMoveTo') paginatorTo: MatPaginator;

  @Input() paginators : any;

  @Input() moveFromFilter : string;
  @Input() moveToFilter : string;
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
  @Output() activeTrigger = new EventEmitter<any>();

  @Output() selectedWarehouseEmit= new EventEmitter<string>();
  

  constructor(
    private contextMenuService : TableContextMenuService, public adminApiService: AdminApiService, public global: GlobalService
  ) { }
  ngOnInit(): void {
   
    this.adminApiService.getWarehouses().subscribe({
      next: (res: any) => {
        this.warehouses = ['ALL', ...res.data]; 
//this.warehouses = res.data;
        // if (this.warehouses.length > 0) {
        //   this.selectedWarehouse = this.warehouses[0];
        //   this.selectedWarehouseEmit.emit( this.selectedWarehouse);
        // }
        console.log(res.data);
        
      },
      error: (err: any) => {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.error('Error loading warehouses:', err);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['moveFromFilter']) {
      this.paginator.pageIndex = 0;
    }

    if (changes['moveToFilter']) {
      this.paginatorTo.pageIndex = 0;
    }
  }
  
  onWarehouseSelect(warehouse: string) {
    console.log(warehouse);
    if(warehouse=='ALL'){
      warehouse='';
    }
    
    this.selectedWarehouseEmit.emit(warehouse);
  }
 
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

 
  onChangeLocation(event) {
    
    this.onChangeLocationEmit.emit(this.viewAll);
  }

  tabChanged(event, p0?: { index: number; tab: typeof MatTab; }) {
    this.tabIndex=event.index;
    this.tabChangedEmit.emit(event);
    this.onChangeLocationEmit.emit(this.viewAll=false);
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
    //this.tabChangedEmit.emit({index:1,tab:MatTab});
     this.tabChanged({index:1,tab:MatTab})
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
    event.preventDefault()
    this.activeTrigger.emit(true);
    setTimeout(() => {
      this.contextMenuService.updateContextMenuState(event, SelectedItem, FilterColumnName, FilterConditon, FilterItemType);
    }, 100);
  }

  isQuantityGreater(quantity: number): boolean {
    return quantity >= 2;
  }

}
