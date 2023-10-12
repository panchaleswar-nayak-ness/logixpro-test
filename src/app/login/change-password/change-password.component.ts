import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import labels from '../../labels/labels.json'
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { UserApiService } from 'src/app/services/user-api/user-api.service';
import { IUserAPIService } from 'src/app/services/user-api/user-api-interface';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: []
})
export class ChangePasswordComponent implements OnInit {
  old_toggle = true;
  new_toggle = true;
  toggle_password = true;
  resetPassForm: FormGroup;
  isReadOnly: boolean = true;
  public iUserApi : IUserAPIService;

  constructor(
    public userApi : UserApiService,
    private fb: FormBuilder,
    // public api: ApiFuntions,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<any>
  ) { this.iUserApi = userApi; }

  ngOnInit(): void {
    this.resetPassForm = this.fb.group({
      userName: ['', Validators.required],
      old_password: ['', Validators.required],
      new_password: ['', Validators.required],
      confirm_password: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }
  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['new_password'].value === frm.controls['confirm_password'].value ? null : { 'mismatch': true };
  }
  onSend(form: FormGroup) {

    if (form.value.old_password.toLowerCase() === form.value.new_password.toLowerCase()) {
      this.toastr.error('You aren\'t changing your password. You\'re re-entering your password', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
    else {
      let payload = {
        "username": form.value.userName,
        "password": form.value.old_password,
        "newpassword": form.value.new_password
      }
      this.iUserApi.changePassword(payload).subscribe((res) => {
        const { isExecuted, responseMessage } = res;
        if (isExecuted) {
          this.toastr.success(labels.alert.update, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
          this.dialogRef.close();
        }
        else {
          this.toastr.error(responseMessage?.toString(), 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
      })
    }


  }

  removeReadOnly() {
    this.isReadOnly = !this.isReadOnly;
  }

}
