import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

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
  constructor(    public authService: AuthService,private Api:ApiFuntions) {
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
    this.Api.ColumnAlias().subscribe((res: any) => {
      this.columns = res.data;
    })
  }
  public FieldNameSave() { 
    const payload :any = {
      "itemAlias": this.columns?.itemNumber?this.columns?.itemNumber:'',
      "uomAlias": this.columns?.unitOfMeasure? this.columns?.unitOfMeasure:'',
      "ufs": [
       this.columns?.userField1? this.columns.userField1:'',this.columns?.userField2?this.columns?.userField2:'', this.columns?.userField3?this.columns?.userField3:'',this.columns?.userField4?this.columns?.userField4:'',this.columns?.userField5?this.columns?.userField5:'',this.columns?.userField6?this.columns?.userField6:'',this.columns?.userField7?this.columns?.userField7:'',
       this.columns?.userField8?this.columns?.userField8:'',this.columns?.userField9?this.columns?.userField9:'',this.columns?.userField10?this.columns?.userField10:''
      ],
      "username":  this.userData.userName,
      "wsid":this.userData.wsid
    };
    this.Api.FieldNameSave(payload).subscribe((res: any) => {
      this.OSFieldFilterNames();
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
