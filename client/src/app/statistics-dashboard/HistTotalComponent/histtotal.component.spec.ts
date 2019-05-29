import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistTotalComponent } from './histtotal.component';

describe('HistogramComponent', () => {
  let component: HistTotalComponent;
  let fixture: ComponentFixture<HistTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
