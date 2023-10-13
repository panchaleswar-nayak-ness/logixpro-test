import { Component, OnInit } from '@angular/core'; 
import { AuthService } from 'src/app/init/auth.service';
import {Subscription} from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CmCarriersAddDeleteEditComponent } from 'src/app/dialogs/cm-carriers-add-delete-edit/cm-carriers-add-delete-edit.component';
import { IConsolidationApi } from 'src/app/services/consolidation-api/consolidation-api-interface';
import { ConsolidationApiService } from 'src/app/services/consolidation-api/consolidation-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-consolidation-preferences',
  templateUrl: './consolidation-preferences.component.html',
  styleUrls: [],
})
export class ConsolidationPreferencesComponent implements OnInit {
  userData: any;
  preferencesData:any;
  private subscription: Subscription = new Subscription();
  public IconsolidationAPI : IConsolidationApi;
  constructor(
    public consolidationAPI : ConsolidationApiService,
    private authService: AuthService,
    public global:GlobalService
  ) {
    this.userData = this.authService.userData();
    this.IconsolidationAPI = consolidationAPI;
   
  }
  openCmCarriers() {
    let dialogRef:any = this.global.OpenDialog(CmCarriersAddDeleteEditComponent, {
      height: 'auto',
      width: '720px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
     
    })
    dialogRef.afterClosed().subscribe(result => {
      
      
    })
   }

  ngOnInit(): void {
    this.getPreferences();
  }

  getPreferences() {
    let payload = {
      type: '',
      value: ''
    };

    this.IconsolidationAPI
      .ConsoleDataSB(payload)
      .subscribe((res) => {
        if (res.isExecuted) {
          this.preferencesData = res.data.cmPreferences;
   
        }
        
      });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
