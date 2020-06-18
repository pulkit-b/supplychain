import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcurementInputHssComponent } from './procurement-input-hss.component';

describe('ProcurementInputHssComponent', () => {
  let component: ProcurementInputHssComponent;
  let fixture: ComponentFixture<ProcurementInputHssComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProcurementInputHssComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcurementInputHssComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
