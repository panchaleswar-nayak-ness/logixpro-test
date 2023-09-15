import { Component, OnInit } from '@angular/core';
import { Router,RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs/operators';
import { AuthService } from '../init/auth.service';
import { SharedService } from '../services/shared.service';
import { ApiFuntions } from '../services/ApiFuntions';

@Component({
  selector: 'app-induction-manager',
  templateUrl: './induction-manager.component.html',
  styleUrls: ['./induction-manager.component.scss']
})
export class InductionManagerComponent implements OnInit {
  tab_hover_color:string = '#cf9bff3d';
  fieldNames:any;
  constructor(
    private router: Router, 
    private sharedService: SharedService,
    private authService: AuthService,
    private Api:ApiFuntions
    ) { 
    router.events
      .pipe(
        filter((evt: any) => evt instanceof RoutesRecognized),
        pairwise()
      )
      .subscribe((events: RoutesRecognized[]) => {
        const prevRoute= events[0].urlAfterRedirects.split('/');
        const nextRoute = events[1].urlAfterRedirects.split('/');

    
    
        // debugger;
        // if (events[0].urlAfterRedirects == '/InductionManager' || events[1].urlAfterRedirects == '/InductionManager') {
    
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
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }
    this.Api.PickToteSetupIndex(paylaod).subscribe(res => {
      this.useInZonePickScreen = res.data.imPreference.useInZonePickScreen;
      this.sharedService.BroadCastInductionMenuUpdate(this.useInZonePickScreen);
    });
  }

  updateMenu(menu = '', route = ''){
    // if (menu == 'transaction-admin') {
    //   this.sharedService.updateInductionAdminMenu(menu);
    // }    
    this.sharedService.updateInductionAdminMenu({menu , route});

  }
  isAuthorized(controlName:any) {
    return !this.authService.isAuthorized(controlName);
 }
}
