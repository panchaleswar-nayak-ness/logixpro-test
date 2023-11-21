import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from 'src/app/common/init/auth.service';
import { AlertConfirmationComponent } from '../alert-confirmation/alert-confirmation.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';

@Component({
  selector: 'app-blossom-tote',
  templateUrl: './blossom-tote.component.html',
  styleUrls: ['./blossom-tote.component.scss']
})
export class BlossomToteComponent implements OnInit {
  @ViewChild('toteFocus') toteFocus: ElementRef;
  public userData: any;
  public iInductionManagerApi:IInductionManagerApiService; 
  nxtToteID: any;
  oldToteID: any; 
  imPreferences:any; 
  constructor(private dialog:MatDialog,
    public inductionManagerApi: InductionManagerApiService,
    private authService: AuthService,
    private global:GlobalService) {
      this.iInductionManagerApi = inductionManagerApi;
     }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.imPreferences=this.global.getImPreferences();
  }
  ngAfterViewInit(): void {
    setTimeout(()=>{
      this.toteFocus.nativeElement.focus();
    }, 200);
  }
  updateNxtTote() {  
    let updatePayload = {
      "tote": this.nxtToteID, 
    }
    this.iInductionManagerApi.NextToteUpdate(updatePayload).subscribe(res => {
      if (!res.isExecuted) {
        this.global.ShowToastr('error','Something is wrong.', 'Error!'); 
      }

    });
  }

  getNextToteId() {
    this.iInductionManagerApi.NextTote().subscribe(res => {
      if(res.data){
        this.nxtToteID = res.data;
        this.nxtToteID = this.nxtToteID + 1
        this.updateNxtTote();
      }
      
    });
  }

  submitBlosom() {
    if(!this.oldToteID || !this.nxtToteID){
      this.global.ShowToastr('error','Either the Old or New Tote ID was not supplied.', 'Error!');
    }
    else{
      const dialogRef:any = this.global.OpenDialog(AlertConfirmationComponent, {
        height: 'auto',
        width: '786px',
        data: {
          message: "Perform the blossom? This will move all open transaction lines from the old tote to the new tote.",
          heading: 'Perform Blossom'
        },
        autoFocus: '__non_existing_element__'
      });
      dialogRef.afterClosed().subscribe((result) => {
        if(result){
          let paylaod = {
            "OldTote": this.oldToteID?.toString(),
            "NewTote": this.nxtToteID?.toString()
          }
          this.iInductionManagerApi.ProcessBlossom(paylaod).subscribe(res => {
            if (res.isExecuted && res.data) {
              let batch = res.data
              if(this.imPreferences.autoPrintPickToteLabels){
                if(this.imPreferences.printDirectly){
                  this.global.Print(`FileName:PrintPrevInZoneBatchToteLabel|tote:true|BatchID:${batch}`)
                }
                else{
                  window.open(`/#/report-view?file=FileName:PrintPrevInZoneBatchToteLabel|tote:true|BatchID:${batch}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
                }
              }
              if(this.imPreferences.autoPrintOffCarouselPickList){
                if(this.imPreferences.printDirectly){
                  this.global.Print(`FileName:autoPrintCrossDock|tote:true|BatchID:${batch}`)
                }
                else{
                  window.open(`/#/report-view?file=FileName:autoPrintCrossDock|tote:true|BatchID:${batch}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
                }
                
              }
              this.global.ShowToastr('success','Updated Successfully', 'Success!');
              this.dialog.closeAll();
            } else {
              this.global.ShowToastr('error','Old tote ID does not exist', 'Error!'); 
            }
          });
        }
      });
    }

   
  }

}
