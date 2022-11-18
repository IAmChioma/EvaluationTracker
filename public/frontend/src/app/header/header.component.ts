import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  get isLoggedIn(){return this._authService.isLoggedIn};
  constructor(
    private _router: Router,
    private _authService: AuthenticationService
  ) { }
  ngOnInit(): void {
  }

}
