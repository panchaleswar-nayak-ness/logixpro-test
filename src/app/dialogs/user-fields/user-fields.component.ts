import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service';
import labels from '../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-user-fields',
  templateUrl: './user-fields.component.html',
  styleUrls: ['./user-fields.component.scss']
})
export class UserFieldsComponent implements OnInit {
  @ViewChild('field_focus') field_focus: ElementRef;

  public userData: any;
  userForm: FormGroup;
  fieldNames:any;
  constructor(public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    public formBuilder: FormBuilder,
    private authService: AuthService,
    private toast: ToastrService,
    private Api: ApiFuntions) {

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
    this.field_focus.nativeElement.focus();
  }

  public OSFieldFilterNames() { 
    this.Api.ColumnAlias().subscribe((res: any) => {
      this.fieldNames = res.data;
      this.setValues();
      // this.sharedService.updateFieldNames(this.fieldNames)
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
    //   try {

    //     const values = this.userForm.value;

    //     var payload = { 
    //       "transaction": this.data.id,
    //       "userFields": [
    //         values.userField1,
    //         values.userField2,
    //         values.userField3,
    //         values.userField4,
    //         values.userField5,
    //         values.userField6,
    //         values.userField7,
    //         values.userField8,
    //         values.userField9,
    //         values.userField10
    //       ],
    //       "username": this.userData.userName,
    //       "wsid": this.userData.wsid 
    //     }

    //     this.service.create(payload, '/Common/UserFieldMTSave').subscribe(
    //       (res: any) => {
    //         if (res.data && res.isExecuted) {
    //           this.dialogRef.close();
    //           this.toast.success(labels.alert.update, 'Success!',{
    //             positionClass: 'toast-bottom-right',
    //             timeOut:2000
    //           });            
    //         } else {
    //           this.toast.error('Something went wrong', 'Error!', {
    //             positionClass: 'toast-bottom-right',
    //             timeOut: 2000,
    //           });
    //         }
    //       },
    //       (error) => { }
    //     );
    //   } catch (error) {
    //     
    //   }
    // }

  }
}
