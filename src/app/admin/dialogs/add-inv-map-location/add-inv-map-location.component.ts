import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CellSizeComponent } from '../cell-size/cell-size.component';
import { VelocityCodeComponent } from '../velocity-code/velocity-code.component';
import { WarehouseComponent } from '../warehouse/warehouse.component';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map';

import { AuthService } from '../../../common/init/auth.service';
import { AdjustQuantityComponent } from '../adjust-quantity/adjust-quantity.component';
import { Router } from '@angular/router';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FloatLabelType } from '@angular/material/form-field';
import { DialogConstants, ToasterTitle, ToasterType ,zoneType,ColumnDef,Column,TableConstant,UniqueConstants,StringConditions} from 'src/app/common/constants/strings.constants';

import { Placeholders } from 'src/app/common/constants/strings.constants';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

type InventoryMapFormData = {
  location: FormControl<string | null>;
  zone: FormControl<string | null>;
  carousel: FormControl<string | null>;
  row: FormControl<string | null>;
  shelf: FormControl<string | null>;
  bin: FormControl<string | null>;
  item: FormControl<string | null>;
  itemQuantity: FormControl<string | number | null>;
  description: FormControl<string | null>;
  clear: FormControl<string | number | null>;
  cell: FormControl<string | null>;
  velocity: FormControl<string | null>;
  maxQuantity: FormControl<string | number | null>;
  dedicated: FormControl<boolean | null>;
  serialNumber: FormControl<string | number | null>;
  lotNumber: FormControl<string | number | null>;
  expirationDate: FormControl<string | null>;
  unitOfMeasure: FormControl<string | null>;
  quantityAllocatedPick: FormControl<string | number | null>;
  quantityAllocatedPutAway: FormControl<string | number | null>;
  putAwayDate: FormControl<string | null>;
  warehouse: FormControl<string | null>;
  revision: FormControl<string | null>;
  inventoryMapID: FormControl<string | null>;
  userField1: FormControl<string | null>;
  userField2: FormControl<string | null>;
  masterLocation: FormControl<string | boolean | null>;
  dateSensitive: FormControl<boolean | null>;
  masterInventoryMapID: FormControl<string | null>;
  minQuantity: FormControl<string | number | null>;
  laserX: FormControl<string | number | null>;
  laserY: FormControl<string | number | null>;
  locationNumber: FormControl<string | null>;
  locationID: FormControl<string | null>;
  altLight: FormControl<string | number | null>;
};
export interface InventoryMapDataStructure {
  invMapID: string;
  locationID: string;
  location: string;
  warehouse: string;
  zone: string;
  carousel: string;
  row: string;
  shelf: string;
  bin: string;
  itemNumber: string;
  revision: string;
  serialNumber: string;
  lotNumber: string;
  expirationDate: string;
  description: string;
  itemQuantity: string;
  unitOfMeasure: string;
  maxQuantity: string;
  cellSize: string;
  goldenZone: string;
  putAwayDate: string;
  userField1: string;
  userField2: string;
  masterLocation: string;
  dateSensitive: boolean;
  dedicated: boolean;
  masterInvMapID: string;
  minQuantity: string;
  quantityAllocatedPick: string;
  quantityAllocatedPutAway: string;
  laserX: string;
  laserY: string;
  locationNumber: string;
  rn: string;
  velocity: string;
  altLight: string;
};
@Component({
  selector: 'app-add-inv-map-location',
  templateUrl: './add-inv-map-location.component.html',
  styleUrls: ['./add-inv-map-location.component.scss']
})
export class AddInvMapLocationComponent implements OnInit {
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  itemNumber: string = this.fieldMappings.itemNumber;
  userField1: string = this.fieldMappings.userField1;
  userField2: string = this.fieldMappings.userField2;
  unitOfMeasure: string = this.fieldMappings.unitOfMeasure;
  addInvMapLocation: FormGroup<InventoryMapFormData>;
  clearInvMapLocation: FormGroup;
  allowClearWholeLocation: boolean = false;
  isClearWholeLocationAvailable: boolean = false;
  buttonColor: 'primary' | 'warn' = 'warn';
isButtonDisabled: boolean = true;
  locZoneList: any[] = [];
  itemNumberList: any[] = [];
  zoneList: any[] = [];
  locationzone: any = []; 
  duplicateLocationZone: any = [];
  filteredOptions: Observable<any[]>;
  filteredItemNum: Observable<any[]>;
  itemDescription: any;
  fieldNames:any;
  autoFillLocNumber: any = '';
  zone = '';
  carousel = '';
  row = '';
  shelf = '';
  bin = '';
  setStorage;
  setStorageOM;
  quantity: any;
  routeFromIM: boolean = false;
  routeFromOM: boolean = false;
  searchItemNumbers
  warehouseSensitive: boolean;
  dateSensitive: boolean;
  grpData: any = {};
  userName: any;
  public isGroupLookUp: boolean = false;
  assignedFunctions:any;
  unassignedFunctions:any;
  @ViewChild('cellSizeVal') cellSizeVal: ElementRef;
  @ViewChild('velCodeVal') velCodeVal: ElementRef;
  @ViewChild('location_name') location_name: ElementRef;
  getDetailInventoryMapData: InventoryMapDataStructure = {
    invMapID: '',
    locationID: '',
    location: '',
    warehouse: '',
    zone: '',
    carousel: '',
    row: '',
    shelf: '',
    bin: '',
    itemNumber: '',
    revision: '',
    serialNumber: '',
    lotNumber: '',
    expirationDate: '',
    description: '',
    itemQuantity: '',
    unitOfMeasure: '',
    maxQuantity: '',
    cellSize: '',
    goldenZone: '',
    putAwayDate: '',
    userField1: '',
    userField2: '',
    masterLocation: '',
    dateSensitive: false,
    dedicated: false,
    masterInvMapID: '',
    minQuantity: '',
    quantityAllocatedPick: '',
    quantityAllocatedPutAway: '',
    laserX: '',
    laserY: '',
    locationNumber: '',
    rn: '',
    altLight: '',
    velocity: ''
  };

  clickSubmit: boolean = true;
  headerLable: any;
  userData: any;
  FromOm:boolean=false;
  public iAdminApiService: IAdminApiService;
  myroute1:boolean=true;
  myroute2:boolean=true;
  unitOFMeasure
  itemNumberScroll:any = "vertical";

  floatLabelControl: any = new FormControl('uf1' as FloatLabelType);
  floatLabelControlShipName: any = new FormControl('uf2' as FloatLabelType);
  hideRequiredControl = new FormControl(false);
  hideRequiredControlShipName = new FormControl(false);
  shipVia;
  shipToName;
  searchByShipVia: any = new Subject<string>();
  searchByShipName: any = new Subject<string>();
  searchAutocompleteShipVia: any = [];
  searchAutocompleteShipName: any = [];
  isInputDisabled:boolean=false;
  public iCommonAPI : ICommonApi;

  placeholders = Placeholders;

  constructor(
    public commonAPI : CommonApiService,
    private global:GlobalService,
    private dialog:MatDialog,
    private fb: FormBuilder,
    private Api: ApiFuntions,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,

    private adminApiService: AdminApiService,
    public dialogRef: MatDialogRef<any>,
    private router: Router
  ) {
    this.iAdminApiService = adminApiService;
    if (data.mode == "addInvMapLocation") {
      this.headerLable = 'Add Location';
    } else if (data.mode == "editInvMapLocation") {
      this.headerLable = 'Update Location';
      this.loadItemDetails(this.data.detailData.itemNumber);
    }

    if(this.router.url=="/InductionManager/Admin/InventoryMap" || this.router.url=="/OrderManager/InventoryMap"){
      this.myroute1=false;
      this.myroute2=false;
    }

    this.iCommonAPI = commonAPI;
  }

  isValidClearLocation() {
    return this.clearInvMapLocation.valid;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.fieldNames = this.data?.fieldName;

    if (this.data.detailData) {
      this.getDetailInventoryMapData = this.data.detailData;
      this.zone = this.getDetailInventoryMapData.zone;
      this.carousel = this.getDetailInventoryMapData.carousel;
      this.row = this.getDetailInventoryMapData.row;
      this.shelf = this.getDetailInventoryMapData.shelf;
      this.bin = this.getDetailInventoryMapData.bin;
      this.itemDescription = this.getDetailInventoryMapData.description;
      this.quantity = this.getDetailInventoryMapData.itemQuantity;
      this.unitOFMeasure = this.getDetailInventoryMapData.unitOfMeasure;
      this.shipVia = this.getDetailInventoryMapData.userField1;
      this.shipToName = this.getDetailInventoryMapData.userField2;
      this.updateItemNumber();
    }


    this.initializeDataSet();

    this.getLocationZones();
    this.functionsByGroup();

    this.addInvMapLocation.get('allowClearWholeLocation')?.valueChanges.subscribe(value => {
      this.allowClearWholeLocation = value === 'true'; 
    });

    this.searchItemNumbers = this.getDetailInventoryMapData.itemNumber;

    this.iAdminApiService.getLocZTypeInvMap({}).subscribe((res) => {
      if (res.isExecuted && res.data) {
        this.locZoneList = res.data;
        this.filteredOptions = this.addInvMapLocation.controls[TableConstant.Location].valueChanges.pipe(
          startWith(''),
          map(value => this.filterLocalZoneList(value || ''))
        );
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("getLocZTypeInvMap", res.responseMessage);

      }
    });

    this.searchByShipVia
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.autocompleteSearchColumn();
      });

    this.searchByShipName
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.autocompleteSearchColumnShipName();
      });
}

parentZones: any = [];


functionsByGroup(event?: any) {

  const grp_data = {
   
    "groupName":this?.userData?.accessLevel

    }; 
  this.iAdminApiService.getFunctionByGroup(grp_data)
  .subscribe((response:any) => {
    if(response.isExecuted && response.data)
    {
      this.assignedFunctions = response.data?.groupFunc
      this.unassignedFunctions = response.data?.allFunc

      this.isClearWholeLocationAvailable = response.data.allFunc.includes("Inv Map Clear Whole Location");

    }
    else {
     
    } 
    
  });
}

getLocationZones() {
  this.iAdminApiService.LocationZone().subscribe((res) => {
    if (res.isExecuted && res.data) {
     
      const matchingLocation = res.data.find((location) => location.zone === this.zone);

      // Set button color and disabled state based on `allowClearWholeLocation` value
      if (matchingLocation && matchingLocation.allowClearWholeLocation) {
        this.buttonColor = 'primary';
        this.isButtonDisabled = false;
      } else {
        this.buttonColor = 'warn';
        this.isButtonDisabled = true;
      }
    } else {
      this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      console.log('LocationZone', res.responseMessage);
    }
  });
}

  ngAfterViewInit() {
    if(this.router.url == '/OrderManager/InventoryMap'){
      this.addInvMapLocation.get(TableConstant.Location)?.disable();
      this.addInvMapLocation.get(TableConstant.zone)?.disable();
      this.addInvMapLocation.get(UniqueConstants.Description)?.disable();
      this.addInvMapLocation.get('laserX')?.disable();
      this.addInvMapLocation.get('laserY')?.disable();
      this.addInvMapLocation.get('warehouse')?.disable();
      this.addInvMapLocation.get(zoneType.carousel)?.disable();
      this.addInvMapLocation.get(Column.Row)?.disable();
      this.addInvMapLocation.get(TableConstant.shelf)?.disable();
      this.addInvMapLocation.get(ColumnDef.Bin)?.disable();
      this.addInvMapLocation.get(ColumnDef.UnitOfMeasure)?.disable();
      this.addInvMapLocation.get(Column.cell)?.disable();
      this.addInvMapLocation.get('velocity')?.disable();
      this.addInvMapLocation.get('altLight')?.disable();
      this.addInvMapLocation.get('userField1')?.disable();
      this.addInvMapLocation.get(ColumnDef.userField2)?.disable();
      this.addInvMapLocation.get('quantityAllocatedPutAway')?.disable();
      this.addInvMapLocation.get('inventoryMapID')?.disable();
      this.addInvMapLocation.get('masterInventoryMapID')?.disable();
      this.addInvMapLocation.get(UniqueConstants.item)?.disable();
      this.addInvMapLocation.get('maxQuantity')?.disable();
      this.addInvMapLocation.get('minQuantity')?.disable();
      this.addInvMapLocation.get(StringConditions.clear)?.disable();
      this.isInputDisabled=true;
    }
    this.location_name?.nativeElement.focus();
  }
  onClearFieldDisable(): boolean {
    return !this.searchItemNumbers;
  }
 
  clearFields() {

  }

  clearWholeLocation() {

    this.onclearWholeLocation(this.addInvMapLocation);
    
  }

  clearFieldsAndSubmit() {
   
    this.addInvMapLocation.patchValue({
      carousel: null,
      row: null,
      shelf: null,
      bin: null,
    });
  
  
    this.onSubmit(this.addInvMapLocation);
  }


performClear() {
  this.addInvMapLocation.patchValue({
    item: '',
    description: '',
    maxQuantity: '0',
    minQuantity: '0',
    putAwayDate: '',
    serialNumber: '',
    lotNumber: '',
    revision: '',
    expirationDate: '',
    userField1: '',
    userField2: '',
      carousel: '',
      row: '',
      shelf: '',
      bin: '',
  });
  this.itemDescription = '';
  this.unitOFMeasure = '';
  this.itemNumberList = [];
}
  adjustQuantity() {
    if(this.addInvMapLocation.value.item == '') return;
    if(this.getDetailInventoryMapData.itemNumber == ''){
      this.global.ShowToastr(ToasterType.Error,'No item found at the location specified.  Ensure that the entry selected has been saved since an item was assigned to it.', ToasterTitle.Error);
      return;
    }
    let dialogRef:any = this.global.OpenDialog(AdjustQuantityComponent, {
      height: DialogConstants.auto,
      width: '800px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        id: this.getDetailInventoryMapData.invMapID
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result !== false) {
        this.addInvMapLocation.patchValue({
          'itemQuantity': result
        });
        this.clearInvMapLocation.patchValue({
          'itemQuantity': result
        });
      }
    })
  }

  searchItemNumber(event:any,itemNum: any) {
    if(this.searchItemNumbers == ''||this.searchItemNumbers == undefined){
      this.clearFields()
    }
    if(event.keyCode == 13){
      this.searchItemNumbers = this.itemNumberList.find(x=>x.itemNumber == event.target.value.toString()).itemNumber;
      if(this.searchItemNumbers) {
        this.loadItemDetails(this.searchItemNumbers);
        this.itemNumberList = []
      }
    }
    else{
    let payload = {
      "itemNumber": itemNum.value.toString(),
      "beginItem": "---",
      "isEqual": false
    }
    this.iCommonAPI.getSearchedItem(payload).subscribe(res => {
      if (res.data.length > 0) {
        this.itemNumberList = res.data;
      }
      else {
        this.addInvMapLocation.controls[UniqueConstants.item].setValue('');
        this.itemNumberList = []
        this.clearFields()
      }
    });
  }
  }

  initializeDataSet() {
    this.addInvMapLocation = this.fb.group({
      location: [this.getDetailInventoryMapData.location  || '', [Validators.required]],
      zone: [this.getDetailInventoryMapData.zone|| '', [Validators.required, Validators.maxLength(2)]],
      carousel: [this.getDetailInventoryMapData.carousel || '', [Validators.pattern(UniqueConstants.Regx), Validators.maxLength(1)]],
      row: [this.getDetailInventoryMapData.row || '', [Validators.maxLength(5)]],
      shelf: [this.getDetailInventoryMapData.shelf || '', [Validators.maxLength(2)]],
      bin: [this.getDetailInventoryMapData.bin || '', [Validators.maxLength(3)]],
      item: [this.getDetailInventoryMapData.itemNumber || '', [Validators.maxLength(50)]],
      itemQuantity: new FormControl({value:this.getDetailInventoryMapData.itemQuantity || 0,disabled:this.getDetailInventoryMapData.itemNumber ===''}),
      description: [this.getDetailInventoryMapData.description || ""],
      clear:new FormControl({ value: this.getDetailInventoryMapData.itemNumber || 0, disabled: true }),
      cell: [this.getDetailInventoryMapData.cellSize || '', [Validators.required]],
      velocity: [this.getDetailInventoryMapData.goldenZone || '', [Validators.required]],
      maxQuantity: [this.getDetailInventoryMapData.maxQuantity || 0, [Validators.maxLength(9)]],
      dedicated: [this.getDetailInventoryMapData.dedicated || false],
      serialNumber: new FormControl({ value: this.getDetailInventoryMapData.serialNumber || 0, disabled: true }),
      lotNumber: new FormControl({ value: this.getDetailInventoryMapData.lotNumber || 0, disabled: true }),
      expirationDate: new FormControl({ value: this.getDetailInventoryMapData.expirationDate || '', disabled: true }),
      unitOfMeasure: [{value:this.getDetailInventoryMapData.unitOfMeasure ,disabled:true}],//disabled:this.data.detailData?true:false
      quantityAllocatedPick: new FormControl({ value: this.getDetailInventoryMapData.quantityAllocatedPick || 0, disabled: true }),
      quantityAllocatedPutAway: new FormControl({ value: this.getDetailInventoryMapData.quantityAllocatedPutAway || 0, disabled: true }),
      putAwayDate: new FormControl({ value: this.getDetailInventoryMapData.putAwayDate || '', disabled: true }),
      warehouse: [this.getDetailInventoryMapData.warehouse || ''],
      revision: new FormControl({ value: this.getDetailInventoryMapData.revision || '', disabled: true }),
      inventoryMapID: new FormControl({ value: this.getDetailInventoryMapData.invMapID || '', disabled: true }),
      userField1: [this.getDetailInventoryMapData.userField1 || '', [Validators.maxLength(255)]],
      userField2: [this.getDetailInventoryMapData.userField2 || '', [Validators.maxLength(255)]],
      masterLocation: [this.getDetailInventoryMapData.masterLocation || false],
      dateSensitive: [this.getDetailInventoryMapData.dateSensitive || false],
      masterInventoryMapID: new FormControl({ value: this.getDetailInventoryMapData.masterInvMapID || '', disabled: true }),
      minQuantity: [this.getDetailInventoryMapData.minQuantity || 0, [Validators.maxLength(9)]],
      laserX: [this.getDetailInventoryMapData.laserX || 0, [Validators.pattern(UniqueConstants.Regx), Validators.maxLength(9)]],
      laserY: [this.getDetailInventoryMapData.laserY || 0, [Validators.pattern(UniqueConstants.Regx), Validators.maxLength(9)]],
      locationNumber: [this.getDetailInventoryMapData.locationNumber || '',],
      locationID: [this.getDetailInventoryMapData.locationID || ''],
      altLight: [this.getDetailInventoryMapData.altLight || 0, [Validators.maxLength(9), Validators.pattern(UniqueConstants.Regx)]]
    });

    this.clearInvMapLocation = this.fb.group({
      quantityAllocatedPick: new FormControl(this.getDetailInventoryMapData.quantityAllocatedPick || 0),
      quantityAllocatedPutAway: new FormControl(this.getDetailInventoryMapData.quantityAllocatedPutAway || 0),
      itemQuantity: new FormControl(this.getDetailInventoryMapData.itemQuantity || 0),
    }, { validators: this.validateQuantity });
  }

  validateQuantity(control: AbstractControl): ValidationErrors | null {
    const quantityAllocatedPick = control.get('quantityAllocatedPick')?.value;
    const quantityAllocatedPutAway = control.get('quantityAllocatedPutAway')?.value;
    const itemQuantity = control.get('itemQuantity')?.value;

    if (itemQuantity === 0 && quantityAllocatedPick === 0 && quantityAllocatedPutAway === 0) {
      return {invalidQuantity: true};
    }
    return null;
  }

  onMinChange(event: KeyboardEvent) {
    
    let max = parseInt(this.addInvMapLocation.get("maxQuantity")?.value?.toString() ?? '0', 10);
    let min = parseInt(this.addInvMapLocation.get("minQuantity")?.value?.toString() ?? '0', 10);
    if(min > max){
      this.addInvMapLocation.get("minQuantity")?.setValue("");
    }
  }

  onMaxChange() {
    this.addInvMapLocation.get("minQuantity")?.setValue("0");
  }

  onchangeItemNumber() {
    let value = this.addInvMapLocation.controls[TableConstant.zone].value + this.addInvMapLocation.controls[zoneType.carousel].value + this.addInvMapLocation.controls[Column.Row].value + this.addInvMapLocation.controls[TableConstant.shelf].value + this.addInvMapLocation.controls[ColumnDef.Bin].value;
    this.addInvMapLocation.controls['locationNumber'].setValue(value);
  }

  onclearWholeLocation(form: FormGroup<InventoryMapFormData>) {
    const quantityAllocatedPick = this.addInvMapLocation.get('quantityAllocatedPick')?.value ?? 0;
    const quantityAllocatedPutAway = this.addInvMapLocation.get('quantityAllocatedPutAway')?.value ?? 0;

    // Check if there are allocated quantities
    if (+quantityAllocatedPick > 0 || +quantityAllocatedPutAway > 0) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '560px',
            data: {
                message: 'Clear Whole Location cannot proceed because the Allocated Pick or Allocated Put Away quantity is greater than zero.',
                showOkButton: true,
                hideCancel: true
            }
        });

        dialogRef.afterClosed().subscribe(() => {
            console.log('Dialog closed due to count restriction');
            this.dialog.closeAll();
        });
    } else {
        // Show confirmation dialog before API call
        const clearDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '560px',
            data: {
                heading: 'Clear Whole Location',
                message: 'Click OK to clear all Inventory Map records matching Location Number (Zone + Carousal + Row + Shelf + Bin) Criteria!',
                showOkButton: true,
                hideCancel: false
            }
        });

        clearDialogRef.afterClosed().subscribe((clearResult) => {
            if (clearResult === 'Yes') {
                // Call API if user confirms
                this.iAdminApiService.updateInventoryMapClearWholeLocation(form.getRawValue()).subscribe(
                    (res) => {
                        if (res.isExecuted && res.data.pickPutAwayCount === 0) {
                            console.log('Proceeding with clearing operation:', res);
                            this.dialog.closeAll();
                            // Show success toast
                            this.global.ShowToastr(
                                ToasterType.Success,
                                'Clear Whole Location has been performed successfully',
                                ToasterTitle.Success
                            );

                            if (res.data.adjustMade === 'Yes') {
                                console.log('Adjustment made successfully.');
                                // Optionally, show another dialog here for adjustments
                            } else {
                                console.log('No adjustment made.');
                                // Optionally, show a dialog for no adjustment
                            }

                            if (res.data.dynamic) {
                                console.log('Dynamic clearing was involved.');
                            } else {
                                console.log('Non-dynamic clearing process.');
                            }

                            this.dialog.closeAll(); // Close all dialogs
                        } else if (!res.isExecuted || res.data.pickPutAwayCount > 0) {
                            console.log('Clear operation did not execute properly:', res);
                            if (res.responseMessage) {
                                console.log('Response message from server:', res.responseMessage);
                            }
                        }
                    },
                    (error) => {
                        console.error('An error occurred:', error);
                    }
                );
            } else {
                console.log('Clear operation canceled by the user.');
            }
        });
    }
}


onSubmit(form: FormGroup<InventoryMapFormData>) {
  const invMapIDs = {
    invMapID: this.getDetailInventoryMapData.invMapID,
    masterInvMapID: this.getDetailInventoryMapData.masterInvMapID,
  };

  this.clickSubmit = true;

  if (this.clickSubmit) {
    this.clickSubmit = false;

    if (this.data.detailData) {
      // Update mode
      if (!this.zoneChecker(form.value.zone, form.value.location)) {
        this.global.ShowToastr(
            ToasterType.Error,
           "Zone and Location need to be set via the dropdown in order to save.",
           ToasterTitle.Warning
        );
        return;
      }
      if (this.warehouseSensitive && !form.value.warehouse) {
        this.global.ShowToastr(
          ToasterType.Error,
          "The selected item is warehouse sensitive. Please set a warehouse to continue.",
          ToasterTitle.Warning
        );
        return;
      }
      if (this.dateSensitive && form.value.dateSensitive) {
        this.global.ShowToastr(
          ToasterType.Error,
          "Item is date sensitive. Please set date sensitive before saving.",
          ToasterTitle.Warning
        );
        return;
      }

      // API call for updating inventory map
      this.iAdminApiService.updateInventoryMap(form.getRawValue(), invMapIDs).subscribe((res) => {
        this.clickSubmit = true;

        if (res.isExecuted) {
          this.global.ShowToastr(
            ToasterType.Success,
            "Your details have been updated",
            ToasterTitle.Success
          );
          this.dialog.closeAll();
        } else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("updateInventoryMap", res.responseMessage);
        }
      });
    } else {
      // Create mode
      if (!this.zoneChecker(form.value.zone, form.value.location)) {
        this.global.ShowToastr(
          ToasterType.Error,
          "Zone and Location need to be set via the dropdown in order to save.",
          ToasterTitle.Warning
        );
        return;
      }
      if (this.warehouseSensitive && !form.value.warehouse) {
        this.global.ShowToastr(
          ToasterType.Error,
          "The selected item is warehouse sensitive. Please set a warehouse to continue.",
          ToasterTitle.Warning
        );
        return;
      }
      if (this.dateSensitive && form.value.dateSensitive) {
        this.global.ShowToastr(
          ToasterType.Error,
          "Item is date sensitive. Please set date sensitive before saving.",
          ToasterTitle.Warning
        );
        return;
      }

      // API call for creating inventory map
      this.iAdminApiService.createInventoryMap(form.getRawValue()).subscribe((res) => {
        this.clickSubmit = true;

        if (res.isExecuted) {
          this.global.ShowToastr(
            ToasterType.Success,
            "Your details have been added",
            ToasterTitle.Success
          );
          this.dialog.closeAll();
        } else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("createInventoryMap", res.responseMessage);
        }
      });
    }
  }
}

  itemNumberFocusOut() {
    if(this.itemNumberList && this.itemNumberList.length > 0){
      this.warehouseSensitive =  this.itemNumberList[0].warehouseSensitive;
      this.dateSensitive =  this.itemNumberList[0].dateSensitive;
      this.addInvMapLocation.controls[UniqueConstants.Description].setValue(this.itemNumberList[0].description ?? '');
      if ((this.data.mode == "addInvMapLocation") || this.data.detailData.itemQuantity == 0) { // By this point we know there is a valid item number, and quantity is 0, so force it to be dedicated.
        this.addInvMapLocation.controls['dedicated'].setValue(true);
      }
    }
    else{
      this.searchItemNumbers = "";
      if (!this.getDetailInventoryMapData.dedicated) { // If it wasn't dedicated before and the item number is now blank, we don't care what the current forms value is, always set it false.
        this.addInvMapLocation.controls['dedicated'].setValue(false);
      }
    }
  }

  get f() {
    return this.addInvMapLocation.controls;
  }
  hasError(fieldName: string, errorName: string) {
    return this.addInvMapLocation.get(fieldName)?.touched && this.addInvMapLocation.get(fieldName)?.hasError(errorName);
  }
  isValid() {
    return this.addInvMapLocation.valid;
  }

  loadWarehouse() {
    if (!this.isInputDisabled) {
      let dialogRef:any = this.global.OpenDialog(WarehouseComponent, {
        height: DialogConstants.auto,
        width: '640px',
        autoFocus: DialogConstants.autoFocus,
        disableClose:true,
        data: {
          mode: 'addlocation',
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        ;

        if (result !== true && result !== false) {
          this.addInvMapLocation.controls[TableConstant.WareHouse].setValue(result);
        }
        if (result == StringConditions.clear) {
          this.addInvMapLocation.controls[TableConstant.WareHouse].setValue('');
        }
      })
    }
  }
  loadCellSize() {
    if (!this.isInputDisabled) {
      let dialogRef:any = this.global.OpenDialog(CellSizeComponent, {
        height: DialogConstants.auto,
        width: '660px',
        autoFocus: DialogConstants.autoFocus,
        disableClose:true,
        data: {
          mode: 'cell-size',
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result !== true && result !== false) {
          this.addInvMapLocation.controls[Column.cell].setValue(result);
        }
      })
    }
  }
  loadVelocityCode() {
    if (!this.isInputDisabled) {
      let dialogRef: any = this.global.OpenDialog(VelocityCodeComponent, {
        height: DialogConstants.auto,
        width: '660px',
        autoFocus: DialogConstants.autoFocus,
        disableClose: true,
        data: {
          mode: 'cell-size',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result !== true && result !== false) {
          this.addInvMapLocation.controls['velocity'].setValue(result);
        }
      });
    }
  }

  private filterLocalZoneList(value: any): string[] {
    const filterValue = value.toLowerCase();

    return this.locZoneList.filter(option => option.locationName.toLowerCase().includes(filterValue));
  }
  loadZones(zone: any) {
    this.zoneList = this.locZoneList.filter(option => option.locationName.includes(zone.option.value));
    this.addInvMapLocation.controls[TableConstant.zone].setValue(this.zoneList[0]?.zone);
    this.updateItemNumber(TableConstant.zone, this.zoneList[0]?.zone);
  }

  zoneChecker(zone, location) { //To check if the zone and location are selected from dropdown.
    return this.locZoneList.some(item => item.zone === zone && item.locationName === location);
  }

  loadItemDetails(item: any) {
    this.itemNumberList.forEach(val => {
      if (val.itemNumber === item) {
        this.addInvMapLocation.controls[UniqueConstants.Description].setValue(val.description ?? '');
      }
    })
    let payload = {
      "itemNumber": item,
      "zone": this.addInvMapLocation?.get(TableConstant.zone)?.value
    }


    const cellSizeVal = this.cellSizeVal?.nativeElement.value
    const velCodeVal = this.velCodeVal?.nativeElement.value


    this.iAdminApiService.getItemNumDetail(payload).subscribe((res) => {
      if (res.isExecuted) {
        this.warehouseSensitive=res.data.warehouseSensitive;
        this.dateSensitive=res.data.dateSensitive;
        this.unitOFMeasure =res.data.unitOfMeasure
        let match = '';
        let expected = '';

        if (cellSizeVal != res.data.cellSize && res.data.cellSize) {
          match += 'Cell Size';
          expected += ' Expecting Cell Size: ' + res.data.cellSize;
        };
        if (velCodeVal != res.data.velocityCode && res.data.velocityCode) {
          if (match != '') { match += ', Velocity Code'; expected += ' and Velocity Code: ' + res.data.velocityCode } else { match += 'Velocity Code'; expected += 'Velocity Code: ' + res.data.velocityCode };
        };
        if (match != '') {
          this.global.ShowToastr('info','Provided ' + match + ' do not match Inventory Master.' + expected + ' for specified Item and Zone', 'Info!');
        }
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("getItemNumDetail",res.responseMessage);
      }

    });
  }

  updateItemNumber(col?: string, val?: any) {

    if (col === TableConstant.zone) {
      this.zone = val?.toString();
    }
    if (col === zoneType.carousel) {
      this.carousel = val.toString();
    }
    if (col === Column.Row) {
      this.row = val.toString();
    }
    if (col === TableConstant.shelf) {
      this.shelf = val.toString();
    }
    if (col === ColumnDef.Bin) {
      this.bin = val.toString();
    }
    this.autoFillLocNumber = this.zone + this.carousel + this.row + this.shelf + this.bin;

  }

  dialogClose() {
    this.dialogRef.close(DialogConstants.close);
  }

  @HostListener('unloaded')

  focusinmethod(){
    this.itemNumberScroll = "";
  }
  focusoutmethod(){
    this.itemNumberScroll = "vertical";
  }


  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'uf1';
  }
  getFloatLabelValueItem(): FloatLabelType {
    return this.floatLabelControlShipName.value || 'uf2';
  }

  async autocompleteSearchColumn() {
    let searchPayload = {
      value: this.shipVia,
      uFs: 1
    };
    this.iCommonAPI
      .UserFieldTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          this.searchAutocompleteShipVia = res.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  async autocompleteSearchColumnShipName() {
    let searchPayload = {
      value: this.shipToName,
      uFs: 2
    };
    this.iCommonAPI
      .UserFieldTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          this.searchAutocompleteShipName = res.data;
        },
        (error) => {
          console.log(error);
        }
      );
  }

  ngOnDestroy() {
    this.searchByShipVia.unsubscribe();
    this.searchByShipName.unsubscribe();
  }
}





