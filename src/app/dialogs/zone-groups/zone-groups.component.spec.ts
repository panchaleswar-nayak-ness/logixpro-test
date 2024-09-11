import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneGroupsComponent } from './zone-groups.component';

describe('ZoneGroupsComponent', () => {
  let component: ZoneGroupsComponent;
  let fixture: ComponentFixture<ZoneGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneGroupsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
