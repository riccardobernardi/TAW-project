import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import {NgbDate} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-histogram-with-dates',
  templateUrl: './histogram-with-dates.component.html',
  styleUrls: ['./histogram-with-dates.component.css']
})
export class HistogramWithDatesComponent implements OnInit {

  @Output() dateRange = new EventEmitter();

  @Input() barChartData = null;
  @Input() barChartDates = null;

  public barChartLabels = null;

  private min_date : Date;
  private max_date : Date;
  private startDate = new Date();

  private barChartType = "bar";
  private barChartLegend = true;
  private barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  constructor() {}

  ngOnInit() { }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
   
    if(changes["barChartDates"].currentValue)
      this.barChartLabels = this.createLabels(changes["barChartDates"].currentValue);
  }

  onMinDateSelect($event : NgbDate) {
    this.min_date = new Date($event.year, $event.month - 1, $event.day, 0, 0, 0, 0);
  }

  onMaxDateSelect($event : NgbDate) {
    this.max_date = new Date($event.year, $event.month - 1, $event.day, 0, 0, 0, 0);
  }

  update() {
    this.dateRange.emit({min_date: this.min_date, max_date: this.max_date});
  }

  createLabels(data) {
    return data.map((date) => {
      console.log(date);
      date = new Date(date);
      return date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
    });
  }

}
