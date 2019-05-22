import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablesViewComponent } from './tables-view.component';

describe('TablesComponent', () => {
  let component: TablesViewComponent;
  let fixture: ComponentFixture<TablesViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
