import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IeSsCheckForDuplicatesComponent } from './ie-ss-check-for-duplicates.component';

describe('IeSsCheckForDuplicatesComponent', () => {
  let component: IeSsCheckForDuplicatesComponent;
  let fixture: ComponentFixture<IeSsCheckForDuplicatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IeSsCheckForDuplicatesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IeSsCheckForDuplicatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
