import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemNumberComponent } from 'src/app/admin/dialogs/item-number/item-number.component';


describe('ItemNumberComponent', () => {
  let component: ItemNumberComponent;
  let fixture: ComponentFixture<ItemNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItemNumberComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItemNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
