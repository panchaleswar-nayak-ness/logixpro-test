import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import labels from '../../../labels/labels.json';
 
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';
import { AuthService } from '../../../../app/init/auth.service';
import { Router } from '@angular/router';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-add-group-allowed',
  templateUrl: './add-group-allowed.component.html',
  styleUrls: ['./add-group-allowed.component.scss']
})
export class AddGroupAllowedComponent implements OnInit {
  @ViewChild('control_name') control_name: ElementRef;
  form_heading: string = 'Add Group Allowed';
  form_btn_label: string = 'Add';
  GroupName: any;
  public iAdminApiService: IAdminApiService;
  controlNameList: any[] = [];
  options: string[] = [];
  filteredOptions: Observable<any[]>;
  userData: any;
  controlNameForm: FormGroup;
  constrolName
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private employeeService: ApiFuntions,
    private global: GlobalService,
    private authService: AuthService,
    private fb: FormBuilder,
    private adminApiService: AdminApiService,
    private router: Router
  ) {this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.controlNameForm = this.fb.group({
      controlName: [ '', [Validators.required]]
    })
    this.userData = this.authService.userData();
    let payload = { 
      "filter": "%"
    }
    this.iAdminApiService.getControlName(payload).subscribe((res: any) => {
      
      this.controlNameList = res.data;
      this.filteredOptions = this.controlNameForm.controls['controlName'].valueChanges.pipe(
        startWith(''),
        map(value => this.filterx(value || '')),
      );
    });

   


  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.control_name.nativeElement.focus();
    }, 200);
  }

  filterx(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.controlNameList.filter(option => option.controlName.toLowerCase().includes(filterValue));
  }
  onSend(form: any) {
    let payload = {
      "controlName": form.value.controlName, 
    }
    this.iAdminApiService.submitControlResponse(payload).subscribe((res: any) => {
      if (res.isExecuted) {
        this.dialog.closeAll();
        this.global.ShowToastr('success',labels.alert.success, 'Success!'); 
      }
      else{
        this.global.ShowToastr('success',res.responseMessage, 'Success!');
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
