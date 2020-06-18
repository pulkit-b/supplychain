import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InboundlogsComponent } from './inboundlogs.component';

describe('InboundlogsComponent', () => {
  let component: InboundlogsComponent;
  let fixture: ComponentFixture<InboundlogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InboundlogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InboundlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
