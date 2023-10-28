import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import labels from '../../../labels/labels.json';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
 
import { AuthService } from '../../../../app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

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
  public iAdminApiService: IAdminApiService;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog:MatDialog,
    private employeeService: ApiFuntions,
    private global: GlobalService,
    
    private adminApiService: AdminApiService,
    private authService: AuthService
  ) { 
    this.iAdminApiService = adminApiService;
  }

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
    if (this.data.mode === 'edit') {
      form.value.levelID = this.levelId;
      
      this.iAdminApiService.updatePickLevels({ userName : this.data.userName, ...form.value }).subscribe((res:any) =>{
        if (res.isExecuted) {
          this.dialog.closeAll();
          this.global.ShowToastr('success',labels.alert.success, 'Update!');
        } else {
          
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
          console.log("updatePickLevels",res.responseMessage);
        }
      });
    }
    else {  
      form.value.levelID = this.picklvl;
      this.iAdminApiService.insertPickLevels({ userName : this.data.userName, ...form.value }).subscribe((res: any) => {
        if (res.isExecuted) {
          this.dialog.closeAll();
          this.global.ShowToastr('success',labels.alert.success, 'Success!');
        } else {
          
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
          console.log("insertPickLevels",res.responseMessage);
        }
      });
    }

  }
  ngAfterViewInit() {
    this.start_shelf.nativeElement.focus();
  }

}
