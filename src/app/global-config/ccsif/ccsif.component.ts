import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-ccsif',
  templateUrl: './ccsif.component.html',
  styleUrls: []
})
export class CcsifComponent implements OnInit {
  sideBarOpen: boolean = true;
  Status:any = 'Offline';
  constructor( public dialog: MatDialog,    public api: ApiFuntions,private toastr:ToastrService) { }

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
            this.toastr.success('Service ' + changeType + ' was successful.','Success', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
        } else {
          this.Status = 'Offline'; 
          this.toastr.error('Service ' + changeType + ' was unsuccessful.  Please try again or contact Scott Tech for support.','Error', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        };
    } else {
      this.Status = 'Offline'; 
        if (success) {
          this.toastr.success('Service stop was successful.','Success', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        } else {
          this.toastr.error('Service stop encountered an error.  Please try again or contact Scott Tech for support.','Error', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        };
    };
};
  // ConfirmationPopup(msg:any) {
  //   const dialogRef  = this.dialog.open(ConfirmationDialogComponent, {
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
    this.api.startCCSIF().subscribe((res: any) => {
      if(res.data) this.ServiceStatus('start',res.data);
    }) 
  }else  {
    this.api.stopCCSIF().subscribe((res: any) => {
      if(res.data) this.ServiceStatus('stop',res.data);
    })
  }
}
async CheckStatus(){
  this.api.ServiceStatusCCSIF().subscribe((res: any) => {
    if(res.data)   this.Status = 'Online';
    else    this.Status = 'Offline';
  })
  
}
}
