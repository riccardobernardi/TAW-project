import { Component, OnInit, Input } from '@angular/core';
import { TableHttpService } from 'src/app/table-http.service';
import { UserHttpService } from 'src/app/user-http.service';
import { TicketHttpService } from '../ticket-http.service';
import { Ticket } from 'src/app/Ticket';
import { Table, states } from '../Table';
import { Observable } from 'rxjs/Observable';
import { SocketioService } from '../socketio.service';


@Component({
  selector: 'app-tables-view',
  templateUrl: './tables-view.component.html',
  styleUrls: ['./tables-view.component.css']
})
export class TablesViewComponent implements OnInit {

  private tables: Table[] = [];
  private socketObserver: Observable<any>;
  private states = states;
  private error = false;

  constructor(private table: TableHttpService, private user: UserHttpService, private ticket: TicketHttpService, private socketio: SocketioService) {}

  ngOnInit() {
    this.get_tables()
    this.socketio.get().on('waiters', ()=>{ 
      console.log("Waiters view evento ricevuto");
      this.get_tables() } );
  }

  public get_tables() {
    this.table.get_tables().subscribe( (tables: Table[]) => {
      this.tables.splice(0, this.tables.length);
      tables.forEach( (table : Table) => {
        this.tables.push(table);
      });
      console.log(this.tables);
      this.error = false;
    });
  }

  public open_ticket(tableToChange: Table, people_number: number) {
    console.log(people_number);
    this.ticket.open_ticket(this.user.get_nick(), tableToChange.number, people_number).toPromise().then((data: Ticket) => {
      console.log(data);
      // tableToChange.state = data._id;
      const table = Object.assign({}, tableToChange);
      table.state = states[1];
      console.log(table.state);
      return this.table.change_table(table, data._id).toPromise();
      // update del tavolo da rimuovere perchè si deve usare il websocket
    }).then().catch(err => {
      console.log(err);
      this.error = true;
    });
  }

}
