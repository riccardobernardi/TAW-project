import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterInsertOrdersComponent } from './waiter-insert-orders.component';

describe('WaiterInsertOrdersComponent', () => {
  let component: WaiterInsertOrdersComponent;
  let fixture: ComponentFixture<WaiterInsertOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterInsertOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterInsertOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
