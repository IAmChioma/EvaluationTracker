import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  get isLoggedIn() {
    if (localStorage.getItem("token")) {
      return true;
    }
    else {
      return false;}
    }

  set token(token: string) { localStorage.setItem("token", token); }
  get token() { return localStorage.getItem("token") as string; }
  get name() {
    if (this._jwtService.decodeToken(this.token)) {
      return this._jwtService.decodeToken(this.token).name as string;
    }else {
      return "";}
  }


  constructor(private _jwtService: JwtHelperService) { }

  _logout() {
    localStorage.clear()
  }
  _login(token: string) {
    this.token = token;

  }
}
