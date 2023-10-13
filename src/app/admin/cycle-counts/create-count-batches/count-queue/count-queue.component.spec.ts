import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { CCBCountQueueComponent } from './count-queue.component';
import { AdminComponent } from 'src/app/admin/admin.component';
// import { AdminService } from 'src/app/admin/admin.service';
import { of } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ToastrModule } from 'ngx-toastr';

import { PageEvent } from '@angular/material/paginator';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';

describe('CCBCountQueueComponent', () => {
  let component: CCBCountQueueComponent;
  let fixture: ComponentFixture<CCBCountQueueComponent>;
  let liveAnnouncer: LiveAnnouncer;
  let global:GlobalService;
  let dialogRef: any;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CCBCountQueueComponent, DeleteConfirmationComponent],
      imports: [
        HttpClientTestingModule,
        OverlayModule,
        MatDialogModule,
        MatIconModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [
        // AdminService,
        PageEvent,
        LiveAnnouncer,
        ToastrService,
        MatDialog,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CCBCountQueueComponent);
    component = fixture.componentInstance;
    liveAnnouncer = TestBed.inject(LiveAnnouncer);
    fixture.detectChanges();
    dialog = TestBed.inject(MatDialog);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialog.open = jasmine.createSpy('open').and.returnValue(dialogRef);
  });

  // Component creation cases
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // getCount()  cases
  it('should emit count value when getCount is called', () => {
    const count = '5';
    const emitSpy = spyOn(component.countEvent, 'emit');

    component.getCount(count); //getCount is called

    expect(emitSpy).toHaveBeenCalledWith(count);
  });

  // handlePageEvent()  cases
  it('should set pagination values correctly when handlePageEvent is called', () => {
    const pageEvent: PageEvent = {
      pageIndex: 1,
      pageSize: 10,
      length: 100,
      previousPageIndex: 0,
    };

    component.handlePageEvent(pageEvent); // handlePageEvent is called

    expect(component.pageEvent).toEqual(pageEvent);
    expect(component.customPagination.startIndex).toEqual(
      pageEvent.pageSize * pageEvent.pageIndex
    );
    expect(component.customPagination.endIndex).toEqual(
      pageEvent.pageSize * pageEvent.pageIndex + pageEvent.pageSize
    );
    expect(component.customPagination.recordsPerPage).toEqual(
      pageEvent.pageSize
    );
  });

  it('should call getCountQue when event is set with invMapIDs property', () => {
    const event: any = { invMapIDs: [1, 2, 3] };
    const getCountQueSpy = spyOn(component, 'getCountQue');

    component.event = event;

    expect(getCountQueSpy).toHaveBeenCalled();
  });

  it('should not call getCountQue when event is undefined', () => {
    const getCountQueSpy = spyOn(component, 'getCountQue');
    const event: any = undefined;
    component.event = event;

    expect(getCountQueSpy).not.toHaveBeenCalled();
  });

  // getCountQue test cases
  it('should fetch data when API call is successful', () => {
    // arrange
    // const adminServiceSpy = spyOn(
    //   component.adminService,
    //   'get'
    // ).and.returnValue(
    //   of({
    //     isExecuted: true,
    //     data: {
    //       invCycleCount: [{}, {}],
    //       recordsTotal: 2,
    //       recordsFiltered: 2,
    //     },
    //   })
    // );
    const getCountSpy = spyOn(component, 'getCount');

    // act
    component.getCountQue();

    // assert
    // expect(adminServiceSpy).toHaveBeenCalledOnceWith(
    //   {
    //     userName: component.userData.userName,
    //     wsid: component.userData.wsid,
    //     draw: 1,
    //     sRow: component.customPagination.startIndex,
    //     eRow: component.customPagination.endIndex,
    //     sortColumnIndex: component.sortColumn.columnIndex,
    //     sortOrder: component.sortColumn.sortOrder,
    //   },
    //   '/Admin/GetCCQueue'
    // );
    expect(component.dataSource.data.length).toBe(2);
    expect(component.customPagination.total).toBe(2);
    expect(component.noData).toBeTrue();
    expect(getCountSpy).toHaveBeenCalledOnceWith(2);
  });

  it('should show no data message when response has no data', () => {
    // arrange
    // const adminServiceSpy = spyOn(
    //   component.adminService,
    //   'get'
    // ).and.returnValue(
    //   of({
    //     isExecuted: true,
    //     data: {
    //       invCycleCount: [],
    //       recordsTotal: 0,
    //       recordsFiltered: 0,
    //     },
    //   })
    // );

    // act
    component.getCountQue(); // getCountQue is called

    // assert
    // expect(adminServiceSpy).toHaveBeenCalledOnceWith(
    //   {
    //     userName: component.userData.userName,
    //     wsid: component.userData.wsid,
    //     draw: 1,
    //     sRow: component.customPagination.startIndex,
    //     eRow: component.customPagination.endIndex,
    //     sortColumnIndex: component.sortColumn.columnIndex,
    //     sortOrder: component.sortColumn.sortOrder,
    //   },
    //   '/Admin/GetCCQueue'
    // );
    expect(component.dataSource.data.length).toBe(0);
    expect(component.customPagination.total).toBe(0);
    expect(component.noData).toBeFalse();
  });

  // sorting cases

  it('should announce sorting direction when a sort direction is provided', () => {
    // call the function with a sort direction
    const sortState: any = { active: 'column1', direction: 'asc' };
    component.announceSortChange(sortState);

    // assert that the LiveAnnouncer was called with the correct message
    // expect(liveAnnouncer.announce).toHaveBeenCalledWith(
    //   'Sorted ascending',
    //   'polite'
    // );
  });
  it('should announce sorting cleared when no sort direction is provided', () => {
    // call the function without a sort direction
    const sortState: any = { active: 'column1', direction: '' };
    component.announceSortChange(sortState);

    // assert that the LiveAnnouncer was called with the correct message
    // expect(liveAnnouncer.announce).toHaveBeenCalledWith('Sorting', 'polite'
    // );
  });

  // deleteRow() cases
  it('should open the dialog and return the result', () => {
    const expectedResult: any = 'Yes';
    dialogRef.afterClosed.and.returnValue(of(expectedResult));

    component.deleteRow(1);

    expect(dialog.open).toHaveBeenCalledWith(DeleteConfirmationComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: '__non_existing_element__',
      data: {
        mode: 'delete-cycle-count',
      },
    });

    expect(dialogRef.afterClosed).toHaveBeenCalled();

    fixture.detectChanges(); // Wait for asynchronous operations to complete

    // expect(component.openPop()).toEqual(expectedResult);
  });

  it('should call deleteRow', () => {
    dialogRef.afterClosed.and.returnValue(of('yes')); // Mock the dialog.open method
    const rowId = 1;
    component.deleteRow(rowId);

    expect(dialog.open).toHaveBeenCalled();
    expect(dialogRef.afterClosed).toHaveBeenCalled();
  });

  it('should open the confirmation dialog and subscribe to afterClosed event and createCycleCount', () => {
    dialogRef.afterClosed.and.returnValue(of('yes'));

    expect(component.createCycleCount());
    expect(dialog.open).toHaveBeenCalledWith(ConfirmationDialogComponent, {
      height: 'auto',
      width: '786px',
      autoFocus: '__non_existing_element__',
      data: {
        message:
          'Would you like to create count transactions for these locations?',
        heading: 'Create Cycle Count',
      },
    });
    expect(component.dialog.open).toHaveBeenCalled();
  });

  it('should not create count transactions when dialog response is not "Yes"', () => {
    dialogRef.afterClosed.and.returnValue(of('no'));

    // spyOn(component.adminService, 'get');
    spyOn(component.toastr, 'success');
    spyOn(component.toastr, 'error');
    spyOn(component, 'getCountQue');
    spyOn(component, 'getCount');
    spyOn(component, 'ngOnInit');
    spyOn(component.insertEvent, 'emit');

    component.createCycleCount();

    // expect(component.adminService.get).not.toHaveBeenCalled();
    expect(component.toastr.success).not.toHaveBeenCalled();
    expect(component.toastr.error).not.toHaveBeenCalled();
    expect(component.getCountQue).not.toHaveBeenCalled();
    expect(component.getCount).not.toHaveBeenCalled();
    expect(component.ngOnInit).not.toHaveBeenCalled();
    expect(component.insertEvent.emit).not.toHaveBeenCalled();
  });

  it('should open delete confirmation dialog and perform delete operation when user selects "Yes"', fakeAsync(() => {
    // spyOn(dialog, 'open').and.returnValue({afterClosed: () => of('Yes')});
    dialogRef.afterClosed.and.returnValue(of('Yes'));
    // spyOn(component.adminService, 'get').and.returnValue(
    //   of({ isExecuted: true })
    // );

    spyOn(component.toastr, 'success');
    spyOn(component, 'getCount');
    spyOn(component, 'getCountQue');
    spyOn(component, 'ngOnInit');

    component.deleteCycleCount(null);
    tick();

    expect(component.dialog.open).toHaveBeenCalledWith(
      DeleteConfirmationComponent,
      {
        height: 'auto',
        width: '600px',
        autoFocus: '__non_existing_element__',
        data: {
          mode: 'delete-cycle-count',
          actionMessage: 'all records from the Queue',
          action: 'delete',
        },
      }
    );

    // expect(component.adminService.get).toHaveBeenCalledWith(
    //   {
    //     userName: component.userData.userName,
    //     wsid: component.userData.wsid,
    //     appName: 'Cycle Count',
    //   },
    //   '/Admin/RemoveccQueueAll'
    // );

    // expect(component.toastr.success).toHaveBeenCalledWith('Success!', 'Success!' );

    expect(component.getCount).toHaveBeenCalledWith(0);
    expect(component.getCountQue).toHaveBeenCalled();
    expect(component.ngOnInit).toHaveBeenCalled();
  }));
});
