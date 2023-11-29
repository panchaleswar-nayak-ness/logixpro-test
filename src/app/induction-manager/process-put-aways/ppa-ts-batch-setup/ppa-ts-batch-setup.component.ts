import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ToasterMessages, ToasterTitle, ToasterType ,UniqueConstants} from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';

@Component({
  selector: 'app-ppa-ts-batch-setup',
  templateUrl: './ppa-ts-batch-setup.component.html',
  styleUrls: ['./ppa-ts-batch-setup.component.scss']
})
export class PpaTsBatchSetupComponent  implements OnInit{

  hideRequiredControlItem = new FormControl(false);
  floatLabelControlItem: any = new FormControl(UniqueConstants.item as FloatLabelType);
  @Input() cellSize = '0';
  @Input() batchId = '';
  @Input() status;
  searchByItem: any = new Subject<string>();
  @Input() searchAutocompleteItemNum: any = [];
  @Input() assignedZones = '';

  @Output() funCall = new EventEmitter<any>();

  public iInductionManagerApi:IInductionManagerApiService;
 
  constructor( 
    private global:GlobalService, 
    public inductionManagerApi: InductionManagerApiService,
  ) { 
    this.iInductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.searchByItem
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autoCompleteSearchColumnItem();
      });
  }

  callFun(funName:any,funParam:any){
    this.funCall.emit({funName:funName,funParam:funParam,batchId:this.batchId});
  }

  getFloatLabelValueItem(): FloatLabelType {
    return this.floatLabelControlItem.value || UniqueConstants.item;
  }

  async autoCompleteSearchColumnItem() {
    let searchPayload = { batchID: this.batchId };
    this.iInductionManagerApi.BatchIDTypeAhead(searchPayload).subscribe(
      (res: any) => {
        if (res.isExecuted &&  res.data) this.searchAutocompleteItemNum = res.data;
        else {
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("BatchIDTypeAhead",res.responseMessage);
        }
      },
      (error) => { }
    );
  }
  
}
