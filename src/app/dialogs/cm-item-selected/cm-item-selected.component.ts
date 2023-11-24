import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { AuthService } from "src/app/common/init/auth.service";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { IConsolidationApi } from "src/app/common/services/consolidation-api/consolidation-api-interface";
import { ConsolidationApiService } from "src/app/common/services/consolidation-api/consolidation-api.service";
import { GlobalService } from "src/app/common/services/global.service";
import {  LiveAnnouncerMessage } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-cm-item-selected',
  templateUrl: './cm-item-selected.component.html',
  styleUrls: ['./cm-item-selected.component.scss']
})
export class CmItemSelectedComponent implements OnInit { 
  public startSelectFilter: any;
  public unverifiedItems: any;
  public verifiedItems: any;
  public identModal: any;
  public colLabel: any;
  public columnModal: any;
  userData: any;
  displayedColumns: string[] = ['itemNumber', 'warehouse', 'completedQuantity', 'toteID', 'serialNumber', 'userField1', 'lotNumber', 'actions'];
  itemSelectTable: any
  dataSourceList: any
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;

  public iConsolidationAPI: IConsolidationApi;

  constructor(
    public consolidationAPI: ConsolidationApiService,
    private global: GlobalService,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CmItemSelectedComponent>,
    private _liveAnnouncer: LiveAnnouncer) {
    this.iConsolidationAPI = consolidationAPI;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.identModal = this.data.identModal;
    this.colLabel = this.data.colLabel
    this.columnModal = this.data.columnModal;
    this.unverifiedItems = this.data.unverifiedItems;
    this.verifiedItems = this.data.verifiedItems;
    this.getItemSelectedData();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    }
    this.itemSelectTable.sort = this.sort;
  } 
  getItemSelectedData() {
    let payload = {
      "orderNumber": this.identModal,
      "column": this.colLabel,
      "columnValue": this.columnModal
    }
    this.iConsolidationAPI.ItemModelData(payload).subscribe((res => {
      if (res.isExecuted && res.data) {
        this.itemSelectTable = new MatTableDataSource(res.data);
        this.itemSelectTable.paginator = this.paginator;
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("ItemModelData", res.responseMessage);
      }
    }))
  } 
  verifyLine(index) {
    let id = this.itemSelectTable.data[index].id; 
    let payload = {
      "id": id
    } 
    this.iConsolidationAPI.VerifyItemPost(payload).subscribe((res: any) => { 
      if (res.isExecuted) { 
        this.dialogRef.close({ isExecuted: true }); 
      }
      else {
        this.global.ShowToastr('error', res.responseMessage, 'Error!');
        console.log("VerifyItemPost", res.responseMessage);
      } 

    }) 
  }

  verifyAll() {
    let itemLineStatus = new Set();
    this.itemSelectTable.data.forEach((row: any) => {
      if (!["Not Completed", "Not Assigned", "Waiting Reprocess"].includes(row.lineStatus)) {
        itemLineStatus.add(row.id);
      }
    });

    let tabID = this.unverifiedItems.filter((el) => itemLineStatus.has(el.id))
      .map((row) => row.id.toString());

    let payload = {
      "iDs": tabID
    };
    this.iConsolidationAPI.VerifyAllItemPost(payload).subscribe((res: any) => {
      if (res.isExecuted) {
        this.dialogRef.close({ isExecuted: true }); 
      }
      else {
        this.global.ShowToastr('error', res.responseMessage, 'Error!');
      } 
    }) 
  } 
}
