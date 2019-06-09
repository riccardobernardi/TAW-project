import { Component, OnInit } from '@angular/core';
import { TicketHttpService } from 'src/app/services/ticket-http.service';
import { Report } from "../../../interfaces/Report";
import { ToastrService } from 'ngx-toastr';
import { HttpReportService } from "../../../services/http-report.service";

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

  constructor(private ticket: TicketHttpService, private toastr: ToastrService, private report: HttpReportService) { }

  private showError(err) {
    let errmessage = (err.error) ? err.error.errormessage || err.error.message : err;
    this.toastr.error('Error: ' + errmessage, 'Failure!', {
      timeOut: 3000
    });
  }

  ngOnInit() {}

  changedRange($event, field) {
    //console.log($event);
    //console.log(field);
    //console.log(this.statistics[field]);
    if($event.min_date && $event.max_date) {
      this.report.get_reports({start: $event.min_date, end: $event.max_date}).toPromise().then((reports : Report[]) => {
        //console.log(reports);
        if(field == "total_orders") 
          this.statistics[field] = {data : [{data: reports.map((report) => report[field].dish), label: this.labels[field].dish}, {data: reports.map((report) => report[field].beverage), label: this.labels[field].beverage}], dates: reports.map((report) => report.date)}
        else 
          this.statistics[field] = {data : [{data: reports.map((report) => report[field]), label: this.labels[field]}], dates: reports.map((report) => report.date)}
        //console.log(this.statistics);
      }).catch((err) => {
        this.showError(err);
      })
    } else this.showError("No range selected!");
  }

}
