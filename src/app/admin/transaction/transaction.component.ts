import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap  } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SharedService } from 'src/app/common/services/shared.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { AppRoutes, ToasterTitle, ToasterType ,RouteUpdateMenu} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: [],
})
export class TransactionComponent implements OnInit, AfterViewInit {
  public tabIndex = 1;
  public userData: any;
  public showReprocess;
  public showReprocessed;
  public setval;
  fieldNames:any;
  orderStatus$: Observable<any>;
  itemNumber$: Observable<any>;
  type$: Observable<any>;
  isOrderStatus:any = false;
  type:any;
  itemNumber:any;
  tabIndex$: Observable<any>;
  location$: Observable<any>;
  location: any;

  public iAdminApiService: IAdminApiService;

  constructor(
    router: Router,
    private route: ActivatedRoute,
    public adminApiService: AdminApiService,
    private sharedService: SharedService,
    public authService: AuthService,
    private global : GlobalService,
  ) { 
    this.iAdminApiService = adminApiService;
    if(router.url == AppRoutes.OrderManagerOrderStatus) this.tabIndex = 0;
    else if(router.url == AppRoutes.AdminTrans) this.tabIndex = 1;
  }

  ngAfterViewInit() {
    this.setval = localStorage.getItem(RouteUpdateMenu.RouteFromInduction)
    this.showReprocess = JSON.parse(this.setval)
    this.showReprocessed = JSON.parse(this.setval)

    this.orderStatus$ = this.route.queryParamMap.pipe(map((params: ParamMap) => params.get('orderStatus')));
 
    this.tabIndex$ = this.route.queryParamMap.pipe(map((params: ParamMap) => params.get('tabIndex')));
    let IsStatus = this.route.queryParamMap.pipe(map((params: ParamMap) => params.get('IsOrderStatus')));
    
    IsStatus.subscribe((param) => {
      if (param!=null &&param != undefined) this.isOrderStatus = true;
      else this.isOrderStatus = false;
    });

    this.tabIndex$.subscribe((param) => { if (param) this.tabIndex = 0; });
    
    this.orderStatus$.subscribe((param) => { 
      if(param != null && param !== undefined){
        this.tabIndex = 0;
        this.sharedService.updateOrderStatus(param)
      }
    });
    
    this.itemNumber$ = this.route.queryParamMap.pipe(map((params: ParamMap) => params.get('itemNumber')));

    this.itemNumber$.subscribe((param) => { if (param) this.itemNumber=param; });

    this.type$ = this.route.queryParamMap.pipe(map((params: ParamMap) => params.get('type')));

    this.type$.subscribe((param) => {
      if (param) {
        this.type=param;

        if(this.type === 'OpenTransaction'){
          this.tabIndex = 1;
          this.sharedService.updateItemTransaction(this.itemNumber);
        }
        else if(this.type === 'TransactionHistory'){
          this.tabIndex = 2;
          this.sharedService.updateTransactionHistory(this.itemNumber);
        }
        else if(this.type==='ReprocessTransaction'){
          this.tabIndex = 3;
          this.sharedService.updateTransactionReprocess(this.itemNumber);
        }
      }
    });

    this.location$ = this.route.queryParamMap.pipe(map((params: ParamMap) => params.get('location')));

    this.location$.subscribe((param) => {
      if (param) {
        this.tabIndex = 2;
        this.sharedService.updateTransactionLocHistory(param);
      }
    });
  }

  ngOnInit(): void {
    this.osFieldFilterNames();
  }

  public osFieldFilterNames() { 
    this.iAdminApiService.ColumnAlias().subscribe((res: any) => {
      if(res.isExecuted && res.data)
      {
        this.fieldNames = res.data;
        this.sharedService.updateFieldNames(this.fieldNames)
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("ColumnAlias",res.responseMessage);
      }
    })
  }

  switchToOrder() {
    this.tabIndex = 0;
  }

  onTabChanged(event) {
    this.sharedService.updateBreadcrumb(event)
  }
}
