import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import labels from '../../../labels/labels.json';
import { ToastrService } from 'ngx-toastr'; 
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';
import { AuthService } from '../../../../app/init/auth.service';
import { Router } from '@angular/router';
import { CustomValidatorService } from '../../../../app/init/custom-validator.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'group-allowed',
  templateUrl: './group-allowed.component.html',
  styleUrls: ['./group-allowed.component.scss']
})
export class GroupAllowedComponent implements OnInit {

  form_heading: string = 'Add Group Allowed';
  form_btn_label: string = 'Add';
  GroupName: any;
  controlNameList: any[] = [];
  options: string[] = [];
  filteredOptions: Observable<any[]>;
  userData: any;
  isValid = false;
  controlNameForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private employeeService: ApiFuntions,
    private toastr: ToastrService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private cusValidator: CustomValidatorService
  ) { }

  ngOnInit(): void {
    this.controlNameForm = this.fb.group({
      controlName: ['', [Validators.required]]
    })
    this.userData = this.authService.userData();
    let payload = {
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }
    this.employeeService.getEmployeeData(payload).subscribe((res: any) => {
      this.controlNameList = res.data.allGroups;
      this.filteredOptions = this.controlNameForm.controls['controlName'].valueChanges.pipe(
        startWith(''),
        map(value => this.filterx(value || '')),
      );
    });


  }

  blurInput() {
    if (!this.isValid){
      this.controlNameForm.controls['controlName'].setValue("");
    }
  }
  filterx(value: string): string[] {
    let result;
    const filterValue = value.toLowerCase();
    result =  this.controlNameList.filter(option => option.groupName.toLowerCase().includes(filterValue));
    this.isValid = result.length > 0;
    return result;
  }
  alphaNumberOnly(string:any) {
    const regex = "^[a-zA-Z0-9_//][a-zA-Z0-9_// ]*[a-zA-Z0-9_//]$";
    if(string.match(regex)){
      return true;
    }
      return false;
  }
  checkIfValid(input:string){
    if(this.GroupName.trim() === ''){
      this.isValid = true;
    }
    else{
      this.isValid =  false;
      if(this.alphaNumberOnly(input)){
        this.isValid = false;
      }
      else{
        this.isValid = true;
      }
      
    }
  }
  onSend(form: any) { 
    let payload = {
      "groupname": form.value.controlName,
      "username": this.data.grp_data,
    }
    this.employeeService.insertUserGroup(payload).subscribe((res: any) => {
      if (res.isExecuted) {
        this.dialog.closeAll();
        this.toastr.success(labels.alert.success, 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
      else {
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    });
  }
  hasError(fieldName: string, errorName: string) {
    return this.controlNameForm.get(fieldName)?.touched && this.controlNameForm.get(fieldName)?.hasError(errorName);
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
