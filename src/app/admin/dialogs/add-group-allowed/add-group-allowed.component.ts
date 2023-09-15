import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import labels from '../../../labels/labels.json';
import { ToastrService } from 'ngx-toastr'; 
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';
import { AuthService } from '../../../../app/init/auth.service';
import { Router } from '@angular/router';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

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
  controlNameList: any[] = [];
  // myControl = new FormControl('');
  options: string[] = [];
  filteredOptions: Observable<any[]>;
  userData: any;
  controlNameForm: FormGroup;
  constrolName
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private employeeService: ApiFuntions,
    private toastr: ToastrService,
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.controlNameForm = this.fb.group({
      controlName: [ '', [Validators.required]]
    })
    this.userData = this.authService.userData();
    let payload = {
      "username": this.data.userName,
      "wsid": this.data.wsid,
      "filter": "%"
    }
    this.employeeService.getControlName(payload).subscribe((res: any) => {
      
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
      "username": this.data.userName,
      "wsid": this.data.wsid,
    }
    this.employeeService.submitControlResponse(payload).subscribe((res: any) => {
      if (res.isExecuted) {
        this.dialog.closeAll();
        this.toastr.success(labels.alert.success, 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        }); 
      }
      else{
        this.toastr.success(res.responseMessage, 'Success!', {
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
