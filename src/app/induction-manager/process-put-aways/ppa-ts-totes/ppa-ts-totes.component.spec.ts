import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PpaTsTotesComponent } from './ppa-ts-totes.component';

describe('PpaTsTotesComponent', () => {
  let component: PpaTsTotesComponent;
  let fixture: ComponentFixture<PpaTsTotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PpaTsTotesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PpaTsTotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
