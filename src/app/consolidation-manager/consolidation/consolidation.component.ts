import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';

import { AuthService } from '../../../app/init/auth.service';
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
import { IConsolidationApi } from 'src/app/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/services/consolidation-api/consolidation-api.service';
import { LiveAnnouncerMessage } from 'src/app/common/constants/strings.constants';
import { KeyboardCodes } from 'src/app/common/enums/CommonEnums';

@Component({
  selector: 'app-consolidation',
  templateUrl: './consolidation.component.html',
  styleUrls: ['./consolidation.component.scss']
})
export class ConsolidationComponent implements OnInit {

  @ViewChild('matSort1') sort1: MatSort;
  @ViewChild('matSort2') sort2: MatSort;
  @ViewChild('matSort3') sort3: MatSort;

  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('paginator3') paginator3: MatPaginator;

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

  displayedColumns: string[] = ['toteID', 'complete', 'stagingLocation', 'stagedBy', 'stagedDate'];
  stageTable = new MatTableDataSource<any>([]);

  displayedColumns_1: string[] = ['itemNumber', 'lineStatus', 'lineNumber', 'completedQuantity', 'toteID', 'serialNumber', 'userField1', 'actions'];
  tableData_1 = new MatTableDataSource<any>([]);

  displayedColumns_2: string[] = ['itemNumber', 'lineStatus', 'supplierItemID', 'lineNumber', 'completedQuantity', 'toteID', 'serialNumber', 'userField1', 'actions'];
  tableData_2 = new MatTableDataSource<any>([]);

  filterOption: any = [
    { key: '0', value: 'Any Code' },
    { key: '1', value: 'Item Number' },
    { key: '10', value: 'Lot Number' },
    { key: '2', value: 'Supplier Item ID' },
    { key: '8', value: 'Serial Number' },
    { key: '6', value: 'Tote ID' },
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
    private _liveAnnouncer: LiveAnnouncer) {
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
      this.tableData_1 = item.tableData_1;
      this.tableData_2 = item.tableData_2;
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
      tableData_1 : this.tableData_1,
      tableData_2 : this.tableData_2,
      typeValue : this.typeValue,
      dataSource : this.dataSource
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.tableData_1.sort = this.sort1;
  }

  openAction(){
    this.clearMatSelectList();
  }

  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }

  announceSortChange2(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.tableData_2.sort = this.sort2;
  }

  announceSortChange3(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.stageTable.sort = this.sort3;
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
        if (this.startSelectFilterLabel == 'Supplier Item ID') {
          this.isItemVisible = false;
          this.displayedColumns_1.shift()
          this.displayedColumns_1.unshift('supplierItemID')
          this.isSupplyVisible = true;
        }
        else {
          this.isItemVisible = true;
          this.isSupplyVisible = false;
          this.displayedColumns_1.shift()
          this.displayedColumns_1.unshift('itemNumber')
        }
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
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
            case "DNE":
              this.global.ShowToastr('error',"Consolidation The Order/Tote that you entered is invalid or no longer exists in the system.", 'Error!');
              this.searchBoxField?.nativeElement.focus();
              break;

            case "Conflict":
              this.openCmOrderToteConflict()
              this.global.ShowToastr('error',"The Value you Entered matched a Tote and Order Number, select one to Continue.", 'Error!');
              break;

            case "Error":
              this.global.ShowToastr('error',"An Error occured while retrieving data.", 'Error!');
              break;
          }

        }
        else {
          this.btnEnable();
          this.open = res.data.openLinesCount;
          this.completed = res.data.completedLinesCount;
          this.backOrder = res.data.reprocessLinesCount;

          this.tableData_1 = new MatTableDataSource(res.data.consolidationTable);
          this.tableData_2 = new MatTableDataSource(res.data.consolidationTable2);
          this.stageTable = new MatTableDataSource(res.data.stageTable);
          let z: any[] = [];



          z = this.tableData_1.data.filter((element) => element.lineStatus == 'Waiting Reprocess')
          let data = this.tableData_2.data;
          data.push(...z);
          this.tableData_2 = new MatTableDataSource(data);

          this.tableData_1.data = this.tableData_1.data.filter((el) => {
            return !z.includes(el)
          })


          this.tableData_1.paginator = this.paginator;
          this.tableData_2.paginator = this.paginator2;
          this.stageTable.paginator = this.paginator3;

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
                this.global.ShowToastr('error','Error has occured', 'Error!');
              }
            }
            else {
              this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
              console.log("ShippingButtSet",res.responseMessage);

            }
          })
        }
      }
      else {
        this.global.ShowToastr('error',res.responseMessage, 'Error!');
        console.log("ConsolidationData",res.responseMessage);
      }
      
      this.recordSavedItem();
    })
  }

  verifyAll() {

    let IDS: any = [];
    this.tableData_1.data.forEach((row: any) => {
      if (row.lineStatus != "Not Completed" && row.lineStatus != "Not Assigned") {
        IDS.push(row.id.toString())
      }
    });
    let payload = {
      "iDs":
        IDS
    }
    this.IconsolidationAPI.VerifyAllItemPost(payload).subscribe((res: any) => {
      if (!res.isExecuted) {
        this.global.ShowToastr('error',res.responseMessage, 'Error!');
        console.log("VerifyAllItemPost",res.responseMessage);
      }
      else {
        let z: any[] = [];
        this.tableData_1.data.forEach((row: any) => {
          // check if the value at row.itemNumber exists in the IDS array using the indexOf method. 
          if (IDS.indexOf(row.id.toString()) != -1) {
            z.push(row)
          }
        });
        let data = this.tableData_2.data;
        data.push(...z);
        this.tableData_2 = new MatTableDataSource(data);
        this.tableData_1.paginator = this.paginator
        this.tableData_2.paginator = this.paginator2;
        this.tableData_1.data = this.tableData_1.data.filter((el) => {
          return !z.includes(el)
        })

        if (this.tableData_1.data.length == 0) {
          this.global.ShowToastr('info','You have consolidated all items in this order', 'Alert!');
        }
      }
    })
  }

  unverifyAll() {

    let z: any = [];
    z = this.tableData_2.data.filter((element) => element.lineStatus != 'Waiting Reprocess')
    let IDS: any = [];
    z.forEach((row: any) => {
      IDS.push(row.id.toString())
    }
    )
    let payload = {
      "iDs": IDS
    }
    this.IconsolidationAPI.UnVerifyAll(payload).subscribe((res: any) => {

      if (!res.isExecuted) {
        this.global.ShowToastr('error',res.responseMessage, 'Error!');
        console.log("UnVerifyAll",res.responseMessage);

      }
      else {
        this.tableData_1.data = this.tableData_1.data.concat(z);

        this.tableData_2.data = this.tableData_2.data.filter((el) => {
          return !z.includes(el)
        })
        this.tableData_1.paginator = this.paginator
        this.tableData_2.paginator = this.paginator2;
      }

    })

  }

  verifyLine(element: any, Index?: any) {
    let index: any;
    let status: any;
    let id: any;
    if (Index != undefined) {
      id = this.tableData_1.data[Index].id;
      status = this.tableData_1.data[Index].lineStatus;
    }
    else {
      index = this.tableData_1.data.indexOf(element);
      status = element.lineStatus;
      id = element.id;
    }

    if (status == "Not Completed" || status == "Not Assigned") {
      this.global.ShowToastr('error',"The selected item has not yet been completed and can't be verified at this time", 'Error!');
    }
    else {
      let payload = {
        "id": id
      }

      this.IconsolidationAPI.VerifyItemPost(payload).subscribe((res: any) => {
        if (res.isExecuted) {
          if (Index != undefined) {
            let data = this.tableData_2.data;
            data.push({ ...this.tableData_1.data[Index] });
            this.tableData_2 = new MatTableDataSource(data);
            let data2 = this.tableData_1.data;
            data2.splice(Index, 1);
            this.tableData_1 = new MatTableDataSource(data2);
            this.tableData_1.paginator = this.paginator;
            this.tableData_2.paginator = this.paginator2;
          }
          else {
            let data = this.tableData_2.data;
            data.push({ ...this.tableData_1.data[index] });
            this.tableData_2 = new MatTableDataSource(data);
            let data2 = this.tableData_1.data;
            data2.splice(index, 1);
            this.tableData_1 = new MatTableDataSource(data2);
            this.tableData_1.paginator = this.paginator;
            this.tableData_2.paginator = this.paginator2;
          }

        }
        else {
          this.global.ShowToastr('error',res.responseMessage, 'Error!')
          console.log("VerifyItemPost",res.responseMessage);
        }

      })
    }
  }

  unverifyLine(element) {


    let id = element.id;
    let status = element.lineStatus;
    let index = this.tableData_2.data.indexOf(element)


    if (status == 'Waiting Reprocess') {
      return;
    }
    else {
      let payload = {
        "id": id
      }
      this.IconsolidationAPI.DeleteVerified(payload).subscribe((res: any) => {
        if (res.isExecuted) {
          let data2 = this.tableData_1.data;
          data2.push({ ...this.tableData_2.data[index] });
          this.tableData_1 = new MatTableDataSource(data2);
          let data = this.tableData_2.data;
          data.splice(index, 1);
          this.tableData_2 = new MatTableDataSource(data);
          this.tableData_1.paginator = this.paginator;
          this.tableData_2.paginator = this.paginator2;
        }
        else {
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
          console.log("DeleteVerified",res.responseMessage);
        }
      })
    }


  }

  getFilterValue(event) {
    if (event.keyCode == 13) {
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
     this.tableData_1.data.some((obj, i) => {
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
    if (result.valueCount >= 1 && verifyItems == 'No' && blindVerifyItems == 'No') {
      const dialogRef:any = this.global.OpenDialog(CmItemSelectedComponent, {
        height: 'auto',
        width: '899px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          IdentModal: this.typeValue,
          ColLabel: this.startSelectFilterLabel,
          ColumnModal: val,
          tableData_1: this.tableData_1.data,
          tableData_2: this.tableData_2.data,
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
      this.global.ShowToastr('error','Item not in order or has already been consolidated', 'error!');
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
      this.displayedColumns_1.shift()
      this.displayedColumns_1.unshift('supplierItemID')
      this.isSupplyVisible = true;
    }
    else {
      this.isItemVisible = true;
      this.isSupplyVisible = false;
      this.displayedColumns_1.shift()
      this.displayedColumns_1.unshift('itemNumber')
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
    this.tableData_1.data = [];
    this.tableData_2.data = [];
    this.stageTable.data = [];
    this.typeValue = '';
    this.open = 0;
    this.completed = 0;
    this.backOrder = 0;

    this.paginator.pageIndex = 0;
    this.paginator2.pageIndex = 0;
    this.paginator3.pageIndex = 0;
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

        this.global.ShowToastr('error',"An error occured while retrieving data.", 'Error!');
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
      autoFocus: '__non_existing_element__',
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
      autoFocus: '__non_existing_element__',
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
      autoFocus: '__non_existing_element__',
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
      width: '50vw',
      autoFocus: '__non_existing_element__',
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
    let dialogRef:any = this.global.OpenDialog(CmItemSelectedComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,

    })
    dialogRef.afterClosed().subscribe(result => {


    })
  }

  openCmSelectTransaction() {
    let dialogRef:any = this.global.OpenDialog(CmConfirmAndPackingSelectTransactionComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,

    })
    dialogRef.afterClosed().subscribe(result => {


    })
  }

  openCmPrintOptions() {
    let dialogRef:any = this.global.OpenDialog(CmPrintOptionsComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,

    })
    dialogRef.afterClosed().subscribe(result => {


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
      autoFocus: '__non_existing_element__',
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
    window.location.href = `/#/admin/transaction?orderStatus=${this.typeValue ? this.typeValue : ''}&IsOrderStatus=true`;

  }

  printPreviewNonVerified(print = true) {
    if (this.tableData_1?.filteredData && this.tableData_1.filteredData.length > 0) {
      if(print){
        this.global.Print(`FileName:PrintPrevNotVerified|OrderNum:${this.typeValue}|WSID:${this.userData.wsid}`)
      }
      else{
        window.open(`/#/report-view?file=FileName:PrintPrevNotVerified|OrderNum:${this.typeValue}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
      }
    }
    else {
      this.global.ShowToastr('error',"There are no unverfied items", 'Error!');
    }
  }

  printPreviewPackList(print = true) {
    if (this.tableData_1?.filteredData && this.tableData_1.filteredData.length > 0) {
      let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: '786px',
        data: {
          message: 'There are still unverfied items. Coninue the preview?'
        },
        autoFocus: '__non_existing_element__',
      disableClose:true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'Yes') {
          this.IconsolidationAPI.ShowCMPackPrintModal({ orderNumber: this.typeValue }).subscribe((res: any) => {
            if (res.isExecuted && res.data == "all") {
              if(print){
                this.global.Print(`FileName:PrintPrevCMPackList|OrderNum:${this.typeValue}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`)
              }
              else{
                window.open(`/#/report-view?file=FileName:PrintPrevCMPackList|OrderNum:${this.typeValue}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
              }
            } else if (res.isExecuted && res.data == "modal") {
              this.showCmPackPrintModal(true, this.typeValue,print);
            } else {
              this.global.ShowToastr('error',"Error has occured","Error");
              console.log("ShowCMPackPrintModal",res.responseMessage);
            }
          });
        }
      });
    }
    else {
      this.IconsolidationAPI.ShowCMPackPrintModal({ orderNumber: this.typeValue }).subscribe((res: any) => {
        if (res.isExecuted && res.data == "all") {
          if(print){
            this.global.Print(`FileName:PrintPrevCMPackList|OrderNum:${this.typeValue}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`)
          }
          else{
            window.open(`/#/report-view?file=FileName:PrintPrevCMPackList|OrderNum:${this.typeValue}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
          }
        } else if (res.isExecuted && res.data == "modal") {
          this.showCmPackPrintModal(true, this.typeValue,print);
        } else {
          this.global.ShowToastr('error',"Error has occured","Error");
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
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });
  }
}


