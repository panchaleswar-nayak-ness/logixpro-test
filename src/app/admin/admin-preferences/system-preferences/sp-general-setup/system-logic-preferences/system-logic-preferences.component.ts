import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneralSetup } from 'src/app/common/Model/preferences';

@Component({
  selector: 'app-system-logic-preferences',
  templateUrl: './system-logic-preferences.component.html',
  styleUrls: []
})
export class SystemLogicPreferencesComponent { 

  // Constant string for comparison to avoid hardcoded literals everywhere
  parallelPickType: string = 'Parallel Pick';

  // Input model representing the system logic preferences
  @Input() systemLogicPref: GeneralSetup = {
    nextToteID: 0,
    nextSerialNumber: 0,
    pickType: '',
    fifoPickAcrossWarehouse: false,
    replenishDedicatedOnly: false,
    otTemptoOTPending: false,
    zeroLocationQuantityCheck: false,
    distinctKitOrders: false,
    printReplenPutLabels: false,
    generateQuarantineTransactions: false,
    shortPickFindNewLocation: false,
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
    requireHotReasons: false,
    allowQuickPicks: false,
    deafultQuickPicks: false,
    printReprocessReportAfterAllocation: false
  };

  // Output event to notify parent component of changes
  @Output() updatesystemLogicPref = new EventEmitter<GeneralSetup>();

  /**
   * Called on any change to input fields or toggles
   * Ensures dependent values are set properly before emitting changes
   */
  update() { 
    this.checkIsBulkBatchDisabled(); // Handle logic to disable/reset bulkBatchID based on pickType
    this.checkIsCarouselBatchDisabled(); // Handle logic to disable/reset carouselBatchID based on pickType
    this.updatesystemLogicPref.emit(this.systemLogicPref);    
  }

  /**
   * Forces bulkBatchID to false when pickType is 'Parallel Pick'
   * Used to prevent enabling this setting under conflicting conditions
   */
  checkIsBulkBatchDisabled() {
    if (this.systemLogicPref.pickType === this.parallelPickType) {
      this.systemLogicPref.bulkBatchID = false; // Force disable the value
    }
  }

  checkIsCarouselBatchDisabled() {
    if (this.systemLogicPref.pickType === this.parallelPickType) {
      this.systemLogicPref.carouselBatchID = false; // Force disable the value
    }
  }

  /**
   * Returns true if 'Parallel Pick' is selected, indicating
   * that the Maintain Bulk Batch ID toggle should be disabled
   */
  get isBulkBatchDisabled(): boolean {
    return this.systemLogicPref.pickType === this.parallelPickType;
  }

   /**
   * Returns true if 'Parallel Pick' is selected, indicating
   * that the Maintain Carousel Batch ID toggle should be disabled
   */
  get isCarouselBatchDisabled(): boolean {
    return this.systemLogicPref.pickType === this.parallelPickType;
  }
}
