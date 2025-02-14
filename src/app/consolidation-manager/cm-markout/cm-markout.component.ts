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
    
        this.handlePrinting();
      });
  }

  // Markout Print Logic
  async handlePrinting() {
    if (this.toteDataResponse.data.length > 0) {
      const allTransactionsComplete = this.toteDataResponse.data.every(
        (data: ToteData) => data.status === StringConditions.Complete
      );

      if (allTransactionsComplete) {
        try {
          if (this.preferencesData.autoPrintToteManifest) {
            await this.print('Print Tote Manifest', this.toteId);
          }  
        } catch (error) {
          console.error("Error printing Tote Manifest:", error);
        }
        
        try {
          if (this.preferencesData.autoPrintToteManifest2) {
            await this.print('Print Tote Manifest 2', this.toteId);
          }
        } catch (error) {
          console.error("Error printing Tote Manifest 2:", error);
        }        
      } 
      
      if (!allTransactionsComplete && this.preferencesData.autoPrintMarkoutReport) {
        try {
          this.print('Print Markout Report', this.toteId);
        } catch (error) {
          console.error('Error printing Markout Report:', error);
        }
      }
    }
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
