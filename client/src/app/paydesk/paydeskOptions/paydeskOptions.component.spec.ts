import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaydeskOptionsComponent } from './paydeskOptions.component';

describe('PaydeskComponent', () => {
  let component: PaydeskOptionsComponent;
  let fixture: ComponentFixture<PaydeskOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaydeskOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaydeskOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
