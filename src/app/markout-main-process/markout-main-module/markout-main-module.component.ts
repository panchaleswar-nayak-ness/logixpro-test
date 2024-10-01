import { Component, OnInit } from '@angular/core';
import { IMarkoutApiService } from 'src/app/common/services/markout-api/markout-api-interface';
import { MarkoutApiService } from 'src/app/common/services/markout-api/markout-api-service';
import { SharedService } from 'src/app/common/services/shared.service';
import { MarkoutToteRequest, ToteDataResponse } from 'src/app/markout-main-process/markout-main-module/models/markout-model';

@Component({
  selector: 'app-markout-main-module',
  templateUrl: './markout-main-module.component.html',
  styleUrls: ['./markout-main-module.component.scss']
})
export class MarkoutMainModuleComponent implements OnInit {

  public iMarkoutApiService: IMarkoutApiService;
  toteDataResponse: ToteDataResponse;
  MarkoutToteReq: MarkoutToteRequest;
  selectedView: string = '';

  constructor(public markoutApiService: MarkoutApiService, private sharedService: SharedService,) {
    this.iMarkoutApiService = markoutApiService;
  }

  ngOnInit(): void {
  }

  handleToteId(event: MarkoutToteRequest) {
    const { toteId, viewType } = event;
    this.MarkoutToteReq = new MarkoutToteRequest()
    this.MarkoutToteReq.toteId = toteId
    this.MarkoutToteReq.viewType = viewType
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
