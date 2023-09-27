import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-cm-tote-id-update-modal',
  templateUrl: './cm-tote-id-update-modal.component.html',
  styleUrls: []
})
export class CmToteIdUpdateModalComponent implements OnInit {

  public userData: any;

  containerID : string = '';

  clearContainerIDBtn : boolean = true;
  setContainerIDBtn : boolean = false;

  @ViewChild('conID') conID : ElementRef;

  constructor(private dialog: MatDialog,
              public dialogRef: MatDialogRef<CmToteIdUpdateModalComponent>,
              private toast: ToastrService,
              private Api: ApiFuntions,
              private authService: AuthService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.focusConID();
  }

  validateContainerID() {
    if (this.containerID != '') {      
      this.setContainerIDBtn = true;
    } else {      
      this.setContainerIDBtn = false;
    }
  }

  focusConID() {
    setTimeout(()=>{
      this.conID.nativeElement.focus();
    }, 500);
  }

  updateToteID() {
    try {
      let payLoad = {
        orderNumber : this.data.orderNumber,
        toteID: this.data.toteID,
        contID: this.containerID,
        username: this.userData.userName,
        wsid: this.userData.wsid
      };

      this.Api.ContIDShipTransUpdate(payLoad).subscribe(
        (res: any) => {
          if (res?.isExecuted) {
            this.dialogRef.close({
              isExecuted: true,
              toteID: this.data.toteID,
              containerID: this.containerID
            });
          } else {
            this.toast.error('Something went wrong', 'Error!', { positionClass: 'toast-bottom-right', timeOut: 2000 });
          }
        },
        (error) => { }
      );
    } catch (error) { 
    }
  }

}
