import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchSchedularComponent } from './dispatch-schedular.component';

describe('DispatchSchedularComponent', () => {
  let component: DispatchSchedularComponent;
  let fixture: ComponentFixture<DispatchSchedularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DispatchSchedularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchSchedularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
