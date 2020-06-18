import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartCharteringComponent } from './chart-chartering.component';

describe('ChartCharteringComponent', () => {
  let component: ChartCharteringComponent;
  let fixture: ComponentFixture<ChartCharteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartCharteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartCharteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
