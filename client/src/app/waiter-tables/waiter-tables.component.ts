import { Component, OnInit } from '@angular/core';
import { Table } from '../Table';
import { TableHttpService } from 'src/app/table-http.service';
import { UserHttpService } from 'src/app/user-http.service';
import { TicketHttpService } from '../ticket-http.service';
import { Ticket } from 'src/app/Ticket';

@Component({
  selector: 'app-waiter-tables',
  templateUrl: './waiter-tables.component.html',
  styleUrls: ['./waiter-tables.component.css']
})
export class WaiterTablesComponent implements OnInit {

  private tables: Table[] = [];

  constructor(private table: TableHttpService, private user: UserHttpService, private ticket: TicketHttpService) { }

  ngOnInit() {
    this.table.get_tables().toPromise().then((data : Table[]) => {
      this.tables = data;
      console.log(this.tables[0].state);
    }).catch((err) => {
      console.log(err);
    });
  }

  open_ticket(tableToChange: Table) {
    this.ticket.open_ticket(this.user.get_nick(), tableToChange.num).toPromise().then((data : Ticket) => {
      tableToChange.state = data._id;
      return this.table.change_table(tableToChange);
      // update del tavolo da rimuovere perchè si deve usare il websocket
    }).then().catch(err => {
      console.log(err);
    });
  }

}
