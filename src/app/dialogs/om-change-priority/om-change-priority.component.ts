import { Component, OnInit , Inject, ViewChild, ElementRef} from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';

import { AuthService } from 'src/app/init/auth.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { ToastrService } from "ngx-toastr";
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-om-change-priority',
  templateUrl: './om-change-priority.component.html',
  styleUrls: []
})
export class OmChangePriorityComponent implements OnInit {
  @ViewChild('new_pri') new_pri: ElementRef;
  public orderNumber: any;
  public Oldpriority:number;
  public Newpriority:number;
  userData: any;
  constructor(
    private sharedService: SharedService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<OmChangePriorityComponent>,
    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private Api: ApiFuntions,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.orderNumber = this.data.orderNo;
    this.Oldpriority = this.data.priorityTable;
  }

  updatepriority(){

    let payload = {
      "orderNumber": this.orderNumber,
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
      "priority": this.Newpriority
    }

    this.Api.UpdateOSPriority(payload).subscribe((res: any) => {
      if(res.isExecuted){
        this.dialogRef.close(res);
      }
      else{
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    })
   
  }
 
  ngAfterViewInit(): void {
    this.new_pri.nativeElement.focus();
  }
}
