import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import labels from '../../../labels/labels.json';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from '../../../../app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-add-pickuplevels',
  templateUrl: './add-pickuplevels.component.html',
  styleUrls: []
})
export class AddPickuplevelsComponent implements OnInit {
  @ViewChild('start_shelf') start_shelf: ElementRef;
  form_heading: string = 'Add Pick Level';
  form_btn_label: string = 'Add';
  levelId: any;
  startShelf: any;
  endShelf: any;
  userData: any;
  picklvl: any;
  isValidForm: boolean = true;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private employeeService: ApiFuntions,
    private toastr: ToastrService,
    private authService: AuthService
  ) { }

  ngOnInit(): void { 

    this.userData = this.authService.userData();
    if (this.data.mode === 'edit') {
      this.form_heading = 'Edit Pick Label';
      this.form_btn_label = 'Update';
      this.picklvl = this.data.pickLevelData.pickLevel?.toString();
      this.startShelf = this.data.pickLevelData.startShelf?.toString();
      this.endShelf = this.data.pickLevelData.endShelf?.toString();
      this.levelId = this.data.pickLevelData.levelID?.toString();
    } else {
      this.picklvl = this.data.nextPickLvl?.toString();
    }
  }

  checkIfValid(){
    if(this.startShelf.trim() === '' || this.endShelf.trim() === ''){
      this.isValidForm = true;
    }
    else{
      this.isValidForm = false;
    }
  }

  onSend(form: NgForm) {
    form.value.username = this.data.userName;
    form.value.wsid = this.userData.wsid;
    if (this.data.mode === 'edit') {
      form.value.levelID = this.levelId;
      
      this.employeeService.updatePickLevels(form.value).subscribe((res:any) =>{
        if (res.isExecuted) {
          this.dialog.closeAll();
          this.toastr.success(labels.alert.success, 'Update!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        } else {
          this.toastr.error(res.responseMessage, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
      });
    }
    else {  
      form.value.levelID = this.picklvl;
      this.employeeService.insertPickLevels(form.value).subscribe((res: any) => {
        if (res.isExecuted) {
          this.dialog.closeAll();
          this.toastr.success(labels.alert.success, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        } else {
          this.toastr.error(res.responseMessage, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
      });
    }

  }
  ngAfterViewInit() {
    this.start_shelf.nativeElement.focus();
  }

}
