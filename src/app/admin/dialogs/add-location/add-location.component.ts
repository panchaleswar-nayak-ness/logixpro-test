import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { SpinnerService } from '../../../../app/init/spinner.service';
import labels from '../../../labels/labels.json';
import { Api } from 'datatables.net';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.scss']
})
export class AddLocationComponent implements OnInit {
  @ViewChild('start_location') start_location: ElementRef;

  form_heading: string = '';
  form_btn_label: string = '';
  startLocation:any;
  endLocation:any;

  startLocationList: any;
  endLocationList: any;
  isValid: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private dialog: MatDialog, 
    private employeeService: ApiFuntions, 
    private toastr: ToastrService,
    private loader: SpinnerService,
    public dialogRef: MatDialogRef<any>
    
    
    ) {}

  ngOnInit(): void {
    if(this.data.locationData){
      this.endLocation =  this.data.locationData.endLocation;
      this.startLocation =  this.data.locationData.startLocation;

      this.form_heading = 'Update New Location';
      this.form_btn_label = 'Update';

    } else {
      this.form_heading = 'Add New Location';
      this.form_btn_label = 'Add';
    }
    
  }

  ngAfterViewInit() {
    this.start_location.nativeElement.focus();
  }
  getstartLocationList(){
    let payload = {
      "query":  this.startLocation,
      "unique": true,
      "username": this.data.userName,
      "wsid": "TESTWSID"
    }
    this.employeeService.getLocationList('/Common/locationbegin',payload).subscribe((res:any) => {
      if(res.isExecuted){
        this.startLocationList = res.data;
        const foundStr = this.startLocationList.find(v => v.toLowerCase().includes(this.startLocation.toLowerCase()));
        if(!foundStr){
          this.startLocation = '';
        }
      }
    })
  }
  getendLocationList(){
    if(this.startLocation){
    let payload = {
      "query":  this.endLocation,
      "beginLocation": this.startLocation,
      "unique": true,
      "username": this.data.userName,
      "wsid": "TESTWSID"
    }
    this.employeeService.getLocationList('/Common/locationend',payload).subscribe((res:any) => {
      if(res.isExecuted){
        this.endLocationList = res.data;
        const foundStr = this.endLocationList.find(v => v.toLowerCase().includes(this.endLocation.toLowerCase()));
        if(!foundStr){
          this.endLocation = '';
        }
      }
    })
  }
  }
  onBlur(){
    if(this.startLocation.trim() !== '' && this.endLocation.trim() !== '' ){
      this.isValid = true
    }
    else{
      this.isValid = false
    }
  }

  onSend(form: NgForm){


    let payload = {
      "startLocation": this.startLocation,
      "endLocation": this.endLocation,   
      "oldStartLocation":  this.data.locationData?.startLocation ?? '',    
      "oldEndLocation": this.data.locationData?.endLocation ?? '',
      "username": this.data.userName,
      "wsid": "TESTWSID"
    }
    if(this.data.locationData){
      this.employeeService.updateEmployeeLocation(payload).subscribe((res:any) => {
        if(res.isExecuted){
          // this.dialog.closeAll();
          this.dialogRef.close('update');
          this.toastr.success(labels.alert.update, 'Success!',{
            positionClass: 'toast-bottom-right',
            timeOut:2000
         });
        }else{
          this.toastr.error(res.responseMessage, 'Error!',{
            positionClass: 'toast-bottom-right',
            timeOut:2000
         });
        }
   });
    }else{
      this.employeeService.insertEmployeeLocation(payload).subscribe((res:any) => {
        if(res.isExecuted){
          // this.dialog.closeAll();
          this.dialogRef.close('add');
          this.toastr.success(labels.alert.success, 'Success!',{
            positionClass: 'toast-bottom-right',
            timeOut:2000
         });
        }else{
          this.toastr.error(res.responseMessage, 'Error!',{
            positionClass: 'toast-bottom-right',
            timeOut:2000
         });
        }
   });
    }

  }

}
