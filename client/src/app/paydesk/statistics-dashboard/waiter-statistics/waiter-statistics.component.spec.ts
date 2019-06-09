import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterStatisticsComponent } from './waiter-statistics.component';

describe('WaiterStatisticsComponent', () => {
  let component: WaiterStatisticsComponent;
  let fixture: ComponentFixture<WaiterStatisticsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterStatisticsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
