import { Component, OnInit } from '@angular/core';
import { TicketHttpService } from '../../ticket-http.service';
import { Ticket } from "../../Ticket";
import { Report } from "../../Report";

@Component({
  selector: 'app-histogram',
  templateUrl: './histtotal.component.html',
  styleUrls: ['./histtotal.component.css']
})
export class HistTotalComponent implements OnInit {

  private reports : Report[] = []
  private barChartLabels = null;
  private barChartType = "bar";
  private barChartLegend = true;
  private barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  private barChartData = null

  constructor(private ticket: TicketHttpService) {}


  ngOnInit() {
    this.getReports();
  }

  createChart() {
    this.barChartLabels = this.reports.map((report) => {
      console.log(report);
      let date = new Date(report.date);
      return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
    });
    this.barChartData = [{data: this.reports.map((report) => report.total), label: "Incasso totale per data in euro"}];
  }

  getReports() {
    this.ticket.get_reports({}).toPromise().then((data : Report[]) => {
      data.forEach((report) => this.reports.push(report));
      this.reports.sort((r1, r2) => (new Date(r1.date) > new Date(r2.date)) ? 1 : -1)
      console.log(this.reports);
      this.createChart();
    }).catch((err) => console.log(err));
  }

}
