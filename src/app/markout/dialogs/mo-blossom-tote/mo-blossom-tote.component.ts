import { ReturnStatement } from '@angular/compiler';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import {
  DialogConstants,
  ResponseStrings,
  Style,
  ToasterTitle,
  ToasterType,
  markoutdisplayedColumns,
} from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { IMarkoutApiService } from 'src/app/common/services/markout-api/markout-api-interface';
import { MarkoutApiService } from 'src/app/common/services/markout-api/markout-api-service';
import { ConfirmationDialogComponent } from '../../../admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BlossomToteRecords, MarkoutBlossomTotenRequest, ToteData } from '../../models/markout-model';

@Component({
  selector: 'app-mo-blossom-tote',
  templateUrl: './mo-blossom-tote.component.html',
  styleUrls: ['./mo-blossom-tote.component.scss'],
})
export class MoBlossomToteComponent implements OnInit {
  public iMarkoutApiService: IMarkoutApiService;
  toteId: string = '';
  markoutlistdataSource: MatTableDataSource<ToteData>;
  orderNumber: string = '';
  selectedList: [];
  isBlossomComplete: boolean = false;
  isBlossom: boolean = false;

  displayedColumns: string[] = [
    markoutdisplayedColumns.ItemNumber,
    markoutdisplayedColumns.TransQty,
    markoutdisplayedColumns.CompQty,
    markoutdisplayedColumns.ToteQty,
  ];
  constructor(
    public dialogRef: MatDialogRef<MoBlossomToteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public markoutApiService: MarkoutApiService,
    private global: GlobalService
  ) {
    this.iMarkoutApiService = markoutApiService;
  }

  ngOnDestroy(): void {
    this.markoutlistdataSource = new MatTableDataSource<ToteData>();
  }

  ngOnInit(): void {
    this.markoutlistdataSource = new MatTableDataSource(
      this.data?.markoutlistdataSource
    );
    this.orderNumber = this.data?.markoutlistdataSource[0].orderNumber;
    this.getParamByName();
  }

  blossomCompleteTransactions() {
    this.blossomTransactions(true);
  }
  getParamByName() {
    this.iMarkoutApiService
      .GetParamByName('BlossomComplete')
      .subscribe((res: string) => {
        this.isBlossomComplete = res == '1';
      });
  }
  blossomTransactions(blossomcompete: boolean = false) {
    this.newToteIdValidation();
    if (this.isBlossom) {
      let blosomtoterequest = new MarkoutBlossomTotenRequest();
      blosomtoterequest.NewTote = this.toteId;
      blosomtoterequest.IsBlossComp = blossomcompete;
      let BlossomToteArray: BlossomToteRecords[] = [];

      this.markoutlistdataSource.data
        .filter((x) => x.oldToteQty && x.oldToteQty > 0)
        .forEach((element) => {
          BlossomToteArray.push({
            Quantity: element.oldToteQty || 0,
            OTID: element.id,
          });
        });
      blosomtoterequest.BlossomTotes = BlossomToteArray;
      console.log(blosomtoterequest);

      // // open dialog and api call
      let dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: DialogConstants.auto,
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          customButtonText: true,
          heading: 'Blossom',
          btn1Text: 'Yes',
          btn2Text: 'No',
          message: `
            You have requested to blossom.
            This will complete the original tote with quantities entered,
            and assign the remaining quantities to the new tote.
            Do you want to perform this action?`,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == ResponseStrings.Yes) {
          this.iMarkoutApiService
            .MarkoutBlossomTote(blosomtoterequest)
            .subscribe((res: boolean) => {
              if (res) {
                //success
                this.global.ShowToastr(
                  ToasterType.Success,
                  'Blossom tote completed',
                  ToasterTitle.Success
                );
                this.dialogRef.close(true);
              } else {
                this.global.ShowToastr(
                  ToasterType.Error,
                  'There was an error blossoming this tote',
                  ToasterTitle.Error
                );
              }
            });
        }
      });
    }
  }

  newToteIdValidation() {
    this.iMarkoutApiService
      .MarkoutValidTote(this.toteId)
      .subscribe((res: boolean) => {
        if (res == false) {
          this.global.ShowToastr(
            ToasterType.Error,
            'Invalid Tote. This tote already has open transactions assigned to it',
            ToasterTitle.Error
          );
          this.isBlossom = false;
        } else {
          this.isBlossom = true;
        }
      });
  }

  ClosePopup() {
    this.dialogRef.close(false);
  }

  onChangeQTY(element: ToteData) {
    if (
      element.oldToteQty &&
      (element.oldToteQty < 0 || element.oldToteQty > element.transQty)
    ) {
      this.global.ShowToastr(
        ToasterType.Error,
        'Invalid Quantity Entered',
        ToasterTitle.Error
      );
      element.oldToteQty = undefined;
    }
  }
}
