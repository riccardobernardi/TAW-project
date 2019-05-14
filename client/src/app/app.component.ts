import { Component } from '@angular/core';
import {UserHttpService} from './user-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  constructor( private us: UserHttpService ) {

  }

}

