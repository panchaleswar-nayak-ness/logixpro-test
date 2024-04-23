import { Component, OnInit } from '@angular/core'; 
import { Style, DialogConstants, ToasterTitle, ToasterType, TransactionType, UniqueConstants } from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';

import { AuthService } from 'src/app/common/init/auth.service';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { BaseService } from 'src/app/common/services/base-service.service';
import { Observable } from 'rxjs';
import { SystemPreference } from '../../common/Model/bulk-transactions';
import { LaLocationAssignmentQuantitiesComponent } from '../dialogs/la-location-assignment-quantities/la-location-assignment-quantities.component';


@Component({
  selector: 'app-location-assignment',
  templateUrl: './location-assignment.component.html',
  styleUrls: []
})
export class LocationAssignmentComponent implements OnInit {

  countLabel:string = "Count (0)";
  pickLabel:string = "Pick (0)";
  putAwayLabel:string = "Put Away (0)";
  public userData: any;
  public iAdminApiService: IAdminApiService;
  private endpointObservable: Observable<string>;
  public autoLocPicksTab: boolean = true;
  public autoLocPutsTab: boolean=true;
  public autoLocCountsTab: boolean = true;
  public isLoaded: boolean = false;

  constructor(
    private Api: ApiFuntions,
    private adminApiService: AdminApiService,
    private authservice: AuthService,
    private apiBase: BaseService,
    private global : GlobalService
  ) {
    this.iAdminApiService = adminApiService;
    this.endpointObservable = this.apiBase.GetApiEndpoint("systempreferences");
  }

  public Tab;

  ngOnInit(): void {
    this.userData = this.authservice.userData();
    this.getLabels();
    this.openLAQ();
    this.getAutoLocValues();
  }

  getLabels(){
    let payload = {
    }
    this.iAdminApiService.GetTransactionTypeCounts(payload).subscribe((res =>{
      if (res.isExecuted && res.data) {
        res.data.forEach(item => {
          if (item.transactionType.toUpperCase() === "Count".toUpperCase()) {
            this.countLabel = `Count (${item.count})`;
          } else if (item.transactionType.toUpperCase() === "Pick".toUpperCase()) {
            this.pickLabel = `Pick (${item.count})`;
          } else if (item.transactionType.toUpperCase() === TransactionType.PutAway.toUpperCase()) {
            this.putAwayLabel = `Put Away (${item.count})`;
          }
        });
      }
      else{
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("GetTransactionTypeCounts",res.responseMessage);
      } 
    }));
  }

  getAutoLocValues() {
    this.endpointObservable.subscribe((res: string) => {
      this.apiBase.Get<SystemPreference>(res).subscribe((res: SystemPreference) => {
        this.autoLocPicksTab = res.autoLocPicks;
        this.autoLocPutsTab = res.autoLocPutAways;
        this.autoLocCountsTab = res.autoLocCounts;
        this.isLoaded = true;
      });
    });
  }

  ngAfterViewInit(){
  }

  addItem(newItem: Event) {
    this.Tab = newItem
  }

  openLAQ() {
    let payload = {
    }

    this.iAdminApiService.GetTransactionTypeCounts(payload).subscribe((res => {
      let dialogRef: any = this.global.OpenDialog(LaLocationAssignmentQuantitiesComponent, {
        height: 'auto',
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          'totalCount': res.data
        }


      })
      dialogRef.afterClosed().subscribe(result => {
        //Need to account for hidden count throwing off tab index by 1
        if (this.autoLocCountsTab) {
          result--;
        }

        this.Tab = result;
      })
    }))

  }


}
