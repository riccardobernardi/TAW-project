import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaydeskDashboardComponent } from './paydeskDashboard.component';

describe('WaiterComponent', () => {
  let component: PaydeskDashboardComponent;
  let fixture: ComponentFixture<PaydeskDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaydeskDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaydeskDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
