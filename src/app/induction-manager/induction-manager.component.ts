import { Component, OnInit } from '@angular/core';
import { Router,RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { AuthService } from '../init/auth.service';
import { SharedService } from '../services/shared.service';
import { ApiFuntions } from '../services/ApiFuntions';
import { IInductionManagerApiService } from '../services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from '../services/induction-manager-api/induction-manager-api.service';

@Component({
  selector: 'app-induction-manager',
  templateUrl: './induction-manager.component.html',
  styleUrls: []
})
export class InductionManagerComponent implements OnInit {
  tab_hover_color:string = '#cf9bff3d';
  fieldNames:any;
  public iinductionManagerApi:IInductionManagerApiService;
  constructor(
    private router: Router, 
    private sharedService: SharedService,
    private authService: AuthService,
    private inductionManagerApi: InductionManagerApiService,
    private Api:ApiFuntions
    ) { 
      this.iinductionManagerApi = inductionManagerApi;
    router.events
      .pipe(
        filter((evt: any) => evt instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((events: RoutesRecognized[]) => {
        const prevRoute= events[0].urlAfterRedirects.split('/');
        const nextRoute = events[1].urlAfterRedirects.split('/');
    
        if (prevRoute[1]== 'InductionManager' || nextRoute[1] == 'InductionManager') {
          localStorage.setItem('routeFromInduction','true')
         
        }else{
          localStorage.setItem('routeFromInduction','false')
        }
       
      });
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.pickToteSetupIndex();
   
  }

  public userData: any;
  useInZonePickScreen:boolean = false;
  pickToteSetupIndex() {
    let paylaod = { 
    }
    this.iinductionManagerApi.PickToteSetupIndex(paylaod).subscribe(res => {
        this.useInZonePickScreen = res.data.imPreference.useInZonePickScreen;
        this.sharedService.BroadCastInductionMenuUpdate(this.useInZonePickScreen);   
    });
  }

  updateMenu(menu = '', route = ''){  
    this.sharedService.updateInductionAdminMenu({menu , route});

  }
  isAuthorized(controlName:any) {
    return !this.authService.isAuthorized(controlName);
 }
}
