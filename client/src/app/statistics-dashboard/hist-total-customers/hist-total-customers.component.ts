import { Component, OnInit } from '@angular/core';
import { TicketHttpService } from "../../ticket-http.service";
import { Report } from "../../Report";

@Component({
  selector: 'app-hist-total-customers',
  templateUrl: './hist-total-customers.component.html',
  styleUrls: ['./hist-total-customers.component.css']
})

export class HistTotalCustomersComponent implements OnInit {

  private reports : Report[] = []
  private barChartLabels;
  private barChartType = "bar";
  private barChartLegend = true;
  private barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  private barChartData = []

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
    this.barChartData = [{data: this.reports.map((report) => report.total_customers), label: "Numero clienti per data in euro"}];
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
