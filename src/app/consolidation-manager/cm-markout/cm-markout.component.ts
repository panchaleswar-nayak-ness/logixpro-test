import { Component, OnInit } from '@angular/core';
import { IMarkoutApiService } from 'src/app/common/services/markout-api/markout-api-interface';
import { MarkoutToteRequest, ToteData, ToteDataResponse } from './models/markout-model';
import { MarkoutApiService } from 'src/app/common/services/markout-api/markout-api-service';
import { SharedService } from 'src/app/common/services/shared.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { CmPreferences } from 'src/app/common/types/CommonTypes';
import { GlobalService } from 'src/app/common/services/global.service';
import { StringConditions, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { PrintApiService } from 'src/app/common/services/print-api/print-api.service';

interface PrefResponse {
  data: {
    cmPreferences: CmPreferences
  };
  responseMessage: string;
  isExecuted: boolean;
}

const Reports = {
  PrintMarkoutReport: 'Print Markout Report',
  PrintToteManifest: 'Print Tote Manifest',
  PrintToteManifest2: 'Print Tote Manifest 2'
}

@Component({
  selector: 'app-cm-markout',
  templateUrl: './cm-markout.component.html',
  styleUrls: ['./cm-markout.component.scss']
})
export class CmMarkoutComponent implements OnInit {

  public iMarkoutApiService: IMarkoutApiService;
  public IconsolidationAPI: IConsolidationApi;
  preferencesData: CmPreferences;
  toteDataResponse: ToteDataResponse;
  MarkoutToteReq: MarkoutToteRequest;
  selectedView: string = '';
  toteId: string = '';
  isBlossomComplete: boolean = false;

  constructor(
    public markoutApiService: MarkoutApiService,
    public consolidationAPI: ConsolidationApiService, 
    public printApiService: PrintApiService,
    public global: GlobalService,
  ) {
    this.iMarkoutApiService = markoutApiService;
    this.IconsolidationAPI = consolidationAPI;
  }

  ngOnInit(): void {
    this.getPreferences();
    this.getBlossomCompleteParam();
  }

  getPreferences() {
    let payload = {
      type: '',
      value: ''
    };
    this.IconsolidationAPI
      .ConsoleDataSB(payload)
      .subscribe((res : PrefResponse) => {
        if (res.isExecuted) {
          this.preferencesData = res.data.cmPreferences;
          this.selectedView = this.preferencesData.defaultViewType;
        }
        else this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      });
  }

  getBlossomCompleteParam() {
    this.iMarkoutApiService
      .GetParamByName('BlossomComplete')
      .subscribe((res: string) => {
        this.isBlossomComplete = res == '1';
      });
  }

  handleToteId(event: MarkoutToteRequest) {
    const { toteId, viewType } = event;
    this.toteId = toteId;
    this.MarkoutToteReq = new MarkoutToteRequest();
    this.MarkoutToteReq.toteId = toteId;
    this.MarkoutToteReq.viewType = viewType;
    this.getToteData();
  }

  getToteData() {
    this.iMarkoutApiService
      .GetMarkoutData(this.MarkoutToteReq)
      .subscribe((res: ToteDataResponse) => {
        this.toteDataResponse = res;

        // let otIDs : number[] = [];

        // // Check if all records are completed in a single loop and take actions accordingly
        // this.toteDataResponse.data.forEach((data: ToteData) => {
        //   if (data.toteId === this.toteId && data.status !== StringConditions.Complete) otIDs.push(data.id);
        // });

        // // Print for incomplete records
        // if (otIDs.length > 0 && this.preferencesData.autoPrintMarkoutReport) {
        //   this.print('Print Markout Report', { Ids : otIDs , toteIDs: this.toteId });
        // }

        // // If all records were completed, print the manifests
        // if (otIDs.length === 0) {
        //   this.toteDataResponse.data.forEach((data: ToteData) => {
        //     if (data.toteId === this.toteId) {
        //       if (this.preferencesData.autoPrintToteManifest) this.print('Print Tote Manifest', { Id: data.id, ToteID: data.toteId });
        //       if (this.preferencesData.autoPrintToteManifest2) this.print('Print Tote Manifest 2', { Id: data.id, ToteID: data.toteId });
        //     }
        //   });
        // }

        if (this.toteDataResponse.data.length > 0) {
          if (this.preferencesData.autoPrintMarkoutReport) this.print('Print Markout Report', this.toteId);
          if (this.preferencesData.autoPrintToteManifest) this.print('Print Tote Manifest', this.toteId);
          if (this.preferencesData.autoPrintToteManifest2) this.print('Print Tote Manifest 2', this.toteId);
        }
      });
  }

  viewChange(event: string) {
    this.selectedView = event;
    this.print(this.selectedView, this.toteId);
  }
  
  print(report: string, data: any) {
    switch (report) {
      case 'Print Markout Report':
        return this.printApiService.PrintMarkoutReport(data);
      case 'Print Tote Manifest':
        return this.printApiService.PrintMoToteManifest(data);
      case 'Print Tote Manifest 2':
        return this.printApiService.PrintMoToteManifest2(data);
      default:
        return false;
    }
  }

}
