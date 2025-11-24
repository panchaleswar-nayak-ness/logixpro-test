import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams, HttpBackend } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, lastValueFrom, observable } from 'rxjs';
import { GlobalService } from './global.service';
import { ToasterMessages, ToasterTitle, ToasterType } from '../constants/strings.constants';
import { ReplaySubject } from 'rxjs';
import { of } from 'rxjs';
import { catchError, shareReplay, take, switchMap, map ,finalize} from 'rxjs/operators';
import { throwError } from 'rxjs';
import { SpinnerService } from "../../common/init/spinner.service";
import { ZoneListPayload } from 'src/app/bulk-process/preferences/preference.models';
import { ErrorCode} from '../enums/CommonEnums';
import { HeaderInterceptor } from '../init/header-interceptor.interceptor';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface LinkedResource<T> {
  resource: T;
  _links: {rel: string, href: string}[];
}

export type Link = {rel: string, href: string};
export type Links = {_links: Link[]};

@Injectable({
  providedIn: 'root'
})
export class BaseService {


  private apiUrl$: Observable<string>;

  constructor(
    private http: HttpClient,
    private injector: Injector,
    private spinnerService: SpinnerService,
  )
  {
    this.initializeApiUrl();
  }

  private initializeApiUrl(): void {
    if (environment.production) {
      const frontendUrl = window.location.origin;
      this.apiUrl$ = this.http.get(`${frontendUrl}/apiUrl`, { responseType: 'text' }).pipe(
        catchError(() => of(environment.apiUrl)),
        shareReplay(1)
      );
    } else {
      this.apiUrl$ = of(environment.apiUrl); // Use a static URL in non-production environments
    }
  }

  private request<T>(
    method: Method,
    endPoint: string,
    options: { body?: any; params?: HttpParams } = {},
    headers?: HttpHeaders,
    observe: any = 'body',
    spinnershow: boolean = true
  ): Observable<HttpResponse<T>> {
    if (spinnershow) {
      this.spinnerService.show();
    }
  
    return this.apiUrl$.pipe(
      take(1),
      switchMap(apiUrl => {
        const url = endPoint.startsWith(apiUrl) ? endPoint : `${apiUrl}${endPoint}`;
        return this.http.request<T>(method, url, {
          ...options,
          observe: 'response',
          withCredentials: true,
          headers: headers || this.GetHeaders()
        }).pipe(
          finalize(() => {
            if (spinnershow) {
              this.spinnerService.hide();
            }
          }),
          catchError(err => {
          const error = err as HttpErrorResponse;

          // Only show toasts if it's not a session timeout
          if (!HeaderInterceptor.getSessionTimeout()) {
            if (error?.error?.messageCode === ErrorCode.UnableToPrint) {
              // Specific error handling for UnableToPrint
              this.injector.get(GlobalService).ShowToastr(
                ToasterType.Error,
                error?.error.error,
                ToasterTitle.Error
              );
            } else {
              // Generic API error toast
              this.injector.get(GlobalService).ShowToastr(
                ToasterType.Error,
                ToasterMessages.APIErrorMessage,
                ToasterTitle.Error
              );
            }
          }

          return throwError(() => error);
        })
        );
      })
    );
  }

  public GetEndpoint(rel: string, links: Link[]): string {
    let endpoint = "";
    links.forEach(link => {
      if(link.rel == rel){
        endpoint = link.href;
      }
    });
    return endpoint;
  }

  public GetApiResources() : Observable<Links | null> {
    return this.Get<Links>("");
  }

  public GetApiEndpoint(rel: string) : Observable<string> {
    let resources = this.GetApiResources();
    return new Observable<string>(observer => {
      resources.subscribe((res: Links | null) => {
        if (res) {
          observer.next(this.GetEndpoint(rel, res._links));
        }
        else {
          observer.error("Error");
        }
      });
    });
  }

  Get<T>(endPoint: string, payload?, spinnerShow: boolean = true): Observable<T> {
    let queryParams = new HttpParams();
    if (payload != null)
      for (let key in payload)
        if (payload[key] != undefined) queryParams = queryParams.append(key, payload[key]);


    let requestObservable = this.request<T>('GET', endPoint, { params: queryParams }, undefined, 'body', spinnerShow);
    return requestObservable.pipe(
      map(response => response.body!)
    );

  }

  async GetAsync<T>(
    endPoint: string,
    payload?: any,
    isLoader: boolean = false,
    spinnershow: boolean = true
  ): Promise<HttpResponse<T>> {
    let queryParams = new HttpParams();
    if (payload != null) {
      for (let key in payload) {
        if (payload[key] !== undefined) {
          queryParams = queryParams.append(key, payload[key]);
        }
      }
    }
  
    try {
      return await lastValueFrom(
        this.request('GET', endPoint, { params: queryParams }, undefined, 'body', spinnershow)
      );
    } catch (error: any) {
      return error as HttpResponse<T>;
    }
  }
  

  async HttpPutAsync<T>(endPoint: string, model: T, isLoader: boolean = false): Promise<HttpResponse<T>> {
    return await lastValueFrom(this.request('PUT', endPoint,{body:model}));
  }

  async PostAsync<T>(endPoint: string, model: T, isLoader: boolean = false, spinnerShow: boolean = true): Promise<HttpResponse<T>> {
    return await lastValueFrom(this.request('POST', endPoint,{body:model}, undefined, 'body', spinnerShow));
  }

  public Post<T>(endPoint: string, reqPaylaod: T) {
    return this.request<T>('POST', endPoint, { body: reqPaylaod }).pipe(  // piping out the body for now for backward compatibility
      map(response => response.body)
    );
  }
  
  public Put<T>(endPoint: string, reqPayload: unknown): Observable<T | null> {
    return this.request<unknown>('PUT', endPoint, { body: reqPayload }).pipe(
        map(response => response.body as T || null) // Cast `response.body` to T and ensure null handling
    );
  }

  public PostFormData<T>(endPoint: string, reqPaylaod: T) {

    return this.request<T>('POST', endPoint, { body: reqPaylaod }, this.GetHeadersFormData()).pipe(// piping out the body for now for backward compatibility
      map(response => response.body)
    );
  }

  public Delete(endPoint: string, reqPaylaod: any = null) {
    let queryParams = new HttpParams();
    for (let key in reqPaylaod)
      queryParams = queryParams.append(key, reqPaylaod[key]);

    return this.request<any>('DELETE', endPoint, { params: queryParams }).pipe(// piping out the body for now for backward compatibility
      map(response => response.body)
    );
  }
  public async DeleteAsync(endPoint: string, reqPaylaod: any = null) {
    let queryParams = new HttpParams();
    for (let key in reqPaylaod)
      queryParams = queryParams.append(key, reqPaylaod[key]);

    return await lastValueFrom(this.request<any>('DELETE', endPoint, { params: queryParams }));
  }
  public async BulkDeleteAsync(endPoint: string, reqPayload: ZoneListPayload) {
    return await lastValueFrom(this.request<ZoneListPayload>('DELETE', endPoint, {
      body: reqPayload,
    }));
  }

  async PutAsync<T>(endPoint: string, reqPaylaod: any, spinnerShow: boolean = true) {
    return await lastValueFrom(this.request<T>('PUT', endPoint, { body: reqPaylaod }, undefined, 'body', spinnerShow));
  }

  async PatchAsync<T>(endPoint: string, reqPayload: T | null) {
    return await lastValueFrom(this.request<T>('PATCH', endPoint, reqPayload ? { body: reqPayload } : {}));
  }

  DownloadFile(endPoint: string) : Observable<any> {
    let httpHeaders = new HttpHeaders();
    const { _token } = JSON.parse(localStorage.getItem('user') ?? "{}");
    if (_token != null) httpHeaders = httpHeaders.set('_token', _token);
    let observable = this.GetUrlOfEndpoint(endPoint);

    return new Observable<any>(observer => {
      observable.subscribe(url => {
        this.http.get(url, {
          headers: httpHeaders,
          observe: 'response',
          responseType: 'blob',
          withCredentials: true
        }).subscribe(res => {
          observer.next(res);
        },
        (err) => {
          observer.error(err);
        });
      });
    });
  }

  handleError(err: any) {
    if (err.status == 500) {
      this.injector.get(GlobalService).ShowToastr(ToasterType.Error, this.injector.get(GlobalService).globalErrorMsg(), ToasterTitle.Error);
    } else if (err.status == 400) {
      this.injector.get(GlobalService).ShowToastr(ToasterType.Error, this.injector.get(GlobalService).globalErrorMsg(), ToasterTitle.Error);
    }
    else if (err.status < 500 && err.status >= 400) {
      this.injector.get(GlobalService).ShowToastr(ToasterType.Error, this.injector.get(GlobalService).globalErrorMsg(), ToasterTitle.Error);
    }
  }

  public GetUrlOfEndpoint(endPoint: string): Observable<string> {
    return this.apiUrl$.pipe(
      map((url: string) => {
        if (!endPoint.startsWith(url)) {
          return `${url}${endPoint}`;
        }
        return endPoint;
      })
    );
  }

  public GetApiUrl() : Observable<string> {
    return this.apiUrl$;
  }

  private GetHeaders(): HttpHeaders {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set(
      'content-type',
      'application/json; charset=utf-8',
    );
    const { _token } = JSON.parse(localStorage.getItem('user') ?? "{}");
    if (_token != null) httpHeaders = httpHeaders.set('_token', _token);
    return httpHeaders;
  }

  private GetHeadersFormData(): HttpHeaders {
    let httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'multipart/form-data');
    httpHeaders.append('Accept', 'application/json');

    const { _token } = JSON.parse(localStorage.getItem('user') ?? "{}");
    if (_token != null) httpHeaders = httpHeaders.set('_token', _token);
    return httpHeaders;
  }

}
