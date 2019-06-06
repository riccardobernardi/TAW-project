import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {UserHttpService} from '../user-http.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  private errmessage = undefined;
  constructor(private us: UserHttpService, private router: Router  ) { }
  private role = undefined

  ngOnInit() {}

  login( mail: string, password: string ) {
    this.us.login( mail, password).subscribe( (d) => {
      //console.log('Login granted: ' + JSON.stringify(d) );
      //console.log('User service token: ' + this.us.get_token() );
      this.role = this.us.get_role();
      this.errmessage = undefined;
      //console.log('going to: ' + '/' + this.role );
      this.router.navigate(['/' + this.role.toLowerCase()]);
    }, (err) => {
      //console.log('Login error: ' + JSON.stringify(err.error.errormessage) );
      this.errmessage = (err.error) ? err.error.errormessage || err.error.message : err;

    });
  }

}
