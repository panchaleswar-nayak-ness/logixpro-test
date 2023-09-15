import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; 
import { AuthService } from 'src/app/init/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MinReelQtyComponent } from 'src/app/dialogs/min-reel-qty/min-reel-qty.component';
import { SharedService } from 'src/app/services/shared.service';
import { Observable, Subscription } from 'rxjs';
import { ApiFuntions } from 'src/app/services/ApiFuntions';


@Component({
  selector: 'app-reel-tracking',
  templateUrl: './reel-tracking.component.html',
  styleUrls: ['./reel-tracking.component.scss']
})
export class ReelTrackingComponent implements OnInit {
  isChecked = false;
  btnDisabled : boolean = false;

  constructor(private dialog: MatDialog,
    private api: ApiFuntions,
    private authService: AuthService,
    private sharedService:SharedService,
    private toastr: ToastrService) { }

  @ViewChild('addItemAction') addItemTemp: TemplateRef<any>;
  @Input() reelTracking: FormGroup;
  public userData: any;
  @Input() events: Observable<String>;
  private eventsSubscription: Subscription;
  ngOnInit(): void {
    this.userData = this.authService.userData(); 
    this.eventsSubscription = this.events.subscribe((val) => {
      if(val){
        this.updateReelQty();
      }
 
    })
  }

  onFocusOutEvent(event: any){
    if (event.target.value == null || event.target.value == '')
     this.reelTracking.patchValue({
      'minimumRTSReelQuantity' : 0
    }); 
 }

 onChangeRTSUpdate(event: any){
  this.btnDisabled = true;
  
  let payload = {
    "itemNumber": this.reelTracking.controls['itemNumber'].value,
    "minimumRTS": this.reelTracking.controls['minimumRTSReelQuantity'].value,
    "includeAutoRTS": event.checked,
    "username": this.userData.userName,
    "wsid": this.userData.wsid
 }
  this.api.UpdateReelQuantity(payload).subscribe((res:any)=>{

    
    if(res.isExecuted){
      this.sharedService.updateInvMasterState(event,true)
       
      if(event.checked){
        this.toastr.success(res.responseMessage, 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        
      }
      this.btnDisabled = false;
  }
  else if (res.responseMessage != 'Update Successful'){
    
    this.toastr.error("Changes not saved!  Please reenter the information.", 'Error!', {
      positionClass: 'toast-bottom-right',
      timeOut: 2000
    });
  }
  })

  
 }
 updateReelQty(): void {
    const dialogRef = this.dialog.open(MinReelQtyComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        minDollarRTS:0,
        thresholdQty:0
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
         

        let payload = {
          rtsAmount: result.minDollarRTS,
          rtsQuantity: result.thresholdQty,
          username: this.userData.userName,
          wsid: this.userData.wsid
        }
        this.api.UpdateReelAll(payload).subscribe((res:any)=>{
          // console.log(res);

          if(res.isExecuted){

            let payload2 = {
              "itemNumber": this.reelTracking.controls['itemNumber'].value,
              "username": this.userData.userName,
              "wsid": this.userData.wsid
           }

            this.api.RefreshRTS(payload2).subscribe((res:any)=>{
              // console.log(res)
              if (res.isExecuted) {
                this.reelTracking.patchValue({
                  'minimumRTSReelQuantity' : res.data[0]
                });
              } else {
                this.toastr.error(res.responseMessage, 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000
                });
              }              
            });            
            
          } else {
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }

          
        });        
      }
    });
  }
  handleInputChange(event: any) {
    this.sharedService.updateInvMasterState(event,true)
  }
  ngOnDestroy() {
    this.eventsSubscription.unsubscribe();
  }
}
