import { Component, OnInit } from '@angular/core';
import { Router,RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { AuthService } from '../common/init/auth.service';
import { SharedService } from '../common/services/shared.service';
import { IInductionManagerApiService } from '../common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from '../common/services/induction-manager-api/induction-manager-api.service';
import {  AppNames ,StringConditions} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-induction-manager',
  templateUrl: './induction-manager.component.html',
  styleUrls: ['./induction-manager.component.scss']
})
export class InductionManagerComponent implements OnInit {
  tab_hover_color:string = '#cf9bff3d';
  fieldNames:any;
  public iinductionManagerApi:IInductionManagerApiService;
  constructor(
    private router: Router, 
    private sharedService: SharedService,
    private authService: AuthService,
    public inductionManagerApi: InductionManagerApiService
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
    
        if (prevRoute[1]== AppNames.InductionManager || nextRoute[1] == AppNames.InductionManager) {
          localStorage.setItem('routeFromInduction',StringConditions.True)
         
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
