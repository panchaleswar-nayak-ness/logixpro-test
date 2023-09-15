import { Component, OnInit, Inject, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import labels from '../../../labels/labels.json'; 
import { AdminEmployeeLookupResponse } from 'src/app/Iemployee';
import { Router } from '@angular/router';
import { CustomValidatorService } from '../../../../app/init/custom-validator.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}


@Component({
  selector: 'app-add-new-employee',
  templateUrl: './add-new-employee.component.html',
  styleUrls: ['./add-new-employee.component.scss']
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

   validatorsArray:any = []
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private employeeService: ApiFuntions,
    private router: Router,
    private fb: FormBuilder,
    private cusValidator: CustomValidatorService,
    public dialogRef: MatDialogRef<any>
  ) { }

  ngOnInit(): void { 
    
    this.empData = this.data?.emp_data;
    
    this.env =  JSON.parse(localStorage.getItem('env') || ''); 
    this.allGroups  = this.empData?.allGroups;
    this.data?.mode === 'edit' ? this.form_heading = 'Edit Employee' : 'Add New Employee';
    this.data?.mode === 'edit' ? this.form_btn_label = 'Save' : 'Add';
    this.data?.mode === 'edit' ? this.isEmail = true : false;
    this.data?.mode === 'edit' ? this.isDisabledPassword = true : false;
    this.data?.mode === 'edit' ? this.isDisabledUsername = true : false;
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
      // this.validatorsArray.push(this.cusValidator.customTrim);
      this.validatorsArray.push(Validators.required, this.cusValidator.customTrim)
    }

    this.empForm = this.fb.group({
      mi: [this.mi || '', []],
      firstName: [this.firstName || '',[Validators.required, this.cusValidator.customTrim]],
      lastName: [this.lastName || '', [Validators.required, this.cusValidator.customTrim]],
      username: [{ value: this.username, disabled: this.isDisabledPassword } || '', [Validators.required]], 
      password: [this.password || '',this.validatorsArray],
      emailAddress: [this.emailAddress || '', [Validators.email]],
      accessLevel: [this.accessLevel || '', [Validators.required]],
      groupName: [this.groupName || '', []],
      active: [this.active || '', []],

    });
  }
ChangePassword(data){ 
  // if(this.OldPassword == this.password) this.OldPassword = -1;
  this.password = data;
}
  async onSubmit(form: FormGroup) {
    if (form.valid) {
      // this.isSubmitting = true;
      this.cleanForm(form);
      form.value.active = Boolean(JSON.parse(form.value.active));
      
      if (this.data?.mode === 'edit') {
        form.value.wsid = "TESTWID"; 
        form.value.username = this.data && this.data.emp_data && this.data.emp_data.username?this.data.emp_data.username:this.data.emp_data.Username;
        if(this.groupChanged){
          let requpdateAccessGroup = await this.employeeService.updateAccessGroup({"group": this.empForm.value.groupName,"Username" : this.username}).toPromise();
          if(requpdateAccessGroup.isExecuted){
            let reqgetAdminEmployeeDetails = await this.employeeService.getAdminEmployeeDetails({"user": this.username,"wsid": "TESTWSID"}).toPromise();
            if(reqgetAdminEmployeeDetails.isExecuted){
              this.functionsAllowedList = reqgetAdminEmployeeDetails.data.userRights;
            }
          }

          // this.employeeService.updateAccessGroup({"group": this.empForm.value.groupName,"Username" : this.username}).subscribe((res:any) => {
          //   if(res.isExecuted){
          //     this.employeeService.getAdminEmployeeDetails({"user": this.username,"wsid": "TESTWSID"}).subscribe((response: any) => { 
          //       if(response.isExecuted){
          //         this.functionsAllowedList = response.data.userRights;
          //       }
          //     });
          //   }
          // });
        }
          this.employeeService.updateAdminEmployee(form.value).subscribe((res: any) => {
            if (res.isExecuted) {
              this.dialogRef.close({mode: 'edit-employee', data:{empData: form.value,functionsAllowedList:this.functionsAllowedList,groupChanged:this.groupChanged}});
              this.toastr.success(labels.alert.update, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
            }
            else {
              this.toastr.error(res.responseMessage?.toString() + '. User already exists.', 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
            }
          });
      }
      else {
        this.employeeService.saveAdminEmployee(form.value)
          .subscribe((response: AdminEmployeeLookupResponse) => {
            if (response.isExecuted) {
              this.dialogRef.close(true);
              this.toastr.success(labels.alert.success, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              
               // this.reloadCurrentRoute();
            }
            else {
              if(response.responseMessage?.toString() === 'User already exists'){
                this.toastr.error(response.responseMessage, 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000
                });
              }
              else{
                this.toastr.error(response.responseMessage?.toString() + '. User already exists.', 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000
                });
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
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
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
          // this.employeeService.updateAccessGroup({"group": this.empForm.value.groupName,"Username" : this.username}).subscribe((res:any) => {
          //   if(res.isExecuted){
          //     this.employeeService.getAdminEmployeeDetails({"user": this.username,"wsid": "TESTWSID"}).subscribe((response: any) => { 
          //       if(response.isExecuted){
          //         this.functionsAllowedList = response.data.userRights;
          //       }
          //     });
          //   }
          // });
        }
        else{
          this.empForm.get('groupName')?.setValue(this.groupName);
        }
      });
    }
  }
}
