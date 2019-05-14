import { Component, OnInit } from '@angular/core';
import {UserService} from '../user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-paydesk',
  templateUrl: './paydesk.component.html',
  styleUrls: ['./paydesk.component.css']
})
export class PaydeskComponent implements OnInit {

  constructor(private us: UserService, private router: Router  ) { }

  private roles: string[] = ['waiter', 'cook', 'barman', 'admin'];
  private newRoleSelected: string = undefined;

  private errmessage = undefined;
  private user = { ID: '00', Nickname: '', Password: '', Ruolo: '' };

  ngOnInit() {
  }

  send(name, password) {
    this.user.Nickname = name;
    this.user.Password = password;
    this.user.Ruolo = this.newRoleSelected;
    this.signup();
  }

  signup() {
    this.us.register( this.user ).subscribe( (d) => {
      console.log('Registration ok: ' + JSON.stringify(d) );
      this.errmessage = undefined;
      // this.router.navigate(['/login']);
    }, (err) => {
      console.log('Signup error: ' + JSON.stringify(err.error.errormessage) );
      this.errmessage = err.error.errormessage || err.error.message;

    });

  }
}
