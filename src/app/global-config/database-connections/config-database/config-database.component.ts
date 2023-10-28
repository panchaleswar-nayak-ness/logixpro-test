import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IGlobalConfigApi } from 'src/app/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/services/globalConfig-api/global-config-api.service';
import { GlobalService } from 'src/app/common/services/global.service';


@Component({
  selector: 'app-config-database',
  templateUrl: './config-database.component.html',
  styleUrls: [],
})
export class ConfigDatabaseComponent {
  @Input() connectionStringData;
  @Output() configdbUpdateEvent = new EventEmitter<string>();

  connectionNameSelect: any = '';
  public  iGlobalConfigApi: IGlobalConfigApi;
  constructor(
    private global: GlobalService,
    private Api:ApiFuntions,
    public globalConfigApi: GlobalConfigApiService
    ) {
      this.iGlobalConfigApi = globalConfigApi;
    }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['connectionStringData']?.currentValue?.connectionString
    )
      this.connectionStringData =
        changes['connectionStringData']['currentValue'];

    if (
      this.connectionStringData?.laConnectionString?.length > 0
    ) {
      this.connectionNameSelect =
        this.connectionStringData?.laConnectionString[0]?.connectionName;
    }
  }

  onSelectionChange(event) {
    this.getConnectionStringSet(event.value);
    
    // this.connectionNameSelect=event.value
  }

  getConnectionStringSet(item) {
    let payload = {
      ConnectionName: item,
    };
    this.iGlobalConfigApi
      .LAConnectionStringSet(payload)
      .subscribe(
        {next: (res: any) => {
          if (res.isExecuted) {
            this.connectionNameSelect = res.data.connectionName;
            this.configdbUpdateEvent.emit(res.isExecuted);
          }
          else{
            this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
            console.log("LAConnectionStringSet",res.responseMessage);
          }
        },
        error: (error) => {}}
      );
  }
}
