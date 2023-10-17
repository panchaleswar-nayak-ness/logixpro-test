import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableContextMenuComponentComponent } from './table-context-menu-component.component';

describe('TableContextMenuComponentComponent', () => {
  let component: TableContextMenuComponentComponent;
  let fixture: ComponentFixture<TableContextMenuComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TableContextMenuComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableContextMenuComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
