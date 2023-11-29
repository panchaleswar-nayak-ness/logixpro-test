import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/common/init/auth.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { ToasterTitle, ToasterType, TransactionType ,UniqueConstants} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-la-location-assignment-quantities',
  templateUrl: './la-location-assignment-quantities.component.html',
  styleUrls: ['./la-location-assignment-quantities.component.scss']
})
export class LaLocationAssignmentQuantitiesComponent implements OnInit {

  public userData: any;
  public totalCount: any;
  public count: any = 0
  public pick: any = 0
  public putAway: any = 0
  public listLabel: any;
  public listLabelFPZ: any;
  public iAdminApiService: IAdminApiService;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authservice: AuthService,
    public adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<any>,
    private router: Router,

    private global: GlobalService
  ) {
    this.iAdminApiService = adminApiService;
  }

  ngOnInit(): void {
    this.userData = this.authservice.userData()
    this.getTotalValues()
  }

  getTotalValues() {
    this.totalCount = this.data.totalCount;
    this.totalCount.forEach(item => {
      switch (item.transactionType) {
        case TransactionType.Count:
          this.count = item.count;
          break;
        case TransactionType.Pick:
          this.pick = item.count;
          break;
        case TransactionType.PutAway:
          this.putAway = item.count;
          break;
        default:
          break;
      }
    });

  }

  viewOrderSelection(event: any, index?) {
    this.iAdminApiService.GetLocAssCountTable().subscribe((res: any) => {
      if (res.isExecuted) {
        res.data.tabIndex = index
        this.dialogRef.close(res.data);
      }
      else {
        this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error)
        console.log("GetLocAssCountTable", res.responseMessage);
      }
    })
  }

  printShortage() {
    this.global.Print(`FileName:PreviewLocAssPickShort`);
  }

  printShortageZone() {
    this.global.Print(`FileName:PreviewLocAssPickShortFPZ`);
  }

  exitBack() {
    this.dialogRef.close();
    this.router.navigate([]).then(() => {
      window.open(`/#/admin`, UniqueConstants._self);
    });
  }
}
