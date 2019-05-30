import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistTotalCustomersComponent } from './hist-total-customers.component';

describe('HistTotalCustomersComponent', () => {
  let component: HistTotalCustomersComponent;
  let fixture: ComponentFixture<HistTotalCustomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistTotalCustomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistTotalCustomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
