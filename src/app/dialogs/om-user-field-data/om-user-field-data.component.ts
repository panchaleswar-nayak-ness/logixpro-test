import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service'; 
import labels from '../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-om-user-field-data',
  templateUrl: './om-user-field-data.component.html',
  styleUrls: []
})
export class OmUserFieldDataComponent implements OnInit {
  @ViewChild('user_focus') user_focus: ElementRef;
  userData: any;
  userFieldData: any;

  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    private Api: ApiFuntions,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<OmUserFieldDataComponent>,
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getUserFieldData();
  }

  getUserFieldData(loader: boolean = false) {
    
    this.Api.UserFieldData().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.userFieldData = res.data[0];
      } else {
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    });
  }

  updateUserFieldData(loader: boolean = false) {
    let payload: any = {
      userField1: this.userFieldData.userField1,
      userField2: this.userFieldData.userField2,
      userField3: this.userFieldData.userField3,
      userField4: this.userFieldData.userField4,
      userField5: this.userFieldData.userField5,
      userField6: this.userFieldData.userField6,
      userField7: this.userFieldData.userField7,
      userField8: this.userFieldData.userField8,
      userField9: this.userFieldData.userField9,
      userField10: this.userFieldData.userField10,
      wsid: this.userData.wsid
    };
    this.Api.UserFieldDataUpdate(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.toastr.success(labels.alert.success, 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        this.dialogRef.close(res.data);
      } else {
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    });
  }

   
  ngAfterViewInit(): void {
    this.user_focus.nativeElement.focus();
  }
}
