import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundDashboardComponent } from './inbound-dashboard.component';

describe('InboundDashboardComponent', () => {
  let component: InboundDashboardComponent;
  let fixture: ComponentFixture<InboundDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
