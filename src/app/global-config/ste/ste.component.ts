import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-ste',
  templateUrl: './ste.component.html',
  styleUrls: []
})
export class SteComponent implements OnInit {
  sideBarOpen: boolean = true;
  Status:any = 'Offline';
  constructor( public dialog: MatDialog,    public Api: ApiFuntions,private toastr:ToastrService) { }

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
  async STEToggle(){  
    try{ 
      if(this.Status != 'Online'){
      this.Api.startSTEService().subscribe((res: any) => {
        if(res.data) this.ServiceStatus('start',res.data);
      }) 
    }else  {
      this.Api.stopSTEService().subscribe((res: any) => {
        if(res.data) this.ServiceStatus('stop',res.data);
      })
    }
    }catch(ex){
      this.Status = 'Offline' 
    }
}
async STERestart(){  
  try{
    this.Status = 'Pending'; 
    this.Api.RestartSTEService().subscribe((res: any) => {
      if(res.data) this.ServiceStatus('restart',res.data);
    })
   
  }catch(ex){
    this.Status = 'Offline' 
  }
}
async CheckStatus(){
  this.Api.ServiceStatusSTE().subscribe((res: any) => {
    if(res.data) this.Status = 'Online';
    else this.Status = 'Offline';
  })
  
}
}
