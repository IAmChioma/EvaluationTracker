import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.dev';
import { AuthenticationService } from '../authentication.service';
import { UserService } from '../user.service';
import { Credential } from './credential';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild("loginForm") loginForm!: NgForm;
  
  get isLoggedIn(){return this._authService.isLoggedIn};
  get name(){return this._authService.name};
  username_required = environment.username_required;
  password_required = environment.password_required;
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _authService: AuthenticationService) {
    
  }

  ngOnInit(): void {

  }


  logout(){
    this._authService._logout();
    this._router.navigate(["/"]);
  }


  _login(token:string):void{
    this._authService.token = token;
    this._router.navigate(["/"]);
  }
  onLogin(){
    const loginCredentials: Credential = new Credential(this.loginForm.value.username, this.loginForm.value.password)
    this._userService.login(loginCredentials).subscribe(
      {next:(loginResult)=>{
        console.log(loginResult);
        this._login(loginResult.token);
      },
      error:(err)=>{
        console.log(err);
      },
      complete(){

      }
    });
  }

}
