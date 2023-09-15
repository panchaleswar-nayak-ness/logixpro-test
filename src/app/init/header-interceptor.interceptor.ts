import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from './auth.service';
import { ApiFuntions } from '../services/ApiFuntions';
import { SpinnerService } from './spinner.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private authService: AuthService,
    private api:ApiFuntions,
    private spinnerService: SpinnerService
    ) {}
    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
      
      return next.handle(request).pipe(
        catchError((error, caught) => {
          this.handleAuthError(error);
          return of(error);
        }) as any
      );
    }

  private handleAuthError(err: HttpErrorResponse): Observable<any> { 
    if (err.status === 401) {
      
      let userData = this.authService.userData();
      let paylaod = {
        "username": userData.userName,
        "wsid": userData.wsid,
      }      
      
      if(this.router.url.split('?')[0] != '/report-view'){
      if(this.authService.isConfigUser()){
          this.api.configLogout(paylaod).subscribe((res:any) => {
            if (res.isExecuted) {       
              this.dialog.closeAll();
              this.toastr.error('Token Expire', 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              this.router.navigate(['/globalconfig']);
            } else {
              this.toastr.error(res.responseMessage, 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
            }
          });    
      } else {
        this.api.Logout(paylaod).subscribe((res:any) => {
          if (res.isExecuted) {  
            let lastRoute: any = localStorage.getItem('LastRoute') ? localStorage.getItem('LastRoute') : "";
            localStorage.clear();     
            if(lastRoute != ""){
              localStorage.setItem('LastRoute', lastRoute);
            } 
            if(!localStorage.getItem('LastRoute')){
              localStorage.setItem('LastRoute', this.router.url);
            }     
            this.dialog.closeAll();
            this.toastr.error('Token Expire', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });  
            if(!(this.router.url.indexOf('login') > -1)) localStorage.setItem('LastRoute', this.router.url);        
            this.router.navigate(['/login']);    
          } else {
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
        })
      }

      return of(err.message);
    }
    throw err;
  }else if(err.status === 500){
    if(`${err.url}`.indexOf("insertnewprinter") > -1){
      this.toastr.error(err.error.ResponseMessage, 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000,
      }); 
    }
    this.spinnerService.hide();
  } 
  return of(err.message);
} 
}
