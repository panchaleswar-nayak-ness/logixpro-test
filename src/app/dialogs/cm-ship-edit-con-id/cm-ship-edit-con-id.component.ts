import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-cm-ship-edit-con-id',
  templateUrl: './cm-ship-edit-con-id.component.html',
  styleUrls: []
})
export class CmShipEditConIdComponent implements OnInit {
  @ViewChild('cont_id') cont_id: ElementRef;
  public userData: any;

  containerID : string = '';

  clearContainerIDBtn : boolean = true;
  setContainerIDBtn : boolean = false;

  @ViewChild('conID') conID : ElementRef;

  constructor(private dialog: MatDialog,
              public dialogRef: MatDialogRef<CmShipEditConIdComponent>,
              private toast: ToastrService,
              private Api: ApiFuntions,
              private authService: AuthService,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.focusConID();
  }
  ngAfterViewInit(): void {
    this.cont_id.nativeElement.focus();
  }
  validateContainerID() {
    if (this.containerID != '') {      
      this.setContainerIDBtn = true;
    } else {      
      this.setContainerIDBtn = false;
    }
  }

  clearContainerID() {
    this.containerID = '';
    this.setContainerIDBtn = false;
    this.focusConID();
  }

  focusConID() {
    setTimeout(()=>{
      this.conID.nativeElement.focus();
    }, 500);
  }

  setContainerID() {
    try {
      let payLoad = {
        stid : this.data.order.sT_ID,
        containerID: this.containerID,
        username: this.userData.userName,
        wsid: this.userData.wsid
      };

      this.Api.ContainerIdSingleShipTransUpdate(payLoad).subscribe(
        (res: any) => {
          if (res.isExecuted) {
            this.dialogRef.close({
              isExecuted: true,
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
