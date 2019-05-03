import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CookComponent } from './cook.component';

describe('CookComponent', () => {
  let component: CookComponent;
  let fixture: ComponentFixture<CookComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CookComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
