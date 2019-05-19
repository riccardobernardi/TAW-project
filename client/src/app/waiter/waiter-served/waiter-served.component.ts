import { Component, OnInit } from '@angular/core';
import {UserHttpService} from '../../user-http.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs/operators';
import * as url from 'url';

@Component({
  selector: 'app-waiter-served',
  templateUrl: './waiter-served.component.html',
  styleUrls: ['./waiter-served.component.css']
})
export class WaiterServedComponent implements OnInit {

  constructor(private http: HttpClient, private us: UserHttpService) { }

  public url = 'http://localhost:8080';

  ngOnInit() {
    if (this.us.get_token() == undefined || this.us.get_token() == '') {
      this.us.logout();
    }
  }

  get() {
    const options = {
      headers: new HttpHeaders({
        'cache-control': 'no-cache',
        'Content-Type':  'application/json',
      }).append('Authorization', 'Bearer ' + this.us.get_token())
    };

    let a = [];

    this.http.get( this.url + '/tickets', options ).pipe(
      tap( (data) => {
        // console.log(options);
        console.log(JSON.stringify(data) );
        a.push(JSON.stringify(data));
        a.push('ghesbò');
      })
    );

    console.log(a);

    return a;
  }

}
