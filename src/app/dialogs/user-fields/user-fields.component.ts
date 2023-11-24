import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';

import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service'; 
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import {  ToasterTitle } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-user-fields',
  templateUrl: './user-fields.component.html',
  styleUrls: ['./user-fields.component.scss']
})
export class UserFieldsComponent implements OnInit {
  @ViewChild('fieldFocus') fieldFocus: ElementRef;

  public userData: any;
  public iAdminApiService: IAdminApiService;
  userForm: FormGroup;
  fieldNames:any;
  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global:GlobalService,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    
    public adminApiService: AdminApiService) {
      this.iAdminApiService = adminApiService;
    this.userForm = this.formBuilder.group({
      userField1: new FormControl('', Validators.compose([])),
      userField2: new FormControl('', Validators.compose([])),
      userField3: new FormControl('', Validators.compose([])),
      userField4: new FormControl('', Validators.compose([])),
      userField5: new FormControl('', Validators.compose([])),
      userField6: new FormControl('', Validators.compose([])),
      userField7: new FormControl('', Validators.compose([])),
      userField8: new FormControl('', Validators.compose([])),
      userField9: new FormControl('', Validators.compose([])),
      userField10: new FormControl('', Validators.compose([])),
    });

  }

  ngOnInit(): void {
    ;

    this.userData = this.authService.userData();
    this.OSFieldFilterNames();
  }
  ngAfterViewInit(): void {
    this.fieldFocus?.nativeElement.focus();
  }

  public OSFieldFilterNames() { 
    this.iAdminApiService.ColumnAlias().subscribe((res: any) => {
      if(res.isExecuted && res.data)
      {
        this.fieldNames = res.data;
        this.setValues();
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ColumnAlias",res.responseMessage);
      }
    })
  }
  setValues() {

    this.userForm.patchValue({
      userField1: this.data.userField1?.trim() ?? '',
      userField2: this.data.userField2?.trim() ?? '',
      userField3: this.data.userField3?.trim() ?? '',
      userField4: this.data.userField4?.trim() ?? '',
      userField5: this.data.userField5?.trim() ?? '',
      userField6: this.data.userField6?.trim() ?? '',
      userField7: this.data.userField7?.trim() ?? '',
      userField8: this.data.userField8?.trim() ?? '',
      userField9: this.data.userField9?.trim() ?? '',
      userField10: this.data.userField10?.trim() ?? ''
    });

  }

  submit() {
    const values = this.userForm.value;
    const userFields = {
      "userField1": values.userField1,
      "userField2": values.userField2,
      "userField3": values.userField3,
      "userField4": values.userField4,
      "userField5": values.userField5,
      "userField6": values.userField6,
      "userField7": values.userField7,
      "userField8": values.userField8,
      "userField9": values.userField9,
      "userField10": values.userField10
    }

    this.dialogRef.close(userFields);

  }
}
