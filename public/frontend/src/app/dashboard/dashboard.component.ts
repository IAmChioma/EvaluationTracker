import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  get isLoggedIn(){return this._authService.isLoggedIn};
  constructor(
    private _authService: AuthenticationService
  
  ) { }

  ngOnInit(): void {
  }

}
