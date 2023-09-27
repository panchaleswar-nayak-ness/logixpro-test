import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component'; 
import labels from '../../labels/labels.json';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-om-event-log-entry-detail',
  templateUrl: './om-event-log-entry-detail.component.html',
  styleUrls: []
})
export class OmEventLogEntryDetailComponent implements OnInit {

  eventLog: any;
  userData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private Api: ApiFuntions,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<OmEventLogEntryDetailComponent>,
    private authService: AuthService,
    private global:GlobalService,
    private datepipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.eventLog = this.data.data;
    this.userData = this.authService.userData();
  }

  deleteEvent() {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete-event-log',
        ErrorMessage: 'Are you sure you want to delete the selected event?',
        action: 'delete'
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Yes') {
        let payload: any = {
          "EventID": this.eventLog.eventID,
          "username": this.userData.userName,
          "wsid": this.userData.wsid
        }
        this.Api.SelectedEventDelete(payload).subscribe((res: any) => {
          if (res.isExecuted && res.data) {
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
            this.dialog.closeAll();
            this.dialogRef.close(this.data);
          } else {
            this.toastr.error(labels.alert.went_worng, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
        });
      }
    });
  }

  printEvent() {
    if(this.eventLog.eventID == 0) this.eventLog.eventID  = -1; 
    let curdatetime = this.datepipe.transform(this.eventLog.dateStamp, 'yyyy-MM-dd HH:mm:ss');
    this.global.Print(`FileName:printELReport|sDate:${curdatetime}|eDate:${curdatetime}|eID:${this.eventLog.eventID ? this.eventLog.eventID : ''}|message:${this.eventLog.message ? this.eventLog.message: '' }|eLocation:${this.eventLog.eLocation ? this.eventLog.eLocation: '' }|nStamp:${this.eventLog.nStamp ? this.eventLog.nStamp: '' }`);
  }

}
