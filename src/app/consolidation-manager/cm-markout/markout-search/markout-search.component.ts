import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { FloatLabelType } from '@angular/material/form-field';
import { MoBlossomToteComponent } from 'src/app/consolidation-manager/cm-markout/dialogs/mo-blossom-tote/mo-blossom-tote.component';
import { BlossomType, DialogConstants } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { IMarkoutApiService } from 'src/app/common/services/markout-api/markout-api-interface';
import { MarkoutApiService } from 'src/app/common/services/markout-api/markout-api-service';
import { MarkoutToteRequest, MOPrefResponse, ToteDataResponse } from '../models/markout-model';

@Component({
  selector: 'app-markout-search',
  templateUrl: './markout-search.component.html',
  styleUrls: ['./markout-search.component.scss'],
})
export class MarkoutSearchComponent implements OnInit {

  @Output() toteIdEmitter = new EventEmitter<MarkoutToteRequest>();
  @Output() viewChangeEmitter = new EventEmitter<string>();

  floatLabelControl = new FormControl('auto' as FloatLabelType);
  orderNumber: string = '';
  selectedView: string = '';
  
  public iMarkoutApiService: IMarkoutApiService;
  
  @Input() toteId: string = '';
  @Input() toteDataResponse: ToteDataResponse;
  @Input() isBlossomComplete: boolean;
  blossomType = BlossomType;
  
  constructor(
  private global: GlobalService,
    public markoutApiService: MarkoutApiService) {
    this.iMarkoutApiService = markoutApiService;
  }

  ngOnInit(): void {
    this.getMarkoutPreferences()
    this.toteDataResponse = new ToteDataResponse();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['toteDataResponse'] &&
      changes['toteDataResponse']['currentValue']
    ) {
      this.orderNumber = this.toteDataResponse.data[0]?.orderNumber || "";
    }
    if (
      changes['toteId'] &&
      changes['toteId']['currentValue']
    ) {
      this.toteId = changes['toteId']['currentValue'];
    }
  }

  viewChange(){
    this.viewChangeEmitter.emit(this.selectedView);
  }

  emitSelectedValue(viewType: string) {
    this.selectedView = viewType;
  }

  getMarkoutPreferences() {
    this.iMarkoutApiService
      .GetMarkoutPreferences()
      .subscribe((res: MOPrefResponse) => {
        this.selectedView = res.defaultViewType;
        this.viewChangeEmitter.emit(this.selectedView);
      });
  }

  emitToteId() {
    this.toteIdEmitter.emit({ toteId: this.toteId, viewType: this.selectedView });
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  blossomtotedialog(type){
    if(type == this.blossomType.BlossomComplete && !this.isBlossomComplete){
      return;
    }
    if(this.toteDataResponse && this.toteDataResponse.data && (this.toteDataResponse.data.length != 0 && this.toteDataResponse.toteStatus != 'Complete')){
      let dialogRefTote;
      dialogRefTote = this.global.OpenDialog(MoBlossomToteComponent, {
        height: DialogConstants.auto,
        width: '990px',
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          markoutlistdataSource: JSON.parse(JSON.stringify(this.toteDataResponse.data.
          filter((element) => (element.status != 'Ship Short') && (element.status != 'Complete')))),
          type:type
        }
      });
      dialogRefTote.afterClosed().subscribe((result) => {
        if(result){
          this.toteIdEmitter.emit( {toteId: '', viewType: this.selectedView });
        }
      });
    }
  }
}
