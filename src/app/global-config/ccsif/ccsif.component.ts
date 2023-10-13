import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { GlobalService } from 'src/app/common/services/global.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IGlobalConfigApi } from 'src/app/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/services/globalConfig-api/global-config-api.service';

@Component({
  selector: 'app-ccsif',
  templateUrl: './ccsif.component.html',
  styleUrls: []
})
export class CcsifComponent implements OnInit {
  sideBarOpen: boolean = true;
  Status:any = 'Offline';
  public  iGlobalConfigApi: IGlobalConfigApi
  constructor( 
    public global:GlobalService,   
     public api: ApiFuntions,
     public globalConfigApi: GlobalConfigApiService) {
      this.iGlobalConfigApi = globalConfigApi;
      }

  ngOnInit(): void {
    this.CheckStatus(); 
  }
  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }
  
   ServiceStatus(changeType, success) {
    if (changeType == 'start' || changeType == 'restart') {
        if (success) {
            this.Status = 'Online';
            this.global.ShowToastr('success','Service ' + changeType + ' was successful.','Success');
        } else {
          this.Status = 'Offline'; 
          this.global.ShowToastr('error','Service ' + changeType + ' was unsuccessful.  Please try again or contact Scott Tech for support.','Error');
        };
    } else {
      this.Status = 'Offline'; 
        if (success) {
          this.global.ShowToastr('success','Service stop was successful.','Success');
        } else {
          this.global.ShowToastr('error','Service stop encountered an error.  Please try again or contact Scott Tech for support.','Error');
        };
    };
};
  // ConfirmationPopup(msg:any) {
  //   const dialogRef  = this.global.OpenDialog(ConfirmationDialogComponent, {
  //     height: 'auto',
  //     width: '560px',
  //     autoFocus: '__non_existing_element__',

  //     data: {
  //       message: msg,
  //     },
  //   });  
  //    dialogRef.afterClosed().subscribe((result) => {
  //     if (result==='Yes') {
  //       this.ServiceStatus('start',true);
  //     }
  //   }); 
  // }
  async CCSIFToggle(){     
    if(this.Status != 'Online'){
    this.iGlobalConfigApi.startCCSIF().subscribe((res: any) => {
      if(res.data) this.ServiceStatus('start',res.data);
    }) 
  }else  {
    this.iGlobalConfigApi.stopCCSIF().subscribe((res: any) => {
      if(res.data) this.ServiceStatus('stop',res.data);
    })
  }
}
async CheckStatus(){
  this.iGlobalConfigApi.ServiceStatusCCSIF().subscribe((res: any) => {
    if(res.data)   this.Status = 'Online';
    else    this.Status = 'Offline';
  })
  
}
}
