import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private errmessage = undefined;
  constructor( private us: UserService, private router: Router  ) { }

  ngOnInit() {
    this.us.get_token()
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

}
