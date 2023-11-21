import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../common/init/auth.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { GlobalService } from 'src/app/common/services/global.service';


@Component({
  selector: 'app-item-number',
  templateUrl: './add-filter-function.component.html',
  styleUrls: ['./add-filter-function.component.scss']
})
export class AddFilterFunction implements OnInit {
  @ViewChild('filterFocus') filterFocus: ElementRef;
  addItem: boolean = true;
  submit: boolean = false;
  filterName: any
  userData;
  public iInductionManagerApi: IInductionManagerApiService;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private global: GlobalService,
    public inductionManagerApi: InductionManagerApiService,
    private authService: AuthService
  ) {
    this.iInductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();

    if (this.data.savedFilter) {
      this.filterName = this.data.savedFilter;
    }
  }
  ngAfterViewChecked(): void {
    this.filterFocus.nativeElement.focus();
  }
  onNoClick(onsubmit: any, status: any): void {
    if (this.data) {
      let paylaod = {
        "OldFilter": this.data.savedFilter,
        "NewFilter": this.filterName,
        "wsid": this.userData.wsid,

      }
      this.iInductionManagerApi.PickBatchFilterRename(paylaod).subscribe(res => {
        if (res?.isExecuted) {
          this.dialogRef.close({ "oldFilter": this.data.savedFilter, "newFilter": this.filterName, })
        }
        else {
          this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
          console.log("PickBatchFilterRename", res.responseMessage);

        }
      })
    }
    else {
      this.dialogRef.close(this.filterName);
    }
  }

}
