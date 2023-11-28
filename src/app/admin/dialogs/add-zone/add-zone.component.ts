import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';
import { startWith } from 'rxjs/internal/operators/startWith'; 
import labels from 'src/app/common/labels/labels.json';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType ,TableConstant} from 'src/app/common/constants/strings.constants';
import {  StringConditions } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-add-zone',
  templateUrl: './add-zone.component.html',
  styleUrls: ['./add-zone.component.scss']
})
export class AddZoneComponent implements OnInit {
  @ViewChild('select_zone') select_zone: ElementRef;

  form_heading: string = 'Add New Zone';
  form_btn_label: string = StringConditions.AddCaps;
  zone = new FormControl('');
  fetchedZones:any;
  all_zones: any = this.data.allZones;
  filteredOptions: Observable<any>;
  addZoneForm: FormGroup;
  isValid = false;
  public editZoneName: any;
  public iAdminApiService: IAdminApiService;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    
    private employeeService: ApiFuntions,
    private router: Router,
    private global:GlobalService,
    private adminApiService: AdminApiService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<any>

  ) { 
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    const isEditMode = this.data?.mode === 'edit-zone';
    this.form_heading = isEditMode ? 'Edit Zone' : 'Update Zone';
    this.form_btn_label = isEditMode ? 'Update' : StringConditions.AddCaps;
    this.fetchedZones = this.data?.fetchedZones;
    this.editZoneName = this.data?.fetchedZones;
    this.initialzeEmpForm();
    this.filteredOptions = this.addZoneForm.controls['zoneList'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
    );
}

  ngAfterViewInit() {
    if (this.data.mode === 'edit-zone') {
      this.addZoneForm.controls['zoneList'].setValue(this.data.zone);
    }
    setTimeout(() => {
      this.select_zone.nativeElement.focus();
    }, 200);
   
  }

  private noWhitespaceValidator(control: FormControl) {
    const isSpace = (control.value || '').match(/\s/g);
    return isSpace ? { 'whitespace': true } : null;
  }

  initialzeEmpForm() {
    this.addZoneForm = this.fb.group({
      zoneList: [this.filteredOptions, [Validators.required, this.noWhitespaceValidator]],
    });
  }
  hasError(fieldName: string, errorName: string) {
    return this.addZoneForm.get(fieldName)?.touched && this.addZoneForm.get(fieldName)?.hasError(errorName);
  }

  blurInput() {
    if (!this.isValid) {
      this.addZoneForm.controls['zoneList'].setValue("");
    }
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    let results = this.all_zones.filter(option => option.toLowerCase().includes(filterValue))
    this.isValid = results.length > 0;
    return results;
  }


  onSubmit(form: FormGroup) {
    if (this.isValid) {
      let addZoneData = {
        "username": this.data.userName,
        "zone": form.value.zoneList
      }
      let oldZone;
      let mode = 'addZone';
      if (this.data.mode === 'edit-zone') {
        mode = 'editZone';
        oldZone = this.data.zone
        let zoneData = {
          "zone": oldZone,
          "username": this.data.userName
        }

        let fetchedIndex=this.fetchedZones.findIndex(item => item.zones === form.value.zoneList )
        if(fetchedIndex===-1){
          this.iAdminApiService.deleteEmployeeZone(zoneData).subscribe((res: any) => {
            if (res.isExecuted) {
              this.addUpdateZone(addZoneData, oldZone, mode)
            }
            else {
              this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
              console.log("deleteEmployeeZone",res.responseMessage);
            }
          });
        }
     
    
      }
      else {
        this.addUpdateZone(addZoneData, oldZone, mode);
      }
    }
    else{
        this.blurInput();
    }
  }

  private addUpdateZone(addZoneData: any, oldZone: any, mode: string) {
    this.iAdminApiService.updateEmployeeZone(addZoneData).subscribe((res: any) => {
      if (res.isExecuted) {
        this.dialogRef.close({ data: addZoneData, mode: mode, oldZone: oldZone });
        this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
      } else {
        
        this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
        console.log("updateEmployeeZone",res.responseMessage);
      }
    });
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

}
