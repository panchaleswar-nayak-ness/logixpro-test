import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/common/init/auth.service';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { ToasterTitle, ToasterType, TransactionType, UniqueConstants } from 'src/app/common/constants/strings.constants';
import { BaseService } from 'src/app/common/services/base-service.service';
import { Observable } from 'rxjs';
import { SystemPreference } from '../../../common/Model/bulk-transactions';

@Component({
  selector: 'app-la-location-assignment-quantities',
  templateUrl: './la-location-assignment-quantities.component.html',
  styleUrls: ['./la-location-assignment-quantities.component.scss']
})
export class LaLocationAssignmentQuantitiesComponent implements OnInit {

  public userData: any;
  public totalCount: any;
  public count = 0
  public pick = 0
  public putAway = 0
  public listLabel: any;
  public listLabelFPZ: any;
  public iAdminApiService: IAdminApiService;
  private endpointObservable: Observable<string>;
  private autoLocPicks: boolean;
  private autoLocPuts: boolean;
  private autoLocCounts: boolean;

  @ViewChild('countCol', {  read: ElementRef }) countCol: ElementRef;
  @ViewChild('pickCol', {  read: ElementRef }) pickCol: ElementRef;
  @ViewChild('putCol', {  read: ElementRef }) putCol: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authservice: AuthService,
    public adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<any>,
    private router: Router,
    private apiBase: BaseService,
    private global: GlobalService
  ) {
    this.iAdminApiService = adminApiService;
    this.endpointObservable = this.apiBase.GetApiEndpoint("systempreferences");
  }

  ngOnInit(): void {
    this.userData = this.authservice.userData()
    this.getTotalValues()
  }

  ngAfterViewInit() {
    this.getAutoLocValues()
  }


  getAutoLocValues() {
    this.endpointObservable.subscribe((res: string) => {
      this.apiBase.Get<SystemPreference>(res).subscribe((res: SystemPreference) => {
        this.autoLocPicks = res.autoLocPicks;
        this.autoLocPuts = res.autoLocPutAways;
        this.autoLocCounts = res.autoLocCounts;
        this.displayTransTypes();
      });
    });
  }

  getTotalValues() {
    this.totalCount = this.data.totalCount;
    this.totalCount.forEach(item => {
      switch (item.transactionType.toUpperCase()) {
        case TransactionType.Count.toUpperCase():
          this.count = item.count;
          break;
        case TransactionType.Pick.toUpperCase():
          this.pick = item.count;
          break;
        case TransactionType.PutAway.toUpperCase(): 
          this.putAway = item.count;
          break;
        default:
          break;
      }
    });

  }

  displayTransTypes() {
    this.countCol.nativeElement.style.display = this.autoLocCounts ? 'none' : 'block';
    this.pickCol.nativeElement.style.display = this.autoLocPicks ? 'none' : 'block';
    this.putCol.nativeElement.style.display = this.autoLocPuts ? 'none' : 'block';
  };

  viewOrderSelection(event: any, index?) {
    this.dialogRef.close(index);
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
