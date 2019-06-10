import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesStatisticsComponent } from './employees-statistics.component';

describe('WaiterStatisticsComponent', () => {
  let component: EmployeesStatisticsComponent;
  let fixture: ComponentFixture<EmployeesStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
