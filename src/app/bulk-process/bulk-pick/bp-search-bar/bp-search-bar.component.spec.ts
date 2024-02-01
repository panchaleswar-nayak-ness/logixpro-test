import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpSearchBarComponent } from './bp-search-bar.component';

describe('BpSearchBarComponent', () => {
  let component: BpSearchBarComponent;
  let fixture: ComponentFixture<BpSearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpSearchBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BpSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
