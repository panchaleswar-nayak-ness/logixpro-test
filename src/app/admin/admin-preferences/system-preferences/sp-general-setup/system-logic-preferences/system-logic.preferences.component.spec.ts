import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SystemLogicPreferencesComponent } from './system-logic-preferences.component';
import { GeneralSetup } from 'src/app/common/Model/preferences';

describe('SystemLogicPreferencesComponent', () => {
  let component: SystemLogicPreferencesComponent;
  let fixture: ComponentFixture<SystemLogicPreferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSlideToggleModule,
        NoopAnimationsModule
      ],
      declarations: [SystemLogicPreferencesComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemLogicPreferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind input systemLogicPref', () => {
    const mockPref: GeneralSetup = {
        nextToteID: 123,
        nextSerialNumber: 4556,
        pickType: 'Pick and Pass',
        fifoPickAcrossWarehouse: true,
        replenishDedicatedOnly: true,
        otTemptoOTPending: false,
        zeroLocationQuantityCheck: true,
        distinctKitOrders: false,
        printReplenPutLabels: true,
        generateQuarantineTransactions: false,
        shortPickFindNewLocation: true,
        companyName: '',
        address1: '',
        city: '',
        state: '',
        domainAuthentication: false,
        useNTLM: false,
        orderManifest: false,
        checkForValidTotes: false,
        pickLabelsOnePerQty: false,
        requestNumberofPutAwayLabels: false,
        carouselBatchID: false,
        bulkBatchID: false,
        dynamicReelTrackingCreateWIP: false,
        reelTrackingPickLogic: '',
        multiBatchCartSelection: false,
        confirmInventoryChanges: false,
        showTransQty: '',
        maxNumberOfPutAwayLabels: 0,
        orderSort: '',
        cartonFlowDisplay: '',
        autoDisplayImage: false,
        earlyBreakTime: '',
        earlyBreakDuration: 0,
        midBreakTime: '',
        midBreakDuration: 0,
        lateBreakTime: '',
        lateBreakDuration: 0,
        requireHotReasons:false
    };

    component.systemLogicPref = mockPref;
    fixture.detectChanges();

    expect(component.systemLogicPref).toEqual(mockPref);
  });

  it('should emit updated systemLogicPref on update', () => {
    spyOn(component.updatesystemLogicPref, 'emit');

    const mockPref: GeneralSetup = {
        nextToteID: 123,
        nextSerialNumber: 456,
        pickType: 'Pick and Pass',
        fifoPickAcrossWarehouse: true,
        replenishDedicatedOnly: true,
        otTemptoOTPending: false,
        zeroLocationQuantityCheck: true,
        distinctKitOrders: false,
        printReplenPutLabels: true,
        generateQuarantineTransactions: false,
        shortPickFindNewLocation: true,
        companyName: '',
        address1: '',
        city: '',
        state: '',
        domainAuthentication: false,
        useNTLM: false,
        orderManifest: false,
        checkForValidTotes: false,
        pickLabelsOnePerQty: false,
        requestNumberofPutAwayLabels: false,
        carouselBatchID: false,
        bulkBatchID: false,
        dynamicReelTrackingCreateWIP: false,
        reelTrackingPickLogic: '',
        multiBatchCartSelection: false,
        confirmInventoryChanges: false,
        showTransQty: '',
        maxNumberOfPutAwayLabels: 0,
        orderSort: '',
        cartonFlowDisplay: '',
        autoDisplayImage: false,
        earlyBreakTime: '',
        earlyBreakDuration: 0,
        midBreakTime: '',
        midBreakDuration: 0,
        lateBreakTime: '',
        lateBreakDuration: 0,
        requireHotReasons:false,
        allowQuickPicks:false,
        deafultQuickPicks:false,
        printReprocessReportAfterAllocation:false
    };

    component.systemLogicPref = mockPref;
    component.update();

    expect(component.updatesystemLogicPref.emit).toHaveBeenCalledWith(mockPref);
  });

  it('should update nextToteID and emit updated systemLogicPref on input change', async () => {
    spyOn(component, 'update').and.callThrough();
    spyOn(component.updatesystemLogicPref, 'emit');

    await fixture.whenStable(); // Ensure all async operations are complete

    // const inputElement = fixture.debugElement.query(By.css('input[ngModel="systemLogicPref.nextToteID"]')).nativeElement;
    
    // Query for the input element using a more general selector and ensure it exists
    const inputDebugElement = fixture.debugElement.query(By.css('input[matInput]'));
    expect(inputDebugElement).not.toBeNull();

    const inputElement = inputDebugElement.nativeElement;
    inputElement.value = 789;
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('change'));

    fixture.detectChanges();
    await fixture.whenStable(); // Ensure change detection completes

    expect(component.update).toHaveBeenCalled();
    expect(component.systemLogicPref.nextToteID).toBe(789);
    expect(component.updatesystemLogicPref.emit).toHaveBeenCalledWith(component.systemLogicPref);
  });

  // Add similar tests for other form fields...

  it('should render template correctly', () => {
    const compiled = fixture.nativeElement;
    const labels = compiled.querySelectorAll('mat-form-field mat-label');
    expect(labels[0].textContent).toContain('Next Tote ID');
    expect(labels[1].textContent).toContain('Next Serial Number');
    expect(labels[2].textContent).toContain('Pick Type');
    // Add more checks for other form fields...
  });
});
