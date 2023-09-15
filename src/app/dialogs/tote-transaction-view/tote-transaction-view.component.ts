import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr'; 
import { AlertConfirmationComponent } from '../alert-confirmation/alert-confirmation.component';
import { BatchDeleteComponent } from '../batch-delete/batch-delete.component';
import { MarkToteFullComponent } from '../mark-tote-full/mark-tote-full.component';
import labels from '../../labels/labels.json';
import { PageEvent } from '@angular/material/paginator';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';


@Component({
  selector: 'app-tote-transaction-view',
  templateUrl: './tote-transaction-view.component.html',
  styleUrls: ['./tote-transaction-view.component.scss'],
})
export class ToteTransactionViewComponent implements OnInit {
  @ViewChild('field_focus') field_focus: ElementRef;

  
  batchID: any;
  tote: any;
  toteID: any;
  selectedOption: any;
  cell:any;
  isData:any;
  @ViewChild('actionRef') actionRef: MatSelect;
  pageEvent: PageEvent;
  public sortCol:any=0;
  public sortOrder:any='asc';
  customPagination: any = {
    total: '',
    recordsPerPage: 10,
    startIndex: 1,
    endIndex: 10,
  };
  IMPreferences:any;
  zoneLabels:any;
  imPreferences:any;
 
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
    private Api: ApiFuntions,
    private global:GlobalService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.batchID = this.data.batchID;
    this.tote = this.data.tote;
    this.toteID = this.data.toteID;
    this.cell=this.data.cell;
    this.IMPreferences=this.data.IMPreferences;
    this.zoneLabels = this.data.zoneLabels;
    this.getTransactionTable();
    this.imPreferences=this.global.getImPreferences();
  }
  ngAfterViewInit(): void {
    this.field_focus.nativeElement.focus();
  }
  
  displayedColumns: string[] = [
    'cell',
    'itemNumber',
    'transactionQuantity',
    'itemLocation',
    'hostTransactionID',
    'other',
  ];
  dataSource:any;

  clearMatSelectList() {
    this.actionRef.options.forEach((data: MatOption) => data.deselect());
  }

  sortChange(event) {
    if (!this.dataSource._data._value || event.direction=='' || event.direction==this.sortOrder) return;
    let index;
    this.displayedColumns.find((x, i) => {
      if (x === event.active) {
        index = i;
      }
    });

    this.sortCol = index;
    this.sortOrder = event.direction;
    this.getTransactionTable();
    // this.getContentData();
  }


  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    // this.customPagination.startIndex =  e.pageIndex
    this.customPagination.startIndex = e.pageSize * e.pageIndex;

    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    // this.length = e.length;
    this.customPagination.recordsPerPage = e.pageSize;
    // this.pageIndex = e.pageIndex;

    // this.initializeApi();
    this.getTransactionTable();
  }
  getTransactionTable() {
    let payLoad = {
      toteNumber: this.tote,
      batchID: this.batchID,
      sRow:  this.customPagination.startIndex,
      eRow: this.customPagination.endIndex,
      sortColumn: this.sortCol,
      sortOrder: this.sortOrder,
      username: this.data.userName,
      wsid: this.data.wsid,
    };

    this.Api.TransTableView(payLoad).subscribe((res:any)=>{
      
      if(res && res.data){
        this.isData=true
      // this.dataSource = new MatTableDataSource<any>(res.data);

      this.dataSource = new MatTableDataSource<any>(res.data);

      }else{
        this.isData=false
      }
    }, (error) => {})
  }
  actionDialog(opened: boolean) {
    if (!opened && this.selectedOption && this.selectedOption === 'clearTote') {
      const dialogRef = this.dialog.open(BatchDeleteComponent, {
        height: 'auto',
        width: '50vw',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          deleteAllDisable:true,
          batchId: this.batchID,
          toteId: this.toteID,
          userName: this.data.userName,
          wsid: this.data.wsid,
          
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res.isExecuted) {
          this.getTransactionTable();
        }
      });
    } else if (
      !opened &&
      this.selectedOption &&
      this.selectedOption === 'fullTote'
    ) {
      this.clearMatSelectList();
      const dialogRef = this.dialog.open(MarkToteFullComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'add-trans',
          message: 'Click OK to mark this Tote as being Full',
          userName: this.data.userName,
          wsid: this.data.wsid,
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          let payLoad = {
            toteNumber: this.tote,
            cell: this.cell,
            batchID: this.batchID,
            username: this.data.userName,
            wsid: this.data.wsid,
          };

          this.Api.MarkToteFull(payLoad).subscribe(
            (res: any) => {
              if (res.data && res.isExecuted) {
                this.toastr.success(labels.alert.success, 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
              } else {
                this.toastr.error(labels.alert.went_worng, 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
              }
            },
            (error) => {}
          );
          
        }
      });
    } else if (
      !opened &&
      this.selectedOption &&
      this.selectedOption === 'printToteLabel'
    ) {
      this.clearMatSelectList();
    } else if (
      !opened &&
      this.selectedOption &&
      this.selectedOption === 'printItemLabel'
    ) {
      this.clearMatSelectList();
    } else if (
      !opened &&
      this.selectedOption &&
      this.selectedOption === 'printToteContent'
    ) {
      this.clearMatSelectList();
    }
  }

  clear(type,item) {
   
    let itemId=item.id
    const dialogRef = this.dialog.open(AlertConfirmationComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        message:
          type === 'clear'
            ? 'Clear This Transaction From This Tote ?'
            : 'Clear And DeAllocate This Transaction From The Tote?',
        heading:
          type === 'clear'
            ? 'Clear Transaction'
            : 'Clear And DeAllocate Transaction',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        let payLoad={
          id:itemId,
          username: this.data.userName,
          wsid: this.data.wsid,
        }
        let baseUrl=type==='clear'?'/Induction/ClearItemFromTote':'/Induction/DeAllocateItemFromTote'
        this.Api.DynamicMethod(payLoad,baseUrl).subscribe((res:any)=>{
          if (res && res.isExecuted) {
            this.toastr.success(labels.alert.success, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
            this.getTransactionTable();
          } else {
            this.toastr.error(labels.alert.went_worng, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        })
      }
    });
  }

  print(type:any){
    if(type == 'tote-label'){
      if(this.imPreferences.printDirectly){
        this.global.Print(`FileName:PrintPrevToteContentsLabel|ToteID:|ZoneLab:${this.zoneLabels}|ID:${this.dataSource?.filteredData[0]?.id}|BatchID:${this.batchID}|TransType:Put Away`)
      }else{
        window.open(`/#/report-view?file=FileName:PrintPrevToteContentsLabel|ToteID:|ZoneLab:${this.zoneLabels}|ID:${this.dataSource?.filteredData[0]?.id}|BatchID:${this.batchID}|TransType:Put Away`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
      }
    }
    else if(type == 'item-label'){

      if(this.imPreferences.printDirectly){
        this.global.Print(`FileName:PrintPrevToteItemLabel|ID:-1|BatchID:${this.batchID}|ToteNum:${this.tote}`)
      }else{
        window.open(`/#/report-view?file=FileName:PrintPrevToteItemLabel|ID:-1|BatchID:${this.batchID}|ToteNum:${this.tote}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
      }
    }
    else if(type == 'tote-contents'){
      if(this.imPreferences.printDirectly){
        this.global.Print(`FileName:PrintPrevToteTransViewCont|BatchID:${this.batchID}|ToteNum:${this.tote}`)
      }else{
        window.open(`/#/report-view?file=FileName:PrintPrevToteTransViewCont|BatchID:${this.batchID}|ToteNum:${this.tote}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
      }
    }
  }

  printToteLabel(){
    let ID = this.dataSource?.filteredData[0]?.id;
    if(this.imPreferences.printDirectly){
      this.global.Print(`FileName:PrintPrevToteItemLabel|ID:${ID}|BatchID:${this.batchID}|ToteNum:${this.tote}`)
    }else{
      window.open(`/#/report-view?file=FileName:PrintPrevToteItemLabel|ID:${ID}|BatchID:${this.batchID}|ToteNum:${this.tote}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
    }
  }

  selectRow(row: any) {
    this.dataSource.filteredData.forEach(element => {
      if(row != element){
        element.selected = false;
      }
    });
    const selectedRow = this.dataSource.filteredData.find((x: any) => x === row);
    if (selectedRow) {
      selectedRow.selected = !selectedRow.selected;
    }
  }

}
