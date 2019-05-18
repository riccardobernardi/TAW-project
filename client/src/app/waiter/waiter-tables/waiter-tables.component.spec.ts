import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiterTablesComponent } from './waiter-tables.component';

describe('WaiterTablesComponent', () => {
  let component: WaiterTablesComponent;
  let fixture: ComponentFixture<WaiterTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiterTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiterTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
