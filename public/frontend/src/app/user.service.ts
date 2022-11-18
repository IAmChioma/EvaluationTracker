import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from './register/user';
import { Credential } from './login/credential';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl="http://localhost:3000/api";
  constructor(private _http:HttpClient) { }


  login(user:Credential):Observable<any>{
    return this._http.post<User>(`${this.baseUrl}/users/login`,user);
  }
  addUser(user:User):Observable<any>{
    return this._http.post<User>(`${this.baseUrl}/users`,user);
  }
  editUser(id:string,user:User):Observable<any>{
    return this._http.put<User>(`${this.baseUrl}/users/${id}`,user);
  }
  getUsers():Observable<User[]>{
    return this._http.get<User[]>(`${this.baseUrl}/users`);
  }
}
