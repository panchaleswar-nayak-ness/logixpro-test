import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkoutMainModuleComponent } from './markout-main-module.component';

describe('MarkoutMainModuleComponent', () => {
  let component: MarkoutMainModuleComponent;
  let fixture: ComponentFixture<MarkoutMainModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarkoutMainModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarkoutMainModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
