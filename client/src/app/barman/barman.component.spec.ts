import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarmanComponent } from './barman.component';

describe('BarmanComponent', () => {
  let component: BarmanComponent;
  let fixture: ComponentFixture<BarmanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarmanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarmanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
