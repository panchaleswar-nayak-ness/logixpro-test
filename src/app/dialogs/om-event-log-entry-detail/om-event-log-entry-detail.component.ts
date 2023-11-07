import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component'; 
import labels from '../../labels/labels.json';

import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';
import { DatePipe } from '@angular/common';
import { IAdminApiService } from 'src/app/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/services/admin-api/admin-api.service';

@Component({
  selector: 'app-om-event-log-entry-detail',
  templateUrl: './om-event-log-entry-detail.component.html',
  styleUrls: []
})
export class OmEventLogEntryDetailComponent implements OnInit {

  eventLog: any;
  userData: any;
  public iAdminApiService: IAdminApiService;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global:GlobalService,
    private Api: ApiFuntions,
    private adminApiService: AdminApiService,
    
    private dialog:MatDialog,
    public dialogRef: MatDialogRef<OmEventLogEntryDetailComponent>,
    private authService: AuthService, 
    private datepipe: DatePipe,
  ) { 
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.eventLog = this.data.data;
    this.userData = this.authService.userData();
  }

  deleteEvent() {
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
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
          "EventID": this.eventLog.eventID
        }
        this.iAdminApiService.SelectedEventDelete(payload).subscribe((res: any) => {
          if (res.isExecuted && res.data) {
            this.global.ShowToastr('success',labels.alert.delete, 'Success!');
            this.dialog.closeAll();
            this.dialogRef.close(this.data);
          } else {
            this.global.ShowToastr('error',labels.alert.went_worng, 'Error!');
            console.log("SelectedEventDelete",res.responseMessage);
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
