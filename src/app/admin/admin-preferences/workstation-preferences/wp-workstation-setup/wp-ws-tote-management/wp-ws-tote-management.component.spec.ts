import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpWsToteManagementComponent } from './wp-ws-tote-management.component';

describe('WpWsToteManagementComponent', () => {
  let component: WpWsToteManagementComponent;
  let fixture: ComponentFixture<WpWsToteManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WpWsToteManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WpWsToteManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
