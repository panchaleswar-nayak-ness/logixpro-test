 
import { Component, ElementRef, OnInit, ViewChild, Renderer2, QueryList } from '@angular/core'; 
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/common/init/auth.service';
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { TableContextMenuService } from 'src/app/common/globalComponents/table-context-menu-component/table-context-menu.service';
import { DialogConstants, ToasterTitle, ToasterType ,ResponseStrings,Column,zoneType,ColumnDef,TableConstant,Style,UniqueConstants} from 'src/app/common/constants/strings.constants';

const TRNSC_DATA = [
  { colHeader: 'warehouse', colDef: 'Warehouse' },
  { colHeader: 'locationNumber', colDef: 'Location Number' },
  { colHeader: UniqueConstants.goldenZone, colDef: 'Golden Zone' },
  { colHeader: 'itemNumber', colDef: Column.ItemNumber },
  { colHeader: 'description', colDef: 'Description' },
  { colHeader: 'itemQuantity', colDef: 'Item Quantity' },
  { colHeader: 'quantityAllocatedPick', colDef: 'Quantity Allocated Pick' },
  { colHeader: 'quantityAllocatedPutAway', colDef: 'Quantity Allocated Put Away' },
  { colHeader: 'zone', colDef: 'Zone' },
  { colHeader: zoneType.carousel, colDef: 'Carousel' },
  { colHeader: 'row', colDef: 'Row' },
  { colHeader: 'shelf', colDef: 'Shelf' },
  { colHeader: 'bin', colDef: 'Bin' },
  { colHeader: 'cellSize', colDef: 'Cell Size' },
  { colHeader: 'lotNumber', colDef: 'Serial Lot Number' },
  { colHeader: 'serialNumber', colDef: 'Serial Number' },
  { colHeader: 'expirationDate', colDef: 'Expiration Date' },
  { colHeader: 'revision', colDef: 'Revision' },
  { colHeader: 'unitOfMeasure', colDef: 'Unit of Measure' },
  { colHeader: 'maximumQuantity', colDef: 'Maximum Quantity' },
  { colHeader: 'putAwayDate', colDef: 'Put Away Date' },
  { colHeader: ColumnDef.userField1, colDef: TableConstant.UserField1 },
  { colHeader: ColumnDef.userField2, colDef: TableConstant.UserField2 },
  { colHeader: 'masterLocation', colDef: 'Master Location' },
  { colHeader: 'dateSensitive', colDef: 'Date Sensitive' },
  { colHeader: 'dedicated', colDef: 'Dedicated' },
  { colHeader: 'masterInvMapID', colDef: 'Master Inv Map ID' },
  { colHeader: 'minQuantity', colDef: 'Min Quantity' },
  { colHeader: 'invMapID', colDef: 'Inv Map ID' },
];

@Component({
  selector: 'app-move-items',
  templateUrl: './move-items.component.html',
  styleUrls: ['./move-items.component.scss'],
})
export class MoveItemsComponent implements OnInit {
  isActiveTrigger:boolean =false;
  paginator: MatPaginator;
  paginatorTo: MatPaginator;
  paginators: QueryList<MatPaginator>;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  @ViewChild('matToolbar') matToolbar: ElementRef;
  public dataSource: any = new MatTableDataSource();
  public moveToDatasource: any = new MatTableDataSource();
  @ViewChild('trigger') trigger: MatMenuTrigger;
  tabIndex: any = 0;
  public iAdminApiService: IAdminApiService;
  isRowSelected = false;
  contextMenuPosition = { x: '0px', y: '0px' };
  moveFromFilter: string = '1 = 1';
  moveToFilter: string = '1 = 1';
  tableType = 'MoveFrom';
  userData: any;
  itemNo: any = '';
  isValidateMove = false;
  isViewAll = false;
  reqDate: Date = new Date();
  sortOrder = 'asc';
  sortCol = 0;
  totalRecords = 0;
  startRow = 0;
  endRow = 10;
  recordsPerPage = 10;
  recordsFiltered = 0;
  itemSelected = true;
  from_zone = '';
  sortOrderTo = 'asc';
  sortColTo = 0;
  totalRecordsTo = 0;
  startRowTo = 0;
  endRowTo = 10;
  recordsPerPageTo = 10;
  recordsFilteredTo = 0;

  viewMode = 'NOA';
  viewModeTo = 'NOA';

  invMapID = -1;
  invMapIDToItem = -1;
  invMapmoveToID = 0;
  invMapmoveFromID = 0;
  viewAll = false;
  customLabel = '';
  customLabelTo = '';
  from_priority = 0;
  from_warehouse = '';
  from_location = '';
  from_locationShow = '';
  from_itemNo = '';
  from_description = '';
  from_itemQuantity = 0;
  from_cellSize = '';
  from_lotNo = '';
  from_serialNo = '';
  from_moveQty = '';
  from_itemQtyShow = '';

  to_priority = 0;
  to_warehouse = '';
  to_location = '';
  to_locationShow = '';
  to_itemNo = '';
  to_description = '';
  to_itemQuantity = 0;
  to_cellSize = '';
  to_lotNo = '';
  to_serialNo = '';
  to_moveQty = '';
  to_itemQtyShow = '';
  to_zone = '';
  fillQty = 0;
  fillQtytoShow = 0;
  maxMoveQty = 0;
  isMoveQty = true;
  dedicateMoveTo = false;
  undedicateMoveFrom = false;
  isDedicated = false;
  moveFromDedicated = '';
  moveToDedicated = '';
  pageEvent: PageEvent;
  pageEventTo: PageEvent;
  itemNumberSearch = new Subject<string>();
  hideRequiredControl = new FormControl(false);
  searchAutocompletItemNo: any = [];
  public itemnumscan: any = ''; 

  public iCommonAPI : ICommonApi;
  
  constructor(
    public commonAPI : CommonApiService,
    private authService : AuthService,
    private global : GlobalService,
    public adminApiService : AdminApiService,
    private renderer: Renderer2,
    private contextMenuService : TableContextMenuService
  ) {
    this.userData = this.authService.userData();
    this.iAdminApiService = adminApiService;
    this.iCommonAPI = commonAPI;
  }

  ngOnInit(): void {
    this.itemNumberSearch
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.startRow = 0;
        this.endRow = 10;
        this.resetPaginationFrom();
        this.autocompleteSearchColumn();
      });
    this.getMoveItemList('MoveFrom');
    this.getMoveItemList('MoveTo');
  }

  ngAfterViewInit() {
    const appHeaderElement = document.querySelector('app-header');
    this.renderer.setStyle(appHeaderElement, 'z-index', '99999');
  }

  public displayedColumns: any = [
    'warehouse',
    'locationNumber',
    UniqueConstants.goldenZone,
    'itemNumber',
    'description',
    'itemQuantity',
    'quantityAllocatedPick',
    'quantityAllocatedPutAway',
    'zone',
    zoneType.carousel,
    'row',
    'shelf',
    'bin',
    'cellSize',
    'lotNumber',
    'serialNumber',
    'expirationDate',
    'revision',
    'unitOfMeasure',
    'maximumQuantity',
    'putAwayDate',
    ColumnDef.userField1,
    ColumnDef.userField2,
    'masterLocation',
    'dateSensitive',
    'dedicated',
    'masterInvMapID',
    'minQuantity',
    'invMapID',
  ];
  stageTable: any = [];
  columnSeq: any = [];

  getMoveItemList(tableName, fromPagination = false, unselectFrom = false) {
    if (tableName === 'MoveTo')
      if (this.viewAll || this.dataSource.data.length === 0) this.viewModeTo = ResponseStrings.AllCaps;
      else if (fromPagination && !this.isRowSelected) this.viewModeTo = ResponseStrings.AllCaps;
      else if (unselectFrom) this.viewModeTo = ResponseStrings.AllCaps;
      else this.viewModeTo = 'NOA';

    let payload = {
      draw: 1,
      StartRow: tableName === 'MoveFrom' ? this.startRow : this.startRowTo,
      EndRow: tableName === 'MoveFrom' ? this.endRow : this.endRowTo,
      searchString: tableName === 'MoveFrom' ? this.itemNo : this.from_itemNo,
      searchColumn: Column.ItemNumber,
      sortColumnIndex: tableName === 'MoveFrom' ? this.sortCol : this.sortColTo,
      sortOrder: tableName === 'MoveFrom' ? this.sortOrder : this.sortOrderTo,
      tableName: tableName,
      cellSize: this.from_cellSize,
      warehouse: this.from_warehouse,
      invMapid: tableName === 'MoveFrom' ? this.invMapID : this.invMapIDToItem,
      viewMode: tableName === 'MoveFrom' ? this.viewMode : this.viewModeTo,
      filter: tableName === 'MoveFrom' ? this.moveFromFilter : this.moveToFilter,
    };

    this.iAdminApiService.GetMoveItemsTable(payload).subscribe((res: any) => {
      if(res.isExecuted)
      {
        if (res?.data && res.data['moveMapItems'].length === 0)
          if (tableName === 'MoveFrom') this.resetPaginationFrom();
          else this.resetPaginationTo();

        if (tableName === 'MoveTo') {
          res?.data && res.data['moveMapItems'].map((item : any) => item.isSelected = false);
          this.moveToDatasource = new MatTableDataSource(res?.data && res.data && res.data['moveMapItems']);
          this.totalRecordsTo = res?.data.recordsTotal;
          this.recordsFilteredTo = res?.data.recordsFiltered;
          this.customLabelTo = `Showing page ${this.totalRecords} of ${Math.ceil(this.totalRecords / this.recordsPerPage)}`;
        } else {
          res?.data && res.data && res.data['moveMapItems'].map((item : any) => item.isSelected = false);
          this.dataSource = new MatTableDataSource(res?.data['moveMapItems']);
          this.totalRecords = res?.data.recordsTotal;
          this.recordsFiltered = res?.data.recordsFiltered;
          this.customLabel = `Showing page ${this.totalRecords} of ${Math.ceil(this.totalRecords / this.recordsPerPage)}`;
        }
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("GetMoveItemsTable",res.responseMessage);
      }
    });
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  async autocompleteSearchColumn() {
    let searchPayload = {
      itemNumber: this.itemNo,
      beginItem: '---',
      isEqual: false
    };
    this.iCommonAPI.SearchItem(searchPayload).subscribe({
      next: (res: any) => {
        this.searchAutocompletItemNo = res.data;
        this.getMoveItemList('MoveFrom');
      }
    });
  }

  searchData(event) {
    if (this.tabIndex === 1) this.tabIndex = 0;
  }
  
  sortChange(event) {
    if (!this.dataSource._data._value || event.direction == '' || event.direction == this.sortOrder) return;
    let index;
    this.displayedColumns.find((x, i) => { if(x === event.active) index = i; });
    this.sortCol = index;
    this.sortOrder = event.direction;
    this.getMoveItemList('MoveFrom');
  }

  sortChangeToItems(event) {
    if (!this.moveToDatasource._data._value || event.direction == '' || event.direction == this.sortOrderTo) return;
    let index;
    this.displayedColumns.find((x, i) => { if (x === event.active) index = i; });
    this.sortColTo = index;
    this.sortOrderTo = event.direction;
    this.getMoveItemList('MoveTo');
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.startRow = e.pageSize * e.pageIndex;
    this.endRow = e.pageSize * e.pageIndex + e.pageSize;
    this.recordsPerPage = e.pageSize;
    this.getMoveItemList('MoveFrom');
  }

  handlePageEventTo(e: PageEvent) {
    this.pageEventTo = e;
    this.startRowTo = e.pageSize * e.pageIndex;
    this.endRowTo = e.pageSize * e.pageIndex + e.pageSize;
    this.recordsPerPageTo = e.pageSize;
    this.getMoveItemList('MoveTo', true);
  }

  getMoveFromDetails(row, i?, type?) {
    let isMoveFromSelected = false;
    console.log(row)

    if (type === 'MoveTo') 
    {
      this.dataSource._data._value.forEach((element, index) => {
        if (!element.isSelected) return;
        isMoveFromSelected = element.isSelected;
      });
      if (!isMoveFromSelected) {
        this.itemSelected = false;
        return;
      } else {
        this.itemSelected = true;
        this.moveToDatasource._data._value[i].isSelected = !this.moveToDatasource._data._value[i].isSelected;
        this.moveToDatasource._data._value.forEach((element, index) => {
          if (row.rn === element.rn) return;
          this.moveToDatasource._data._value[index].isSelected = false;
        });
      }

      this.invMapIDToItem = row.inventoryMapID;
      this.to_warehouse = row.warehouse;
      this.to_location = row.location;
      this.to_locationShow = row.locationNumber;
      this.to_itemNo = row.itemNumber;
      this.to_description = row.description;
      this.to_itemQuantity = row.itemQuantity;
      this.to_itemQtyShow = row.itemQuantity;
      this.to_cellSize = row.cellSize;
      this.to_lotNo = row.lotNumber;
      this.to_serialNo = row.serialNumber;
      this.to_itemQuantity = row.itemQuantity;
      this.to_zone = row.zone;
      this.invMapmoveToID = row.inventoryMapID;
      this.isDedicated = row.dedicated ;
      this.fillQty = row.itemQuantity - row.maximumQuantity - row.quantityAllocatedPutAway;
      this.fillQtytoShow = this.fillQty;
      if (this.fillQty < 0) this.fillQty = 0;
      this.moveToDedicated = row.dedicated === true ? 'Dedicated' : 'Not Dedicated';
      this.isValidateMove = true;
      if (!row.isSelected) this.clearFields('MoveTo');
      else this.isMoveQty = false;
    } 
    else if (type === 'MoveFrom') 
    {
      this.dataSource._data._value[i].isSelected = !this.dataSource._data._value[i].isSelected;
      this.isRowSelected = !this.isRowSelected;
      
      if (!this.isRowSelected) {
        this.moveToDatasource._data._value.forEach((element, index) => element.isSelected = false);
        this.clearFields('MoveFrom');
        this.clearFields('MoveTo');
      }

      this.dataSource._data._value.forEach((element, index) => {
        if (row.rn === element.rn) return;
        this.dataSource._data._value[index].isSelected = false;
      });

      if (!this.dataSource._data._value[i].isSelected) {
        if (!row.isSelected) this.clearFields('MoveFrom');
        else this.isMoveQty = false;
        this.from_itemNo = '';
        this.from_cellSize = '';
        this.invMapIDToItem = -1;
        this.viewModeTo = ResponseStrings.AllCaps;
        this.startRowTo = 0;
        this.endRowTo = 10;
        this.paginator.pageIndex = 0;
        this.getMoveItemList('MoveTo', false, true);
        return;
      }

      this.invMapmoveFromID = row.inventoryMapID;
      this.from_warehouse = row.warehouse;
      this.from_location = row.location;
      this.from_locationShow = row.locationNumber;
      this.from_itemNo = row.itemNumber;
      this.from_description = row.description;
      this.from_itemQuantity = row.itemQuantity;
      this.from_cellSize = row.cellSize;
      this.from_lotNo = row.lotNumber;
      this.from_serialNo = row.serialNumber;
      this.from_itemQtyShow = row.itemQuantity;
      this.moveFromDedicated = row.dedicated === true ? 'Dedicated' : 'Not Dedicated';
      this.isDedicated = row.dedicated
      this.fillQty = row.itemQuantity - row.maximumQuantity - row.quantityAllocatedPutAway;
      this.from_zone = row.zone;
      if (this.fillQty < 0) this.fillQty = 0;
      this.maxMoveQty = row.itemQuantity - row.quantityAllocatedPick;
      this.isMoveQty = false;
      if (this.maxMoveQty <= 0) {
        this.openAlertDialog('MaxAlloc');
        this.dataSource._data._value.forEach((element, index) => element.isSelected = false);
        return;
      } else if (row.quantityAllocatedPick > 0) {
        this.from_itemQuantity = this.maxMoveQty;
        this.openAlertDialog('MoveCap', this.maxMoveQty);
      } else this.from_itemQuantity = this.maxMoveQty;
      this.getMoveItemList('MoveTo');
    }
  }

  openAlertDialog(type, maxMoveQty?, callback?) {
    let message = '';
    let isDisableButton = true;
    let buttonFields = false;
    switch (type) {
      case 'Un-Dedicate':
        message = 'Would you like to Undedicate your move from Location?';
        isDisableButton = false;
        buttonFields = true;
        break;

      case 'Dedicate':
        message = 'Would you like to Dedicate your move to Location?';
        isDisableButton = false;
        buttonFields = true;
        break;
      case 'ZeroQty':
        message =
          'You must specify a Qty greater than 0 to create Move Transactions';
        break;

      case 'MaxMove':
        message =
          'You must specify a Qty less than the Available Qty of ' +
          maxMoveQty +
          ' to create Move transactions';
        break;

      case ResponseStrings.Error:
        message =
          'An Error occured while creating move Transactions. Check the Event log for More information';
        break;

      case 'MoveCap':
        message =
          'Cannot Move more than ' +
          maxMoveQty +
          ' because there are currently Picks allocated to this Location. Deallocate these Transactions if you would like to move more than ' +
          maxMoveQty +
          '.';
        break;

      case 'MaxAlloc':
        message =
          'Your Allocations for the Location exceed or match the current qty. To move from this location, de-allocate transactions to free up inventory';
        this.isMoveQty = true;
        this.from_priority = 0;
        this.from_itemQuantity = 0;
        this.clearFields('MoveFrom');
        break;

      default:
        break;
    }

    const dialogRef:any = this.global.OpenDialog(AlertConfirmationComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      data: {
        message: message,
        heading: '',
        disableCancel: isDisableButton,
        buttonField: buttonFields,
        notificationPrimary: true,
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (this.isDedicated && this.moveFromDedicated === 'Dedicated') {
        // open dedicated and undedicated popups case
        if (type === 'Dedicate') {
          if (result) {
            this.dedicateMoveTo = true;
            this.openAlertDialog('Un-Dedicate');
          } else {
            this.dedicateMoveTo = false;
            this.openAlertDialog('Un-Dedicate');
          }
        }

        if (type === 'Un-Dedicate') {
          if (result) {
            this.undedicateMoveFrom = true;

            this.callCreateMoveTrans();
          } else {
            this.undedicateMoveFrom = false;

            this.callCreateMoveTrans();
          }
        }
      } else if (!this.isDedicated && this.moveFromDedicated === 'Dedicated') {
        // On undedicated popup  when dedicated unchecked move from is dedicated and move to is undedicted
        if (result) {
          this.undedicateMoveFrom = true;

          this.callCreateMoveTrans();
        } else {
          this.undedicateMoveFrom = false;

          this.callCreateMoveTrans();
        }
      } else if (
        this.isDedicated &&
        this.moveFromDedicated === 'Not Dedicated'
      ) {
        // when move from undedicated moveto dedicated and dedicated checked only dedicated popup show
        if (result) {
          this.dedicateMoveTo = true;

          this.callCreateMoveTrans();
        } else {
          this.dedicateMoveTo = false;

          this.callCreateMoveTrans();
        }
      }
    });
  }

  validateMove() {
    let moveQty: any = this.from_itemQuantity;
    this.dedicateMoveTo = false;
    this.undedicateMoveFrom = false;

    if (moveQty === '' || moveQty <= 0) {
      this.openAlertDialog('ZeroQty');
      return;
    } 
    else if (moveQty > this.maxMoveQty) {
      this.openAlertDialog('MaxMove', this.maxMoveQty);
      return;
    }

    if (this.isDedicated) {
      this.openAlertDialog('Dedicate', null, (val) => {});
      return;
    }

    if (this.moveFromDedicated === 'Dedicated') {
      this.openAlertDialog('Un-Dedicate');
      return;
    }

    this.callCreateMoveTrans();
  }

  tabChanged(tab: any) {
    if (tab.index === 0) {
      this.tableType = 'MoveFrom';
      this.isViewAll = false;
    } else if (tab.index === 1) {
      this.tableType = 'MoveTo';
      this.isViewAll = true;
    }
  }

  clearFields(type?) {
    if (type === 'MoveFrom') {
      this.from_priority = 0;
      this.from_warehouse = '';
      this.from_location = '';
      this.from_itemNo = '';
      this.from_description = '';
      this.from_itemQuantity = 0;
      this.from_cellSize = '';
      this.from_lotNo = '';
      this.from_serialNo = '';
      this.from_moveQty = '';
      this.from_itemQtyShow = '';
      this.from_locationShow = '';
      this.isMoveQty = true;
      this.moveFromDedicated = '';
      this.isDedicated = false;
    } else if (type === 'MoveTo') {
      this.to_priority = 0;
      this.to_warehouse = '';
      this.to_location = '';
      this.to_itemNo = '';
      this.to_description = '';
      this.to_itemQuantity = 0;
      this.to_cellSize = '';
      this.to_lotNo = '';
      this.to_serialNo = '';
      this.to_moveQty = '';
      this.to_itemQtyShow = '';
      this.to_locationShow = '';
      this.moveToDedicated = '';
      this.isValidateMove = false;
      this.isDedicated = false;
    }
    this.reqDate = new Date();
  }

  callCreateMoveTrans() {

    let payload = {
      moveFromID: this.invMapmoveFromID,
      moveToID: this.invMapmoveToID,
      moveFromItemNumber: this.from_itemNo,
      moveToItemNumber: this.to_itemNo,
      moveToZone: this.from_zone,
      moveQuantity: this.from_itemQuantity,
      requestedDate: this.reqDate,
      priority: this.from_priority,
      dedicateMoveTo: this.dedicateMoveTo,
      unDedicateMoveFrom: this.undedicateMoveFrom,
    };

    this.iAdminApiService.CreateMoveTransactions(payload).subscribe((res: any) => {
      if(res.isExecuted){
        this.global.ShowToastr(ToasterType.Success, 'Item moved successfully', ToasterTitle.Success);
        this.resetPagination();
        this.moveToFilter='1 = 1';
        this.moveFromFilter='1 = 1';
        this.tabIndex=0;
        this.itemNumberSearch.next('');
        this.getMoveItemList('MoveFrom');
        this.getMoveItemList('MoveTo');
        this.clearFields('MoveFrom')
        this.clearFields('MoveTo')
      } else {
        this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
        console.log("CreateMoveTransactions",res.responseMessage);
      }
    });
  }

  optionSelected(filter : string) {
    if (this.tableType === 'MoveFrom') this.moveFromFilter = filter;
    else if(this.tableType === 'MoveTo') this.moveToFilter = filter;
    this.resetFromFilters();
    this.resetPaginationFrom();
    this.getMoveItemList(this.tableType);  
    this.isActiveTrigger = false;
  }

  resetPagination() {
    this.sortOrder = 'asc';
    this.sortCol = 0;
    this.totalRecords = 0;
    this.startRow = 0;
    this.endRow = 10;
    this.recordsPerPage = 10;
    this.recordsFiltered = 0;
    this.sortOrderTo = 'asc';
    this.sortColTo = 0;
    this.totalRecordsTo = 0;
    this.startRowTo = 0;
    this.endRowTo = 10;
    this.recordsPerPageTo = 10;
    this.recordsFilteredTo = 0;
  }

  resetPaginationTo() {
    this.sortOrderTo = 'asc';
    this.sortColTo = 0;
    this.totalRecordsTo = 0;
    this.startRowTo = 0;
    this.endRowTo = 10;
    this.recordsPerPageTo = 10;
    this.recordsFilteredTo = 0;  
  }

  resetPaginationFrom() {
    this.sortOrder = 'asc';
    this.sortCol = 0;
    this.totalRecords = 0;
    this.startRow = 0;
    this.endRow = 10;
    this.recordsPerPage = 10;
    this.recordsFiltered = 0;
  }

  resetFromFilters() {
    this.startRow = 0;
  }

  resetToFilters() {
    this.startRowTo = 0;
    this.viewModeTo = ResponseStrings.AllCaps;
  }

  clearItemNum() {
    this.itemNo = '';
    this.invMapIDToItem = -1;
    this.clearFields('MoveFrom');
    this.clearFields('MoveTo');
    this.resetFromFilters();
    this.resetToFilters();
    this.autocompleteSearchColumn();
    this.resetPaginationFrom();
    this.resetPaginationTo();
    this.getMoveItemList('MoveFrom');
    this.getMoveItemList('MoveTo', false, true);
    if (this.tabIndex === 1) this.tabIndex = 0;
  }
}
