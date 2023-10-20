import { Component , ElementRef, OnInit, ViewChild } from '@angular/core';
import {  MatDialog } from '@angular/material/dialog';
 
import { AuthService } from 'src/app/init/auth.service';
import { CmOrderToteConflictComponent } from 'src/app/dialogs/cm-order-tote-conflict/cm-order-tote-conflict.component';
import { StagingLocationOrderComponent } from 'src/app/dialogs/staging-location-order/staging-location-order.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IConsolidationApi } from 'src/app/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/services/consolidation-api/consolidation-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { event } from 'jquery';


export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
};

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
];

@Component({
  selector: 'app-cm-staging-location',
  templateUrl: './cm-staging-location.component.html',
  styleUrls: ['./cm-staging-location.component.scss']
})
export class CmStagingLocationComponent {
  userData: any = {};
  isInputFocused:any=false;
  displayedColumns: string[] = ['select', 'position', 'action'];
  tableData = ELEMENT_DATA;
  stagetables: any[] = [];
  Oldstagetables: any[] = [];
  IsLoading: any = false;
  type: any = "";
  OrderNumberTote: any = null;
  stagingLocation

  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  public IconsolidationAPI : IConsolidationApi;

  constructor(
    // private Api: ApiFuntions,
    public consolidationAPI : ConsolidationApiService,
    private authService: AuthService,
    private global:GlobalService,
  ) {
    this.IconsolidationAPI = consolidationAPI;
    this.userData = this.authService.userData();
  }

  ngAfterViewInit() {
    this.searchBoxField.nativeElement.focus();
  }
  
  async SearchToteAndLocation(){ 
    if(this.stagingLocation != ""){
      if(!this.Oldstagetables.length) this.Oldstagetables = this.stagetables;
      this.stagetables = [];
      this.stagetables= this.Oldstagetables.filter(x=>x.toteID.indexOf(this.stagingLocation) >-1);
      let locArray = this.Oldstagetables.filter(x=>x.stagingLocation.indexOf(this.stagingLocation) >-1);
      if(locArray && locArray.length > 0){
        locArray.forEach(item => {
          if(!this.stagetables.includes(item))
                      this.stagetables.push(item);
        }); 
    }
  }else {
    if(!this.Oldstagetables.length) this.Oldstagetables = this.stagetables;
    this.stagetables = this.Oldstagetables
  }
  }
  async StagingLocsOrderNum($event: any) { 
    if ($event.key == "Enter"|| $event == 'event') {
      this.IsLoading = true;
      let obj: any = {
        type: this.type,
        selValue: this.OrderNumberTote
      };
      let inputVal = this.OrderNumberTote;
      this.IconsolidationAPI.ConsolidationData(obj).subscribe((res: any) => {
        if(res.isExecuted && res.data)
        {
          if (typeof res?.data == 'string') { 
            switch (res?.data) {
              case "DNE":
                this.global.ShowToastr('error',"The Order/Tote that you entered is invalid or no longer exists in the system.", 'Consolidation!');
                this.OrderNumberTote = null;
                break;
              case "DNENP":
                this.OrderNumberTote = null; 
                let dialogRef:any = this.global.OpenDialog(StagingLocationOrderComponent, { 
                  height: 'auto',
                  width: '620px',
                  autoFocus: '__non_existing_element__',
                  disableClose:true, 
                })
                dialogRef.afterClosed().subscribe(result => { 
                  this.stagetables = [];
                    if(result) {this.OrderNumberTote = result;
                    this.stagetables.push({ toteID: inputVal, stagingLocation:null});
                    }
                  })
                break;
              case "Conflict":
                  this.openCmOrderToteConflict(inputVal); 
                break;
              case "Error":
                this.global.ShowToastr('error',"An Error occured while retrieving data", "Consolidation Error");
                break;
            }
          }
          else { 
            this.stagetables = res.data.stageTable;
          }
          if(res?.data?.orderNumber) this.OrderNumberTote  = res?.data?.orderNumber;
          if(!res.data.stageTable) this.stagetables  = [];
          this.IsLoading = false;
        }
        else {
          this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
          console.log("ConsolidationData",res.responseMessage);
        }
        
      });
    }
  }
  async saveToteStagingLocation($event:any,toteID: any, location: any,index:any=null,clear = 0) {
    if ($event.key == "Enter" || $event == 'click') {
      this.stagetables[index].stagingLocation = location;
      this.stagetables[index].stagingLocationOld = location;
    let obj: any = {
      "orderNumber": this.OrderNumberTote,
      "toteID": toteID,
      "location": location,
      "clear": clear
    }
    this.IconsolidationAPI.StagingLocationsUpdate(obj).subscribe((res: any) => {
      if (res.responseMessage == "Fail") {
        this.global.ShowToastr('error',"Error Has Occured", "Consolidation");
      } else if (res.responseMessage == 'INVALID') {
        this.global.ShowToastr('error',"The Location entered was not valid", "Staging");

      } else if (res.responseMessage == "Redirect") {
        window.location.href = "/#/Logon/";
      } else if (typeof this.stagetables != 'undefined'){
          for (let x = 0; x < this.stagetables.length; x++) {
            let tote = this.stagetables[x].toteID;
            if (tote == toteID) {
              this.stagetables[x].location = location; //location
              this.stagetables[x].by = res.data; //by
              this.stagetables[x].date = res.data; //date
              break;
            }
          }
      }
      if(res && res.isExecuted && index!=null){ 
        this.stagetables[index].stagingLocation = location;
        this.stagetables[index].location = location; 
      }else{
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("StagingLocationsUpdate",res.responseMessage)
      }
      
    })
  }
  }
  async UnstageAll(){
    for (let x = 0; x < this.stagetables.length; x++) {
      this.saveToteStagingLocation('click',this.stagetables[x].toteID,'',x,1);
    } 
  }
  async clearAll(){
    this.stagetables = [];
    this.OrderNumberTote = null;
  }
  
  openCmOrderToteConflict(order:any) { 
    let dialogRef:any = this.global.OpenDialog(CmOrderToteConflictComponent, { 
      height: 'auto',
      width: '620px',
      autoFocus: '__non_existing_element__',
      disableClose:true, 
    })
    dialogRef.afterClosed().subscribe(result => { 
        this.type = result;  
        if(this.type) this.StagingLocsOrderNum('event');
    })
   }
}

