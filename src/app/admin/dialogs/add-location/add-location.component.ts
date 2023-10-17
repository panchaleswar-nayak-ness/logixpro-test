import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 
import { SpinnerService } from '../../../../app/init/spinner.service';
import labels from '../../../labels/labels.json';
import {  } from 'datatables.net';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: []
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
  public iAdminApiService: IAdminApiService;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private global:GlobalService, 
    private employeeService: ApiFuntions, 
    
    private loader: SpinnerService,
    private adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<any>
    ) {
      this.iAdminApiService = adminApiService;
    }

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
      "oldEndLocation": this.data.locationData?.endLocation ?? '' 
    }
    if(this.data.locationData){
      this.iAdminApiService.updateEmployeeLocation(payload).subscribe((res:any) => {
        if(res.isExecuted){
          this.dialogRef.close('update');
          this.global.ShowToastr('success',labels.alert.update, 'Success!');
        }else{
          
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
          console.log("updateEmployeeLocation",res.responseMessage);
        }
   });
    }else{
      this.iAdminApiService.insertEmployeeLocation(payload).subscribe((res:any) => {
        if(res.isExecuted){
          this.dialogRef.close('add');
          this.global.ShowToastr('success',labels.alert.success, 'Success!');
        }else{
          
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
          console.log("insertEmployeeLocation",res.responseMessage);
        }
   });
    }

  }

}
