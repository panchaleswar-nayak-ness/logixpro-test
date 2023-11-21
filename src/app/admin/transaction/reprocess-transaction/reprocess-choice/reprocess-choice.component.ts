import { Component, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import labels from '../../../../labels/labels.json';
import { SharedService } from '../../../../services/shared.service';
import { MatSelect } from '@angular/material/select';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { StringConditions, ToasterMessages, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-reprocess-choice',
  templateUrl: './reprocess-choice.component.html',
  styleUrls: []
})
export class ReprocessChoiceComponent  {

  @Input() reprocessCount: any;
  @Input() isEnabled: any;
  @Input() transactionID: any;
  @Input() userData: any;
  @Input() isReprocessedChecked: any;
  @Input() isCompleteChecked: any;
  @Input() isHistoryChecked: any;
  @Input() rOrder: any = '';
  @Input() rItem: any = '';
  @Input() selection: any = '';
  @Input() searchString: any = '';
  @Input() hold: boolean = false;

  @Output() itemUpdatedEvent = new EventEmitter<boolean>();

  public iAdminApiService: IAdminApiService;

  constructor(
    private global: GlobalService, 
    public sharedService: SharedService,
    public adminApiService: AdminApiService
  ) { 
    this.iAdminApiService = adminApiService 
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['rOrder']?.currentValue) this.rOrder = changes['rOrder'].currentValue;
    if (changes['rItem']?.currentValue) this.rOrder = changes['rItem'].currentValue;
    if (changes['selection']?.currentValue) this.selection = changes['selection'].currentValue;
    if (changes['searchString']?.currentValue) this.searchString = changes['searchString'].currentValue;
  }

  postTransaction() { 
    this.iAdminApiService.PostReprocessTransaction({}).subscribe({
      next: (res: any) => {
        if (res.data && res.isExecuted) {
          this.isEnabled = true;
          this.clearControls();
          this.global.ShowToastr(ToasterType.Success, res.responseMessage, ToasterTitle.Success);
          this.itemUpdatedEvent.emit(true);
        } else {
          this.clearControls();
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          this.itemUpdatedEvent.emit(true);
          console.log("PostReprocessTransaction",res.responseMessage);
        }
      }
    });
  }

  clearControls() {
    this.isEnabled = true;
    this.isReprocessedChecked.flag = false;
    this.isCompleteChecked.flag = false;
    this.isHistoryChecked.flag = false;
  }

  changeOrderStatus(status): void {
    if (status == StringConditions.Reprocess) this.isCompleteChecked.flag = false;
    else if (status == StringConditions.Complete) this.isReprocessedChecked.flag = false;

    let payload = {
      id: this.transactionID,
      reprocess: (this.isReprocessedChecked.flag) ? 1 : 0,
      postComplete: (this.isCompleteChecked.flag) ? 1 : 0,
      sendHistory: (this.isHistoryChecked.flag) ? 1 : 0,
      field: "", 
    }
    this.iAdminApiService.ReprocessIncludeSet(payload).subscribe({
      next: (res: any) => {
        if (res.data && res.isExecuted) {
          this.global.ShowToastr(ToasterType.Success, labels.alert.update, ToasterTitle.Success);
          this.itemUpdatedEvent.emit(true);
        } else {
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("ReprocessIncludeSet",res.responseMessage);
        }
      }
    });
  }

  markTableSelection(matEvent: any) {
    const matSelect: MatSelect = matEvent.source;
    matSelect.writeValue(null);
  }

  markTable(type: string) {
    let payload = {
      "OrderNum": this.rOrder,
      "ItemNum": this.rItem,
      "Hold": this.hold ? 1 : 0,
      "searchCol": this.selection,
      "searchString": this.searchString,
      "field": type
    }
    this.iAdminApiService.SetReprocessIds(payload).subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          this.global.ShowToastr(ToasterType.Success, labels.alert.update, ToasterTitle.Success);
          this.itemUpdatedEvent.emit(true);
        } else this.global.ShowToastr(ToasterType.Error, 'There was an error marking the designated reprocess records', ToasterTitle.Error);
      }
    );
  }
}
