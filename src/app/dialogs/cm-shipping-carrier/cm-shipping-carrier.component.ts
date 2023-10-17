import { Component, ElementRef, Inject, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

import { Subject, takeUntil } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component'; 
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { IConsolidationApi } from 'src/app/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/services/consolidation-api/consolidation-api.service';

@Component({
  selector: 'app-cm-shipping-carrier',
  templateUrl: './cm-shipping-carrier.component.html',
  styleUrls: [],
})
export class CmShippingCarrierComponent implements OnInit {
  @ViewChildren('carrier_focus', { read: ElementRef }) carrier_focus: QueryList<ElementRef>;

  userData: any;
  carrierList: any;
  carrierListLength: any;
  disableAddField: boolean = false;
  disableEnable = [{ index: -1, value: false }];
  onDestroy$: Subject<boolean> = new Subject();
  public IconsolidationAPI : IConsolidationApi;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    // private Api: ApiFuntions,
    public consolidationAPI : ConsolidationApiService,
    
    public dialogRef: MatDialogRef<any>,
    private global:GlobalService,
    private renderer: Renderer2
  ) {
    this.IconsolidationAPI = consolidationAPI;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getCarrier();
  }

  getCarrier() { 
    this.consolidationAPI
      .CarrierSelect()
      .subscribe((res: any) => {
        if (res.isExecuted) {
          this.disableAddField = false;
          this.carrierList = [...res.data];
          this.carrierListLength = res.data.length;
          this.carrierList = res.data.map((item) => {
            return { carrier: item, oldCarrier: true };
          });
          this.disableEnable.shift();
          for (let i = 0; i < this.carrierList.length; i++) {
            this.disableEnable.push({ index: i, value: true });
          }

          setTimeout(() => {
            const inputElements = this.carrier_focus.toArray();
            const inputElement = inputElements[0].nativeElement as HTMLInputElement;
              this.renderer.selectRootElement(inputElement).focus();
          }, 100);
        }
      });
  }
  addCarrierRow(row: any) {
    if (this.carrierList.length > this.carrierListLength) {
      this.disableAddField = true;
    } else {
      this.disableAddField = false;
      this.carrierList.unshift({ carrier: '', oldCarrier: false });
    }
    const lastIndex = this.carrierList.length - 1;
    setTimeout(() => {
      const inputElements = this.carrier_focus.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }

  saveCarrier(carrer, item) {
    let paylaod;
    if (item.oldCarrier) {
      paylaod = {
        carrier: carrer,
        oldCarrier: item.carrier
      };
    } else {
      paylaod = {
        carrier: carrer,
        oldCarrier: ''
      };
    }

    this.IconsolidationAPI
      .CarrierSave(paylaod)
      .subscribe((res: any) => {
        if (res.isExecuted) {
          this.global.ShowToastr('success',res.message,"Success!");
          this.getCarrier();
        } else {
          this.global.ShowToastr('error',res.message);
          console.log("CarrierSave",res.responseMessage);
        }
      });
  }

  changeDisable(index: any) {
    this.disableEnable[index].value = false;
  }
  deleteCarrier(event: any) {
    if (event != '') {
      let dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
        height: 'auto',
        width: '480px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'delete-carrier',
          carrier: event.carrier,
          //  grp_data: grp_data
        },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((result) => {
          this.getCarrier();
        });
    } else {
    }
  }
}
