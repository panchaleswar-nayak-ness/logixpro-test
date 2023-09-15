import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject'; 
import { DeleteConfirmationComponent } from '../../../app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../admin/dialogs/confirmation-dialog/confirmation-dialog.component'; 
import { AuthService } from '../../../app/init/auth.service';
import labels from '../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-workstation-zones',
  templateUrl: './workstation-zones.component.html',
  styleUrls: ['./workstation-zones.component.scss']
})
export class WorkstationZonesComponent implements OnInit {
  @ViewChild('field_focus') field_focus: ElementRef;

  public velocity_code_list: any[] = [];
  public velocity_code_list_Res: any;
  public currentVelocity = "";
  onDestroy$: Subject<boolean> = new Subject();
  public userData: any;
  public selectedZone: any = '';
  public allZoneList: any[] = [];
  public zones: any[] = [];
  @ViewChild('btnSave') button;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private Api: ApiFuntions,
    private authService: AuthService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    // this.currentVelocity = this.data.vc
    this.getVelocity();
    this.getAllZoneList();

  }
  ngAfterViewInit(): void {
    this.field_focus.nativeElement.focus();
  }
  getVelocity() {
    let paylaod = {
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }
    this.velocity_code_list = [];
    this.Api.WSPickZoneSelect(paylaod).subscribe((res) => {
      if (res.data) {
        res.data.map(val => {
          this.velocity_code_list.push({ 'zone': val, isSaved: true })
        })
      } 
    });
  }
  getAllZoneList() {
    let paylaod = {
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }
    this.velocity_code_list = [];
    this.Api.LocationZonesSelect(paylaod).subscribe((res) => {
      if (res.data) {
        this.zones = res.data;
      }
    });
  }

  addVLRow(row: any) {
    this.selectedZone = '';
    this.allZoneList.unshift([]);
  }
  dltZone(){
    this.allZoneList = [];
  }
  onSelectZone(val:string){
    this.selectedZone = val
  }
  saveVlCode() {
    if(this.selectedZone){
      let paylaod = {
        "zone": this.selectedZone,
        "wsid": this.userData.wsid,
      }
      this.Api.WSPickZoneInsert(paylaod).subscribe((res) => {
        if (res.data) {
          this.toastr.success(labels.alert.success, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
          this.getVelocity();
          this.allZoneList = [];
        }
        else {
          this.toastr.error("This Zone is already selected for this workstation.", 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }

      });
    }
    else{
      this.toastr.error("Please select any zone,", 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
     
  }
  dltVlCode(vlCode: any) {
    if (vlCode) {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        height: 'auto',
        width: '480px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Yes') {
          let paylaod = {
            "velocity": vlCode,
            "username": this.userData.userName,
            "wsid": this.userData.wsid,
          }
          this.Api.dltVelocityCode(paylaod).subscribe((res) => {
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });

            this.getVelocity();

          });
        }
      })

    } else {
      this.velocity_code_list.shift();
    }
  }

  delete(event: any) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        message: "Remove Zone "+event+" from picking for this workstation"
      }
    })
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {
      if (result === 'Yes') {
        let paylaod = {
          "Zone": event,
          "wsid": this.userData.wsid,
        }
        this.Api.WSPickZoneDelete(paylaod).subscribe((res) => {
          // console.log(res);
          if (res.isExecuted) {
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
            this.getVelocity();
          }
          else{
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }

        });
      }

    })
  }

  valueEntered() {
    alert("TRIGGERED");
    this.button.nativeElement.disabled = true;
  }

  selectVlCode(selectedVL: any) {
    this.dialogRef.close(selectedVL.value);
  }
  clearVlCode() {
    this.dialogRef.close('');
  }

  closeBatchDialog(){
    this.dialogRef.close(this.velocity_code_list);
  }

}
