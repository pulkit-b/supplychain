import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PortActivitiesComponent } from './port-activities.component';

describe('PortActivitiesComponent', () => {
  let component: PortActivitiesComponent;
  let fixture: ComponentFixture<PortActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PortActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PortActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
