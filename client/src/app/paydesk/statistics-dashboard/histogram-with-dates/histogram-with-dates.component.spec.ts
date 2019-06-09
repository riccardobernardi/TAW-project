import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramWithDatesComponent } from './histogram-with-dates.component';

describe('HistogramWithDatesComponent', () => {
  let component: HistogramWithDatesComponent;
  let fixture: ComponentFixture<HistogramWithDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistogramWithDatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramWithDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
