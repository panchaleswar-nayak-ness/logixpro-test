import { Component, OnInit, ViewChild, Inject, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { Subject } from 'rxjs/internal/Subject'; 
import { DeleteConfirmationComponent } from '../../../app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { ConfirmationDialogComponent } from '../../admin/dialogs/confirmation-dialog/confirmation-dialog.component'; 
import { AuthService } from '../../../app/init/auth.service';
import labels from '../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { IInductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api.service';
import { ICommonApi } from 'src/app/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/services/common-api/common-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-workstation-zones',
  templateUrl: './workstation-zones.component.html',
  styleUrls: []
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
  public iinductionManagerApi:IInductionManagerApiService;

  @ViewChild("searchauto", { static: false }) autocompleteOpened: MatAutocomplete;
  zoneSelectOptions: any[] = [];
  onSearchSelect(e: any) {
    this.selectedZone = e.option.value;
    if(this.validateZone()){
      this.saveVlCode();
    }
  }

  validateZone(){
    if(this.velocity_code_list.filter((x:any) => x.zone.toLowerCase() == this.selectedZone.trim().toLowerCase()).length > 0){
      this.global.ShowToastr('error',"This Zone is already selected for this workstation", 'Error!');
      return false;
    }
    if(this.zones.filter((x:any) => x == this.selectedZone).length == 0){
      this.global.ShowToastr('error',"This zone does not exist", 'Error!');
      return false;
    }
    return true;
  }

  searchItem(event:any) {
    if (this.selectedZone.trim() != '') {
      if(event.key == "Enter"){
        if(this.validateZone()){
          this.saveVlCode();
        }
      }
      else{
        this.zoneSelectOptions = this.zones.filter((x:any) => x.trim().toLowerCase().indexOf(this.selectedZone.trim().toLowerCase()) != -1 );
      }
    }
    else {
      this.zoneSelectOptions = [];
    }
  }
  clearAllZones(){
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'release-all-orders',
        ErrorMessage: 'Remove All Zones for this workstation?',
        action: 'remove'
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Yes') {
        this.iinductionManagerApi.ClrWSPickZone().subscribe((res) => {
          if (res.isExecuted && res.data) {
            this.getVelocity();
            this.global.ShowToastr('success',labels.alert.remove, 'Success!');
          }
          else {
            this.global.ShowToastr('error',"Failed to remove Zones from workstation", 'Remove Failed');
            console.log("ClrWSPickZone",res.responseMessage);
          }
        });
      }
    });

  }
  
  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private Api: ApiFuntions,
    private authService: AuthService,
    private inductionManagerApi: InductionManagerApiService,
    public dialogRef: MatDialogRef<any>,
    private global:GlobalService,
  ) { this.iCommonAPI = commonAPI; 
    this.iinductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getVelocity();
    this.getAllZoneList();

  }
  ngAfterViewInit(): void {
    this.field_focus.nativeElement.focus();
  }
  getVelocity() {
    let paylaod = { 
    }
    this.velocity_code_list = [];
    this.iinductionManagerApi.WSPickZoneSelect(paylaod).subscribe((res) => {
      if (res.isExecuted && res.data) {
        res.data.map(val => {
          this.velocity_code_list.push({ 'zone': val, isSaved: true })
        })
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("WSPickZoneSelect",res.responseMessage);

      } 
    });
  }
  getAllZoneList() {
    let paylaod = { 
    }
    this.velocity_code_list = [];
    this.iinductionManagerApi.LocationZonesSelect(paylaod).subscribe((res) => {
      if (res.isExecuted && res.data) {
        this.zones = res.data;
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("LocationZonesSelect",res.responseMessage);

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
      }
      this.iinductionManagerApi.WSPickZoneInsert(paylaod).subscribe((res) => {
        if (res.isExecuted && res.data) {
          this.global.ShowToastr('success',labels.alert.success, 'Success!');
          this.getVelocity();
          this.allZoneList = [];
          this.selectedZone = "";
          this.zoneSelectOptions = [];
        }
        else {
          this.global.ShowToastr('error',"This Zone is already selected for this workstation.", 'Error!');
          console.log("WSPickZoneInsert",res.responseMessage);
        }

      });
    }
    else{
      this.global.ShowToastr('error',"Please select any zone,", 'Error!');
    }
     
  }
  dltVlCode(vlCode: any) {
    if (vlCode) {
      const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
        height: 'auto',
        width: '480px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'Yes') {
          let paylaod = {
            "velocity": vlCode
          }
          this.iCommonAPI.dltVelocityCode(paylaod).subscribe((res) => {
            this.global.ShowToastr('success',labels.alert.delete, 'Success!');

            this.getVelocity();

          });
        }
      })

    } else {
      this.velocity_code_list.shift();
    }
  }

  delete(event: any) {
    let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        message: "Remove Zone "+event+" from picking for this workstation?"
      }
    })
    dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {
      if (result === 'Yes') {
        let paylaod = {
          "Zone": event
        }
        this.iinductionManagerApi.WSPickZoneDelete(paylaod).subscribe((res) => {
          if (res.isExecuted) {
            this.global.ShowToastr('success',labels.alert.delete, 'Success!');
            this.getVelocity();
          }
          else{
            this.global.ShowToastr('error',res.responseMessage, 'Error!');
            console.log("WSPickZoneDelete",res.responseMessage);
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
