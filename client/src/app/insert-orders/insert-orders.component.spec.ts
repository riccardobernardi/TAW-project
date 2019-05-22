import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertOrdersComponent } from './insert-orders.component';

describe('InsertOrdersComponent', () => {
  let component: InsertOrdersComponent;
  let fixture: ComponentFixture<InsertOrdersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertOrdersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsertOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
