import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { SpinnerService } from './spinner.service';
import { IGlobalConfigApi } from 'src/app/common/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/common/services/globalConfig-api/global-config-api.service';
import { IUserAPIService } from '../services/user-api/user-api-interface';
import { UserApiService } from '../services/user-api/user-api.service';
import { GlobalService } from '../services/global.service';
import { ToasterTitle, ToasterType } from '../constants/strings.constants';
import { SharedService } from '../services/shared.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  public iGlobalConfigApi: IGlobalConfigApi;
  public iUserApi : IUserAPIService;

  constructor(
	  public userApi: UserApiService,
    private router: Router,
    private global: GlobalService,
    private dialog:MatDialog,
    private authService: AuthService,
    public globalConfigApi: GlobalConfigApiService,
    private spinnerService: SpinnerService,
    private sharedService:SharedService,
  ) {
    this.iGlobalConfigApi = globalConfigApi;
    this.iUserApi = userApi;
  }  

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error, caught) => {
        this.handleAuthError(error);
        throw error;
      }) as any
    );
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401) {
      if(this.router.url.split('?')[0] != '/report-view'){
        if(this.authService.isConfigUser())
          this.iGlobalConfigApi.configLogout().subscribe((res: any) => {
            if (res.isExecuted) {       
              this.dialog.closeAll();
              this.global.ShowToastr(ToasterType.Error, 'Token Expire', ToasterTitle.Error);
              window.location.href = "/#/globalconfig"; 
            } else this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
          });    
        else
          this.iUserApi.Logout().subscribe((res: any) => {
            if (res.isExecuted) {
              let lastRoute: any = localStorage.getItem('LastRoute') ? localStorage.getItem('LastRoute') : "";
              if(lastRoute != "") localStorage.setItem('LastRoute', lastRoute);
              if(!localStorage.getItem('LastRoute')) localStorage.setItem('LastRoute', this.router.url);
              this.dialog.closeAll();
              this.global.ShowToastr(ToasterType.Error,'Token Expire', ToasterTitle.Error);
              if((this.router.url.indexOf('login') <= -1)) localStorage.setItem('LastRoute', this.router.url);
              this.router.navigate(['/login']);
            } else this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
          });

        return of(err.message);
      }
      throw err;
    } else if(err.status === 500) {
      if(`${err.url}`.indexOf("insertnewprinter") > -1) this.global.ShowToastr(ToasterType.Error, err.error.ResponseMessage, ToasterTitle.Error);
      this.spinnerService.hide();
    } else if(err.status === 403) {
      const responseMessage = err.error?.ResponseMessage ? `(${err.error.ResponseMessage})` : '';
      const errorMessage = 'Unauthorize access ' + responseMessage;
      this.global.ShowToastr(ToasterType.Error, errorMessage, ToasterTitle.Error);
      this.router.navigate(['/dashboard']);
      this.sharedService.BroadCastMenuUpdate("/dashboard");
    }

    return of(err.message);
  }
}
