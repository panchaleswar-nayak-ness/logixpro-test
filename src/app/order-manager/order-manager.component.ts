import { Component, OnInit } from '@angular/core';
import { AuthService } from '../init/auth.service';
import { NavigationEnd, Router} from '@angular/router';
import { ApiFuntions } from '../services/ApiFuntions';
import { GlobalService } from '../common/services/global.service';
import { OrderManagerApiService } from 'src/app/services/orderManager-api/order-manager-api.service';
import { IOrderManagerAPIService } from 'src/app/services/orderManager-api/order-manager-api-interface';

@Component({
  selector: 'app-order-manager',
  templateUrl: './order-manager.component.html',
  styleUrls: [],
})
export class OrderManagerComponent implements OnInit {
  userData: any;
  openPicks=0;
  compPicks=0;
  openPuts=0;
  compPuts=0;
  openCounts=0;
  compCounts=0;
  compAdjust=0;
  compLocChange=0;
  reprocCount=0;
  public iOrderManagerApi :  IOrderManagerAPIService;
  constructor(
    private Api:ApiFuntions,
    private authService: AuthService,
    public orderManagerApi  : OrderManagerApiService,
    private router: Router,
    private global:GlobalService
  ) {
        this.iOrderManagerApi = orderManagerApi;
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {

            let spliUrl=event.url.split('/');
            if(spliUrl[1]=='OrderManager'){
              localStorage.setItem('routeFromOrderStatus','true')
              localStorage.setItem('routeFromInduction','false')
            }else{
              localStorage.setItem('routeFromOrderStatus','false')
            }
         }
          });
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getInvDetailsList();
    this.global.getOmPreferences();
  }

  getInvDetailsList() {

    this.iOrderManagerApi
      .OrderManagerMenuIndex()
      .subscribe(
        (res: any) => {
          if (res.isExecuted) {
            let item=res.data;
            this.openPicks=item.openPicks;
            this.compPicks=item.compPick;
            this.openPuts=item.openPuts;
            this.compPuts=item.compPuts;
            this.openCounts=item.openCounts;
            this.compCounts=item.compCounts;
            this.compAdjust=item.compAdjust;
            this.compLocChange=item.compLocChange;
            this.reprocCount=item.reprocCount;
          }
        },
        (error) => {}
      );
  }
}