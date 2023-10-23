import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-sp-field-name-mapping',
  templateUrl: './sp-field-name-mapping.component.html',
  styleUrls: []
})
export class SpFieldNameMappingComponent implements OnInit {
  public userData: any;
  public CompanyObj: any={};
  Object=Object;
  public columns :any={};
  public iAdminApiService: IAdminApiService;
  constructor(    public authService: AuthService, private global : GlobalService ,private adminApiService: AdminApiService,private Api:ApiFuntions) {
    this.iAdminApiService = adminApiService;
    this.userData = authService.userData();
   }

  ngOnInit(): void {
    this.OSFieldFilterNames();
  }
  Reset(){
    for(let item in this.columns){
      this.columns[item] = null;
    }
  }
   
  public OSFieldFilterNames() { 
    this.iAdminApiService.ColumnAlias().subscribe((res: any) => {
      if(res.isExecuted && res.data)
      {
        this.columns = res.data;
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("ColumnAlias",res.responseMessage);
      }
      
    })
  }
  public FieldNameSave() { 
    const payload :any = {
      "itemAlias": this.columns?.itemNumber?this.columns?.itemNumber:'',
      "uomAlias": this.columns?.unitOfMeasure? this.columns?.unitOfMeasure:'',
      "ufs": [
       this.columns?.userField1? this.columns.userField1:'',this.columns?.userField2?this.columns?.userField2:'', this.columns?.userField3?this.columns?.userField3:'',this.columns?.userField4?this.columns?.userField4:'',this.columns?.userField5?this.columns?.userField5:'',this.columns?.userField6?this.columns?.userField6:'',this.columns?.userField7?this.columns?.userField7:'',
       this.columns?.userField8?this.columns?.userField8:'',this.columns?.userField9?this.columns?.userField9:'',this.columns?.userField10?this.columns?.userField10:''
      ]
    };
    this.iAdminApiService.FieldNameSave(payload).subscribe((res: any) => {
      if(res)
      {
        this.OSFieldFilterNames();
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("FieldNameSave",res.responseMessage);
      }
      
    })
  }
  
  labelSet(input: string): string {
    const formattedText = this.capitalizeFirstAlpha(input).replace(/([A-Z])/g, ' $1');
    return formattedText.trim();
  }
  capitalizeFirstAlpha(input: string): string {
    const firstAlphaIndex = input.search(/[a-zA-Z]/);
  
    if (firstAlphaIndex === -1) {
      return input;
    }
  
    const firstAlpha = input.charAt(firstAlphaIndex).toUpperCase();
    const capitalizedString = input.slice(0, firstAlphaIndex) + firstAlpha + input.slice(firstAlphaIndex + 1);
  
    return capitalizedString;
  }
  
}
