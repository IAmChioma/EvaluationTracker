import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { Stat, Template } from './template/template';

@Injectable({
  providedIn: 'root'
})
export class TemplateDataService {
  baseUrl = "http://localhost:3000/api"
  constructor(private _http:HttpClient, private _authService: AuthenticationService) { }

  getTemplates():Observable<Template[]>{
    return this._http.get<Template[]>(`${this.baseUrl}/templates`);
  }

  getTemplate(id:string):Observable<Template>{
    return this._http.get<Template>(`${this.baseUrl}/templates/${id}`,{headers: {"authorization":"Bearer "+ this._authService.token}});
    // return this._http.get<Template>(`${this.baseUrl}/templates/${id}`, {headers: {"authorization":"Bearer "+ this._authService.token}});
  }

  deleteTemplate(id:string):Observable<any>{
    return this._http.delete<any>(`${this.baseUrl}/templates/${id}`,  {headers: {"authorization":"Bearer "+ this._authService.token}});
  }

  createTemplate(template:Template):Observable<Template>{
    return this._http.post<Template>(`${this.baseUrl}/templates`, template);
  }
  editTemplate(id:string,template:Template):Observable<Template>{
    return this._http.put<Template>(`${this.baseUrl}/templates/${id}`, template);
  };
  getTotalTemplate():Observable<number>{
    return this._http.get<number>(`${this.baseUrl}/templates/totalCount`);
  }
  getTemplatesByCountAndOffset(count:number, offset:number): Observable<Template[]> {
    return this._http.get<Template[]>(`${this.baseUrl}/templates?count=${count}&offset=${offset}`);
  }

  getTemplatesByName(name:string): Observable<Template[]> {
    return this._http.get<Template[]>(`${this.baseUrl}/templates?search=${name}`);
  }
  deactivateTemplate(id:string, stat:Stat):Observable<Template>{
    return this._http.put<Template>(`${this.baseUrl}/templates/${id}/deactivate`,stat);
  };
 

}
