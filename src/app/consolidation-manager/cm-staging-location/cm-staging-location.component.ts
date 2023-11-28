import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/common/init/auth.service';
import { CmOrderToteConflictComponent } from 'src/app/dialogs/cm-order-tote-conflict/cm-order-tote-conflict.component';
import { StagingLocationOrderComponent } from 'src/app/dialogs/staging-location-order/staging-location-order.component';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { AppRoutes, ResponseStrings, StringConditions, ToasterMessages, ToasterTitle, ToasterType ,DialogConstants,UniqueConstants} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-cm-staging-location',
  templateUrl: './cm-staging-location.component.html',
  styleUrls: ['./cm-staging-location.component.scss']
})
export class CmStagingLocationComponent {
  userData: any = {};
  isInputFocused: any = false;
  displayedColumns: string[] = ['select', UniqueConstants.position, 'action'];
  stageTables: any[] = [];
  oldStageTables: any[] = [];
  isLoading: any = false;
  type: any = "";
  orderNumberTote: any = null;
  stagingLocation
  @ViewChild('autoFocusField') searchBoxField: ElementRef;

  public IconsolidationAPI: IConsolidationApi;

  constructor(
    public consolidationAPI: ConsolidationApiService,
    private authService: AuthService,
    private global: GlobalService,
  ) {
    this.IconsolidationAPI = consolidationAPI;
    this.userData = this.authService.userData();
  }

  ngAfterViewInit() {
    this.searchBoxField?.nativeElement.focus();
  }

  async searchToteAndLocation() {
    if (this.stagingLocation != "") {
      if (!this.oldStageTables.length) this.oldStageTables = this.stageTables;
      this.stageTables = [];
      this.stageTables = this.oldStageTables.filter(x => x.toteID.indexOf(this.stagingLocation) > -1);
      let locArray = this.oldStageTables.filter(x => x.stagingLocation.indexOf(this.stagingLocation) > -1);
      if (locArray && locArray.length > 0) {
        locArray.forEach(item => {
          if (!this.stageTables.includes(item))
            this.stageTables.push(item);
        });
      }
    } else {
      if (!this.oldStageTables.length) this.oldStageTables = this.stageTables;
      this.stageTables = this.oldStageTables
    }
  }

  async stagingLocsOrderNum($event: any) {
    if ($event.key == StringConditions.Enter || $event == StringConditions.Event) {
      this.isLoading = true;
      let obj: any = {
        type: this.type,
        selValue: this.orderNumberTote
      };
      let inputVal = this.orderNumberTote;
      this.IconsolidationAPI.ConsolidationData(obj).subscribe((res: any) => {
        if (res.isExecuted && res.data) {
          if (typeof res?.data == 'string') {
            switch (res?.data) {
              case ResponseStrings.DNE:
                this.global.ShowToastr(ToasterType.Error,ToasterMessages.OrderInvalid,ToasterTitle.Consolidation);
                this.orderNumberTote = null;
                break;
              case ResponseStrings.DNENP:
                this.orderNumberTote = null;
                let dialogRef: any = this.global.OpenDialog(StagingLocationOrderComponent, {
                  height: 'auto',
                  width: '620px',
                  autoFocus: DialogConstants.autoFocus,
                  disableClose: true,
                })
                dialogRef.afterClosed().subscribe(result => {
                  this.stageTables = [];
                  if (result) {
                    this.orderNumberTote = result;
                    this.stageTables.push({ toteID: inputVal, stagingLocation: null });
                  }
                })
                break;
              case ResponseStrings.Conflict:
                this.openCmOrderToteConflict();
                break;
              case ResponseStrings.Error:
                this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorWhileRetrievingData,ToasterTitle.Consolidation);
                break;
            }
          }
          else {
            this.stageTables = res.data.stageTable;
          }
          if (res?.data?.orderNumber) this.orderNumberTote = res?.data?.orderNumber;
          if (!res.data.stageTable) this.stageTables = [];
          this.isLoading = false;
        }
        else {
          this.global.ShowToastr(ToasterType.Error,this.global.globalErrorMsg(),ToasterTitle.Error);
          console.log("ConsolidationData", res.responseMessage);
        }
      });
    }
  }

  async saveToteStagingLocation($event: any, toteID: any, location: any, index: any = null, clear = 0) {
    if ($event.key == StringConditions.Enter || $event == StringConditions.Click) {
      this.stageTables[index].stagingLocation = location;
      this.stageTables[index].stagingLocationOld = location;
      let obj: any = {
        "orderNumber": this.orderNumberTote,
        "toteID": toteID,
        "location": location,
        "clear": clear
      }
      this.IconsolidationAPI.StagingLocationsUpdate(obj).subscribe((res: any) => {
        if (res.responseMessage == ResponseStrings.Fail) {
          this.global.ShowToastr(ToasterType.Error,ToasterMessages.ErrorOccured,ToasterTitle.Consolidation);
        } else if (res.responseMessage == ResponseStrings.INVALID) {
          this.global.ShowToastr(ToasterType.Error,ToasterMessages.InvalidLocation,ToasterTitle.Staging);
        } else if (res.responseMessage == ResponseStrings.Redirect) {
          window.location.href = AppRoutes.Logon;
        } else if (typeof this.stageTables != 'undefined') {
          for (const element of this.stageTables) {
            let tote = element.toteID;
            if (tote == toteID) {
              element.location = location; //location
              element.by = res.data; //by
              element.date = res.data; //date
              break;
            }
          }
        }
        if (res?.isExecuted && index != null) {
          this.stageTables[index].stagingLocation = location;
          this.stageTables[index].location = location;
        } else {
          this.global.ShowToastr(ToasterType.Error,this.global.globalErrorMsg(),ToasterTitle.Error);
          console.log("StagingLocationsUpdate", res.responseMessage)
        }
      })
    }
  }

  async unstageAll() {
    for (let x = 0; x < this.stageTables.length; x++) {
      this.saveToteStagingLocation('click', this.stageTables[x].toteID, '', x, 1);
    }
  }

  async clearAll() {
    this.stageTables = [];
    this.orderNumberTote = null;
  }

  openCmOrderToteConflict() {
    let dialogRef: any = this.global.OpenDialog(CmOrderToteConflictComponent, {
      height: 'auto',
      width: '620px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    })
    dialogRef.afterClosed().subscribe(result => {
      this.type = result;
      if (this.type) this.stagingLocsOrderNum('event');
    })
  }
}

