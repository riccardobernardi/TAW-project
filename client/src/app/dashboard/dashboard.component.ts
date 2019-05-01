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
    this.us.get_username().subscribe(
      (data) => {
        console.log('username:' + data);
      } , (err) => {
        this.us.renew().subscribe( (data) => {
          // Succeeded
          console.log('username:' + data);
        }, (err2) => {
          // Error again, we really need to logout
          this.logout();
        } );
      }
    );
  }

  logout() {
    this.us.logout();
    this.router.navigate(['/']);
  }

}
