import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SocketioService} from '../services/socketio.service';
import {UserHttpService} from '../services/user-http.service';

@Component({
  selector: 'app-paydesk-dashboard',
  templateUrl: './paydeskDashboard.component.html',
  styleUrls: ['./paydeskDashboard.component.css']
})
export class PaydeskDashboardComponent implements OnInit {
  constructor(private sio: SocketioService, private us: UserHttpService, private router: Router) { }

  ngOnInit() {
    if (this.us.get_token() == undefined || this.us.get_token() == '') {
      this.us.logout();
    }
  }
}
