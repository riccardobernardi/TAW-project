import { Component, OnInit } from '@angular/core';
import {UserHttpService} from '../user-http.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(us: UserHttpService) {
    us.logout();
  }

  ngOnInit() {
  }

}
