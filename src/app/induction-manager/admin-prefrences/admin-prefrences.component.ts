import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service'; 
import labels from '../../labels/labels.json';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-admin-prefrences',
  templateUrl: './admin-prefrences.component.html',
  styleUrls: ['./admin-prefrences.component.scss'],
})
export class AdminPrefrencesComponent implements OnInit {

  @ViewChild('myInput') myInput: ElementRef<HTMLInputElement>;
  @ViewChild('maxNumber') maxNumber: ElementRef<HTMLInputElement>;
  
  public userData: any;
  preferencesForm: FormGroup;
  trackIndIsDisable = false;
  shortMethodList: any = [
    {
      id: 'Complete Short',
      name: 'Complete Short',
    },
    {
      id: 'Send to Markout',
      name: 'Send to Markout',
    },
    {
      id: 'Split and Deallocate',
      name: 'Split and Deallocate',
    },
  ];

  stripSideList: any = [
    {
      id: 'Left',
      name: 'Left',
    },
    {
      id: 'Right',
      name: 'Right',
    },
  ];

  pickOrderSortList: any = [
    {
      id: 'Order Number Sequence',
      name: 'Order Number Sequence',
    },
    {
      id: 'Import Date and Order Number',
      name: 'Import Date and Order Number',
    },
    {
      id: 'Import Date and Priority',
      name: 'Import Date and Priority',
    },
    {
      id: 'Import File Sequence',
      name: 'Import File Sequence',
    },
    {
      id: 'Priority and Import Date',
      name: 'Priority and Import Date',
    },
    {
      id: 'Required Date and Priority',
      name: 'Required Date and Priority',
    },
  ];

  defaultPutAwayScanTypeList: any = [
    {
      id: 'Any',
      name: 'Any',
    },
    {
      id: 'Item Number',
      name: 'Item Number',
    },
    {
      id: 'Serial Number',
      name: 'Serial Number',
    },
    {
      id: 'Lot Number',
      name: 'Lot Number',
    },
    {
      id: 'Host Transaction ID',
      name: 'Host Transaction ID',
    },
    {
      id: 'Scan Code',
      name: 'Scan Code',
    },
    {
      id: 'Supplier Item ID',
      name: 'Supplier Item ID',
    },
  ];

  putAwayInductionScreenList: any = [
    {
      id: 'Unlimited Positions',
      name: 'Unlimited Positions',
    },
    {
      id: '20 Tote Matrix',
      name: '20 Tote Matrix',
    },
  ];

  superBatchFilterList: any;

  constructor(
    private authService: AuthService,
    private Api: ApiFuntions,
    public formBuilder: FormBuilder,
    private toast: ToastrService,
    private global:GlobalService
  ) {
    this.preferencesForm = this.formBuilder.group({
      // System Settings
      useDefault: new FormControl('', Validators.compose([])),
      pickBatchQuantity: new FormControl(0, Validators.compose([])),
      defaultCells: new FormControl(0, Validators.compose([])),
      shortMethod: new FormControl('', Validators.compose([])),
      selectIfOne: new FormControl(false, Validators.compose([])),
      validateTotes: new FormControl(false, Validators.compose([])),
      autoForwardReplenish: new FormControl(false, Validators.compose([])),
      createItemMaster: new FormControl(false, Validators.compose([])),
      sapLocationTransactions: new FormControl(false, Validators.compose([])),
      stripScan: new FormControl(false, Validators.compose([])),
      stripSide: new FormControl('', Validators.compose([])),
      stripNumber: new FormControl(0, Validators.compose([])),

      // Pick Settings
      autoPickOrderSelection: new FormControl(false, Validators.compose([])),
      autoPickToteID: new FormControl(false, Validators.compose([])),
      carouselToteIDPicks: new FormControl(false, Validators.compose([])),
      offCarouselToteIDPicks: new FormControl(false, Validators.compose([])),
      usePickBatchManager: new FormControl(false, Validators.compose([])),
      carouselBatchIDPicks: new FormControl(false, Validators.compose([])),
      offCarouselBatchIDPicks: new FormControl(false, Validators.compose([])),
      orderSort: new FormControl('', Validators.compose([])),
      useInZonePickScreen: new FormControl(false, Validators.compose([])),
      autoPrintCaseLabel: new FormControl(false, Validators.compose([])),

      // Put Away Settings
      autoPutAwayToteID: new FormControl(false, Validators.compose([])),
      splitShortPutAway: new FormControl(false, Validators.compose([])),
      carouselBatchIDPutAways: new FormControl(false, Validators.compose([])),
      offCarouselBatchIDAways: new FormControl(false, Validators.compose([])),
      createPutAwayAdjustments: new FormControl(false, Validators.compose([])),
      defaultPutAwayScanType: new FormControl('', Validators.compose([])),
      defaultPutAwayPriority: new FormControl(0, Validators.compose([])),
      defaultPutAwayQuantity: new FormControl(0, Validators.compose([])),
      putAwayInductionScreen: new FormControl('', Validators.compose([])),

      // Print Settings
      autoPrintCrossDockLabel: new FormControl(false, Validators.compose([])),
      autoPrintPickLabels: new FormControl(false, Validators.compose([])),
      pickLabelsOnePerQty: new FormControl(false, Validators.compose([])),
      autoPrintPickToteLabels: new FormControl(false, Validators.compose([])),
      autoPrintPutAwayToteLabels: new FormControl(
        false,
        Validators.compose([])
      ),
      autoPrintOffCarouselPickList: new FormControl(
        false,
        Validators.compose([])
      ),
      autoPrintOffCarouselPutAwayList: new FormControl(
        false,
        Validators.compose([])
      ),
      autoPrintPutAwayLabels: new FormControl(false, Validators.compose([])),
      requestNumberOfPutAwayLabels: new FormControl(
        false,
        Validators.compose([])
      ),
      autoPrintPickBatchList: new FormControl(false, Validators.compose([])),
      printDirectly: new FormControl(false, Validators.compose([])),
      maxNumberOfPutAwayLabels: new FormControl(0, Validators.compose([])),

      // Misc Setup
      trackInductionLocation: new FormControl(false, Validators.compose([])),
      stageUsingBulk: new FormControl(false, Validators.compose([])),
      confirmSuperBatch: new FormControl(false, Validators.compose([])),

      inductionLocation: new FormControl('', Validators.compose([])),
      stageVelocityCode: new FormControl('', Validators.compose([])),
      defaultSuperBatchSize: new FormControl('', Validators.compose([])),
      superBatchFilter: new FormControl('', Validators.compose([])),
      // Reel tracking
      userField1: new FormControl('', Validators.compose([])),
      userField2: new FormControl('', Validators.compose([])),
      userField3: new FormControl('', Validators.compose([])),
      userField4: new FormControl('', Validators.compose([])),
      userField5: new FormControl('', Validators.compose([])),
      userField6: new FormControl('', Validators.compose([])),
      userField7: new FormControl('', Validators.compose([])),
      userField8: new FormControl('', Validators.compose([])),
      userField9: new FormControl('', Validators.compose([])),
      userField10: new FormControl('', Validators.compose([])),
      orderNoPrefix: new FormControl('', Validators.compose([])),
    });
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getPreferences();
  }

  getPreferences() {
    try {
      var payload = { wsid: this.userData.wsid };
      this.Api
        .PreferenceIndex()
        .subscribe(
          (res: any) => {
            if (res.data && res.isExecuted) {
              const values = res.data.imPreference;
              const reelVal = res.data.rtUserFieldData[0];
              if (values.superBatchByToteID) {
                this.superBatchFilterList = [
                  { id: 1, name: 'Tote ID' },
                  { id: 0, name: 'Order Number' },
                ];
                this.preferencesForm.get('superBatchFilter')?.setValue('1');
              } else {
                this.superBatchFilterList = [
                  { id: 0, name: 'Order Number' },
                  { id: 1, name: 'Tote ID' },
                ];
                this.preferencesForm.get('superBatchFilter')?.setValue('0');
              }
              if (!values.trackInductionTransactions) {
                this.preferencesForm.get('inductionLocation')?.disable();
                this.trackIndIsDisable = true;
              }

              this.preferencesForm.patchValue({
                // System Settings
                useDefault: values.useDefaultFilter ? 'filter' : 'zone',
                pickBatchQuantity: values.pickBatchQuantity,
                defaultCells: values.defaultCells,
                shortMethod: values.shortMethod,
                selectIfOne: values.selectIfOne,
                validateTotes: values.validateTotes,
                autoForwardReplenish: values.autoForwardReplenish,
                createItemMaster: values.createItemMaster,
                sapLocationTransactions: values.sapLocationTransactions,
                stripScan: values.stripScan,
                stripSide: values.stripSide,
                stripNumber: values.stripNumber,

                // Pick Settings
                autoPickOrderSelection: values.autoPickOrderSelection,
                autoPickToteID: values.autoPickToteID,
                carouselToteIDPicks: values.carouselToteIDPicks,
                offCarouselToteIDPicks: values.offCarouselToteIDPicks,
                usePickBatchManager: values.usePickBatchManager,
                carouselBatchIDPicks: values.carouselBatchIDPicks,
                offCarouselBatchIDPicks: values.offCarouselBatchIDPicks,
                orderSort: values.orderSort,
                useInZonePickScreen: values.useInZonePickScreen,
                autoPrintCaseLabel: values.autoPrintCaseLabel,

                // Put Away Settings
                autoPutAwayToteID: values.autoPutAwayToteID,
                splitShortPutAway: values.splitShortPutAway,
                carouselBatchIDPutAways: values.carouselBatchIDPutAways,
                offCarouselBatchIDAways: values.offCarouselBatchIDAways,
                createPutAwayAdjustments: values.createPutAwayAdjustments,
                defaultPutAwayScanType: values.defaultPutAwayScanType,
                defaultPutAwayPriority: values.defaultPutAwayPriority,
                defaultPutAwayQuantity: values.defaultPutAwayQuantity,
                putAwayInductionScreen: values.putAwayInductionScreen,

                // Print Settings
                autoPrintCrossDockLabel: values.autoPrintCrossDockLabel,
                autoPrintPickLabels: values.autoPrintPickLabels,
                pickLabelsOnePerQty: values.pickLabelsOnePerQty,
                autoPrintPickToteLabels: values.autoPrintPickToteLabels,
                autoPrintPutAwayToteLabels: values.autoPrintPutAwayToteLabels,
                autoPrintOffCarouselPickList:
                  values.autoPrintOffCarouselPickList,
                autoPrintOffCarouselPutAwayList:
                  values.autoPrintOffCarouselPutAwayList,
                autoPrintPutAwayLabels: values.autoPrintPutAwayLabels,
                requestNumberOfPutAwayLabels:
                  values.requestNumberOfPutAwayLabels,
                autoPrintPickBatchList: values.autoPrintPickBatchList,
                printDirectly: values.printDirectly,
                maxNumberOfPutAwayLabels: values.maxNumberOfPutAwayLabels,

                //  MISC Setup

                trackInductionLocation: values.trackInductionTransactions,
                inductionLocation: values.inductionLocation,
                stageUsingBulk: values.stageUsingBulkPro,
                stageVelocityCode: values.stageVelocityCode,
                confirmSuperBatch: values.confirmSuperBatch,
                defaultSuperBatchSize:
                  values.defaultSuperBatchSize < 2
                    ? 2
                    : values.defaultSuperBatchSize,

                // Reel Tracking
                userField1: reelVal.userField1,
                userField2: reelVal.userField2,
                userField3: reelVal.userField3,
                userField4: reelVal.userField4,
                userField5: reelVal.userField5,
                userField6: reelVal.userField6,
                userField7: reelVal.userField7,
                userField8: reelVal.userField8,
                userField9: reelVal.userField9,
                userField10: reelVal.userField10,
                orderNoPrefix: reelVal.orderNumberPrefix,
              });
            } else {
              this.toast.error('Something went wrong', 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            }
          },
          (error) => {}
        );
    } catch (error) { 
    }
  }

  updatePreferences(type: any, event?) {
    try {
      const values = this.preferencesForm.value;
      let payLoad = {};
      let endPoint = '';

      if (type == 1) {
        payLoad = {
          AutoPickOrder: values.autoPickOrderSelection,
          OrderSort: values.orderSort,
          AutoPickTote: values.autoPickToteID,
          CarTotePicks: values.carouselToteIDPicks,
          OffCarTotePicks: values.offCarouselToteIDPicks,
          UsePickBatch: values.usePickBatchManager,
          UseDefFilter: values.useDefault == 'filter' ? true : false,
          UseDefZone: values.useDefault == 'zone' ? true : false,
          AutoPutTote: values.autoPutAwayToteID,
          DefPutPrior: values.defaultPutAwayPriority,
          DefPutQuant: values.defaultPutAwayQuantity,
          PickBatchQuant: values.pickBatchQuantity,
          DefCells: values.defaultCells,
          SplitShortPut: values.splitShortPutAway,
          SelIfOne: values.selectIfOne,
          PutInductScreen: values.putAwayInductionScreen,
          ValTote: values.validateTotes,
          CarBatchPicks: values.carouselBatchIDPicks,
          CarBatchPuts: values.carouselBatchIDPutAways,
          OffCarBatchPicks: values.offCarouselBatchIDPicks,
          OffCarBatchPuts: values.offCarouselBatchIDAways,
          AutoForReplen: values.autoForwardReplenish,
          CreateItemMast: values.createItemMaster,
          SAPLocTrans: values.sapLocationTransactions,
          CreatePutAdjusts: values.createPutAwayAdjustments,
          StripScan: values.stripScan,
          StripSide: values.stripSide,
          StripNum: values.stripNumber,
          PutScan: values.defaultPutAwayScanType,
          UseInZonePickScreen: values.useInZonePickScreen,
          AutoPrintCaseLabel: values.autoPrintCaseLabel,
          ShortMethod: values.shortMethod,
          WSID: this.userData.wsid,
        };

        endPoint = '/Induction/imsytemsettings';
      } else if (type == 2) {
        payLoad = {
          User1: values.userField1,
          User2: values.userField2,
          User3: values.userField3,
          User4: values.userField4,
          User5: values.userField5,
          User6: values.userField6,
          User7: values.userField7,
          User8: values.userField8,
          User9: values.userField9,
          User10: values.userField10,
          OrderNumPre: values.orderNoPrefix,
          WSID: this.userData.wsid,
        };
        endPoint = '/Induction/rtsuserdata';
      } else if (type == 3) {
        if (event && event.checked) {
          this.preferencesForm.get('inductionLocation')?.enable();
          this.trackIndIsDisable = false;
        } else if(event && !event.checked) {
          this.preferencesForm.get('inductionLocation')?.disable();
          this.trackIndIsDisable = true;
        }

        if(values.defaultSuperBatchSize<2){
          // this.preferencesForm.get('defaultSuperBatchSize')?.setValue(2);
          this.toast.error('Default Super Batch Size must be greater than 1', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
          return 
        }
        
        payLoad = {
          TrackInductTrans: values.trackInductionLocation,
          InductLoc: this.preferencesForm.get('inductionLocation')?.value,
          StageBulkPro: values.stageUsingBulk,
          StageVelCode: values.stageVelocityCode,
          DefaultSuperBatch: values.defaultSuperBatchSize,
          ConfirmSuperBatch: values.confirmSuperBatch,
          superBatchFilt: values.superBatchFilter === '1' ? true : false,
          WSID: this.userData.wsid,
        };
        endPoint = '/Induction/immiscsetup';
      } else {
        payLoad = {
          AutoPrintCross: values.autoPrintCrossDockLabel,
          AutoPrintPickLabs: values.autoPrintPickLabels,
          PickLabsOnePer: values.pickLabelsOnePerQty,
          AutoPrintPickToteLabs: values.autoPrintPickToteLabels,
          AutoPrintPutToteLabs: values.autoPrintPutAwayToteLabels,
          AutoPrintOffCarPickList: values.autoPrintOffCarouselPickList,
          AutoPrintOffCarPutList: values.autoPrintOffCarouselPutAwayList,
          AutoPrintPutLabs: values.autoPrintPutAwayLabels,
          ReqNumPutLabs: values.requestNumberOfPutAwayLabels,
          MaxNumPutLabs: values.maxNumberOfPutAwayLabels,
          PrintDirect: values.printDirectly,
          AutoPrintPickBatchList: values.autoPrintPickBatchList,
          WSID: this.userData.wsid,
        };

        endPoint = '/Induction/imprintsettings';
      }

      this.Api.DynamicMethod(payLoad, endPoint).subscribe(
        (res: any) => {
          if (res.data && res.isExecuted) {
            // if(endPoint == '/Induction/imprintsettings'){
              this.global.updateImPreferences()
            // }
            this.toast.success(labels.alert.update, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          } else {
            this.toast.error('Something went wrong', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        },
        (error) => {}
      );
    } catch (error) { 
    }
  }
  getCompName() {
    let payload = {
      WSID: this.userData.wsid,
    };
    this.Api.CompName().subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {

          this.preferencesForm.get('inductionLocation')?.setValue(res.data);
          this.updatePreferences(3);
          // this.preferencesForm.get('inductionLocation')?.enable();
          // this.trackIndIsDisable=false;
          this.toast.success(labels.alert.update, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        } else {
          this.toast.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (error) => {}
    );
  }
  checkDBQ() {
    if (this.preferencesForm.value.pickBatchQuantity >= 20) {
      this.preferencesForm.patchValue({
        putAwayInductionScreen: 'Unlimited Positions',
      });
    }
  }


  restrictTo10Digits(): void {
    const inputElement = this.myInput.nativeElement;
    let value = inputElement.value.replace(/\D/g, ''); // Remove non-digit characters
    if (parseInt(value) > 2147483647) {
      value = value.substr(0, 10);
    } else {
      value = value.substr(0, 10);
    }
    // if (value === '') {
    //   value = '0';
    // }
    inputElement.value = value;
  }

  restrictTo309Digits(event: KeyboardEvent): void {
    const inputElement = this.maxNumber.nativeElement;
    let value = inputElement.value.replace(/\D/g, ''); // Remove non-digit characters
    if (parseInt(value) > 2147483647) {
      value = value.substr(0, 309);
    } else {
      value = value.substr(0, 309);
    }
    // if (value === '') {
    //   value = '0';
    // }
    inputElement.value = value;
  }

}
