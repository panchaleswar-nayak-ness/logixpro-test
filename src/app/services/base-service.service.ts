import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';  
import { BYPASS_LOG } from '../init/http-interceptor';

@Injectable({
    providedIn: 'root'
})

export class BaseService {

    constructor(private http: HttpClient) {
    } 
      Get(endPoint:string ,payload?,isLoader:boolean=false): Observable<any>{
        let queryParams = new HttpParams();
        if(payload != null){
             for(let key in payload){
                 if(payload[key] != undefined) queryParams=queryParams.append(key,payload[key]);
             }
        }  
   
        return this.http.get<any>(`${environment.apiUrl}${endPoint}`,{
            headers: this.GetHeaders(),
            params:queryParams
          }); 
        
    }
  
    async GetAsync(endPoint: string,payload?, isLoader:boolean=false): Promise<any> {
      let queryParams = new HttpParams();
      if(payload != null){
           for(let key in payload){
               if(payload[key] != undefined) queryParams=queryParams.append(key,payload[key]);
           }
      }  
      return await this.http
        .get<any>(`${environment.apiUrl}${endPoint}`,  {
          headers: this.GetHeaders(),
          params:queryParams
        })
        .toPromise();
    }
  
    public Post(endPoint: string,reqPaylaod: any) { 
        return this.http.post<any>(`${environment.apiUrl}${endPoint}`, reqPaylaod, {
            headers: this.GetHeaders(),
          });
    }
    public PostFormData(endPoint: string,reqPaylaod: any) { 
        return this.http.post<any>(`${environment.apiUrl}${endPoint}`, reqPaylaod, {
            headers: this.GetHeadersFormData(),
          });
    }

    public Put(endPoint: string,reqPaylaod: any) { 
        return this.http.put<any>(`${environment.apiUrl}${endPoint}`, reqPaylaod, {
            headers: this.GetHeaders(),
          });
    }
    public Update(endPoint: string,reqPaylaod: any) { 
        return this.http.put<any>(`${environment.apiUrl}${endPoint}`, reqPaylaod, {
            headers: this.GetHeaders(),
          });
    }
    public Delete(endPoint: string,reqPaylaod: any = null) {
      let queryParams = new HttpParams();
      for(let key in reqPaylaod){
      queryParams=queryParams.append(key,reqPaylaod[key]);
      } 
       
        return this.http.delete<any>(`${environment.apiUrl}${endPoint}`, {
            headers: this.GetHeaders(),
            params:queryParams
          });
    } 
    public update(reqPaylaod: any, endPoint: string) { 
        return this.http.put<any>(`${environment.apiUrl}${endPoint}`, reqPaylaod, {
            headers: this.GetHeaders(),
          });
    } 
    token:string;
  private GetHeaders(): HttpHeaders {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.set(
      'content-type',
      'application/json; charset=utf-8',
    );
    const { _token } = JSON.parse(localStorage.getItem('user') || "{}");
    if (_token != null) {
      httpHeaders = httpHeaders.set('_token', _token);
    }
    return httpHeaders;
  }
  private GetHeadersFormData(): HttpHeaders {
    let httpHeaders = new HttpHeaders();
    httpHeaders.append('content-type', 'multipart/form-data');
    httpHeaders.append('Accept', 'application/json');
   
    const { _token } = JSON.parse(localStorage.getItem('user') || "{}");
    if (_token != null) {
      httpHeaders = httpHeaders.set('_token', _token);
    }
    return httpHeaders;
  }

}