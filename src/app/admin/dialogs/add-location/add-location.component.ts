import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'; 
import labels from 'src/app/common/labels/labels.json';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType} from 'src/app/common/constants/strings.constants';
import {  StringConditions } from 'src/app/common/constants/strings.constants';

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
  public iAdminApiService: IAdminApiService;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private global:GlobalService, 
    private employeeService: ApiFuntions, 
    public adminApiService: AdminApiService,
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
      this.form_btn_label = StringConditions.AddCaps;
    }
    
  }

  ngAfterViewInit() {
    this.start_location.nativeElement.focus();
  }
  getstartLocationList(){
    let payload = {
      "query":  this.startLocation,
      "unique": true,
      "username": this.data.userName
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
      "username": this.data.userName
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
      "oldEndLocation": this.data.locationData?.endLocation ?? '' ,
      "username": this.data.userName
    }
    if(this.data.locationData){
      this.iAdminApiService.updateEmployeeLocation(payload).subscribe((res:any) => {
        if(res.isExecuted){
          this.dialogRef.close('update');
          this.global.ShowToastr(ToasterType.Success,labels.alert.update, ToasterTitle.Success);
        }else{
          
          this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
          console.log("updateEmployeeLocation",res.responseMessage);
        }
   });
    }else{
      this.iAdminApiService.insertEmployeeLocation(payload).subscribe((res:any) => {
        if(res.isExecuted){
          this.dialogRef.close('add');
          this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
        }else{
          
          this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
          console.log("insertEmployeeLocation",res.responseMessage);
        }
   });
    }

  }

}
