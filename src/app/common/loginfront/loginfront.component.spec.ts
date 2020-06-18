import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginfrontComponent } from './loginfront.component';

describe('LoginfrontComponent', () => {
  let component: LoginfrontComponent;
  let fixture: ComponentFixture<LoginfrontComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginfrontComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginfrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
