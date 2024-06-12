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
import { MoBlossomToteComponent } from 'src/app/markout/dialogs/mo-blossom-tote/mo-blossom-tote.component';
import { DialogConstants } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { IMarkoutApiService } from 'src/app/common/services/markout-api/markout-api-interface';
import { MarkoutApiService } from 'src/app/common/services/markout-api/markout-api-service';
import { ToteDataResponse } from '../models/markout-model';

@Component({
  selector: 'app-markout-search',
  templateUrl: './markout-search.component.html',
  styleUrls: ['./markout-search.component.scss'],
})
export class MarkoutSearchComponent implements OnInit {
  @Output() toteIdEmitter = new EventEmitter<string>();

  floatLabelControl = new FormControl('auto' as FloatLabelType);
  toteId: string = '';
  orderNumber: string = '';
  
  public iMarkoutApiService: IMarkoutApiService;
  
  @Input() toteDataResponse: ToteDataResponse;
  
  constructor(
  private global: GlobalService,
    public markoutApiService: MarkoutApiService) {
    this.iMarkoutApiService = markoutApiService;
  }

  ngOnInit(): void {
    this.toteDataResponse = new ToteDataResponse();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['toteDataResponse'] &&
      changes['toteDataResponse']['currentValue']
    ) {
      this.orderNumber = this.toteDataResponse.data[0]?.orderNumber || "";
      this.toteId = '';
    }
  }

  emitToteId() {
    this.toteIdEmitter.emit(this.toteId);
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }


  blossomtotedialog(){
    if(this.toteDataResponse && this.toteDataResponse.data && (this.toteDataResponse.data.length != 0 && this.toteDataResponse.toteStatus != 'Complete')){
      let dialogRefTote;
      dialogRefTote = this.global.OpenDialog(MoBlossomToteComponent, {
        height: DialogConstants.auto,
        width: '990px',
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          markoutlistdataSource: JSON.parse(JSON.stringify(this.toteDataResponse.data.
          filter((element) => (element.status != 'Ship Short') && (element.status != 'Complete'))))
        }
      });
      dialogRefTote.afterClosed().subscribe((result) => {
        if(result){
          this.toteIdEmitter.emit("");
        }
      });
    }
  }
}
