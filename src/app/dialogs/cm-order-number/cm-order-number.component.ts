import { Component, ElementRef, OnInit, ViewChild, Inject, ViewChildren, QueryList } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AuthService } from 'src/app/init/auth.service'; 
import { CmOrderToteConflictComponent } from '../cm-order-tote-conflict/cm-order-tote-conflict.component';
import { IConsolidationApi } from 'src/app/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/services/consolidation-api/consolidation-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-cm-order-number',
  templateUrl: './cm-order-number.component.html',
  styleUrls: ['./cm-order-number.component.scss']
})
export class CmOrderNumberComponent implements OnInit {
  @ViewChild('order_focus') order_focus: ElementRef;
  userData: any;
  isStandAlone: boolean = false;
  type: any = "";

  displayedColumns: string[] = ['toteID', 'stagingLocation', 'action'];
  tableData : any = [];

  @ViewChild('order') order: ElementRef;
  @ViewChild('searchTote') searchTote: ElementRef;
  @ViewChildren('stagLoc') stagLoc: QueryList<HTMLInputElement>;

  public IconsolidationAPI : IConsolidationApi;

  constructor(private global          : GlobalService,
              public dialogRef        : MatDialogRef<CmOrderNumberComponent>,
              
              public consolidationAPI : ConsolidationApiService,
              private authService     : AuthService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.IconsolidationAPI = consolidationAPI;
               }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    if(!this.isStandAlone) setTimeout(() => this.searchTote.nativeElement.focus(), 100);
    else setTimeout(() => this.order.nativeElement.focus(), 100);

    if(this.data?.stagingTable) this.tableData = this.data.stagingTable;
  }
  ngAfterViewInit(): void {
    this.order_focus.nativeElement.focus();
  }
  findTote(event : KeyboardEvent, value : any) {
    if (event.key === 'Enter') {
      this.tableData.forEach((row : any, i : any) => {        
        if(row.toteID == value) {
          this.stagLoc['_results'][i].nativeElement.focus();
          this.stagLoc['_results'][i].nativeElement.value = ''
        }
      });
    }
  }

  async getStagLoc(event: KeyboardEvent, value : any) { 
    this.tableData = [];
    if (event.key == "Enter") {
      let obj: any = {
        type: this.type,
        selValue: value
      };

      this.IconsolidationAPI.ConsolidationData(obj).subscribe((res: any) => {
        if (res.isExecuted)
        {
          if (typeof res?.data == 'string') {
            switch (res?.data) {
              case "DNE":
                this.global.ShowToastr('error',"The Order/Tote that you entered is invalid or no longer exists in the system.", 'Consolidation!');
                this.order.nativeElement.value = '';
                this.order.nativeElement.focus();
                break;
              case "Conflict":
                this.global.ShowToastr('warning',"You have a conflicting Tote ID and Order Number.", 'Staging Locations');
                  this.openCmOrderToteConflict(value); 
                break;
              case "Error":
                this.global.ShowToastr('error',"An Error occured while retrieving data", "Consolidation Error");
                break;
            }
          }
          else { 
            this.findTote({key: 'Enter'} as KeyboardEvent, value);
            this.tableData = res.data.stageTable;
          }

        }
        else {
          this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
          console.log("ConsolidationData",res.responseMessage);

        }
        
      });
    }
  }

  openCmOrderToteConflict(order : any) { 
    let dialogRef:any = this.global.OpenDialog(CmOrderToteConflictComponent, { 
      height: 'auto',
      width: '620px',
      autoFocus: '__non_existing_element__',
      disableClose:true, 
    });

    dialogRef.afterClosed().subscribe(result => { 
        this.type = result;  
        if(this.type) this.getStagLoc({key: 'Enter'} as KeyboardEvent, order);
    })
  }

  onEnterStagLoc(event : KeyboardEvent, value : any) {
    if (event.key === 'Enter') {    
      this.saveToteStagingLocation(value);
    }
  }

  async saveToteStagingLocation(values : any, clear : number = 0) {
    let obj: any = {
      "orderNumber": this.order.nativeElement.value,
      "toteID": values.toteID,
      "location": values.stagingLocation,
      "clear": clear
    }

    this.IconsolidationAPI.StagingLocationsUpdate(obj).subscribe((res: any) => {
      if (res && res.responseMessage == "Fail") {
        this.global.ShowToastr('error',"Error Has Occured", "Consolidation");
        console.log("StagingLocationsUpdate",res.responseMessage);
      } else {
        if (typeof this.tableData != 'undefined') {
          for (let x = 0; x < this.tableData.length; x++) {
            let tote = this.tableData[x].toteID;
            if (tote == values.toteID) {
              this.tableData[x].stagingLocation = clear ? '' :  values.stagingLocation;
              this.tableData[x].stagedBy = clear ? '' : this.userData.userName;
              this.tableData[x].stagedDate = clear ? '' :  res.data;
              break;
            }
          }
        }
      }
    });    
  }

  unStageAll() {
    this.tableData.forEach((row : any, i : any) => {        
      this.saveToteStagingLocation(row, 1);
    });
  }

}
