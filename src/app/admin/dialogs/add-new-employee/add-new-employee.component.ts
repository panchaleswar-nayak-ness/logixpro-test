import { Component, OnInit, Inject, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import labels from '../../../labels/labels.json'; 
import { AdminEmployeeLookupResponse } from 'src/app/Iemployee';
import { Router } from '@angular/router';
import { CustomValidatorService } from '../../../../app/init/custom-validator.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}


@Component({
  selector: 'app-add-new-employee',
  templateUrl: './add-new-employee.component.html',
  styleUrls: []
})
export class AddNewEmployeeComponent implements OnInit {

  @ViewChild('last_name') last_name: ElementRef;
  @ViewChild('addNewEmployee') AddNewEmployeeComponent: TemplateRef<any>;
  form_heading: string = 'Add New Employee';
  form_btn_label: string = 'Add';
  empData: any = [];
  mi: string;
  firstName: string;
  lastName: string;
  username: string;
  emailAddress: string;
  accessLevel: string;
  active: boolean;
  groupName:string = "";
  isEmail: boolean;
  env: any;
  isDisabledPassword: boolean;
  password:string;
  isDisabledUsername: boolean;
  toggle_password = true;
  isSubmitting = false;
  allGroups:any=[];
  empForm: FormGroup;
  OldPassword:any;
  IsEdit:any=false;
  @ViewChild('focusFeild') focusFeild: ElementRef;
  public iAdminApiService: IAdminApiService;
   validatorsArray:any = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global:GlobalService,
    
    private adminApiService: AdminApiService,
    private employeeService: ApiFuntions,
    private router: Router,
    private fb: FormBuilder,
    private cusValidator: CustomValidatorService,
    public dialogRef: MatDialogRef<any>
  ) { 
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void { 
    this.empData = this.data?.emp_data;
    
    this.env =  JSON.parse(localStorage.getItem('env') ?? ''); 
    this.allGroups  = this.empData?.allGroups;
    this.form_heading = this.data?.mode === 'edit' ? 'Edit Employee' : 'Add New Employee';
    this.form_btn_label = this.data?.mode === 'edit' ?'Save' : 'Add';
    this.isEmail = this.data?.mode === 'edit' ? true : false;
    this.isDisabledPassword = this.data?.mode === 'edit' ? true : false;
    this.isDisabledUsername = this.data?.mode === 'edit' ? true : false;
    this.mi = this.empData?.mi ?? '';
    this.firstName = this.empData?.firstName ?? '';
    this.OldPassword = this.empData?.password ?? '';
    this.lastName = this.empData?.lastName ?? '';
    
    if(this.empData)this.IsEdit =true; 
    this.groupName = this.empData?.groupName ?? '';
    this.username = this.empData?.username ?? '';
    this.emailAddress = this.empData?.emailAddress ?? '';
    this.emailAddress = this.empData?.emailAddress ?? '';
    this.password = this.empData?.password ?? '';
    this.accessLevel = this.empData?.accessLevel.toLowerCase() ?? '';
    this.active = this.empData?.active ?? true;
    this.initialzeEmpForm();
  }

  toggleDisabled() {
    this.isDisabledPassword = false;
    if (!this.isDisabledPassword) {
      this.empForm.controls['password'].enable();
      this.focusFeild.nativeElement.focus();
    }
  }
  isEmptyPass() { 
    if (this.data?.mode === 'edit') {
      if (this.empForm.controls['password']?.value === '') {
        this.isDisabledPassword = true;
        this.empForm.controls['password'].disable();
      }
    }

  }

  initialzeEmpForm() {
    if (this.env === 'DB') {
      this.validatorsArray.push(Validators.required, this.cusValidator.customTrim)
    }

    this.empForm = this.fb.group({
      mi: [this.mi || '', []],
      firstName: [this.firstName || '',[Validators.required, this.cusValidator.customTrim]],
      lastName: [this.lastName || '', [Validators.required, this.cusValidator.customTrim]],
      username: [{ value: this.username, disabled: this.isDisabledPassword } , [Validators.required]], 
      password: [this.password || '',this.validatorsArray],
      emailAddress: [this.emailAddress || '', [Validators.email]],
      accessLevel: [this.accessLevel || '', [Validators.required]],
      groupName: [this.groupName || '', []],
      active: [this.active || '', []],

    });
  }
ChangePassword(data){ 
  this.password = data;
}
  async onSubmit(form: FormGroup) {
    if (form.valid) {
      this.cleanForm(form);
      form.value.active = Boolean(JSON.parse(form.value.active));
      
      if (this.data?.mode === 'edit') {
        form.value.wsid = "TESTWID"; 
        form.value.username = this.data?.emp_data?.username ? this.data.emp_data.username : this.data.emp_data.Username;
        if(this.groupChanged){
          let requpdateAccessGroup = await this.iAdminApiService.updateAccessGroup({"group": this.empForm.value.groupName,"Username" : this.username}).toPromise();
          if(requpdateAccessGroup.isExecuted){
            let reqgetAdminEmployeeDetails = await this.iAdminApiService.getAdminEmployeeDetails({"user": this.username,"wsid": "TESTWSID"}).toPromise();
            if(reqgetAdminEmployeeDetails.isExecuted){
              this.functionsAllowedList = reqgetAdminEmployeeDetails.data.userRights;
            }
          }

        }
          this.iAdminApiService.updateAdminEmployee(form.value).subscribe((res: any) => {
            if (res.isExecuted) {
              this.dialogRef.close({mode: 'edit-employee', data:{empData: form.value,functionsAllowedList:this.functionsAllowedList,groupChanged:this.groupChanged}});
              this.global.ShowToastr('success',labels.alert.update, 'Success!');
            }
            else {
              this.global.ShowToastr('error',res.responseMessage?.toString() + '. User already exists.', 'Error!');
            }
          });
      }
      else {
        this.iAdminApiService.saveAdminEmployee(form.value)
          .subscribe((response: AdminEmployeeLookupResponse) => {
            if (response.isExecuted) {
              this.dialogRef.close(true);
              this.global.ShowToastr('success',labels.alert.success, 'Success!');
              
            }
            else {
              if(response.responseMessage?.toString() === 'User already exists'){
                this.global.ShowToastr('error',response.responseMessage, 'Error!');
              } else{
                this.global.ShowToastr('error',response.responseMessage?.toString() + '. User already exists.', 'Error!');
              }
            }
          });
      }

    }

  }

  public cleanForm(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => this.empForm.get(key)?.setValue(this.empForm.get(key)?.value.toString().trim()));
  }
  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  hasError(fieldName: string, errorName: string) {
    return this.empForm.get(fieldName)?.touched && this.empForm.get(fieldName)?.hasError(errorName);
  }
  
  ngAfterViewInit() {
    this.last_name.nativeElement.focus();
  }

  prevGroupName = "";
  public onMatSelectOpen(form: AbstractControl): void {
    this.prevGroupName = form.value.type;
  }

  functionsAllowedList: any = [];
  groupChanged: boolean = false;
  groupChange($event:any){
    if (this.data?.mode === 'edit') {
      const dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: '786px',
        data: {
          message: `Would you like to change this employee's functions allowed to the defaults for ${$event.value}?`,
          heading: 'Add Employee Group',
        },
        autoFocus: '__non_existing_element__',
      disableClose:true,
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result==='Yes') {
          this.groupChanged = true;
        }
        else{
          this.empForm.get('groupName')?.setValue(this.groupName);
        }
      });
    }
  }
}
