import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessPickBatchesComponent } from './process-pick-batches.component';

describe('ProcessPickBatchesComponent', () => {
  let component: ProcessPickBatchesComponent;
  let fixture: ComponentFixture<ProcessPickBatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessPickBatchesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProcessPickBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
