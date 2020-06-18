import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CharteringDatadisplayComponent } from './chartering-datadisplay.component';

describe('CharteringDatadisplayComponent', () => {
  let component: CharteringDatadisplayComponent;
  let fixture: ComponentFixture<CharteringDatadisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CharteringDatadisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CharteringDatadisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
