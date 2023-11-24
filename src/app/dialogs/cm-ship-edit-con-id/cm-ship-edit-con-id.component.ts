import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import {  ToasterMessages } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-cm-ship-edit-con-id',
  templateUrl: './cm-ship-edit-con-id.component.html',
  styleUrls: ['./cm-ship-edit-con-id.component.scss'],
})
export class CmShipEditConIdComponent implements OnInit {
  @ViewChild('contId') contId: ElementRef;
  public userData: any; 
  containerID: string = ''; 
  clearContainerIDBtn: boolean = true;
  setContainerIDBtn: boolean = false; 
  @ViewChild('conID') conID: ElementRef; 
  public IconsolidationAPI: IConsolidationApi; 
  constructor(
    public consolidationAPI: ConsolidationApiService,
    private global: GlobalService,
    public dialogRef: MatDialogRef<CmShipEditConIdComponent>,

    private authService: AuthService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.IconsolidationAPI = consolidationAPI;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.focusConID();
  }
  ngAfterViewInit(): void {
    this.contId.nativeElement.focus();
  }
  validateContainerID() {
    if (this.containerID != '') {
      this.setContainerIDBtn = true;
    } else {
      this.setContainerIDBtn = false;
    }
  }

  clearContainerID() {
    this.containerID = '';
    this.setContainerIDBtn = false;
    this.focusConID();
  }

  focusConID() {
    setTimeout(() => {
      this.conID.nativeElement.focus();
    }, 500);
  }

  setContainerID() {
    try {
      let payLoad = {
        stid: this.data.order.sT_ID,
        containerID: this.containerID,
      };

      this.IconsolidationAPI.ContainerIdSingleShipTransUpdate(
        payLoad
      ).subscribe(
        (res: any) => {
          if (res.isExecuted) {
            this.dialogRef.close({
              isExecuted: true,
              containerID: this.containerID,
            });
          } else {
            this.global.ShowToastr('error', ToasterMessages.SomethingWentWrong, 'Error!');
            console.log(
              'ContainerIdSingleShipTransUpdate',
              res.responseMessage
            );
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } catch (error) {}
  }
}
