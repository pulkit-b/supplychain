import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortDashboardComponent } from './port-dashboard.component';

describe('PortDashboardComponent', () => {
  let component: PortDashboardComponent;
  let fixture: ComponentFixture<PortDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
