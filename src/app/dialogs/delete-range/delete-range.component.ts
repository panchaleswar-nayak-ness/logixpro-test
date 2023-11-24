import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
 
import { AuthService } from 'src/app/common/init/auth.service';
import labels from 'src/app/common/labels/labels.json';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import {  ToasterTitle ,ResponseStrings,ToasterType} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-delete-range',
  templateUrl: './delete-range.component.html',
  styleUrls: ['./delete-range.component.scss']
})
export class DeleteRangeComponent implements OnInit {
  @ViewChild('delFocus') delFocus: ElementRef;
  public userData: any;
  repByDeletePayload: any = {
    identity: "Batch Pick ID",
    filter1: "",
    filter2: "",
    searchString: "",
    searchColumn: "",
    status: "",
    username: "",
    wsid: ""
  };
  beginAutoCompleteList: any = [];
  endAutoCompleteList: any = [];
  public iAdminApiService: IAdminApiService;

  @ViewChild(MatAutocompleteTrigger) autocompleteStart: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger) autocompleteEnd: MatAutocompleteTrigger;
  floatLabelControlStart = new FormControl('auto' as FloatLabelType);
  floatLabelControlEnd = new FormControl('auto' as FloatLabelType);
  hideRequiredControlStart = new FormControl(false);
  hideRequiredControlEnd = new FormControl(false);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public adminApiService: AdminApiService, 
    private dialog:MatDialog,
    
    private global:GlobalService,
    public dialogRef: MatDialogRef<DeleteRangeComponent>,
    private authService: AuthService,
  ) { 
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.repByDeletePayload.username = this.userData.userName;
    this.repByDeletePayload.wsid = this.userData.wsid;
    this.repByDeletePayload.identity = "Batch Pick ID";
    this.getSearchOptionsBegin();
    this.getSearchOptionsEnd();
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.delFocus.nativeElement.focus();  
    }, 200);
  }
  
  ngOnDestroy() {
    this.getSearchOptionsBeginSubscribe.unsubscribe();
    this.getSearchOptionsEndSubscribe.unsubscribe();
  }

  ReplenishmentsByDelete() {
    if (this.repByDeletePayload.filter1 && this.repByDeletePayload.filter2) {
      const dialogRef2:any = this.global.OpenDialog(DeleteConfirmationComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'delete-selected-current-orders',
          action: 'delete'
        },
      });
      dialogRef2.afterClosed().subscribe((result) => {
        if (result === ResponseStrings.Yes) {
          this.iAdminApiService.ReplenishmentsByDelete(this.repByDeletePayload).subscribe((res: any) => {
            if (res.isExecuted && res.data) {
              this.global.ShowToastr(ToasterType.Success,labels.alert.delete, ToasterTitle.Success);
              this.dialog.closeAll();
              this.dialogRef.close(this.data);
            } else {
              this.global.ShowToastr(ToasterType.Error,"Deleting by range has failed", ToasterTitle.Error);
              this.dialog.closeAll();
              console.log("ReplenishmentsByDelete",res.responseMessage);
            }
          });
        }
      });
    }
  }

  closeautoMenuStart() {
    this.autocompleteStart.closePanel();
  }

  closeautoMenuEnd() {
    this.autocompleteEnd.closePanel();
  }

  getFloatLabelValueStart(): FloatLabelType {
    return this.floatLabelControlStart.value ?? 'auto';
  }

  getFloatLabelValueEnd(): FloatLabelType {
    return this.floatLabelControlEnd.value ?? 'auto';
  }

  changeBegin() {
    this.getSearchOptionsBeginSubscribe.unsubscribe();
    this.getSearchOptionsBegin();
    this.getSearchOptionsEndSubscribe.unsubscribe();
    this.getSearchOptionsEnd();
  }

  changeEnd() {
    this.getSearchOptionsEndSubscribe.unsubscribe();
    this.getSearchOptionsEnd();
  }

  showChange() {
    this.getSearchOptionsBegin();
    this.getSearchOptionsEnd();
  }

  getSearchOptionsBeginSubscribe: any;
  getSearchOptionsBegin(){
    let payload = {
      "delCol": this.repByDeletePayload.identity,
      "query": this.repByDeletePayload.filter1 
    }
    this.getSearchOptionsBeginSubscribe = this.iAdminApiService.DeleteRangeBegin(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.beginAutoCompleteList = res.data.sort();
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("DeleteRangeBegin",res.responseMessage);

      }
    });
  }

  getSearchOptionsEndSubscribe: any;
  getSearchOptionsEnd(){
    let payload = {
      "delCol": this.repByDeletePayload.identity,
      "begin": this.repByDeletePayload.filter1,
      "query": this.repByDeletePayload.filter2 
    }
    this.getSearchOptionsEndSubscribe = this.iAdminApiService.DeleteRangeEnd(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.endAutoCompleteList = res.data.sort();
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error); 
      }
    });
  }
}
