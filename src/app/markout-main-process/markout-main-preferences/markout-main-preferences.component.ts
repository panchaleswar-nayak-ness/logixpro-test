import { Component, OnInit } from '@angular/core';
import { IMarkoutApiService } from 'src/app/common/services/markout-api/markout-api-interface';
import { MarkoutApiService } from 'src/app/common/services/markout-api/markout-api-service';
import { MOPrefResponse } from '../markout-main-module/models/markout-model';

@Component({
  selector: 'app-markout-main-preferences',
  templateUrl: './markout-main-preferences.component.html',
  styleUrls: ['./markout-main-preferences.component.scss']
})
export class MarkoutMainPreferencesComponent implements OnInit {
  selectedView: string = '';
  public iMarkoutApiService: IMarkoutApiService;

  constructor(public markoutApiService: MarkoutApiService) {
    this.iMarkoutApiService = markoutApiService;
   }

  ngOnInit(): void {
    this.getMarkoutPreferences()
  }

  emitSelectedValue(viewType: string) {
    this.selectedView = viewType;
  }

  getMarkoutPreferences() {

    this.iMarkoutApiService
      .GetMarkoutPreferences()
      .subscribe((res: MOPrefResponse) => {
        // this.toteDataResponse = res;
        console.log(res)
      });
  }

}
