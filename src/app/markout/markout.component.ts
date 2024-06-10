import { Component, OnInit } from '@angular/core';
import { IMarkoutApiService } from '../common/services/markout-api/markout-api-interface';
import { MarkoutApiService } from '../common/services/markout-api/markout-api-service';
import { ToteDataResponse } from './models/markout-model';
import { SharedService } from '../common/services/shared.service';

@Component({
  selector: 'app-markout',
  templateUrl: './markout.component.html',
  styleUrls: ['./markout.component.scss'],
})
export class MarkoutComponent implements OnInit {
  public iMarkoutApiService: IMarkoutApiService;
  toteDataResponse: ToteDataResponse;
  toteId: string;

  constructor(public markoutApiService: MarkoutApiService,private sharedService: SharedService,) {
    this.iMarkoutApiService = markoutApiService;
  }

  ngOnInit(): void {
    let appd=JSON.parse(localStorage.getItem('availableApps') ?? '');
    this.sharedService.setMenuData(appd);
  }

  getToteData() {
    this.iMarkoutApiService
      .GetMarkoutData(this.toteId)
      .subscribe((res: ToteDataResponse) => {
        this.toteDataResponse = res;
      });
  }
}
