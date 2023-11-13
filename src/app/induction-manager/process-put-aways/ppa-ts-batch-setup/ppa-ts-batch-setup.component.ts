import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api.service';

@Component({
  selector: 'app-ppa-ts-batch-setup',
  templateUrl: './ppa-ts-batch-setup.component.html',
  styleUrls: []
})
export class PpaTsBatchSetupComponent  implements OnInit{

  hideRequiredControlItem = new FormControl(false);
  floatLabelControlItem: any = new FormControl('item' as FloatLabelType);
  @Input() cellSize = '0';
  @Input() batchId = '';
  @Input() status;
  searchByItem: any = new Subject<string>();
  @Input() searchAutocompleteItemNum: any = [];
  @Input() assignedZones = '';

  @Output() funCall = new EventEmitter<any>();

  public iinductionManagerApi:IInductionManagerApiService;
 
  constructor( 
    private global:GlobalService, 
    public inductionManagerApi: InductionManagerApiService,
  ) { 
    this.iinductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.searchByItem
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        this.autocompleteSearchColumnItem();
      });
  }

  callFun(funName:any,funParam:any){
    debugger
    this.funCall.emit({funName:funName,funParam:funParam});
   
  }

  getFloatLabelValueItem(): FloatLabelType {
    return this.floatLabelControlItem.value || 'item';
  }

  async autocompleteSearchColumnItem() {
    let searchPayload = { batchID: this.batchId };
    this.iinductionManagerApi.BatchIDTypeAhead(searchPayload).subscribe(
      (res: any) => {
        if (res.isExecuted &&  res.data) this.searchAutocompleteItemNum = res.data;
        else {
          this.global.ShowToastr('error','Something went wrong', 'Error!');
          console.log("BatchIDTypeAhead",res.responseMessage);
        }
      },
      (error) => { }
    );
  }
  
}
