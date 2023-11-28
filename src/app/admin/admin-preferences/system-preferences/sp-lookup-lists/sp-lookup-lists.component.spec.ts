import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpLookupListsComponent } from './sp-lookup-lists.component';

describe('SpLookupListsComponent', () => {
  let component: SpLookupListsComponent;
  let fixture: ComponentFixture<SpLookupListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpLookupListsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpLookupListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
