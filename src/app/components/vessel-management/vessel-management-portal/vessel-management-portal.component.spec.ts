import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VesselManagementPortalComponent } from './vessel-management-portal.component';

describe('VesselManagementPortalComponent', () => {
  let component: VesselManagementPortalComponent;
  let fixture: ComponentFixture<VesselManagementPortalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VesselManagementPortalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VesselManagementPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
