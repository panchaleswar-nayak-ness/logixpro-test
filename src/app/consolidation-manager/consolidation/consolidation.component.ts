import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/init/auth.service';
import { CmConfirmAndPackingSelectTransactionComponent } from 'src/app/dialogs/cm-confirm-and-packing-select-transaction/cm-confirm-and-packing-select-transaction.component';
import { CmConfirmAndPackingComponent } from 'src/app/dialogs/cm-confirm-and-packing/cm-confirm-and-packing.component';
import { CmItemSelectedComponent } from 'src/app/dialogs/cm-item-selected/cm-item-selected.component';
import { CmOrderNumberComponent } from 'src/app/dialogs/cm-order-number/cm-order-number.component';
import { CmPrintOptionsComponent } from 'src/app/dialogs/cm-print-options/cm-print-options.component';
import { CmShippingTransactionComponent } from 'src/app/dialogs/cm-shipping-transaction/cm-shipping-transaction.component';
import { CmShippingComponent } from 'src/app/dialogs/cm-shipping/cm-shipping.component';
import { Subject, catchError, debounceTime, distinctUntilChanged, of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { CmOrderToteConflictComponent } from 'src/app/dialogs/cm-order-tote-conflict/cm-order-tote-conflict.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { MatOption } from '@angular/material/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { CurrentTabDataService } from 'src/app/admin/inventory-master/current-tab-data-service';

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
  public TypeValue: any
  public userData: any;
  public filterValue: any;
  public consolidationIndex: any;
  public IdentModal: any;
  public nextOrderbtn: boolean = false;
  public unverifybtn: boolean = true;
  public verifybtn: boolean = true;
  public packingbtn: boolean = true;
  public stagingbtn: boolean = true;
  public shippingbtb: boolean = true;
  public orderstatusbtn: boolean = false;
  public printButtons: boolean = true;
  public type: any = '';
  @ViewChild('matRef') matRef: MatSelect;

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);

  public isitemVisible: boolean = true;
  public issupplyVisible: boolean = false;

  searchByItem: any = new Subject<string>();
  searchAutocompleteItemNum: any = [];

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

  constructor(private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private Api: ApiFuntions,
    private global:GlobalService,
    public authService: AuthService,
    private currentTabDataService: CurrentTabDataService,
    private _liveAnnouncer: LiveAnnouncer,) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.ConsolidationIndex()
    this.searchByItem
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteSearchColumnItem()
      });

  }

  ngAfterViewInit() {
    this.searchBoxField.nativeElement.focus();
    this.ApplySavedItem();
  }

  
  ApplySavedItem() {
    if (this.currentTabDataService.savedItem[this.currentTabDataService.CONSOLIDATION])
    {
      let item= this.currentTabDataService.savedItem[this.currentTabDataService.CONSOLIDATION];
      this.open = item.open;
      this.completed = item.completed;
      this.backOrder = item.backOrder;
      this.stageTable = item.stageTable;
      this.tableData_1 = item.tableData_1;
      this.tableData_2 = item.tableData_2;
      this.TypeValue = item.TypeValue;
      this.dataSource = item.dataSource;
      return true;
    }
    return false;
  }
  RecordSavedItem() {
    this.currentTabDataService.savedItem[this.currentTabDataService.CONSOLIDATION]= {
      open : this.open,
      completed : this.completed,
      backOrder : this.backOrder,
      stageTable : this.stageTable,
      tableData_1 : this.tableData_1,
      tableData_2 : this.tableData_2,
      TypeValue : this.TypeValue,
      dataSource : this.dataSource
 
    }
  }

  hideRow = true;
  firstTable = true;

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.tableData_1.sort = this.sort1;
  }
  openAction(event:any){
    this.clearMatSelectList();
  }
  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }
  announceSortChange2(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.tableData_2.sort = this.sort2;
  }

  announceSortChange3(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.stageTable.sort = this.sort3;
  }

  clickToHide() {
    this.hideRow = !this.hideRow;
    this.firstTable = !this.firstTable;
  }

  enterOrderID(event) {
    this.TypeValue = event.target.value;
    if (event.keyCode == 13) {
      this.getTableData("", this.TypeValue);
    }
  }

  ConsolidationIndex() {
    let payload = {
      "username": this.userData.username,
      "wsid": this.userData.wsid,
      "orderNumber": this.TypeValue
    }

    this.Api.ConsolidationIndex(payload).subscribe((res: any) => {
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
          this.isitemVisible = false;
          this.displayedColumns_1.shift()
          this.displayedColumns_1.unshift('supplierItemID')
          this.issupplyVisible = true;
        }
        else {
          this.isitemVisible = true;
          this.issupplyVisible = false;
          this.displayedColumns_1.shift()
          this.displayedColumns_1.unshift('itemNumber')
        }
      }
    }
    )
  }

  getTableData(type: any, TypeValue: any) {
    this.ConsolidationIndex();
    let curValue = TypeValue;
    let payload = {
      "type": this.type,
      "selValue": curValue,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    }

    this.Api.ConsolidationData(payload).subscribe((res: any) => {
      if (res.isExecuted) {
        if ((typeof res.data == 'string')) {
          switch (res.data) {
            case "DNE":
              this.toastr.error("Consolidation The Order/Tote that you entered is invalid or no longer exists in the system.", 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              this.searchBoxField.nativeElement.focus();
              break;

            case "Conflict":
              this.openCmOrderToteConflict()
              this.toastr.error("The Value you Entered matched a Tote and Order Number, select one to Continue.", 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              break;

            case "Error":
              this.toastr.error("An Error occured while retrieving data.", 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
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
            "orderNumber": curValue,
            "username": this.userData.username,
            "wsid": this.userData.wsid
          }

          this.Api.ShippingButtSet(payload).subscribe((res: any) => {
            if (res.data == 1) {
              this.enableConButts()
              this.shippingbtb = false;
            }
            else if (res.data == 0) {
              this.enableConButts()
              this.shippingbtb = true;
            }
            else {
              this.toastr.error('Error has occured', 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
            }

          })
        }
      }
      else {
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
      
      this.RecordSavedItem();
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
      ,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    }
    this.Api.VerifyAllItemPost(payload).subscribe((res: any) => {
      if (!res.isExecuted) {
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
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
          this.toastr.info('You have consolidated all items in this order', 'Alert!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
      }
    })
  }

  unVerifyAll() {

    let z: any = [];
    z = this.tableData_2.data.filter((element) => element.lineStatus != 'Waiting Reprocess')
    let IDS: any = [];
    z.forEach((row: any) => {
      IDS.push(row.id.toString())
    }
    )
    let payload = {
      "iDs": IDS,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    }
    this.Api.UnVerifyAll(payload).subscribe((res: any) => {

      if (!res.isExecuted) {
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });

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
      this.toastr.error("The selected item has not yet been completed and can't be verified at this time", 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
    else {
      let payload = {
        "id": id,
        "username": this.userData.userName,
        "wsid": this.userData.wsid
      }

      this.Api.VerifyItemPost(payload).subscribe((res: any) => {
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
          this.toastr.error(res.responseMessage, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          })
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
        "id": id,
        "username": this.userData.userName,
        "wsid": this.userData.wsid
      }
      this.Api.DeleteVerified(payload).subscribe((res: any) => {
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
          this.toastr.error(res.responseMessage, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
      })
    }


  }

  filtervalue(event) {
    if (event.keyCode == 13) {
      this.CheckDuplicatesForVerify(this.filterValue);
    }
    this.RecordSavedItem();
  }

  checkVerifyType(columnIndex, val) {
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

  CheckDuplicatesForVerify(val) {
    let columnIndex = this.startSelectFilter;
    let result: any;
    if (columnIndex == 0) {

      this.filterOption.forEach((e: any) => {
        result = this.checkVerifyType(e.key, val);
      });

    }
    else
      result = this.checkVerifyType(columnIndex, val);

    // desturcturing
    const { verifyItems, blindVerifyItems } = this.consolidationIndex.cmPreferences;
    if (result.valueCount >= 1 && verifyItems == 'No' && blindVerifyItems == 'No') {
      const dialogRef = this.dialog.open(CmItemSelectedComponent, {
        height: 'auto',
        width: '899px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          IdentModal: this.TypeValue,
          ColLabel: this.startSelectFilterLabel,
          ColumnModal: val,
          tableData_1: this.tableData_1.data,
          tableData_2: this.tableData_2.data,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result?.isExecuted) {
          this.getTableData('', this.TypeValue);
        }
      })
    }
    else if (result.valueCount >= 1) {

      this.verifyLine(val, result.index)
    }
    else {
      this.toastr.error('Item not in order or has already been consolidated', 'error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
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
      this.isitemVisible = false;
      this.displayedColumns_1.shift()
      this.displayedColumns_1.unshift('supplierItemID')
      this.issupplyVisible = true;
    }
    else {
      this.isitemVisible = true;
      this.issupplyVisible = false;
      this.displayedColumns_1.shift()
      this.displayedColumns_1.unshift('itemNumber')
    }
    
    this.RecordSavedItem();
  }

  btnEnable() {
    this.verifybtn = false;
    this.unverifybtn = false;
  }

  btnDisable() {
    this.verifybtn = true;
    this.unverifybtn = true;
  }

  enableConButts() {
    this.nextOrderbtn = false;
    this.stagingbtn = false;
    this.packingbtn = false;
    this.verifybtn = false;
    this.unverifybtn = false;
    this.printButtons = false;
  }

  disableConButts() {
    this.nextOrderbtn = true;
    this.stagingbtn = true;
    this.packingbtn = true;
    this.verifybtn = true;
    this.unverifybtn = true;
    this.printButtons = true;
  }

  clearpagedata() {
    this.tableData_1.data = [];
    this.tableData_2.data = [];
    this.stageTable.data = [];
    this.TypeValue = '';
    this.open = 0;
    this.completed = 0;
    this.backOrder = 0;

    this.paginator.pageIndex = 0;
    this.paginator2.pageIndex = 0;
    this.paginator3.pageIndex = 0;
  }

  async autocompleteSearchColumnItem() {

    let payload = {
      "column": this.startSelectFilter,
      "value": this.filterValue ? this.filterValue : '',
      "orderNumber": this.TypeValue,
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }

    this.Api.ConsoleItemsTypeAhead(payload).pipe(

      catchError((error) => {

        // Handle the error here

        this.toastr.error("An error occured while retrieving data.", 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });


        // Return a fallback value or trigger further error handling if needed

        return of({ isExecuted: false });

      })

    ).subscribe((res: any) => {
      this.searchAutocompleteItemNum = res.data;
    });

  }

  getRow(filtervalue) {

    this.CheckDuplicatesForVerify(filtervalue);
  }

  openCmShipping() {
    let dialogRef = this.dialog.open(CmShippingComponent, {
      height: 'auto',
      width: '96vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: { orderNumber: this.TypeValue }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTableData(null, this.TypeValue);
      }
    })
  }

  openCmShippingTransaction() {
    let dialogRef = this.dialog.open(CmShippingTransactionComponent, {
      height: 'auto',
      width: '96vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        orderNum: this.TypeValue ? this.TypeValue : '2909782A',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.isExecuted) {
        this.getTableData("", this.TypeValue);
      }
    });
  }

  openCmConfirmPacking() {
    let dialogRef = this.dialog.open(CmConfirmAndPackingComponent, {
      height: 'auto',
      width: '96vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: { orderNumber: this.TypeValue }

    })
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.getTableData(null, this.TypeValue);
      }

    })
  }

  openCmOrderNo() {
    this.clearpagedata();
    this.searchBoxField.nativeElement.focus();
    this.disableConButts();
    this.RecordSavedItem();
  }

  openCmOrderNumber() {
    let dialogRef = this.dialog.open(CmOrderNumberComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        orderNumber: this.TypeValue,
        stagingTable: this.stageTable?.data ? this.stageTable.data : []
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.focusOnOrderNum();
    });
  }

  openCmItemSelected() {
    let dialogRef = this.dialog.open(CmItemSelectedComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,

    })
    dialogRef.afterClosed().subscribe(result => {


    })
  }

  openCmSelectTransaction() {
    let dialogRef = this.dialog.open(CmConfirmAndPackingSelectTransactionComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,

    })
    dialogRef.afterClosed().subscribe(result => {


    })
  }

  openCmPrintOptions() {
    let dialogRef = this.dialog.open(CmPrintOptionsComponent, {
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
    let dialogRef = this.dialog.open(CmOrderToteConflictComponent, {
      height: 'auto',
      width: '620px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe(result => {
      this.type = result;
      if (this.type) this.getTableData(null, this.TypeValue);
    })
  }


  focusOnOrderNum() {
    setTimeout(() => {
      this.searchBoxField.nativeElement.focus();
    }, 100);
  }
  navigateToOrder() {
    window.location.href = `/#/admin/transaction?orderStatus=${this.TypeValue ? this.TypeValue : ''}&IsOrderStatus=true`;

  }

  printPreviewNonVerified(print = true) {
    if (this.tableData_1?.filteredData && this.tableData_1.filteredData.length > 0) {
      if(print){
        this.global.Print(`FileName:PrintPrevNotVerified|OrderNum:${this.TypeValue}|WSID:${this.userData.wsid}`)
      }
      else{
        window.open(`/#/report-view?file=FileName:PrintPrevNotVerified|OrderNum:${this.TypeValue}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
      }
    }
    else {
      this.toastr.error("There are no unverfied items", 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
  }

  printPreviewPackList(print = true) {
    if (this.tableData_1?.filteredData && this.tableData_1.filteredData.length > 0) {
      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
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
          this.Api.ShowCMPackPrintModal({ orderNumber: this.TypeValue }).subscribe((res: any) => {
            if (res.isExecuted && res.data == "all") {
              if(print){
                this.global.Print(`FileName:PrintPrevCMPackList|OrderNum:${this.TypeValue}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`)
              }
              else{
                window.open(`/#/report-view?file=FileName:PrintPrevCMPackList|OrderNum:${this.TypeValue}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
              }
            } else if (res.isExecuted && res.data == "modal") {
              this.showCmPackPrintModal(true, this.TypeValue,print);
            } else {
              this.toastr.error("Error has occured","Error");
            }
          });
        }
      });
    }
    else {
      this.Api.ShowCMPackPrintModal({ orderNumber: this.TypeValue }).subscribe((res: any) => {
        if (res.isExecuted && res.data == "all") {
          if(print){
            this.global.Print(`FileName:PrintPrevCMPackList|OrderNum:${this.TypeValue}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`)
          }
          else{
            window.open(`/#/report-view?file=FileName:PrintPrevCMPackList|OrderNum:${this.TypeValue}|Where:all|OrderBy:${this.packListSort}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
          }
        } else if (res.isExecuted && res.data == "modal") {
          this.showCmPackPrintModal(true, this.TypeValue,print);
        } else {
          this.toastr.error("Error has occured","Error");
        }
      });
    }
  }

  showCmPackPrintModal(preview:boolean,orderNumber:any,print:any){
     this.dialog.open(CmPrintOptionsComponent, {
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


