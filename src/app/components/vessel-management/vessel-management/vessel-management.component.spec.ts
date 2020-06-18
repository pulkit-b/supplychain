import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselManagementComponent } from './vessel-management.component';

describe('VesselManagementComponent', () => {
  let component: VesselManagementComponent;
  let fixture: ComponentFixture<VesselManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VesselManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
