import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CustomValidatorService } from '../../../../app/init/custom-validator.service'; 
import labels from '../../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-clone-group',
  templateUrl: './clone-group.component.html',
  styleUrls: []
})
export class CloneGroupComponent implements OnInit {
  @ViewChild('grp_name') grp_name: ElementRef;
  cloneForm: FormGroup;
  isValidForm: boolean = true;
  public iAdminApiService: IAdminApiService;
  constructor(
    private fb: FormBuilder, 
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialog:MatDialog, 
    private global:GlobalService,
private adminApiService: AdminApiService,
     
    private employeeService: ApiFuntions,
    private cusValidator: CustomValidatorService
    
    ) { 
      this.iAdminApiService = adminApiService;
    }

  ngOnInit(): void {
    this.cloneForm = this.fb.group({
      group_name: ['', [Validators.required,this.noWhitespaceValidator, this.cusValidator.specialCharValidator]]
    })
  }
  ngAfterViewInit() {
    this.grp_name.nativeElement.focus();
  }
  hasError(fieldName: string, errorName: string) {
    return this.cloneForm.get(fieldName)?.touched && this.cloneForm.get(fieldName)?.hasError(errorName);
  }

  public noWhitespaceValidator(control: FormControl) {
    return control.value.trim() === '' ? { 'whitespace': true } : false;
  }

  onSend(form: any) {
    let payload = {
      "clonegroupname": this.data.grp_data.groupName,
      "newgroupname": form.value.group_name
    }
    this.iAdminApiService.cloneGroup(payload).subscribe((res:any) => {
      if(res.isExecuted){
        this.dialog.closeAll();
        this.global.ShowToastr('success',labels.alert.update, 'Success!');
      }
      else{
        this.global.ShowToastr('error',res.responseMessage, 'Error!');
        console.log("cloneGroup",res.responseMessage);

      }
 }); 
  }

}
