import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GeneralSetup } from 'src/app/common/Model/preferences';
@Component({
  selector: 'app-system-logic-preferences',
  templateUrl: './system-logic-preferences.component.html',
  styleUrls: []
})
export class SystemLogicPreferencesComponent{ 
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
    requireHotReasons:false,
    allowQuickPicks:false,
    deafultQuickPicks:false,
    printReprocessReportAfterAllocation:false
  };
  @Output() updatesystemLogicPref = new EventEmitter<GeneralSetup>();

  update(){ 
    this.updatesystemLogicPref.emit(this.systemLogicPref);    
  }
}
