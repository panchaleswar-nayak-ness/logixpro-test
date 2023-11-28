import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpSortBarSetupComponent } from './wp-sort-bar-setup.component';

describe('WpSortBarSetupComponent', () => {
  let component: WpSortBarSetupComponent;
  let fixture: ComponentFixture<WpSortBarSetupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WpSortBarSetupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WpSortBarSetupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
