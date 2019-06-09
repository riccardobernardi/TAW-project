import { Component, OnInit } from '@angular/core';
import { UserHttpService } from '../services/user-http.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private us: UserHttpService) {}

  ngOnInit() {}


}
