import { Component, OnInit } from '@angular/core';
import { TicketHttpService } from 'src/app/ticket-http.service';
import { Report } from "../../Report";

@Component({
  selector: 'app-stats-charts',
  templateUrl: './stats-charts.component.html',
  styleUrls: ['./stats-charts.component.css']
})
export class StatsChartsComponent implements OnInit {

  private statistics = {
    total : {data: undefined, dates: undefined},
    total_customers : {data: undefined, dates: undefined},
    total_orders: {data: undefined, dates: undefined},
    average_stay : {data: undefined, dates: undefined}
  };

  private labels = {
    total: "Incasso totale per data in euro",
    total_customers : "Numero clienti per data in euro",
    total_orders: {
      dish: "Ordini totali di pietanze per data",
      beverage: "Ordini totali di bibite per data"
    },
    average_stay : "Tempo medio di accomodamento in minuti per data"
  }

  constructor(private ticket: TicketHttpService) { }

  ngOnInit() {
    console.log(new Date().toISOString())
    this.ticket.get_reports({start: new Date().toISOString(), end: new Date().toISOString()}).toPromise().then((reports : Report[]) => {
      console.log(reports);
      for (let f in this.statistics) {
        if(f == "total_orders") 
          this.statistics[f] = {data : [{data: [], label: this.labels[f].dish}, {data: [], label: this.labels[f].beverage}], dates: reports.map((report) => report.date)}
        else 
          this.statistics[f] = {data : [{data: [], label: this.labels[f]}], dates: []}
        /*if(f == "total_orders") {
          this.statistics[f] = {data : [{data: reports.map((report) => report[f].dish), label: this.labels[f].dish}, {data: reports.map((report) => report[f].beverage), label: this.labels[f].beverage}], dates: reports.map((report) => report.date)}
          console.log(this.statistics[f]);
        }  else 
          this.statistics[f] = {data : [{data: reports.map((report) => report[f]), label: this.labels[f]}], dates: reports.map((report) => report.date)}*/
      }
      console.log(this.statistics);
    })
    
  }

  changedRange($event, field) {
    console.log($event);
    console.log(field);
    console.log(this.statistics[field]);
    this.ticket.get_reports({start: $event.min_date, end: $event.max_date}).toPromise().then((reports : Report[]) => {
      console.log(reports);
      if(field == "total_orders") 
        this.statistics[field] = {data : [{data: reports.map((report) => report[field].dish), label: this.labels[field].dish}, {data: reports.map((report) => report[field].beverage), label: this.labels[field].beverage}], dates: reports.map((report) => report.date)}
      else 
        this.statistics[field] = {data : [{data: reports.map((report) => report[field]), label: this.labels[field]}], dates: reports.map((report) => report.date)}
      console.log(this.statistics);
    })
  }

}
