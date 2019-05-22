import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersServedComponent } from './orders-served.component';

describe('OrdersServedComponent', () => {
  let component: OrdersServedComponent;
  let fixture: ComponentFixture<OrdersServedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersServedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersServedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
