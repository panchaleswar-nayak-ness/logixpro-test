import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-config-database',
  templateUrl: './config-database.component.html',
  styleUrls: [],
})
export class ConfigDatabaseComponent {
  @Input() connectionStringData;
  @Output() configdbUpdateEvent = new EventEmitter<string>();

  connectionNameSelect: any = '';
  constructor(private Api:ApiFuntions) {}

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
    this.Api
      .LAConnectionStringSet(payload)
      .subscribe(
        {next: (res: any) => {
          if (res.isExecuted) {
            this.connectionNameSelect = res.data.connectionName;
            this.configdbUpdateEvent.emit(res.isExecuted);
          }
        },
        error: (error) => {}}
      );
  }
}
