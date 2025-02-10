import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, lastValueFrom, observable } from 'rxjs';
import { GlobalService } from './global.service';
import { ToasterTitle, ToasterType } from '../constants/strings.constants';
import { ReplaySubject } from 'rxjs';
import { of } from 'rxjs';
import { catchError, shareReplay, take, switchMap, map } from 'rxjs/operators';


type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

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

  private request<T>(method: Method, endPoint: string, options: { body?: T; params?: HttpParams } = {}, headers?: HttpHeaders,observe:any = "body"): Observable<HttpResponse<T>> {
    return this.apiUrl$.pipe(
      take(1),
      switchMap(apiUrl => {
        const url = endPoint.startsWith(apiUrl) ? endPoint : `${apiUrl}${endPoint}`;
        return this.http.request<T>(method, url, {
          ...options,
          observe: 'response',
          withCredentials: true,
          headers: headers || this.GetHeaders()
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

  Get<T>(endPoint: string, payload?, isLoader: boolean = false): Observable<T> {
    let queryParams = new HttpParams();
    if (payload != null)
      for (let key in payload)
        if (payload[key] != undefined) queryParams = queryParams.append(key, payload[key]);


    let requestObservable = this.request<T>('GET', endPoint, { params: queryParams });
    return requestObservable.pipe(
      map(response => response.body!)
    );

  }

  async GetAsync<T>(endPoint: string, payload?, isLoader: boolean = false): Promise<HttpResponse<T>> {
    let queryParams = new HttpParams();
    if (payload != null) {
      for (let key in payload) {
        if (payload[key] !== undefined) queryParams = queryParams.append(key, payload[key]);
      }
    }
  
    try {
      return await lastValueFrom(this.request('GET', endPoint, { params: queryParams }));
    } catch (error: any) {
      // Return error response instead of throwing an exception
      return error as HttpResponse<T>;
    }
  }

  async PostAsync<T>(endPoint: string, model: T, isLoader: boolean = false): Promise<HttpResponse<T>> {
    return await lastValueFrom(this.request('POST', endPoint,{body:model}));
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

  async PutAsync<T>(endPoint: string, reqPaylaod: T) {
    return await lastValueFrom(this.request<T>('PUT', endPoint, { body: reqPaylaod }));
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
