import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {SocketioService} from '../socketio.service';
import {UserHttpService} from '../user-http.service';

@Component({
  selector: 'app-waiter',
  templateUrl: './paydesk2Dashboard.component.html',
  styleUrls: ['./paydesk2Dashboard.component.css']
})
export class Paydesk2DashboardComponent implements OnInit {
  constructor(private sio: SocketioService, private us: UserHttpService, private router: Router) { }

  ngOnInit() {
    if (this.us.get_token() == undefined || this.us.get_token() == '') {
      this.us.logout();
    }
  }
}
