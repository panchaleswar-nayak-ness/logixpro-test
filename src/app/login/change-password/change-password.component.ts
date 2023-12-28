import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import labels from 'src/app/common/labels/labels.json';
import { UserApiService } from 'src/app/common/services/user-api/user-api.service';
import { IUserAPIService } from 'src/app/common/services/user-api/user-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import {  ToasterTitle ,ToasterType} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
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
    private global: GlobalService,
    public dialogRef: MatDialogRef<any>
  ) { this.iUserApi = userApi; }

  ngOnInit(): void {
    this.resetPassForm = this.fb.group({
      userName: ['', Validators.required],
      old_password: ['', Validators.required],
      new_password: ['',  [
        Validators.required,
        Validators.minLength(7),
        Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/),
      ]],
      confirm_password: ['',  [
        Validators.required,
        Validators.minLength(7),
        Validators.pattern(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/),
      ]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(frm: FormGroup) {
    return frm.controls['new_password'].value === frm.controls['confirm_password'].value ? null : { 'mismatch': true };
  }

  onSend(form: FormGroup) {

    if (form.value.old_password.toLowerCase() === form.value.new_password.toLowerCase()) this.global.ShowToastr(ToasterType.Error,'You aren\'t changing your password. You\'re re-entering your password', ToasterTitle.Error);
    else {
      let payload = {
        "username": form.value.userName,
        "password": form.value.old_password,
        "newpassword": form.value.new_password
      }
      this.iUserApi.changePassword(payload).subscribe((res) => {
        if(res?.isExecuted)
        {
          const { isExecuted, responseMessage } = res;
          if (isExecuted) {
            this.global.ShowToastr(ToasterType.Success,labels.alert.update, ToasterTitle.Success);
            this.dialogRef.close();
          }
          else this.global.ShowToastr(ToasterType.Error,responseMessage?.toString(), ToasterTitle.Error);
        }
        else {
          this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
          console.log("changePassword",res.responseMessage);
        }
        
      });
    }
  }

  removeReadOnly() {
    this.isReadOnly = !this.isReadOnly;
  }

}
