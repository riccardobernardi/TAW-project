import { Component, OnInit } from '@angular/core';
import {UserHttpService} from '../../user-http.service';

@Component({
  selector: 'app-waiter-tables',
  templateUrl: './waiter-tables.component.html',
  styleUrls: ['./waiter-tables.component.css']
})
export class WaiterTablesComponent implements OnInit {

  constructor(private us: UserHttpService) { }

  ngOnInit() {
    if (this.us.get_token() == undefined || this.us.get_token() == '') {
      this.us.logout();
    }
  }

}
