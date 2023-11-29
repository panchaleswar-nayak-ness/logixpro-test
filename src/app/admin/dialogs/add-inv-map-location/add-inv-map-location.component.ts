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
}
@Component({
  selector: 'app-add-inv-map-location',
  templateUrl: './add-inv-map-location.component.html',
  styleUrls: ['./add-inv-map-location.component.scss']
})
export class AddInvMapLocationComponent implements OnInit {
  addInvMapLocation: FormGroup;
  clearInvMapLocation: FormGroup;

  locZoneList: any[] = [];
  itemNumberList: any[] = [];
  zoneList: any[] = [];
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
    this.fieldNames=this.data?.fieldName;
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
      this.updateItemNumber();
      this.initializeDataSet();
    } else {
      this.initializeDataSet();
    }
    this.searchItemNumbers = this.getDetailInventoryMapData.itemNumber;


    this.iAdminApiService.getLocZTypeInvMap({}).subscribe((res) => {
      if(res.isExecuted && res.data)
      {
        this.locZoneList = res.data;
      this.filteredOptions = this.addInvMapLocation.controls['location'].valueChanges.pipe(
        startWith(''),
        map(value => this.filterLocalZoneList(value || '')),
      );

      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("getLocZTypeInvMap",res.responseMessage);


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
    this.addInvMapLocation.patchValue({
      'putAwayDate': '',
      'userField1': '',
      'userField2': '',
      'item': '',
      'expirationDate': '',
      'maxQuantity': '0',
      'minQuantity': '0',
      'revision': '',
      'serialNumber': '',
      'lotNumber': '',
      "description":'',
      'location':'',
      'locationNumber':'',
      'laserX':'',
      'lasery':'',
      'warehouse':'',
      "zone":'',
      'carousel':'',
      'row':'',
      "shelf":'',
      'bin':'',
      'cell':'',
      'velocity':'',
      'altLight':'',
      dedicated: false,
      dateSensitive : false


    });
    this.itemDescription = "";
    this.unitOFMeasure = ''
    this.autoFillLocNumber = ''
    this.itemNumberList = []
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
      if (!result) {

        this.addInvMapLocation.patchValue({
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
      itemQuantity: new FormControl({value:this.getDetailInventoryMapData.itemQuantity || '',disabled:this.getDetailInventoryMapData.itemNumber ===''}),
      description: [this.getDetailInventoryMapData.description || ""],
      clear:new FormControl({ value: this.getDetailInventoryMapData.itemNumber || 0, disabled: true }),
      cell: [this.getDetailInventoryMapData.cellSize || ''],
      velocity: [this.getDetailInventoryMapData.goldenZone || ''],
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
    let max = parseInt(this.addInvMapLocation.get("maxQuantity")?.value ? this.addInvMapLocation.get("maxQuantity")?.value : 0);
    let min = parseInt(this.addInvMapLocation.get("minQuantity")?.value ? this.addInvMapLocation.get("minQuantity")?.value : 0);
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
  onSubmit(form: FormGroup) {
    let invMapIDs={
      invMapID:this.getDetailInventoryMapData.invMapID,
      masterInvMapID:this.getDetailInventoryMapData.masterInvMapID
    }
      this.clickSubmit = true;
        if (this.clickSubmit) {
          if (this.data.detailData) {
            this.clickSubmit = false;
            if(!this.zoneChecker(form.value.zone, form.value.location)){
              this.global.ShowToastr(ToasterType.Error,"Zone and Location need be set via the dropdown in order to save.", ToasterTitle.Warning);
              return
            }
            if(this.warehouseSensitive && form.value.warehouse == ''){
              this.global.ShowToastr(ToasterType.Error,"The selected item is warehouse sensitive.  Please set a warehouse to continue.", ToasterTitle.Warning);
              return
            }
            if(this.dateSensitive && form.value.dateSensitive == ''){
              this.global.ShowToastr(ToasterType.Error,"Item is date sensitive. Please set date sensitive before saving.", ToasterTitle.Warning);
              return
            }
            this.iAdminApiService.updateInventoryMap(form.value,invMapIDs).subscribe((res) => {
              this.clickSubmit = true;
                if (res.isExecuted) {
                  this.global.ShowToastr(ToasterType.Success,"Your details have been updated", ToasterTitle.Success);
                  this.dialog.closeAll()
                }
                else {
                  this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
                  console.log("updateInventoryMap",res.responseMessage);
                }
            });
          } else {
            this.clickSubmit = false;
            if(!this.zoneChecker(form.value.zone, form.value.location)){
              this.global.ShowToastr(ToasterType.Error,"Zone and Location need be set via the dropdown in order to save.", ToasterTitle.Warning);
              return
            }
            if(this.warehouseSensitive && form.value.warehouse == ''){
              this.global.ShowToastr(ToasterType.Error,"The selected item is warehouse sensitive.  Please set a warehouse to continue.", ToasterTitle.Warning);
              return
            }
            if(this.dateSensitive && form.value.dateSensitive == ''){
              this.global.ShowToastr(ToasterType.Error,"Item is date sensitive. Please set date sensitive before saving.", ToasterTitle.Warning );
              return
            }
            this.iAdminApiService.createInventoryMap(form.value).subscribe((res) => {
              this.clickSubmit = true;
              if (res.isExecuted) {
                this.global.ShowToastr(ToasterType.Success,"Your details have been added", ToasterTitle.Success);
                this.dialog.closeAll()
              }

              else {

                this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
                console.log("createInventoryMap",res.responseMessage);

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
    }
    else{
      this.searchItemNumbers = "";
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
