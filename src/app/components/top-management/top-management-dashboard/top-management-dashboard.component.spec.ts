import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopManagementDashboardComponent } from './top-management-dashboard.component';

describe('TopManagementDashboardComponent', () => {
  let component: TopManagementDashboardComponent;
  let fixture: ComponentFixture<TopManagementDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopManagementDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopManagementDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
