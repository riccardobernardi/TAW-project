import { Component, OnInit, Input } from '@angular/core';
import { TableHttpService } from 'src/app/table-http.service';
import { UserHttpService } from 'src/app/user-http.service';
import { TicketHttpService } from '../ticket-http.service';
import { Ticket } from 'src/app/Ticket';
import {Table} from '../Table';
import { Observable } from 'rxjs/Observable';
import {SocketioService} from '../socketio.service';
import {TicketOrder} from '../TicketOrder';


@Component({
  selector: 'app-tables-view',
  templateUrl: './tables-view.component.html',
  styleUrls: ['./tables-view.component.css']
})
export class TablesViewComponent implements OnInit {

  private tables: Table[] = [];
  private socketObserver: Observable<any>;
  private dd

  constructor(private table: TableHttpService, private user: UserHttpService, private ticket: TicketHttpService, private socketio: SocketioService) {
    var supTables = this.tables;
    this.dd = () => {
      table.get_tables().subscribe( (dd) => {
        supTables.splice(0, supTables.length);
        dd.forEach( (ss) => {
          supTables.push(ss);
        });
      });
    }
   }

  ngOnInit() {
    this.dd()
    this.socketio.get().on('waiters', this.dd);
  }

  /*dd() {
    this.table.get_tables().subscribe( (dd) => {
      dd.forEach( (ss) => {
        this.tables.push(ss);
      });
    });
  }*/

  open_ticket(tableToChange: Table, people_number: number) {
    console.log(people_number);
    this.ticket.open_ticket(this.user.get_nick(), tableToChange.number, people_number).toPromise().then((data: Ticket) => {
      console.log(data);
      // tableToChange.state = data._id;
      const table = Object.assign({}, tableToChange);
      table.state = data._id;
      console.log(tableToChange.state);
      return this.table.change_table(table).toPromise();
      // update del tavolo da rimuovere perchè si deve usare il websocket
    }).then().catch(err => {
      console.log(err);
    });
  }

}
