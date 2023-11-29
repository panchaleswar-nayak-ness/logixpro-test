import { Component, OnInit, Inject, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { NgForm } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import labels from 'src/app/common/labels/labels.json'; 
import { AccessGroupObject, IEmployee } from 'src/app/common/interface/Iemployee';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType ,StringConditions} from 'src/app/common/constants/strings.constants';
import {  StringConditions } from 'src/app/common/constants/strings.constants';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}

@Component({
  selector: 'app-add-new-group',
  templateUrl: './add-new-group.component.html',
  styleUrls: ['./add-new-group.component.scss']
})

export class AddNewGroupComponent implements OnInit {

  @ViewChild('new_group') new_group: ElementRef;
  @ViewChild('addNewGroup') AddNewEmployeeComponent: TemplateRef<any>;
  form_heading: string = 'Add New Group';
  form_btn_label: string = StringConditions.AddCaps;
  grpData: any = [];
  isValidForm: boolean = true;
  public iAdminApiService: IAdminApiService;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global:GlobalService,
    
    private employeeService: ApiFuntions,
    private adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<any>
  ) { 
    this.iAdminApiService = adminApiService;
  }

  emp: IEmployee;
  groupName: string;

  ngOnInit(): void {
    this.grpData = this.data.grp_data;
    this.form_heading = this.data?.mode === StringConditions.edit ? 'Edit Group' : 'Add New Group';
    this.form_btn_label = this.data?.mode === StringConditions.edit ? 'Save' : StringConditions.AddCaps;

    this.groupName = this.grpData.groupName ?? '';

  }

  checkWhiteSpace(string: any) {
    const isSpace = string.trim() === '';
    if (isSpace) {
      return { 'whitespace': true }
    }
    else {
      return false;
    }
  }

  alphaNumberOnly(string: any) {
    if (!string.includes('=') && !string.includes('\'')) {
      return true;
    }
    return false
  }


  onSend(form: NgForm) {
    if (form.status === 'INVALID') {
      // display error in your form
    } else {
      this.iAdminApiService.insertGroup(form.value)
        .subscribe((response: AccessGroupObject) => {
          if (response.isExecuted) {
            this.dialogRef.close(form.value); // Close opened diaglo
            this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
          }
          else {
            
            this.global.ShowToastr(ToasterType.Error,response.responseMessage, ToasterTitle.Error);
            console.log("insertGroup",response.responseMessage);
          }
        });


    }

  }

  checkIfValid(input: string) {
    if (this.groupName.trim() === '') {
      this.isValidForm = true;
    }
    else {
      this.isValidForm = !this.alphaNumberOnly(input);
    }
  }

  ngAfterViewInit() {
    this.new_group.nativeElement.focus();
  }

}


