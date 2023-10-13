import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from 'src/app/init/auth.service';
import labels from '../../labels/labels.json';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-delete-range',
  templateUrl: './delete-range.component.html',
  styleUrls: []
})
export class DeleteRangeComponent implements OnInit {
  @ViewChild('del_focus') del_focus: ElementRef;
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
    private adminApiService: AdminApiService,
    private Api: ApiFuntions,
    private dialog:MatDialog,
    private toastr: ToastrService,
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
      this.del_focus.nativeElement.focus();  
    }, 200);
  }
  
  ngOnDestroy() {
    this.getSearchOptionsBeginSubscribe.unsubscribe();
    this.getSearchOptionsEndSubscribe.unsubscribe();
  }

  ReplenishmentsByDelete() {
    debugger
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
        if (result === 'Yes') {
          this.iAdminApiService.ReplenishmentsByDelete(this.repByDeletePayload).subscribe((res: any) => {
            if (res.isExecuted && res.data) {
              this.toastr.success(labels.alert.delete, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              this.dialog.closeAll();
              this.dialogRef.close(this.data);
            } else {
              this.toastr.error("Deleting by range has failed", 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              this.dialog.closeAll();
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

  changeBegin(event: any) {
    this.getSearchOptionsBeginSubscribe.unsubscribe();
    this.getSearchOptionsBegin();
    this.getSearchOptionsEndSubscribe.unsubscribe();
    this.getSearchOptionsEnd();
  }

  changeEnd(event: any) {
    this.getSearchOptionsEndSubscribe.unsubscribe();
    this.getSearchOptionsEnd();
  }

  showChange(event: any) {
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
    });
  }
}
