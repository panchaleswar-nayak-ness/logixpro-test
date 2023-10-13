import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
 
import { AuthService } from '../../../../app/init/auth.service';
import labels from '../../../labels/labels.json'; 
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-quarantine-confirmation',
  templateUrl: './quarantine-confirmation.component.html',
})
export class QuarantineConfirmationComponent implements OnInit {
  public iAdminApiService: IAdminApiService;
  action: any;
  userData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private adminApiService: AdminApiService, 
  private global:GlobalService,
  private dialog:MatDialog, private authService: AuthService,
  private Api:ApiFuntions ) {
    this.iAdminApiService = adminApiService;
    if (this.data.mode === 'inventory-map-quarantine') {
    this.action = 'Quarantine'
    } else if(this.data.mode === 'inventory-map-unquarantine') {
      this.action = 'Unquarantine'
    }
   }

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }

  onConfirmQuarantine () { 
    if (this.data.mode === 'inventory-map-quarantine') {
      let payload = {
        "mapID": this.data.id
    }
    this.iAdminApiService.quarantineInventoryMap(payload).subscribe((res: any) => {

      if (res.isExecuted) {
        
        this.dialog.closeAll();
        this.global.ShowToastr('success',labels.alert.quarantine, 'Success!');
      } else {
        
        this.dialog.closeAll();
        this.global.ShowToastr('error',labels.alert.went_worng, 'Error!');
      }
    });
      
    } else if(this.data.mode === 'inventory-map-unquarantine') {

      let payload = {
        "mapID": this.data.id
    }
    this.iAdminApiService.unQuarantineInventoryMap(payload).subscribe((res: any) => {

      if (res.isExecuted) {
        
        this.dialog.closeAll();
        this.global.ShowToastr('success',labels.alert.quarantine.replace("quarantine","unquarantined"), 'Success!');
      } else {
        
        this.dialog.closeAll();
        this.global.ShowToastr('error',labels.alert.went_worng, 'Error!');
      }
    });

    }
  }

}
