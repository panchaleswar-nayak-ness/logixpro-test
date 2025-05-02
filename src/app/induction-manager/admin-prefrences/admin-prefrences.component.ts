import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/common/init/auth.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import {
  ApiEndpoints,
  ToasterMessages,
  ToasterTitle,
  ToasterType,
  superBatchFilterListName,
  Column,
  TableConstant,
  StringConditions,
  ColumnDef,
  DialogConstants,
  Style,
  Placeholders,
} from 'src/app/common/constants/strings.constants';
import { ZoneGroupsComponent } from 'src/app/dialogs/zone-groups/zone-groups.component';
import { ImprefInductionFilterComponent } from 'src/app/dialogs/impref-induction-filter/impref-induction-filter.component';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { PutAwayOption } from 'src/app/common/Model/preferences'; 

@Component({
  selector: 'app-admin-prefrences',
  templateUrl: './admin-prefrences.component.html',
  styleUrls: ['./admin-prefrences.component.scss'],
})
export class AdminPrefrencesComponent implements OnInit {
fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
ItemNumber: string = this.fieldMappings.itemNumber;
UserField1:string = this.fieldMappings.userField1;
UserField2:string = this.fieldMappings.userField2;
UserField3:string = this.fieldMappings.userField3;
UserField4:string = this.fieldMappings.userField4;
UserField5:string = this.fieldMappings.userField5;
UserField6:string = this.fieldMappings.userField6;
UserField7:string = this.fieldMappings.userField7;
UserField8:string = this.fieldMappings.userField8;
UserField9:string = this.fieldMappings.userField9;
UserField10:string = this.fieldMappings.userField10;
  placeholders = Placeholders;
  constructor(
    private authService: AuthService,
    public inductionManagerApi: InductionManagerApiService,
    public formBuilder: FormBuilder,
    private global: GlobalService
  ) {
    this.iInductionManagerApi = inductionManagerApi;
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
      dontAllowOverReceipt: new FormControl(false, Validators.compose([])),
      autoAssignAllZones: new FormControl(false, Validators.compose([])),
      purchaseOrderRequired: new FormControl(false, Validators.compose([])),
      defaultPutAwayShortQuantity: new FormControl('', Validators.compose([])),

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

      //Pick Tote Induction Settings
      excludeOrderInReprocess: new FormControl(false, Validators.compose([])),
      maximumQtyPerTote: new FormControl(0, Validators.compose([])),
      sbMaximumQtyPerTote: new FormControl(0, Validators.compose([])),
      defaultZoneGroup: new FormControl('', Validators.compose([])),
      pickToteSuppressInfoMessages: new FormControl(0, Validators.compose([])),
    });
  }

  @ViewChild('myInput') myInput: ElementRef<HTMLInputElement>;
  @ViewChild('maxNumber') maxNumber: ElementRef<HTMLInputElement>;

  preferencesForm: FormGroup;

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

  zoneGroupingsList: any = [];

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

  defaultPutAwayShortQuantity: PutAwayOption[] = [
    {
      id: 'Split transaction on short quantity',
      name: 'Split transaction on short quantity',
    },
    {
      id: 'Cancel on short quantity',
      name: 'Cancel on short quantity',
    },
    {
      id: 'Prompt user on short quantity',
      name: 'Prompt user on short quantity',
    },
  ];

  defaultPutAwayScanTypeList: any = [
    {
      id: 'Any',
      name: 'Any',
    },
    {
      id: Column.ItemNumber,
      name: this.ItemNumber,
    },
    {
      id: ColumnDef.SerialNumber,
      name: ColumnDef.SerialNumber,
    },
    {
      id: Column.LotNumber,
      name: Column.LotNumber,
    },
    {
      id: TableConstant.HostTransactionID,
      name: TableConstant.HostTransactionID,
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
  public iInductionManagerApi: IInductionManagerApiService;
  public userData: any;
  trackIndIsDisable = false;
  isSplitShortPutAwayEnabled: boolean = false;
  selectedOption: string = '';

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getPreferences();
    this.getZoneGroupings();
  }

  getPreferences() {
    try {
      this.iInductionManagerApi.PreferenceIndex().subscribe((res: any) => {
        if (res.data && res.isExecuted) {
          const values = res.data.imPreference;
          const reelVal = res.data.rtUserFieldData[0];
          if (values.superBatchByToteID) {
            this.superBatchFilterList = [
              { id: 1, name: superBatchFilterListName.ToteID },
              { id: 0, name: superBatchFilterListName.OrderNo },
            ];
            this.preferencesForm.get('superBatchFilter')?.setValue('1');
          } else {
            this.superBatchFilterList = [
              { id: 0, name: superBatchFilterListName.OrderNo },
              { id: 1, name: superBatchFilterListName.ToteID },
            ];
            this.preferencesForm.get('superBatchFilter')?.setValue('0');
          }
          if (!values.trackInductionTransactions) {
            this.preferencesForm.get('inductionLocation')?.disable();
            this.trackIndIsDisable = true;
          }

          this.isSplitShortPutAwayEnabled = values.splitShortPutAway;

          this.preferencesForm.patchValue({
            // System Settings
            useDefault: values.useDefaultFilter
              ? StringConditions.filter
              : TableConstant.zone,
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
            dontAllowOverReceipt: values.dontAllowOverReceipt,
            autoAssignAllZones: values.autoAssignAllZones,
            purchaseOrderRequired: values.purchaseOrderRequired,
            defaultPutAwayShortQuantity: this.isSplitShortPutAwayEnabled === false ? 'Prompt user on short quantity' : values.defaultPutAwayShortQuantity,

            // Print Settings
            autoPrintCrossDockLabel: values.autoPrintCrossDockLabel,
            autoPrintPickLabels: values.autoPrintPickLabels,
            pickLabelsOnePerQty: values.pickLabelsOnePerQty,
            autoPrintPickToteLabels: values.autoPrintPickToteLabels,
            autoPrintPutAwayToteLabels: values.autoPrintPutAwayToteLabels,
            autoPrintOffCarouselPickList: values.autoPrintOffCarouselPickList,
            autoPrintOffCarouselPutAwayList:
              values.autoPrintOffCarouselPutAwayList,
            autoPrintPutAwayLabels: values.autoPrintPutAwayLabels,
            requestNumberOfPutAwayLabels: values.requestNumberOfPutAwayLabels,
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

            //Pick Tote Induction Settings
            excludeOrderInReprocess: values.excludeOrdersinReprocess,
            maximumQtyPerTote: values.maximumQuantityperTote,
            sbMaximumQtyPerTote: values.sbMaximumQuantityPerTote,
            defaultZoneGroup: values.defaultZoneGroup,
            pickToteSuppressInfoMessages:values.pickToteSuppressInfoMessages
          });
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.SomethingWentWrong,
            ToasterTitle.Error
          );
          console.log('PreferenceIndex', res.responseMessage);
        }
      });
    } catch (error) {}
  }

  getZoneGroupings() {
    try {
      this.zoneGroupingsList = [];

      this.iInductionManagerApi.GetZoneGroupings().subscribe((res: any) => {
        if (res.data && res.isExecuted) {
          let uniqueZoneGroupNames = [
            ...new Set(res.data.map((m) => m.zoneGroupName)),
          ];

          uniqueZoneGroupNames.forEach((f) => {
            this.zoneGroupingsList.push({ id: f, name: f });
          });

          this.getPreferences();
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.SomethingWentWrong,
            ToasterTitle.Error
          );
          console.log('Get Zone Groups', res.responseMessage);
        }
      });
    } catch (error) {}
  }

  updatePreferences(type: any, event?) {
    try {
      const values = this.preferencesForm.value;
      let payLoad = {};
      let endPoint = '';
      if (type == 1) {

        this.isSplitShortPutAwayEnabled = values.splitShortPutAway;
        if(!this.isSplitShortPutAwayEnabled) {
          this.selectedOption = 'Prompt user on short quantity';
        }

        payLoad = {
          AutoPickOrder: values.autoPickOrderSelection,
          OrderSort: values.orderSort,
          AutoPickTote: values.autoPickToteID,
          CarTotePicks: values.carouselToteIDPicks,
          OffCarTotePicks: values.offCarouselToteIDPicks,
          UsePickBatch: values.usePickBatchManager,
          UseDefFilter: values.useDefault == StringConditions.filter,
          UseDefZone: values.useDefault == TableConstant.zone,
          AutoPutTote: values.autoPutAwayToteID,
          DefPutPrior: values.defaultPutAwayPriority,
          DefPutQuant: values.defaultPutAwayQuantity,
          PickBatchQuant: values.pickBatchQuantity,
          DefCells: values.defaultCells,
          SplitShortPut: values.splitShortPutAway,
          DefaultPutAwayShortQuantity: this.isSplitShortPutAwayEnabled === false ? '' : values.defaultPutAwayShortQuantity,
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
          DontAllowOverReceipt: values.dontAllowOverReceipt,
          AutoAssignAllZones: values.autoAssignAllZones,
          PurchaseOrderRequired: values.purchaseOrderRequired,
          ExcludeOrdersinReprocess: values.excludeOrderInReprocess,
          MaximumQuantityperTote: values.maximumQtyPerTote,
          SBMaximumQuantityperTote: values.sbMaximumQtyPerTote,
          DefaultZoneGroup: values.defaultZoneGroup,
          PickToteSuppressInfoMessages:values.pickToteSuppressInfoMessages
        };

        endPoint = ApiEndpoints.IMSytemSettings;
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
        endPoint = ApiEndpoints.RTSUserData;
      } else if (type == 3) {
        if (event?.checked) {
          this.preferencesForm.get('inductionLocation')?.enable();
          this.trackIndIsDisable = false;
        } else if (event && !event.checked) {
          this.preferencesForm.get('inductionLocation')?.disable();
          this.trackIndIsDisable = true;
        }

        if (values.defaultSuperBatchSize < 2) {
          this.global.ShowToastr(
            ToasterType.Error,
            'Default Super Batch Size must be greater than 1',
            ToasterTitle.Error
          );
          return;
        }

        payLoad = {
          TrackInductTrans: values.trackInductionLocation,
          InductLoc: this.preferencesForm.get('inductionLocation')?.value,
          StageBulkPro: values.stageUsingBulk,
          StageVelCode: values.stageVelocityCode,
          DefaultSuperBatch: values.defaultSuperBatchSize,
          ConfirmSuperBatch: values.confirmSuperBatch,
          superBatchFilt: values.superBatchFilter === '1',
          WSID: this.userData.wsid,
        };
        endPoint = ApiEndpoints.IMMIScSetup;
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

        endPoint = ApiEndpoints.IMPrintSettings;
      }
      console.log('here', payLoad);
      this.iInductionManagerApi
        .DynamicMethod(payLoad, endPoint)
        .subscribe((res: any) => {
          if (res.data && res.isExecuted) {
            this.global.updateImPreferences();
            this.global.ShowToastr(
              ToasterType.Success,
              'Your details have been updated',
              ToasterTitle.Success
            );
          } else {
            this.global.ShowToastr(
              ToasterType.Error,
              ToasterMessages.SomethingWentWrong,
              ToasterTitle.Error
            );
            console.log('DynamicMethod', res.responseMessage);
          }
        });
    } catch (error) {}
  }

  getCompName() {
    this.iInductionManagerApi.CompName().subscribe((res: any) => {
      if (res.data && res.isExecuted) {
        this.preferencesForm.get('inductionLocation')?.setValue(res.data);
        this.updatePreferences(3);
        this.global.ShowToastr(
          ToasterType.Success,
          'Your details have been updated',
          ToasterTitle.Success
        );
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.SomethingWentWrong,
          ToasterTitle.Error
        );
        console.log('CompName', res.responseMessage);
      }
    });
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
      value = value.slice(0, 10);
    }
    inputElement.value = value;
  }

  restrictTo309Digits(event: KeyboardEvent): void {
    const inputElement = this.maxNumber.nativeElement;
    let value = inputElement.value.replace(/\D/g, ''); // Remove non-digit characters
    if (parseInt(value) > 2147483647) {
      value = value.slice(0, 309);
    }
    inputElement.value = value;
  }

  openZoneGroups() {
    const dialogRef: any = this.global.OpenDialog(ZoneGroupsComponent, {
      height: 'auto',
      width: '60%',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // check for confirmation then refresh zone groupins on the screen
      if (result && result.confirm) {
        this.getZoneGroupings();
      }
    });
  }

  openPickToteInductionFilter() {
    const dialogRef: any = this.global.OpenDialog(
      ImprefInductionFilterComponent,
      {
        height: 'auto',
        width: Style.w1080px,
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      // check for confirmation then clear all filters on the screen
      if (result) {
      }
    });
  }
}
