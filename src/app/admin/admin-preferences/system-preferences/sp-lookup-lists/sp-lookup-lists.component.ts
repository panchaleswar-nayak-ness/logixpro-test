import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { SharedService } from 'src/app/common/services/shared.service';
import { ToasterTitle, ToasterType, ListNames, LookupListDescriptions, LookupListDeleteMessages } from 'src/app/common/constants/strings.constants';
import { LookupListConfig } from 'src/app/common/types/lookup-table.types';

@Component({
  selector: 'app-sp-lookup-lists',
  templateUrl: './sp-lookup-lists.component.html',
  styleUrls: ['./sp-lookup-lists.component.scss']
})
export class SpLookupListsComponent implements OnInit {
  fieldNames: any;
  public iAdminApiService: IAdminApiService;

  // Lookup List Configurations
  readonly pickConfig: LookupListConfig = {
    listName: ListNames.ShortPick,
    infoText: LookupListDescriptions.PickLookupInfo,
    deleteActionMessage: LookupListDeleteMessages.Pick,
    automationIdPrefix: 'pick'
  };

  readonly putAwayConfig: LookupListConfig = {
    listName: ListNames.PutAwayChangeQty,
    infoText: LookupListDescriptions.PutAwayLookupInfo,
    deleteActionMessage: LookupListDeleteMessages.PutAway,
    automationIdPrefix: 'put-away'
  };

  readonly hotPickConfig: LookupListConfig = {
    listName: ListNames.HotPick,
    infoText: LookupListDescriptions.HotPickLookupInfo,
    deleteActionMessage: LookupListDeleteMessages.HotPick,
    automationIdPrefix: 'hot-pick'
  };

  readonly hotPutAwayConfig: LookupListConfig = {
    listName: ListNames.HotPut,
    infoText: LookupListDescriptions.HotPutAwayLookupInfo,
    deleteActionMessage: LookupListDeleteMessages.HotPutAway,
    automationIdPrefix: 'hot-put-away'
  };

  readonly hotMoveConfig: LookupListConfig = {
    listName: ListNames.HotMove,
    infoText: LookupListDescriptions.HotMoveLookupInfo,
    deleteActionMessage: LookupListDeleteMessages.HotMove,
    automationIdPrefix: 'hot-move'
  };

  readonly blindInductionConfig: LookupListConfig = {
    listName: ListNames.BlindInduct,
    infoText: LookupListDescriptions.BlindInductionLookupInfo,
    deleteActionMessage: LookupListDeleteMessages.BlindInduction,
    automationIdPrefix: 'blind-induction'
  };

  constructor(private Api: ApiFuntions, private global: GlobalService, private sharedService: SharedService, private adminApiService: AdminApiService) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.OSFieldFilterNames();

  }
  public OSFieldFilterNames() { 
    this.iAdminApiService.ColumnAlias().subscribe((res: any) => {
      if(res.isExecuted && res.data)
      {
        this.fieldNames = res.data;
        this.sharedService.updateFieldNames(this.fieldNames)
      }
      else  {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ColumnAlias",res.responseMessage);

      }
      
      
    })
  }
}
