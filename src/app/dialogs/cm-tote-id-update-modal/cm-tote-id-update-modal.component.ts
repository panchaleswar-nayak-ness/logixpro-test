import { Component, ElementRef, OnInit, ViewChild, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';

@Component({
  selector: 'app-cm-tote-id-update-modal',
  templateUrl: './cm-tote-id-update-modal.component.html',
  styleUrls: ['./cm-tote-id-update-modal.component.scss']
})
export class CmToteIdUpdateModalComponent implements OnInit {
  public userData: any;
  containerID : string = '';
  clearContainerIDBtn : boolean = true;
  setContainerIDBtn : boolean = false;

  @ViewChild('conID') conID : ElementRef;

  public iConsolidationAPI : IConsolidationApi;

  constructor(private global:GlobalService,
              public dialogRef: MatDialogRef<CmToteIdUpdateModalComponent>,
              public consolidationAPI : ConsolidationApiService,
              private authService: AuthService,
              @Inject(MAT_DIALOG_DATA) public data: any) {
                this.iConsolidationAPI = consolidationAPI;
               }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.focusConID();
  }

  validateContainerID() {
    if (this.containerID != '') {      
      this.setContainerIDBtn = true;
    } else {      
      this.setContainerIDBtn = false;
    }
  }

  focusConID() {
    setTimeout(()=>{
      this.conID.nativeElement.focus();
    }, 500);
  }

  updateToteID() {
    try {
      let payLoad = {
        orderNumber : this.data.orderNumber,
        toteID: this.data.toteID,
        contID: this.containerID
      };

      this.iConsolidationAPI.ContIDShipTransUpdate(payLoad).subscribe(
        (res: any) => {
          if (res?.isExecuted) {
            this.dialogRef.close({
              isExecuted: true,
              toteID: this.data.toteID,
              containerID: this.containerID
            });
          } else {
            this.global.ShowToastr('error','Something went wrong', 'Error!');
            console.log("ContIDShipTransUpdate",res.responseMessage);
          }
        },
        (error) => { 
          console.log(error);
        }
      );
    } catch (error) { 
      console.log(error);
    }
  }

}
