import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementDashboardComponent } from './procurement-dashboard.component';

describe('ProcurementDashboardComponent', () => {
  let component: ProcurementDashboardComponent;
  let fixture: ComponentFixture<ProcurementDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcurementDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
