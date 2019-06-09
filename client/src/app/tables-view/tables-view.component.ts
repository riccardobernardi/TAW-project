import { Component, OnInit, Input } from '@angular/core';
import { TableHttpService } from 'src/app/services/table-http.service';
import { UserHttpService } from 'src/app/services/user-http.service';
import { TicketHttpService } from '../services/ticket-http.service';
import { Ticket } from 'src/app/interfaces/Ticket';
import { Table, states } from '../interfaces/Table';
import { SocketioService } from '../services/socketio.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-tables-view',
  templateUrl: './tables-view.component.html',
  styleUrls: ['./tables-view.component.css']
})
export class TablesViewComponent implements OnInit {

  private tables: Table[];
  private states = states;
  private error = false;
  private role

  constructor(private toastr: ToastrService, private table: TableHttpService, private user: UserHttpService, private ticket: TicketHttpService, private socketio: SocketioService) {
    this.get_tables()
    this.socketio.get().on('waiters', () => { 
      console.log("Waiters view evento ricevuto");
      this.get_tables() ;
    });
    this.role = this.user.get_role();
    //console.log(this.role);
  }

  ngOnInit() {}

  public get_tables() {
    this.table.get_tables().toPromise().then((tables: Table[]) => {
      this.tables = tables;
      tables.sort((table1 : Table, table2 : Table) => {
        return table1.number - table2.number;
      });
      var component = this;
      tables.forEach((table: Table) => {
        if(table.associated_ticket)
          component.ticket.get_ticket(table.associated_ticket).subscribe((ticket : Ticket) => {
            table.actual_people = ticket.people_number;
          }, (err) => {
            this.error = true;
          });
      });
    }).catch((err) => {
      this.error = true;
      //console.log(err);
    });
  }

  public open_ticket(tableToChange: Table, people_number: number, spinner: HTMLElement, button: HTMLButtonElement) {
    console.log(event)
  
    //console.log(people_number);
    if(people_number > 0 && people_number <= tableToChange.max_people) {
      spinner.hidden = false;
      button.disabled = true;
      this.ticket.open_ticket(this.user.get_nick(), tableToChange.number, people_number).toPromise().then((data: Ticket) => {
        //console.log(data);
        const table = Object.assign({}, tableToChange);
        table.state = states[1];
        //console.log(table.state);
        return this.table.change_table(table, data._id).toPromise();
        // update del tavolo da rimuovere perchè si deve usare il websocket
      }).then(() => {
        spinner.hidden = true;
      }).catch(err => {
        //console.log(err);
        this.error = true;
      });
    } else {
      this.toastr.error('People Number has to be smaller than max number supported!', 'Failure!', {
        timeOut: 3000
      });
      spinner.hidden = true;
      button.disabled = false;
    }
  }

}
