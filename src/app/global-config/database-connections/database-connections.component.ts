import { Component, OnInit } from '@angular/core';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { SharedService } from 'src/app/services/shared.service'; 

@Component({
  selector: 'app-database-connections',
  templateUrl: './database-connections.component.html',
  styleUrls: ['./database-connections.component.scss'],
})
export class DatabaseConnectionsComponent implements OnInit {
  sideBarOpen: boolean = true;
  constructor(
    private Api:ApiFuntions,
    private sharedService: SharedService
  ) {}
  dbConnectionData = [];
  ngOnInit(): void {
    let sharedData = this.sharedService.getData();
    if (sharedData && sharedData['connectionString']) {
      sharedData['connectionString'].map((obj) => {obj.isButtonDisable=true,obj.isSqlButtonDisable=false,obj.isNewConn=false,obj.isDuplicate=false});

      this.dbConnectionData = sharedData;
    } else {
      this.getMenuData();
    }
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  getMenuData() {
    let payload = {
      LicenseString:
        'qdljjBp3O3llQvKEW01qlvO4dTIFf6VMuJvYMgXgEc8U8q+dVlMKt0mKG6qtD9DO',
      AppUrl: 'CM1',
      DisplayName: 'Consolidation Manager',
      AppName: 'Consolidation Manager',
    };
    this.Api.Menu(payload).subscribe(
      (res: any) => {

        this.dbConnectionData = res && res.data;
        this.dbConnectionData['connectionString'].map((obj) => {obj.isButtonDisable=true,obj.isSqlButtonDisable=false,obj.isNewConn=false,obj.isDuplicate=false});
        
        this.sharedService.setData(this.dbConnectionData);
      },
      (error) => {}
    );
  }
  updateListEventRec(event) {
    if (event) {
      this.getMenuData();
    }
  }
}
