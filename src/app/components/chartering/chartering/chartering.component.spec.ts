import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharteringComponent } from './chartering.component';

describe('CharteringComponent', () => {
  let component: CharteringComponent;
  let fixture: ComponentFixture<CharteringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharteringComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharteringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
