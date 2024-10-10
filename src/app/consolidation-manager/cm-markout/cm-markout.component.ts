import { Component, OnInit } from '@angular/core';
import { IMarkoutApiService } from 'src/app/common/services/markout-api/markout-api-interface';
import { MarkoutToteRequest, ToteDataResponse } from './models/markout-model';
import { MarkoutApiService } from 'src/app/common/services/markout-api/markout-api-service';
import { SharedService } from 'src/app/common/services/shared.service';

@Component({
  selector: 'app-cm-markout',
  templateUrl: './cm-markout.component.html',
  styleUrls: ['./cm-markout.component.scss']
})
export class CmMarkoutComponent implements OnInit {

  public iMarkoutApiService: IMarkoutApiService;
  toteDataResponse: ToteDataResponse;
  MarkoutToteReq: MarkoutToteRequest;
  selectedView: string = '';
  toteId: string = '';
  isBlossomComplete: boolean = false;

  constructor(public markoutApiService: MarkoutApiService, private sharedService: SharedService,) {
    this.iMarkoutApiService = markoutApiService;
  }

  ngOnInit(): void {
    this.getBlossomCompleteParam();
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
      });
  }

  viewChange(event: string) {
    this.selectedView = event;
  }

}
