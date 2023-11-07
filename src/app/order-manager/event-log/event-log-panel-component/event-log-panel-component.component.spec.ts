import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventLogPanelComponentComponent } from './event-log-panel-component.component';

describe('EventLogPanelComponentComponent', () => {
  let component: EventLogPanelComponentComponent;
  let fixture: ComponentFixture<EventLogPanelComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventLogPanelComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventLogPanelComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
