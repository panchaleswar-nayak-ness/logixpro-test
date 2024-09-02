import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { ApiResponse, ColumnAlias } from 'src/app/common/types/CommonTypes';

@Component({
  selector: 'app-sp-field-name-mapping',
  templateUrl: './sp-field-name-mapping.component.html',
  styleUrls: []
})
export class SpFieldNameMappingComponent implements OnInit {
  Object = Object;
  public columns :ColumnAlias;
  public iAdminApiService: IAdminApiService;
  constructor(
    public authService: AuthService, 
    private global : GlobalService,
    public adminApiService: AdminApiService
  ) {
    this.iAdminApiService = adminApiService;
    this.emptyColumns();
  }

  ngOnInit(): void {
    this.OSFieldFilterNames();
  }

  emptyColumns(){
    this.columns = {
      itemNumber: '',
      unitOfMeasure: '',
      userField1: '',
      userField2: '',
      userField3: '',
      userField4: '',
      userField5: '',
      userField6: '',
      userField7: '',
      userField8: '',
      userField9: '',
      userField10: ''
    }
  }
   
  public OSFieldFilterNames() { 
    this.iAdminApiService.ColumnAlias().subscribe((res: ApiResponse<ColumnAlias>) => {
      if(res.isExecuted && res.data) this.columns = res.data;
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ColumnAlias",res.responseMessage);
      }
    });
  }

  public FieldNameSave() { 
    const payload = {
      "itemAlias": this.columns.itemNumber,
      "uomAlias": this.columns.unitOfMeasure,
      "ufs": [
       this.columns.userField1,
       this.columns.userField2, 
       this.columns.userField3,
       this.columns.userField4,
       this.columns.userField5,
       this.columns.userField6,
       this.columns.userField7,
       this.columns.userField8,
       this.columns.userField9,
       this.columns.userField10
      ]
    };
    this.iAdminApiService.FieldNameSave(payload).subscribe((res: any) => {
      if(res) this.OSFieldFilterNames();
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("FieldNameSave",res.responseMessage);
      }
    });
  }
  
  labelSet(input: string): string {
    const formattedText = this.capitalizeFirstAlpha(input).replace(/([A-Z])/g, ' $1');
    return formattedText.trim();
  }

  capitalizeFirstAlpha(input: string): string {
    const firstAlphaIndex = input.search(/[a-zA-Z]/);
    if (firstAlphaIndex === -1) return input
    const firstAlpha = input.charAt(firstAlphaIndex).toUpperCase();
    const capitalizedString = input.slice(0, firstAlphaIndex) + firstAlpha + input.slice(firstAlphaIndex + 1);
    return capitalizedString;
  }
  
}
