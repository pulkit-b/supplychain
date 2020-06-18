import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharteringDashboardComponent } from './chartering-dashboard.component';

describe('CharteringDashboardComponent', () => {
  let component: CharteringDashboardComponent;
  let fixture: ComponentFixture<CharteringDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharteringDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharteringDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
