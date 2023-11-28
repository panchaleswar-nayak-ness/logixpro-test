import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WpCustomAppsComponent } from './wp-custom-apps.component';

describe('WpCustomAppsComponent', () => {
  let component: WpCustomAppsComponent;
  let fixture: ComponentFixture<WpCustomAppsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WpCustomAppsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WpCustomAppsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
