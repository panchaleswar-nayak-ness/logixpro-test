import { Component, OnInit } from '@angular/core';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-sp-lookup-lists',
  templateUrl: './sp-lookup-lists.component.html',
  styleUrls: []
})
export class SpLookupListsComponent implements OnInit {
  fieldNames:any;
  public iAdminApiService: IAdminApiService;
  constructor(private Api:ApiFuntions,private sharedService:SharedService,private adminApiService: AdminApiService) {
    this.iAdminApiService = adminApiService;
   }

  ngOnInit(): void {
    this.OSFieldFilterNames();

  }
  public OSFieldFilterNames() { 
    this.iAdminApiService.ColumnAlias().subscribe((res: any) => {
      this.fieldNames = res.data;
      this.sharedService.updateFieldNames(this.fieldNames)
    })
  }
}
