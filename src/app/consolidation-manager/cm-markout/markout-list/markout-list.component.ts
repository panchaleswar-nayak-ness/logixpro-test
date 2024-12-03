import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import {
  BlossomType,
  DialogConstants,
  LiveAnnouncerMessage,
  ResponseStrings,
  Style,
  ToasterTitle,
  ToasterType,
  markoutdisplayedColumns,
} from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { IMarkoutApiService } from 'src/app/common/services/markout-api/markout-api-interface';
import { MarkoutApiService } from 'src/app/common/services/markout-api/markout-api-service';
import { InputFilterComponent } from 'src/app/dialogs/input-filter/input-filter.component';
import { MarkoutCompleteTransactionRequest, MarkoutToteRequest, ToteData, ToteDataResponse, UpdateQuantityRequest } from '../models/markout-model';
import { MoBlossomToteComponent } from '../../../consolidation-manager/cm-markout/dialogs/mo-blossom-tote/mo-blossom-tote.component';

@Component({
  selector: 'app-markout-list',
  templateUrl: './markout-list.component.html',
  styleUrls: ['./markout-list.component.scss'],
})
export class MarkoutListComponent implements OnInit {

  displayedColumns: string[] = [
    markoutdisplayedColumns.Status,
    markoutdisplayedColumns.ToteID,
    markoutdisplayedColumns.ItemNumber,
    markoutdisplayedColumns.Location,
    markoutdisplayedColumns.TransQty,
    markoutdisplayedColumns.CompQty,
    markoutdisplayedColumns.ShortQty,
    markoutdisplayedColumns.CompletedDate,
    markoutdisplayedColumns.actions,
  ];
  public iMarkoutApiService: IMarkoutApiService;
  @Input() toteDataResponse: ToteDataResponse;
  @Input() selectedView: string;
  @Input() isBlossomComplete: boolean;
  @Output() updateTableEmitter = new EventEmitter<string>();
  @ViewChild('paginator') paginator: MatPaginator;
  markoutlistdataSource: MatTableDataSource<ToteData>;
  @ViewChild(MatSort) sort: MatSort;
  @Output() toteIdEmitter = new EventEmitter<MarkoutToteRequest>();
  blossomType = BlossomType;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private global: GlobalService,
    public markoutApiService: MarkoutApiService
  ) {
    this.iMarkoutApiService = markoutApiService;
  }

  ngOnInit(): void { }

  selectRow(row: any) {
    this.markoutlistdataSource.filteredData.forEach(element => { if (row != element) element.selected = false; });
    const selectedRow = this.markoutlistdataSource.filteredData.find((x: any) => x === row);
    if (selectedRow) selectedRow.selected = !selectedRow.selected;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction)
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    else this._liveAnnouncer.announce('Sorting cleared');
    this.markoutlistdataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['toteDataResponse'] &&
      changes['toteDataResponse']['currentValue']
    ) {
      this.markoutlistdataSource = new MatTableDataSource(
        this.toteDataResponse.data
      );
      if (this.toteDataResponse.data.length) this.markoutlistdataSource.sort = this.sort;
      setTimeout(() => {
        this.markoutlistdataSource.paginator = this.paginator;
      }, 100);
    }
  }

  completeTrans(element: ToteData) {
    let dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        customButtonText: true,
        heading: 'Transaction Complete',
        btn1Text: 'Yes',
        btn2Text: 'No',
        message: `
        You have requested to complete this transaction.
        This will complete the transaction with the Transaction Quantity.
        Do you want to perform this action??`,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == ResponseStrings.Yes) {
        var transRequest = new MarkoutCompleteTransactionRequest();
        transRequest.OTID = element.id;
        transRequest.ShipShort = false;
        this.iMarkoutApiService
          .MarkoutCompleteTransaction(transRequest)
          .subscribe((res: boolean) => {
            this.updateTableEmitter.emit(element.toteId);
          });
      }
    });
  }

  shipShort(element: ToteData) {
    let dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        customButtonText: true,
        heading: 'Ship Short',
        btn1Text: 'Yes',
        btn2Text: 'No',
        message: `        
        You have requested to ship this transaction short.
        This will complete the transaction with the short quantity.
        Do you want to perform this action?
        `,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == ResponseStrings.Yes) {
        var transRequest = new MarkoutCompleteTransactionRequest();
        transRequest.OTID = element.id;
        transRequest.ShipShort = true;
        this.iMarkoutApiService
          .MarkoutCompleteTransaction(transRequest)
          .subscribe((res: ToteDataResponse) => {
            this.updateTableEmitter.emit(element.toteId);
          });
      }
    });
  }

  updateQuantity(element: ToteData, qty: number) {
    let dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        customButtonText: true,
        heading: 'Short Quantity',
        btn1Text: 'Yes',
        btn2Text: 'No',
        message: `        
        You have requested to update this line item with a short quantity.
        You must press the ship short button after the update to complete this transaction.
        Are you sure you want to update the picked quantity?
        `,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == ResponseStrings.Yes) {
        var transRequest = new UpdateQuantityRequest();
        transRequest.OTID = element.id;
        transRequest.Quantity = qty;
        this.iMarkoutApiService
          .UpdateMarkoutQuantity(transRequest)
          .subscribe((res: ToteDataResponse) => {
            this.updateTableEmitter.emit(element.toteId);
          });
      }
    });
  }

  showUpdateQTY(element: ToteData) {
    const dialogRef: any = this.global.OpenDialog(InputFilterComponent, {
      height: DialogConstants.auto,
      width: '480px',
      data: {
        FilterColumnName: `Quantity`,
        dynamicText: 'Update Quantity',
        butttonText: 'Update',
        inputType: 'number',
      },
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(async (result: any) => {
      if (result) {
        let SelectedItem = parseInt(result.SelectedItem);
        if (SelectedItem <= 0) {
          this.global.ShowToastr(
            ToasterType.Error,
            'The Picked Quantity can not be less than zero',
            ToasterTitle.Error
          );
        } else if (SelectedItem > element.transQty) {
          this.global.ShowToastr(
            ToasterType.Error,
            'The Picked Quantity is greater than the Requested Quantity',
            ToasterTitle.Error
          );
        } else if (SelectedItem < element.transQty) {
          this.updateQuantity(element, SelectedItem);
        } else {
          this.completeTrans(element);
        }
      }
    });
  }

  blossom(element: ToteData,type) {
    if(type == this.blossomType.BlossomComplete && !this.isBlossomComplete){
      return;
    }
    let dialogRefTote;
    dialogRefTote = this.global.OpenDialog(MoBlossomToteComponent, {
      height: DialogConstants.auto,
      width: '990px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        markoutlistdataSource: [element],
        type:type
      }
    });
    dialogRefTote.afterClosed().subscribe((result) => {
      if (result) {
        this.toteIdEmitter.emit({ toteId: '', viewType: this.selectedView });
      }
    });
  }

}
