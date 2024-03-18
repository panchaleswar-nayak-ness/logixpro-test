import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, lastValueFrom } from 'rxjs';
import { GlobalService } from './global.service';
import { ToasterTitle, ToasterType } from '../constants/strings.constants';

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

  constructor(
    private http: HttpClient,
    private injector: Injector
  ) { }


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

    return this.http.get<T>(this.GetUrl(endPoint), {
      headers: this.GetHeaders(),
      params: queryParams,
      withCredentials: true
    });
  }

  async GetAsync(endPoint: string, payload?, isLoader: boolean = false): Promise<any> {
    let queryParams = new HttpParams();
    if (payload != null)
      for (let key in payload)
        if (payload[key] != undefined) queryParams = queryParams.append(key, payload[key]);

    return await this.http.get<any>(this.GetUrl(endPoint), {
      headers: this.GetHeaders(),
      params: queryParams,
      withCredentials: true
    }).toPromise();
  }

  async PostAsync(apiUrl: string, model: any): Promise<any> {
    let res;
    try {
      res = await lastValueFrom(this.http.post<any>(environment.apiUrl + apiUrl, model, { headers: this.GetHeaders() }));
    } catch (err) {
      console.log(err);
      res = null;
    }
    return res;
  }

  public Post(endPoint: string, reqPaylaod: any) {
    return this.http.post<any>(this.GetUrl(endPoint), reqPaylaod, {
      headers: this.GetHeaders(),
      withCredentials: true
    });
  }

  public PostFormData(endPoint: string, reqPaylaod: any) {
    return this.http.post<any>(this.GetUrl(endPoint), reqPaylaod, {
      headers: this.GetHeadersFormData(),
      withCredentials: true
    });
  }

  public Put(endPoint: string, reqPaylaod: any) {
    return this.http.put<any>(this.GetUrl(endPoint), reqPaylaod, {
      headers: this.GetHeaders(),
      withCredentials: true
    });
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
    let res: any;
    try {
      res = await lastValueFrom(this.http.get<any>(this.GetUrl(endPoint), {
        headers: this.GetHeaders(),
        observe: 'response',
        params: queryParams,
        withCredentials: true
      }));
    } catch (err) {
      this.handleError(err);
      console.log(err);
      res = null;
    }
    return res;
  }

  async PostHttpResponse(endPoint: string, reqPaylaod: any) {
    let queryParams = new HttpParams();
    let res: any;
    try {
      res = await lastValueFrom(this.http.post<any>(this.GetUrl(endPoint), reqPaylaod, {
        headers: this.GetHeaders(),
        observe: 'response',
        params: queryParams,
        withCredentials: true
      }));
    } catch (err) {
      this.handleError(err);
      console.log(err);
      res = null;
    }
    return res;
  }

  async PutHttpResponse(endPoint: string, reqPaylaod: any) {
    let queryParams = new HttpParams();
    let res: any;
    try {
      res = await lastValueFrom(this.http.put<any>(this.GetUrl(endPoint), reqPaylaod, {
        headers: this.GetHeaders(),
        observe: 'response',
        params: queryParams,
        withCredentials: true
      }));
    } catch (err) {
      this.handleError(err);
      console.log(err);
      res = null;
    }
    return res;
  }

  async DeleteHttpResponse(endPoint: string, reqPaylaod: any) {
    let queryParams = new HttpParams();
    if (reqPaylaod != null)
      for (let key in reqPaylaod)
        if (reqPaylaod[key] != undefined) queryParams = queryParams.append(key, reqPaylaod[key]);
    let res: any;
    try {
      res = await lastValueFrom(this.http.delete<any>(this.GetUrl(endPoint), {
        headers: this.GetHeaders(),
        observe: 'response',
        params: queryParams,
        withCredentials: true
      }));
    } catch (err) {
      this.handleError(err);
      console.log(err);
      res = null;
    }
    return res;
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

  private GetUrl(endPoint: string) : string {
    let url = endPoint;
    if (!endPoint.startsWith(environment.apiUrl)) {
      url = `${environment.apiUrl}${endPoint}`;
    }
    return url;
  }
}