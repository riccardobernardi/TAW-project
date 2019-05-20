import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterServedComponent } from './waiter-served.component';

describe('WaiterServedComponent', () => {
  let component: WaiterServedComponent;
  let fixture: ComponentFixture<WaiterServedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterServedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterServedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
