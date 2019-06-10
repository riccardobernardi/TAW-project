import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import {UserHttpService} from '../services/user-http.service';

@Component({
  selector: 'app-waiter',
  templateUrl: './waiterDashboard.component.html',
  styleUrls: ['./waiterDashboard.component.css']
})
export class WaiterDashboardComponent implements OnInit {

  private waiterObserver : Observable<any>

  constructor(private us: UserHttpService, private router: Router) {
  }

  ngOnInit() {
    console.log("WaiterDashboard istanciated!");
    if (this.us.get_token() == undefined || this.us.get_token() == '' || this.us.get_role() != "waiter") {
      console.log("Entrato per fare la logout!")
      this.us.logout();
    }
  }

}
