import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  get isLoggedIn(){return this._authService.isLoggedIn};
  constructor(
    private _router: Router,
    private _authService: AuthenticationService
  ) { }
  ngOnInit(): void {
  }

  mode(){

  }
}
