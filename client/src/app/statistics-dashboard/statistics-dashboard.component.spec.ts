import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsDashboardComponent } from './statistics-dashboard.component';

describe('StatisticsDashboardComponent', () => {
  let component: StatisticsDashboardComponent;
  let fixture: ComponentFixture<StatisticsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
