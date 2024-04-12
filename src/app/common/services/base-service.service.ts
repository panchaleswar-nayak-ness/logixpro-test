import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, lastValueFrom } from 'rxjs';
import { GlobalService } from './global.service';
import { ToasterTitle, ToasterType } from '../constants/strings.constants';
import { ReplaySubject } from 'rxjs';
import { of } from 'rxjs';
import { catchError, shareReplay, take, switchMap, map } from 'rxjs/operators';




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
    private injector: Injector
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

  private request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endPoint: string, options: { body?: T; params?: HttpParams } = {}): Observable<T> {
    return this.apiUrl$.pipe(
      take(1),
      switchMap(apiUrl => {
        const url = endPoint.startsWith(apiUrl) ? endPoint : `${apiUrl}${endPoint}`;
        return this.http.request<T>(method, url, {
          ...options,
          withCredentials: true,
          headers: this.GetHeaders()
        });
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

  public GetApiResources() : Observable<Links> {
    return this.Get<Links>("");
  }

  public GetApiEndpoint(rel: string) : Observable<string> {
    let resources = this.GetApiResources();
    return new Observable<string>(observer => {
      resources.subscribe((res: Links) => {
        observer.next(this.GetEndpoint(rel, res._links));
      });
    });
  }

  Get<T>(endPoint: string, payload?, isLoader: boolean = false): Observable<T> {
    let queryParams = new HttpParams();
    if (payload != null)
      for (let key in payload)
        if (payload[key] != undefined) queryParams = queryParams.append(key, payload[key]);


    return this.request<T>('GET', endPoint, { params: queryParams });
  }

  async GetAsync(endPoint: string, payload?, isLoader: boolean = false): Promise<any> {
    let queryParams = new HttpParams();
    if (payload != null)
      for (let key in payload)
        if (payload[key] != undefined) queryParams = queryParams.append(key, payload[key]);


    return await lastValueFrom(this.request<any>('GET', endPoint, { params: queryParams }));
  }

  async PostAsync<T>(endPoint: string, model: T): Promise<any> {
    let res;
    try {

      res = await lastValueFrom(this.request<T>('POST', endPoint, { body: model }));

    } catch (err) {
      console.log(err);
      res = null;
    }
    return res;
  }

  public Post<T>(endPoint: string, reqPaylaod: T) {
    return this.request<T>('POST', endPoint, { body: reqPaylaod });
  }

  public Put<T>(endPoint: string, reqPaylaod: T) {  
    return this.request<T>('PUT', endPoint, { body: reqPaylaod });
  }

  public PostFormData<T>(endPoint: string, reqPaylaod: T) {

    return this.request<T>('POST', endPoint, { body: reqPaylaod });
  }

  public Delete(endPoint: string, reqPaylaod: any = null) {
    let queryParams = new HttpParams();
    for (let key in reqPaylaod)
      queryParams = queryParams.append(key, reqPaylaod[key]);

    return this.http.delete<any>(this.GetUrl(endPoint), {
      headers: this.GetHeaders(),
      params: queryParams,
      withCredentials: true
    });
  }
  public async DeleteAsync(endPoint: string, reqPaylaod: any = null) {
    let queryParams = new HttpParams();
    for (let key in reqPaylaod)
      queryParams = queryParams.append(key, reqPaylaod[key]); 
    return await lastValueFrom(this.http.delete<any>(this.GetUrl(endPoint), {
      headers: this.GetHeaders(),
      params: queryParams,
      withCredentials: true
    }));
  }

  token: string;

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

  async GetHttpResponse(endPoint: string, reqPaylaod?: any) {
    let queryParams = new HttpParams();
    if (reqPaylaod != null)
      for (let key in reqPaylaod)
        if (reqPaylaod[key] != undefined) queryParams = queryParams.append(key, reqPaylaod[key]);
    let observable = this.GetUrlOfEndpoint(endPoint);
    return new Observable<any>(observer => {
      observable.subscribe(url => {
        this.http.get<any>(url, {
          headers: this.GetHeaders(),
          observe: 'response',
          params: queryParams,
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

  async PostHttpResponse<T>(endPoint: string, reqPaylaod: T) {
    let queryParams = new HttpParams();

    return this.request<T>('POST', endPoint, { body: reqPaylaod });
    
  }

  async PutAsync<T>(endPoint: string, reqPaylaod: T) {
    let queryParams = new HttpParams();
    return  await lastValueFrom(this.http.put<T>(this.GetUrl(endPoint), reqPaylaod, {
      headers: this.GetHeaders(),
      withCredentials: true,
      observe: 'response'
    }));
  }
  private GetUrl(endPoint: string) : string {
    let url = endPoint;
    if (!endPoint.startsWith(environment.apiUrl)) {
      url = `${environment.apiUrl}${endPoint}`;
    }
    return url;
  }

  async DeleteHttpResponse(endPoint: string, reqPaylaod: any) {
    let queryParams = new HttpParams();
    if (reqPaylaod != null)
      for (let key in reqPaylaod)
        if (reqPaylaod[key] != undefined) queryParams = queryParams.append(key, reqPaylaod[key]);

    return this.request<any>('DELETE', endPoint, { params: queryParams });
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

}