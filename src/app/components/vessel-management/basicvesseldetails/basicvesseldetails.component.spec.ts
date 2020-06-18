import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicvesseldetailsComponent } from './basicvesseldetails.component';

describe('BasicvesseldetailsComponent', () => {
  let component: BasicvesseldetailsComponent;
  let fixture: ComponentFixture<BasicvesseldetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicvesseldetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicvesseldetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
