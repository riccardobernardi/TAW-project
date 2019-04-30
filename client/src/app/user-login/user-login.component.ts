

import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  private errmessage = undefined;
  constructor( private us: UserService, private router: Router  ) { }

  ngOnInit() {
    this.us.renew().subscribe( (d) => {
      console.log('Renew succeded: ' + JSON.stringify(d) );
      this.router.navigate(['/messages']);
    }, (err) => {
      console.log('Renew error: ' + JSON.stringify(err.error.errormessage) );
    });
  }

  login( mail: string, password: string, remember: boolean ) {
    this.us.login( mail, password, remember).subscribe( (d) => {
      console.log('Login granted: ' + JSON.stringify(d) );
      console.log('User service token: ' + this.us.get_token() );
      this.errmessage = undefined;
      this.router.navigate(['/messages']);
    }, (err) => {
      console.log('Login error: ' + JSON.stringify(err.error.errormessage) );
      this.errmessage = err.error.errormessage;

    });

  }

}
