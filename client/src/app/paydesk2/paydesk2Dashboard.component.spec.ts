import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Paydesk2DashboardComponent } from './paydesk2Dashboard.component';

describe('WaiterComponent', () => {
  let component: Paydesk2DashboardComponent;
  let fixture: ComponentFixture<Paydesk2DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Paydesk2DashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Paydesk2DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
