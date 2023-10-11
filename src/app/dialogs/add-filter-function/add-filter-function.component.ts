import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog'; 
import { AuthService } from '../../../app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IInductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api.service';


@Component({
  selector: 'app-item-number',
  templateUrl: './add-filter-function.component.html',
  styleUrls: []
})
export class AddFilterFunction implements OnInit {
  @ViewChild('filter_focus') filter_focus: ElementRef;
  addItem : boolean = true;
  submit: boolean = false;
  filter_name:any
  userData;
  public iinductionManagerApi:IInductionManagerApiService;

  constructor(
              public dialogRef: MatDialogRef<any>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private confirmationdialog: MatDialog,
              private Api: ApiFuntions,
              private inductionManagerApi: InductionManagerApiService,
              private authService: AuthService
              ) {
                this.iinductionManagerApi = inductionManagerApi;
               }

  ngOnInit(): void {  
    this.userData = this.authService.userData();
    
    if(this.data.savedFilter){
      this.filter_name = this.data.savedFilter;
    }
  }
  ngAfterViewChecked(): void {
    this.filter_focus.nativeElement.focus();
  }
  onNoClick(onsubmit: any, status : any): void {
    if(this.data){
      let paylaod ={
          "OldFilter": this.data.savedFilter,
          "NewFilter":this.filter_name,
          "wsid": this.userData.wsid,
     
      }
      this.iinductionManagerApi.PickBatchFilterRename(paylaod).subscribe(res => {
        if(res.isExecuted){
          this.dialogRef.close({"oldFilter": this.data.savedFilter,"newFilter":this.filter_name,})
        }
      })
    }
    else{
      this.dialogRef.close(this.filter_name);
    }
  }

}
