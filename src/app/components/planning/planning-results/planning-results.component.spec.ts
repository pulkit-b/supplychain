import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningResultsComponent } from './planning-results.component';

describe('PlanningResultsComponent', () => {
  let component: PlanningResultsComponent;
  let fixture: ComponentFixture<PlanningResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanningResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanningResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
