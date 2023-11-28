import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { AuthService } from '../../common/init/auth.service';
import { CmConfirmAndPackingSelectTransactionComponent } from 'src/app/dialogs/cm-confirm-and-packing-select-transaction/cm-confirm-and-packing-select-transaction.component';
import { CmConfirmAndPackingComponent } from 'src/app/dialogs/cm-confirm-and-packing/cm-confirm-and-packing.component';
import { CmItemSelectedComponent } from 'src/app/dialogs/cm-item-selected/cm-item-selected.component';
import { CmOrderNumberComponent } from 'src/app/dialogs/cm-order-number/cm-order-number.component';
import { CmPrintOptionsComponent } from 'src/app/dialogs/cm-print-options/cm-print-options.component';
import { CmShippingTransactionComponent } from 'src/app/dialogs/cm-shipping-transaction/cm-shipping-transaction.component';
import { CmShippingComponent } from 'src/app/dialogs/cm-shipping/cm-shipping.component';
import { catchError, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CmOrderToteConflictComponent } from 'src/app/dialogs/cm-order-tote-conflict/cm-order-tote-conflict.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatOption } from '@angular/material/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { AppRoutes, ConfirmationMessages, LiveAnnouncerMessage, ResponseStrings, StringConditions, ToasterMessages, ToasterTitle, ToasterType ,Column,DialogConstants,ColumnDef,Style,UniqueConstants} from 'src/app/common/constants/strings.constants';
import { KeyboardCodes } from 'src/app/common/enums/CommonEnums';

@Component({
  selector: 'app-consolidation',
  templateUrl: './consolidation.component.html',
  styleUrls: ['./consolidation.component.scss']
})

export class ConsolidationComponent implements OnInit {

  @ViewChild('stageSort') stageSort: MatSort;
  @ViewChild('unverifiedItemsPaginator') unverifiedItemsPaginator: MatPaginator;
  @ViewChild('verifiedItemsPaginator') verifiedItemsPaginator: MatPaginator;
  @ViewChild('stagePaginator') stagePaginator: MatPaginator;
  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  public startSelectFilter: any;
  public startSelectFilterLabel: any;
  packListSort:any;
  public sortBy: number
  public open: number = 0;
  public completed: number = 0;
  public backOrder: number = 0;
  public typeValue: any
  public userData: any;
  public filterValue: any;
  public consolidationIndex: any;
  public nextOrderbtn: boolean = false;
  public unverifyBtn: boolean = true;
  public verifyBtn: boolean = true;
  public packingBtn: boolean = true;
  public stagingBtn: boolean = true;
  public shippingBtn: boolean = true;
  public printButtons: boolean = true;
  public type: any = '';
  @ViewChild('matRef') matRef: MatSelect;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  public isItemVisible: boolean = true;
  public isSupplyVisible: boolean = false;

  searchAutoCompleteItemNum: any = [];

  stageColumns: string[] = ['toteID', 'complete', 'stagingLocation', 'stagedBy', 'stagedDate'];
  stageTable = new MatTableDataSource<any>([]);

  unverifiedItemsColumns: string[] = ['itemNumber', 'lineStatus', 'lineNumber', 'completedQuantity', 'toteID', 'serialNumber', ColumnDef.userField1, 'actions'];
  unverifiedItems = new MatTableDataSource<any>([]);

  verifiedItemsColumns: string[] = ['itemNumber', 'lineStatus', 'supplierItemID', 'lineNumber', 'completedQuantity', 'toteID', 'serialNumber', ColumnDef.userField1, 'actions'];
  verifiedItems = new MatTableDataSource<any>([]);

  filterOption: any = [
    { key: '0', value: 'Any Code' },
    { key: '1', value: Column.ItemNumber },
    { key: '10', value: Column.LotNumber },
    { key: '2', value: 'Supplier Item ID' },
    { key: '8', value: 'Serial Number' },
    { key: '6', value: Column.ToteID },
    { key: '9', value: 'User Field 1' },
  ];

  hideRow = true;
  firstTable = true;

  public IconsolidationAPI : IConsolidationApi;

  constructor(
    private global:GlobalService,
    public consolidationAPI : ConsolidationApiService, 
    public authService: AuthService,
    private currentTabDataService: CurrentTabDataService,
    private liveAnnouncer: LiveAnnouncer) {
      this.IconsolidationAPI = consolidationAPI;
     }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getConsolidationIndex()
  }

  ngAfterViewInit() {
    this.searchBoxField?.nativeElement.focus();
    this.applySavedItem();
  }

  applySavedItem() {
    if (this.currentTabDataService.savedItem[this.currentTabDataService.CONSOLIDATION])
    {
      let item= this.currentTabDataService.savedItem[this.currentTabDataService.CONSOLIDATION];
      this.open = item.open;
      this.completed = item.completed;
      this.backOrder = item.backOrder;
      this.stageTable = item.stageTable;
      this.unverifiedItems = item.unverifiedItems;
      this.verifiedItems = item.verifiedItems;
      this.typeValue = item.typeValue;
      this.dataSource = item.dataSource;
      return true;
    }
    return false;
  }

  recordSavedItem() {
    this.currentTabDataService.savedItem[this.currentTabDataService.CONSOLIDATION]= {
      open : this.open,
      completed : this.completed,
      backOrder : this.backOrder,
      stageTable : this.stageTable,
      unverifiedItems : this.unverifiedItems,
      verifiedItems : this.verifiedItems,
      typeValue : this.typeValue,
      dataSource : this.dataSource
    }
  }

  openAction(){
    this.clearMatSelectList();
  }

  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }

  announceSortChangeStage(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.stageTable.sort = this.stageSort;
  }

  clickToHide() {
    this.hideRow = !this.hideRow;
    this.firstTable = !this.firstTable;
  }

  enterOrderID(event) {
    this.typeValue = event.target.value;
    if (event.keyCode == KeyboardCodes.ENTER) {
      this.getTableData(this.typeValue);
    }
  }

  getConsolidationIndex() {
    let payload = {
      "orderNumber": this.typeValue
    }
    this.IconsolidationAPI.ConsolidationIndex(payload).subscribe((res: any) => {
      if (res.isExecuted) {
        this.consolidationIndex = res.data;
        this.startSelectFilterLabel = this.consolidationIndex.cmPreferences.defaultLookupType;
        this.packListSort = this.consolidationIndex.cmPreferences.packingListSort;
        this.filterOption.forEach((e: any) => {
          if (e.value == this.startSelectFilterLabel) {
            this.startSelectFilter = e.key;
          }
        });
        if (this.startSelectFilterLabel == StringConditions.SupplierItemID) {
          this.isItemVisible = false;
          this.unverifiedItemsColumns.shift()
          this.unverifiedItemsColumns.unshift('supplierItemID')
          this.isSupplyVisible = true;
        }
        else {
          this.isItemVisible = true;
          this.isSupplyVisible = false;
          this.unverifiedItemsColumns.shift()
          this.unverifiedItemsColumns.unshift('itemNumber')
        }
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ConsolidationIndex",res.responseMessage);
      }
    }
    )
  }

  getTableData(typeValue: any) {
    this.getConsolidationIndex();
    let curValue = typeValue;
    let payload = {
      "type": this.type,
      "selValue": curValue
    }
    this.IconsolidationAPI.ConsolidationData(payload).subscribe((res: any) => {
      if (res.isExecuted) {
        if ((typeof res.data == 'string')) {
          switch (res.data) {
            case ResponseStrings.DNE:
              this.global.ShowToastr(ToasterType.Error,ToasterMessages.ConsolidationOrderInvalid, ToasterTitle.Error);
              this.searchBoxField?.nativeElement.focus();
              break;
            case ResponseStrings.Conflict:
              this.openCmOrderToteConflict()
              this.global.ShowToastr(ToasterType.Error,ToasterMessages.ValueMatchToToteOrder, ToasterTitle.Error);
              break;
            case ResponseStrings.Error:
              this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorWhileRetrievingData, ToasterTitle.Error);
              break;
          }
        }
        else {
          this.btnEnable();
          this.open = res.data.openLinesCount;
          this.completed = res.data.completedLinesCount;
          this.backOrder = res.data.reprocessLinesCount;
          this.unverifiedItems = new MatTableDataSource(res.data.consolidationTable);
          this.verifiedItems = new MatTableDataSource(res.data.consolidationTable2);
          this.stageTable = new MatTableDataSource(res.data.stageTable);
          let waitingReprocessData: any[] = [];
          waitingReprocessData = this.unverifiedItems.data.filter((element) => element.lineStatus == StringConditions.WaitingReprocess)
          let data = this.verifiedItems.data;
          data.push(...waitingReprocessData);
          this.verifiedItems = new MatTableDataSource(data);
          this.unverifiedItems.data = this.unverifiedItems.data.filter((el) => {
            return !waitingReprocessData.includes(el)
          })
          this.unverifiedItems.paginator = this.unverifiedItemsPaginator;
          this.verifiedItems.paginator = this.verifiedItemsPaginator;
          this.stageTable.paginator = this.stagePaginator;
          let payload = {
            "orderNumber": curValue
          }
          this.IconsolidationAPI.ShippingButtSet(payload).subscribe((res: any) => {
            if(res.isExecuted)
            {
              if (res.data == 1) {
                this.enableConButts()
                this.shippingBtn = false;
              }
              else if (res.data == 0) {
                this.enableConButts()
                this.shippingBtn = true;
              }
              else {
                this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorOccured, ToasterTitle.Error);
              }
            }
            else {
              this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
              console.log("ShippingButtSet",res.responseMessage);
            }
          })
        }
      }
      else {
        this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
        console.log("ConsolidationData",res.responseMessage);
      }
      this.recordSavedItem();
    })
  }

  verifyAll() {
    let IDS: any = [];
    this.unverifiedItems.data.forEach((row: any) => {
      if (row.lineStatus != StringConditions.NotCompleted && row.lineStatus != StringConditions.NotAssigned) {
        IDS.push(row.id.toString())
      }
    });
    let payload = {
      "iDs":IDS
    }
    this.IconsolidationAPI.VerifyAllItemPost(payload).subscribe((res: any) => {
      if (!res.isExecuted) {
        this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
        console.log("VerifyAllItemPost",res.responseMessage);
      }
      else {
        let tempData: any[] = [];
        this.unverifiedItems.data.forEach((row: any) => {
          // check if the value at row.itemNumber exists in the IDS array using the indexOf method. 
          if (IDS.indexOf(row.id.toString()) != -1) {
            tempData.push(row)
          }
        });
        let data = this.verifiedItems.data;
        data.push(...tempData);
        this.verifiedItems = new MatTableDataSource(data);
        this.unverifiedItems.paginator = this.unverifiedItemsPaginator
        this.verifiedItems.paginator = this.verifiedItemsPaginator;
        this.unverifiedItems.data = this.unverifiedItems.data.filter((el) => {
          return !tempData.includes(el)
        })
        if (this.unverifiedItems.data.length == 0) {
          this.global.ShowToastr(ToasterType.Info,ToasterMessages.ConsolidatedAllItemsInOrder, ToasterTitle.Alert);
        }
      }
    })
  }

  unverifyAll() {
    let tempData: any = [];
    tempData = this.verifiedItems.data.filter((element) => element.lineStatus != StringConditions.WaitingReprocess)
    let IDS: any = [];
    tempData.forEach((row: any) => {
      IDS.push(row.id.toString())
    }
    )
    let payload = {
      "iDs": IDS
    }
    this.IconsolidationAPI.UnVerifyAll(payload).subscribe((res: any) => {
      if (!res.isExecuted) {
        this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
        console.log("UnVerifyAll",res.responseMessage);
      }
      else {
        this.unverifiedItems.data = this.unverifiedItems.data.concat(tempData);
        this.verifiedItems.data = this.verifiedItems.data.filter((el) => {
          return !tempData.includes(el)
        })
        this.unverifiedItems.paginator = this.unverifiedItemsPaginator
        this.verifiedItems.paginator = this.verifiedItemsPaginator;
      }
    })
  }

  verifyLine(element: any, Index?: any) {
    let index: any;
    let status: any;
    let id: any;
    if (Index != undefined) {
      id = this.unverifiedItems.data[Index].id;
      status = this.unverifiedItems.data[Index].lineStatus;
    }
    else {
      index = this.unverifiedItems.data.indexOf(element);
      status = element.lineStatus;
      id = element.id;
    }
    if (status == StringConditions.NotCompleted || status == StringConditions.NotAssigned) {
      this.global.ShowToastr(ToasterType.Error,ToasterMessages.ItemNotCompleted, ToasterTitle.Error);
    }
    else {
      let payload = {
        "id": id
      }
      this.IconsolidationAPI.VerifyItemPost(payload).subscribe((res: any) => {
        if (res.isExecuted) {
          if (Index != undefined) {
            let data = this.verifiedItems.data;
            data.push({ ...this.unverifiedItems.data[Index] });
            this.verifiedItems = new MatTableDataSource(data);
            let data2 = this.unverifiedItems.data;
            data2.splice(Index, 1);
            this.unverifiedItems = new MatTableDataSource(data2);
            this.unverifiedItems.paginator = this.unverifiedItemsPaginator;
            this.verifiedItems.paginator = this.verifiedItemsPaginator;
          }
          else {
            let data = this.verifiedItems.data;
            data.push({ ...this.unverifiedItems.data[index] });
            this.verifiedItems = new MatTableDataSource(data);
            let data2 = this.unverifiedItems.data;
            data2.splice(index, 1);
            this.unverifiedItems = new MatTableDataSource(data2);
            this.unverifiedItems.paginator = this.unverifiedItemsPaginator;
            this.verifiedItems.paginator = this.verifiedItemsPaginator;
          }
        }
        else {
          this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error)
          console.log("VerifyItemPost",res.responseMessage);
        }
      })
    }
  }

  unverifyLine(element) {
    let id = element.id;
    let status = element.lineStatus;
    let index = this.verifiedItems.data.indexOf(element)
    if (status == StringConditions.WaitingReprocess) {
      return;
    }
    else {
      let payload = {
        "id": id
      }
      this.IconsolidationAPI.DeleteVerified(payload).subscribe((res: any) => {
        if (res.isExecuted) {
          let data2 = this.unverifiedItems.data;
          data2.push({ ...this.verifiedItems.data[index] });
          this.unverifiedItems = new MatTableDataSource(data2);
          let data = this.verifiedItems.data;
          data.splice(index, 1);
          this.verifiedItems = new MatTableDataSource(data);
          this.unverifiedItems.paginator = this.unverifiedItemsPaginator;
          this.verifiedItems.paginator = this.verifiedItemsPaginator;
        }
        else {
          this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
          console.log("DeleteVerified",res.responseMessage);
        }
      })
    }
  }

  getFilterValue(event) {
    if (event.keyCode == KeyboardCodes.ENTER) {
      this.checkDuplicatesForVerify(this.filterValue);
    }
    this.recordSavedItem();
  }

  checkVerifyType(val) {
    let filterVal = this.filterValue
    this.filterValue = '';
    if (val != undefined) {
      filterVal = val
    }
    let valueCount = 0;
    let index;
     this.unverifiedItems.data.some((obj, i) => {
      for (let key in obj) {
        if (obj[key] === filterVal) {
          index = i;
          valueCount++;
        }
      }
    });
    return { index: index, valueCount: valueCount }
  }

  checkDuplicatesForVerify(val) {
    let columnIndex = this.startSelectFilter;
    let result: any;
    if (columnIndex == 0) {
      this.filterOption.forEach((e: any) => {
        result = this.checkVerifyType(val);
      });
    }
    else
      result = this.checkVerifyType(val);
    // desturcturing
    const { verifyItems, blindVerifyItems } = this.consolidationIndex.cmPreferences;
    if (result.valueCount >= 1 && verifyItems == StringConditions.No && blindVerifyItems == StringConditions.No) {
      const dialogRef:any = this.global.OpenDialog(CmItemSelectedComponent, {
        height: 'auto',
        width: '899px',
        autoFocus: DialogConstants.autoFocus,
      disableClose:true,
        data: {
          identModal: this.typeValue,
          colLabel: this.startSelectFilterLabel,
          columnModal: val,
          unverifiedItems: this.unverifiedItems.data,
          verifiedItems: this.verifiedItems.data,
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        if (result?.isExecuted) {
          this.getTableData(this.typeValue);
        }
      })
    }
    else if (result.valueCount >= 1) {
      this.verifyLine(val, result.index)
    }
    else {
      this.global.ShowToastr(ToasterType.Error,ToasterMessages.ItemNotInOrder, ToasterTitle.Error);
    }
  }

  getSelected(event: MatSelectChange): void {
    this.startSelectFilter = event.value;
    this.filterOption.forEach((e: any) => {
      if (e.key == event.value) {
        this.startSelectFilter = e.key;
        this.startSelectFilterLabel = e.value;
      }
    });
    if (event.value == 2) {
      this.isItemVisible = false;
      this.unverifiedItemsColumns.shift()
      this.unverifiedItemsColumns.unshift('supplierItemID')
      this.isSupplyVisible = true;
    }
    else {
      this.isItemVisible = true;
      this.isSupplyVisible = false;
      this.unverifiedItemsColumns.shift()
      this.unverifiedItemsColumns.unshift('itemNumber')
    }
    this.recordSavedItem();
  }

  btnEnable() {
    this.verifyBtn = false;
    this.unverifyBtn = false;
  }

  btnDisable() {
    this.verifyBtn = true;
    this.unverifyBtn = true;
  }

  enableConButts() {
    this.nextOrderbtn = false;
    this.stagingBtn = false;
    this.packingBtn = false;
    this.verifyBtn = false;
    this.unverifyBtn = false;
    this.printButtons = false;
  }

  disableConButts() {
    this.nextOrderbtn = true;
    this.stagingBtn = true;
    this.packingBtn = true;
    this.verifyBtn = true;
    this.unverifyBtn = true;
    this.printButtons = true;
  }

  clearPageData() {
    this.unverifiedItems.data = [];
    this.verifiedItems.data = [];
    this.stageTable.data = [];
    this.typeValue = '';
    this.open = 0;
    this.completed = 0;
    this.backOrder = 0;
    this.unverifiedItemsPaginator.pageIndex = 0;
    this.verifiedItemsPaginator.pageIndex = 0;
    this.stagePaginator.pageIndex = 0;
  }

  async autoCompleteSearchColumnItem(val:any = null) {
    if(val) this.filterValue = val;
    let payload = {
      "column": this.startSelectFilter,
      "value": this.filterValue ? this.filterValue : '',
      "orderNumber": this.typeValue
    }
    this.IconsolidationAPI.ConsoleItemsTypeAhead(payload).pipe(
      catchError((error) => {
        // Handle the error here
        this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorWhileRetrievingData, ToasterTitle.Error);
        console.log("ConsoleItemsTypeAhead");
        // Return a fallback value or trigger further error handling if needed
        return of({ isExecuted: false });
      })
    ).subscribe((res: any) => {
      this.searchAutoCompleteItemNum = res.data;
    });
  }

  getRow(filtervalue) {
    this.checkDuplicatesForVerify(filtervalue);
  }

  openCmShipping() {
    let dialogRef:any = this.global.OpenDialog(CmShippingComponent, {
      height: 'auto',
      width: '96vw',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: { orderNumber: this.typeValue }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTableData(this.typeValue);
      }
    })
  }

  openCmShippingTransaction() {
    let dialogRef:any = this.global.OpenDialog(CmShippingTransactionComponent, {
      height: 'auto',
      width: '96vw',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        orderNum: this.typeValue ? this.typeValue : '2909782A',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result?.isExecuted) {
        this.getTableData(this.typeValue);
      }
    });
  }

  openCmConfirmPacking() {
    let dialogRef:any = this.global.OpenDialog(CmConfirmAndPackingComponent, {
      height: 'auto',
      width: '96vw',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: { orderNumber: this.typeValue }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTableData(this.typeValue);
      }
    })
  }

  openCmOrderNo() {
    this.clearPageData();
    this.searchBoxField?.nativeElement.focus();
    this.disableConButts();
    this.recordSavedItem();
  }

  openCmOrderNumber() {
    let dialogRef:any = this.global.OpenDialog(CmOrderNumberComponent, {
      height: 'auto',
      width: Style.w50vw,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        orderNumber: this.typeValue,
        stagingTable: this.stageTable?.data ? this.stageTable.data : []
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.focusOnOrderNum();
    });
  }

  openCmItemSelected() {
    this.global.OpenDialog(CmItemSelectedComponent, {
      height: 'auto',
      width: Style.w50vw,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    })
  }

  openCmSelectTransaction() {
    this.global.OpenDialog(CmConfirmAndPackingSelectTransactionComponent, {
      height: 'auto',
      width: Style.w50vw,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    })
  }

  openCmPrintOptions() {
    this.global.OpenDialog(CmPrintOptionsComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    })
  }

  openPacking() {
    if (this.consolidationIndex.cmPreferences.confirmAndPacking) {
      this.openCmConfirmPacking();
    } else {
      this.openCmShippingTransaction()
    }
  }

  openCmOrderToteConflict() {
    let dialogRef:any = this.global.OpenDialog(CmOrderToteConflictComponent, {
      height: 'auto',
      width: '620px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe(result => {
      this.type = result;
      if (this.type) this.getTableData(this.typeValue);
    })
  }

  focusOnOrderNum() {
    setTimeout(() => {
      this.searchBoxField?.nativeElement.focus();
    }, 100);
  }

  navigateToOrder() {
    window.location.href = `${AppRoutes.AdminTransaction}?orderStatus=${this.typeValue ? this.typeValue : ''}&IsOrderStatus=true`;
  }

  printPreviewNonVerified(print = true) {
    if (this.unverifiedItems?.filteredData && this.unverifiedItems.filteredData.length > 0) {
      if(print){
        this.global.Print(`FileName:PrintPrevNotVerified|OrderNum:${this.typeValue}|WSID:${this.userData.wsid}`)
      }
      else{
        window.open(`${AppRoutes.ReportView}?file=FileName:PrintPrevNotVerified|OrderNum:${this.typeValue}|WSID:${this.userData.wsid}`, UniqueConstants._blank, 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
      }
    }
    else {
      this.global.ShowToastr(ToasterType.Error,ToasterMessages.NoUnverfiedItems, ToasterTitle.Error);
    }
  }

  printPreviewPackList(print = true) {
    if (this.unverifiedItems?.filteredData && this.unverifiedItems.filteredData.length > 0) {
      let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: '786px',
        data: {
          message: ConfirmationMessages.UnverfiedItemsLeft
        },
        autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === StringConditions.Yes) {
          this.IconsolidationAPI.ShowCMPackPrintModal({ orderNumber: this.typeValue }).subscribe((res: any) => {
            if (res.isExecuted && res.data == ResponseStrings.All) {
              if(print){
                this.global.Print(`FileName:PrintPrevCMPackList|OrderNum:${this.typeValue}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`)
              }
              else{
                window.open(`${AppRoutes.ReportView}?file=FileName:PrintPrevCMPackList|OrderNum:${this.typeValue}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`, UniqueConstants._blank, 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
              }
            } else if (res.isExecuted && res.data == ResponseStrings.Modal) {
              this.showCmPackPrintModal(true, this.typeValue,print);
            } else {
              this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorOccured,ToasterTitle.Error);
              console.log("ShowCMPackPrintModal",res.responseMessage);
            }
          });
        }
      });
    }
    else {
      this.IconsolidationAPI.ShowCMPackPrintModal({ orderNumber: this.typeValue }).subscribe((res: any) => {
        if (res.isExecuted && res.data == ResponseStrings.All) {
          if(print){
            this.global.Print(`FileName:PrintPrevCMPackList|OrderNum:${this.typeValue}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`)
          }
          else{
            window.open(`${AppRoutes.ReportView}?file=FileName:PrintPrevCMPackList|OrderNum:${this.typeValue}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`, UniqueConstants._blank, 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
          }
        } else if (res.isExecuted && res.data == ResponseStrings.Modal) {
          this.showCmPackPrintModal(true, this.typeValue,print);
        } else {
          this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorOccured,ToasterTitle.Error);
          console.log("ShowCMPackPrintModal",res.responseMessage);
        }
      });
    }
  }

  showCmPackPrintModal(preview:boolean,orderNumber:any,print:any){
     this.global.OpenDialog(CmPrintOptionsComponent, {
      height: 'auto',
      width: '786px',
      data: {
        preview : preview,
        orderNumber: orderNumber,
        packListSort : this.packListSort,
        print : print
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });
  }
}


