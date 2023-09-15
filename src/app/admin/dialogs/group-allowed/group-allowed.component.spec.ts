import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddGroupAllowedComponent } from '../add-group-allowed/add-group-allowed.component';


describe('AddGroupAllowedComponent', () => {
  let component: AddGroupAllowedComponent;
  let fixture: ComponentFixture<AddGroupAllowedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGroupAllowedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGroupAllowedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
