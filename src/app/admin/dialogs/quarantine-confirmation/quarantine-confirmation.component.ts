import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from '../../../../app/init/auth.service';
import labels from '../../../labels/labels.json'; 
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';

@Component({
  selector: 'app-quarantine-confirmation',
  templateUrl: './quarantine-confirmation.component.html',
})
export class QuarantineConfirmationComponent implements OnInit {
  public iAdminApiService: IAdminApiService;
  action: any;
  userData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private adminApiService: AdminApiService, private dialog: MatDialog, private toastr: ToastrService,private authService: AuthService,
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
        this.toastr.success(labels.alert.quarantine, 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      } else {
        
        this.dialog.closeAll();
        this.toastr.error(labels.alert.went_worng, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    });
      
    } else if(this.data.mode === 'inventory-map-unquarantine') {

      let payload = {
        "mapID": this.data.id
    }
    this.iAdminApiService.unQuarantineInventoryMap(payload).subscribe((res: any) => {

      if (res.isExecuted) {
        
        this.dialog.closeAll();
        this.toastr.success(labels.alert.quarantine.replace("quarantine","unquarantined"), 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      } else {
        
        this.dialog.closeAll();
        this.toastr.error(labels.alert.went_worng, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    });

    }
  }

}
