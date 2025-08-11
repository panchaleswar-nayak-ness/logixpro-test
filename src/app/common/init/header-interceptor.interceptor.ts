import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { catchError as rxjsCatchError, Observable, of, timeout } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { SpinnerService } from './spinner.service';
import { IGlobalConfigApi } from 'src/app/common/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/common/services/globalConfig-api/global-config-api.service';
import { IUserAPIService } from '../services/user-api/user-api-interface';
import { UserApiService } from '../services/user-api/user-api.service';
import { GlobalService } from '../services/global.service';
import { ToasterTitle, ToasterType,ToasterMessages } from '../constants/strings.constants';
import { SharedService } from '../services/shared.service';
import { BehaviorSubject } from 'rxjs';
import { SetTimeout } from '../constants/numbers.constants';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  public iGlobalConfigApi: IGlobalConfigApi;
  public iUserApi : IUserAPIService;
  public static isSessionTimeoutHandled :  BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); // Public static flag to prevent multiple session timeout toasts

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

  // Static method to check if session timeout is being handled
  public static getSessionTimeout(): boolean {
    return HeaderInterceptor.isSessionTimeoutHandled.getValue();
  }

  // Static method to reset session timeout flag (call this after successful login)
  public static resetSessionTimeoutFlag(): void {
    HeaderInterceptor.isSessionTimeoutHandled.next(false);
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      rxjsCatchError((error, caught) => {
        this.handleAuthError(error);
        throw error;
      }) as any
    );
  }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    if (err.status === 401) {
      if(this.router.url.split('?')[0] != '/report-view'){
        // Only handle session timeout if not already handled
        if (!HeaderInterceptor.isSessionTimeoutHandled.getValue()) {
          HeaderInterceptor.isSessionTimeoutHandled.next(true);
          
          // Clear localStorage immediately to prevent further API calls with invalid token
          localStorage.clear();
          
          if(this.authService.isConfigUser()) {
            this.iGlobalConfigApi.configLogout().pipe(
              timeout(SetTimeout.LOGOUT_TIMEOUT), // 5 second timeout
              rxjsCatchError((error) => {
                // If logout API fails, still redirect
                this.dialog.closeAll();
                this.global.ShowToastr(ToasterType.Error, ToasterMessages.SessionTimeOut, ToasterTitle.Error);
                window.location.href = "/#/globalconfig";
                return of(null);
              })
            ).subscribe((res: any) => {
              this.dialog.closeAll();
              this.global.ShowToastr(ToasterType.Error, ToasterMessages.SessionTimeOut, ToasterTitle.Error);
              window.location.href = "/#/globalconfig";
            });    
          } else {
            this.iUserApi.Logout().pipe(
              timeout(5000), // 5 second timeout
              rxjsCatchError((error) => {
                // If logout API fails, still redirect
                this.dialog.closeAll();
                this.global.ShowToastr(ToasterType.Error, ToasterMessages.SessionTimeOut, ToasterTitle.Error);
                this.router.navigate(['/login']);
                return of(null);
              })
            ).subscribe((res: any) => {
              this.dialog.closeAll();
              this.global.ShowToastr(ToasterType.Error, ToasterMessages.SessionTimeOut, ToasterTitle.Error);
              this.router.navigate(['/login']);
            });
          }
        }

        return of(err.message);
      }
      throw err;
    } else if(err.status === 500) {
      if(`${err.url}`.indexOf("insertnewprinter") > -1){
        this.global.ShowToastr(ToasterType.Error, err.error.ResponseMessage, ToasterTitle.Error);
        this.spinnerService.hide();
      }
        else{
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      }
    } else if(err.status === 403) {
      const responseMessage = err.error?.ResponseMessage ? `(${err.error.ResponseMessage})` : '';
      const errorMessage = 'Unauthorize access ' + responseMessage;
      this.global.ShowToastr(ToasterType.Error, errorMessage, ToasterTitle.Error);
      if(!this.authService.isConfigUser()){
        this.router.navigate(['/dashboard']);
        this.sharedService.BroadCastMenuUpdate("/dashboard");
      }
    }

    return of(err.message);
  }
}
