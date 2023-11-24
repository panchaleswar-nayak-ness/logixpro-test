import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { SharedService } from 'src/app/common/services/shared.service';
import {  ToasterTitle } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-sp-lookup-lists',
  templateUrl: './sp-lookup-lists.component.html',
  styleUrls: ['./sp-lookup-lists.component.scss']
})
export class SpLookupListsComponent implements OnInit {
  fieldNames:any;
  public iAdminApiService: IAdminApiService;
  constructor(private Api:ApiFuntions,private global : GlobalService, private sharedService:SharedService,private adminApiService: AdminApiService) {
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
        this.global.ShowToastr('error', this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ColumnAlias",res.responseMessage);

      }
      
      
    })
  }
}
