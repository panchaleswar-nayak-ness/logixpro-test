import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessPickTotesComponent } from './process-pick-totes.component';

describe('ProcessPickTotesComponent', () => {
  let component: ProcessPickTotesComponent;
  let fixture: ComponentFixture<ProcessPickTotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessPickTotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessPickTotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
