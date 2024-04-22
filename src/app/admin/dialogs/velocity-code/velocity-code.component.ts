import { Component, OnInit, Inject, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../common/init/auth.service';
import labels from 'src/app/common/labels/labels.json';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType ,ResponseStrings,DialogConstants,Style} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-velocity-code',
  templateUrl: './velocity-code.component.html',
  styleUrls: ['./velocity-code.component.scss']
})

export class VelocityCodeComponent implements OnInit {
  @ViewChildren('vl_name', { read: ElementRef }) vl_name: QueryList<ElementRef>;
  public velocityCodeList: any;
  public velocityCodeListRes: any;
  public currentVelocity = "";
  onDestroy$: Subject<boolean> = new Subject();
  public userData: any;
  @ViewChild('btnSave') button;
  disableEnable = [{ index: -1, value: false }];
  public iCommonAPI: ICommonApi;

  constructor(
    public commonAPI: CommonApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,

    public dialogRef: MatDialogRef<any>,
    private global: GlobalService,
    private renderer: Renderer2,
  ) { this.iCommonAPI = commonAPI; }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.currentVelocity = this.data.vc
    this.getVelocity();

  }

  getVelocity() {
    this.iCommonAPI.getVelocityCode().subscribe((res) => {
      this.velocityCodeListRes = [...res.data];
      this.velocityCodeList = res.data;
      this.disableEnable.shift();
      for (let i = 0; i < this.velocityCodeList.length; i++) {
        this.disableEnable.push({ index: i, value: true });
      }
      setTimeout(() => {
        const inputElements = this.vl_name.toArray();
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }, 100)
    });

  }

  changeDisable(index: any) {
    this.disableEnable[index].value = false;
  }

  addVLRow() {
    this.velocityCodeList.unshift([]);

    const lastIndex = this.velocityCodeList.length - 1;
    setTimeout(() => {
      const inputElements = this.vl_name.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }
  saveVlCode(vlcode: any, oldVC: any) {
    if (vlcode) {
      let cond = true;
      this.velocityCodeListRes.forEach(element => {
        if (element == vlcode && cond) {
          cond = false;
          this.global.ShowToastr(ToasterType.Error, 'Velocity cannot be saved! Another velocity code matches the current. Please save any pending changes before attempting to save this entry.', ToasterTitle.Error);

        }
      });

      if (cond) {

        let paylaod = {
          "oldVelocity": oldVC.toString(),
          "velocity": vlcode
        }
        this.iCommonAPI.saveVelocityCode(paylaod).subscribe((res) => {
          this.global.ShowToastr(ToasterType.Success, labels.alert.success, ToasterTitle.Success);
          this.getVelocity()
        });
      }
    } else {
      this.global.ShowToastr(ToasterType.Error, 'Velocity cannot be empty!.', ToasterTitle.Error);
      console.log("saveVelocityCode");
    }
  }
  dltVlCode(vlCode: any) {
    if (vlCode) {
      const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
        height: 'auto',
        width: Style.w480px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result === ResponseStrings.Yes) {
          let paylaod = {
            "velocity": vlCode
          }
          this.iCommonAPI.dltVelocityCode(paylaod).subscribe(() => {
            this.global.ShowToastr(ToasterType.Success, labels.alert.delete, ToasterTitle.Success);
            this.getVelocity();
          });
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("dltVelocityCode");
        }
      })

    } else {
      this.velocityCodeList.shift();
    }
  }

  deleteVC(event: any) {
    if (event != '') {
      let dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
        height: 'auto',
        width: Style.w480px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          mode: 'delete-velocity',
          velocity: event
        }
      })
      dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(result => {
        this.getVelocity();
      })
    }
    else {
      this.velocityCodeList.shift();
      this.getVelocity();
    }

  }

  valueEntered() {
    alert("TRIGGERED");
    this.button.nativeElement.disabled = true;
  }

  selectVlCode(selectedVL: any) {
    this.dialogRef.close(selectedVL.value);
  }
  clearVlCode() {
    this.dialogRef.close(DialogConstants.close);
  }

}
