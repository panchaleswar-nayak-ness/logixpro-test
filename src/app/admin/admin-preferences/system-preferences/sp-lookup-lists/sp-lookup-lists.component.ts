import { Component, OnInit } from '@angular/core';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-sp-lookup-lists',
  templateUrl: './sp-lookup-lists.component.html',
  styleUrls: []
})
export class SpLookupListsComponent implements OnInit {
  fieldNames:any
  constructor(private Api:ApiFuntions,private sharedService:SharedService) { }

  ngOnInit(): void {
    this.OSFieldFilterNames();

  }
  public OSFieldFilterNames() { 
    this.Api.ColumnAlias().subscribe((res: any) => {
      this.fieldNames = res.data;
      this.sharedService.updateFieldNames(this.fieldNames)
    })
  }
}
