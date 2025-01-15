import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageContainerManagementComponent } from './storage-container-management.component';

describe('StorageContainerManagementComponent', () => {
  let component: StorageContainerManagementComponent;
  let fixture: ComponentFixture<StorageContainerManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StorageContainerManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorageContainerManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
