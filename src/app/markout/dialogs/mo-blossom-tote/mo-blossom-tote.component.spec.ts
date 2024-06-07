import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoBlossomToteComponent } from './mo-blossom-tote.component';

describe('MoBlossomToteComponent', () => {
  let component: MoBlossomToteComponent;
  let fixture: ComponentFixture<MoBlossomToteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MoBlossomToteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoBlossomToteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
