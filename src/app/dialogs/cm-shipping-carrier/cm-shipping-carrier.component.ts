import { Component, ElementRef, Inject, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component'; 
import { AuthService } from 'src/app/init/auth.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private Api: ApiFuntions,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getCarrier();
  }

  getCarrier() { 
    this.Api
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
        oldCarrier: item.carrier,
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };
    } else {
      paylaod = {
        carrier: carrer,
        oldCarrier: '',
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };
    }

    this.Api
      .CarrierSave(paylaod)
      .subscribe((res: any) => {
        if (res.isExecuted) {
          this.toastr.success(res.message);
          this.getCarrier();
        } else {
          this.toastr.error(res.message);
        }
      });
  }

  changeDisable(index: any) {
    this.disableEnable[index].value = false;
  }
  deleteCarrier(event: any) {
    if (event != '') {
      let dialogRef = this.dialog.open(DeleteConfirmationComponent, {
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
