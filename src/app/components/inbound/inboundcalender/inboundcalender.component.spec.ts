import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundcalenderComponent } from './inboundcalender.component';

describe('InboundcalenderComponent', () => {
  let component: InboundcalenderComponent;
  let fixture: ComponentFixture<InboundcalenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundcalenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundcalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
