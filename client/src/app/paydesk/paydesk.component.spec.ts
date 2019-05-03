import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaydeskComponent } from './paydesk.component';

describe('PaydeskComponent', () => {
  let component: PaydeskComponent;
  let fixture: ComponentFixture<PaydeskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaydeskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaydeskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
