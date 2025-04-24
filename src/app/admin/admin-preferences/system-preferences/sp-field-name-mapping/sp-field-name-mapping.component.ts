import { Component, OnInit } from '@angular/core';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { ToasterMessages, ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { ApiResponse, FieldMappingAlias } from 'src/app/common/types/CommonTypes';
import { FieldMappingService } from 'src/app/common/services/field-mapping/field-mapping.service';
import { time } from 'echarts';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-sp-field-name-mapping',
  templateUrl: './sp-field-name-mapping.component.html',
  styleUrls: []
})
export class SpFieldNameMappingComponent implements OnInit {
  Object = Object;
  public columns :FieldMappingAlias;
  public iAdminApiService: IAdminApiService;
  constructor(
    public authService: AuthService, 
    private global : GlobalService,
    public adminApiService: AdminApiService,
    private fieldMappingService: FieldMappingService
  ) {
    this.iAdminApiService = adminApiService;
    this.emptyColumns();
  }

  ngOnInit(): void {
    this.OSFieldFilterNames();
  }

  emptyCol(){
    this.emptyColumns();
    this.FieldNameSave(true);
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
      userField10: '',
      bin : '',
      shelf: '',
      row: '',
      carousel: '',
      routeID: '',
      statusDate: '',
      consolidationStatus: '',
      routeIDStatus: '',
      consolidationProgress: '',
      routeIDStatusCountCard: '',
      consolidationStatusCard: ''
    }
  }


  public OSFieldFilterNames() { 
    this.iAdminApiService.ColumnAlias().subscribe((res: ApiResponse<FieldMappingAlias>) => {
      if(res.isExecuted && res.data) this.columns = res.data;
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ColumnAlias",res.responseMessage);
      }
    });
  }

  public FieldNameSave(defaultCheck?:boolean) { 
    const payload = {
      itemNumber: this.columns.itemNumber,
      unitOfMeasure: this.columns.unitOfMeasure,
      userField1: this.columns.userField1,
      userField2: this.columns.userField2,
      userField3: this.columns.userField3,
      userField4: this.columns.userField4,
      userField5: this.columns.userField5,
      userField6: this.columns.userField6,
      userField7: this.columns.userField7,
      userField8: this.columns.userField8,
      userField9: this.columns.userField9,
      userField10: this.columns.userField10,
      bin: this.columns.bin,
      shelf: this.columns.shelf,
      row: this.columns.row,
      carousel: this.columns.carousel,
      routeID: this.columns.routeID,
      statusDate: this.columns.statusDate,
      consolidationStatus: this.columns.consolidationStatus,
      routeIDStatus: this.columns.routeIDStatus,
      consolidationProgress: this.columns.consolidationProgress,
      routeIDStatusCountCard: this.columns.routeIDStatusCountCard,
      consolidationStatusCard: this.columns.consolidationStatusCard
    };
    
    const isEmptyOrWhitespace = (value: string) => !value || value.trim().length === 0;

    if (Object.values(payload).some(value => isEmptyOrWhitespace(String(value)))) {
      if (!defaultCheck) {
        this.global.ShowToastr(
          ToasterType.Info,
          ToasterMessages.FieldEmptyDefault,
          ToasterTitle.Info
        );
      }
    }
    this.iAdminApiService.FieldNameSave(payload).subscribe((res: any) => {
      if(res) {
        this.OSFieldFilterNames();
        this.fieldMappingService.loadFieldMappings();
      }
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
