import { Component, ElementRef, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CellSizeComponent } from '../cell-size/cell-size.component';
import { VelocityCodeComponent } from '../velocity-code/velocity-code.component';
import { WarehouseComponent } from '../warehouse/warehouse.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/internal/operators/map'; 
import { ToastrService } from 'ngx-toastr';
import { ConditionalExpr } from '@angular/compiler';
import { AuthService } from '../../../../app/init/auth.service';
import { AdjustQuantityComponent } from '../adjust-quantity/adjust-quantity.component';
import { Router } from '@angular/router';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { event } from 'jquery';

export interface InventoryMapDataStructure {
  invMapID: string | '',
  locationID: string | '',
  location: string | '',
  warehouse: string | '',
  zone: string | '',
  carousel: string | '',
  row: string | '',
  shelf: string | '',
  bin: string | '',
  itemNumber: string | '',
  revision: string | '',
  serialNumber: string | '',
  lotNumber: string | '',
  expirationDate: string | '',
  description: string | '',
  itemQuantity: string | '',
  unitOfMeasure: string | '',
  maxQuantity: string | '',
  cellSize: string | '',
  goldenZone: string | '',
  putAwayDate: string | '',
  userField1: string | '',
  userField2: string | '',
  masterLocation: string | '',
  dateSensitive: boolean | '',
  dedicated: boolean | '',
  masterInvMapID: string | '',
  minQuantity: string | '',
  quantityAllocatedPick: string | '',
  quantityAllocatedPutAway: string | '',
  laserX: string | '',
  laserY: string | '',
  locationNumber: string | '',
  rn: string | '',
  velocity: string | '' //additional field,
  altLight: string | ''
}

@Component({
  selector: 'app-add-inv-map-location',
  templateUrl: './add-inv-map-location.component.html',
  styleUrls: ['./add-inv-map-location.component.scss']
})
export class AddInvMapLocationComponent implements OnInit {
  addInvMapLocation: FormGroup;
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
    velocity: '' //additional field
  };


  clickSubmit: boolean = true;
  headerLable: any;
  userData: any;
  FromOm:boolean=false;

  myroute1:boolean=true;
  myroute2:boolean=true;
  unitOFMeasure  
  itemNumberScroll:any = "vertical";

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private Api: ApiFuntions,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<any>,
    private router: Router
  ) {
    if (data.mode == "addInvMapLocation") {
      this.headerLable = 'Add Location';
    } else if (data.mode == "editInvMapLocation") {
      this.headerLable = 'Update Location';
    }

    if(this.router.url=="/InductionManager/Admin/InventoryMap" || this.router.url=="/OrderManager/InventoryMap"){
      this.myroute1=false;
      this.myroute2=false;
    }

  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.fieldNames=this.data?.fieldName;
    console.log(this.data.detailData)
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

    //  this.itemNumberList = this.data.itemList;

    this.Api.getLocZTypeInvMap().subscribe((res) => {
      this.locZoneList = res.data; 
      this.filteredOptions = this.addInvMapLocation.controls['location'].valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
      // this.filteredItemNum = this.addInvMapLocation.controls['item'].valueChanges.pipe(
      //   startWith(''),
      //   map(value => this._filterItemNum(value || '')),
      // );

    });


    // this.setStorage = localStorage.getItem('routeFromInduction')
    // this.setStorage = localStorage.getItem('routeFromOrderStatus')
    // this.routeFromIM = JSON.parse(this.setStorage)
    // this.routeFromOM = JSON.parse(this.setStorageOM)

  }

  ngAfterViewInit() {
    this.location_name.nativeElement.focus();
    if(this.router.url == '/OrderManager/InventoryMap'){
      this.addInvMapLocation.get('location')?.disable();
      this.addInvMapLocation.get('zone')?.disable();
      this.addInvMapLocation.get('description')?.disable();
      this.addInvMapLocation.get('laserX')?.disable();
      this.addInvMapLocation.get('laserY')?.disable();
      this.addInvMapLocation.get('warehouse')?.disable();
      this.addInvMapLocation.get('carousel')?.disable();
      this.addInvMapLocation.get('row')?.disable();
      this.addInvMapLocation.get('shelf')?.disable();
      this.addInvMapLocation.get('bin')?.disable();
      this.addInvMapLocation.get('unitOfMeasure')?.disable();
      this.addInvMapLocation.get('cell')?.disable();
      this.addInvMapLocation.get('velocity')?.disable();
      this.addInvMapLocation.get('altLight')?.disable();
      this.addInvMapLocation.get('userField1')?.disable();
      this.addInvMapLocation.get('userField2')?.disable();
      this.addInvMapLocation.get('quantityAllocatedPutAway')?.disable();
      this.addInvMapLocation.get('inventoryMapID')?.disable();
      this.addInvMapLocation.get('masterInventoryMapID')?.disable();
      this.addInvMapLocation.get('item')?.disable();
      this.addInvMapLocation.get('maxQuantity')?.disable();
      this.addInvMapLocation.get('minQuantity')?.disable();

    
    }



    

  }

  clearFields() {
    this.addInvMapLocation.patchValue({
      'userField1': '',
      'userField2': '',
      'item': '',
      'maxQuantity': '',
      'minQuantity': '',
      'putAwayDate': '',
      'serialNumber': '',
      'lotNumber': '',
      'revision': '',
      'expirationDate': '',
      'description':'',
      'location':'',
      'locationNumber':'',
      'laserX':'',
      'lasery':'',
      'warehouse':'',
      'zone':'',
      'carousel':'',
      'row':'',
      'shelf':'',
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
      this.toastr.error('No item found at the location specified.  Ensure that the entry selected has been saved since an item was assigned to it.', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      return;
    }
    let dialogRef = this.dialog.open(AdjustQuantityComponent, {
      height: 'auto',
      width: '800px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        id: this.getDetailInventoryMapData.invMapID
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result != true) {

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
      "isEqual": false,
      "username": this.userData.userName,
      "wsid": this.userData.wsid
    }
    this.Api.getSearchedItem(payload).subscribe(res => {
      if (res.data.length > 0) {
        this.itemNumberList = res.data;
      }
      else {
        this.addInvMapLocation.controls['item'].setValue('');
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
      carousel: [this.getDetailInventoryMapData.carousel || '', [Validators.pattern("^[0-9]*$"), Validators.maxLength(1)]],
      row: [this.getDetailInventoryMapData.row || '', [Validators.maxLength(5)]],
      shelf: [this.getDetailInventoryMapData.shelf || '', [Validators.maxLength(2)]],
      bin: [this.getDetailInventoryMapData.bin || '', [Validators.maxLength(3)]],
      item: [this.getDetailInventoryMapData.itemNumber || '', [Validators.maxLength(50)]],
      itemQuantity: new FormControl({value:this.getDetailInventoryMapData.itemQuantity || '',disabled:this.getDetailInventoryMapData.itemNumber == ''? true: false}),
      description: [this.getDetailInventoryMapData.description || ""],
      
      // description: new FormControl({ value: this.getDetailInventoryMapData.description ? this.getDetailInventoryMapData.description : "", disabled: true }),
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
      laserX: [this.getDetailInventoryMapData.laserX || 0, [Validators.pattern("^[0-9]*$"), Validators.maxLength(9)]],
      laserY: [this.getDetailInventoryMapData.laserY || 0, [Validators.pattern("^[0-9]*$"), Validators.maxLength(9)]],
      locationNumber: [this.getDetailInventoryMapData.locationNumber || '',],
      locationID: [this.getDetailInventoryMapData.locationID || ''],
      altLight: [this.getDetailInventoryMapData.altLight || 0, [Validators.maxLength(9), Validators.pattern("^[0-9]*$")]]

      //velocity
    });
  }

  onMinChange(event: KeyboardEvent) {
    let max = parseInt(this.addInvMapLocation.get("maxQuantity")?.value ? this.addInvMapLocation.get("maxQuantity")?.value : 0);
    let min = parseInt(this.addInvMapLocation.get("minQuantity")?.value ? this.addInvMapLocation.get("minQuantity")?.value : 0);
    if(min > max){
      this.addInvMapLocation.get("minQuantity")?.setValue("");
    }

    // var max = this.addInvMapLocation.get("maxQuantity")?.value;
    // var min = this.addInvMapLocation.get("minQuantity")?.value;
    // if (max == "" || max == "0") {
    //   this.addInvMapLocation.get("minQuantity")?.setValue("0");
    // }
    // if (min > max) {
    //   this.addInvMapLocation.get("minQuantity")?.setValue(this.addInvMapLocation.get("maxQuantity")?.value.toString().charAt(0));
    // }
  }

  onMaxChange($event) {
    this.addInvMapLocation.get("minQuantity")?.setValue("0");
  }

  onchangeItemNumber() {
    let value = this.addInvMapLocation.controls['zone'].value + this.addInvMapLocation.controls['carousel'].value + this.addInvMapLocation.controls['row'].value + this.addInvMapLocation.controls['shelf'].value + this.addInvMapLocation.controls['bin'].value;
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
            this.Api.updateInventoryMap(form.value,invMapIDs).subscribe((res) => {
              this.clickSubmit = true;
              
              if (res.isExecuted) {
                this.toastr.success("Your details have been updated", 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000
                });

                this.dialog.closeAll()
              }
            });
          } else {
            this.clickSubmit = false;
            this.Api.createInventoryMap(form.value).subscribe((res) => {
              this.clickSubmit = true;
              
              if (res.isExecuted) {
                this.toastr.success("Your details have been added", 'Success!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000
                });

                this.dialog.closeAll()
              }
            });
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
    let dialogRef = this.dialog.open(WarehouseComponent, {
      height: 'auto',
      width: '640px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'addlocation',
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      ;

      if (result !== true && result !== false) {
        this.addInvMapLocation.controls['warehouse'].setValue(result);
      }
      if (result == 'clear') {
        this.addInvMapLocation.controls['warehouse'].setValue('');
      }
    })
  }
  loadCellSize() {

    let dialogRef = this.dialog.open(CellSizeComponent, {
      height: 'auto',
      width: '660px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'cell-size',
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result !== true && result !== false) {
        this.addInvMapLocation.controls['cell'].setValue(result);
      }
    })
  }
  loadVelocityCode() {
    let dialogRef = this.dialog.open(VelocityCodeComponent, {
      height: 'auto',
      width: '660px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'cell-size',
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result !== true && result !== false) {
        this.addInvMapLocation.controls['velocity'].setValue(result);
      }

    })
  }

  private _filter(value: any): string[] {
    const filterValue = value.toLowerCase();

    return this.locZoneList.filter(option => option.locationName.toLowerCase().includes(filterValue));
  }
  private _filterItemNum(value: any): string[] {
    const filterValue = value.toLowerCase();
    return this.itemNumberList.filter(option => option.itemNumber.toLowerCase().includes(filterValue));
  }
  loadZones(zone: any) {
    this.zoneList = this.locZoneList.filter(option => option.locationName.includes(zone.option.value));
    this.addInvMapLocation.controls['zone'].setValue(this.zoneList[0].zone);
    this.updateItemNumber('zone', this.zoneList[0].zone);

  }
  loadItemDetails(item: any) {
    this.itemNumberList.map(val => {
      if (val.itemNumber === item) {
        this.addInvMapLocation.controls['description'].setValue(val.description ?? '');
        // this.itemDescription = ;
      }
    })
    let payload = {
      "itemNumber": item,
      "zone": this.addInvMapLocation.get('zone')?.value
    }

    const cellSizeVal = this.cellSizeVal.nativeElement.value
    const velCodeVal = this.velCodeVal.nativeElement.value
    

    this.Api.getItemNumDetail(payload).subscribe((res) => {
      if (res.isExecuted) {
        this.unitOFMeasure =res.data.unitOfMeasure 
        var match = '';
        var expected = '';
        if (cellSizeVal != res.data.cellSize && res.data.cellSize) {
          match += 'Cell Size';
          expected += ' Expecting Cell Size: ' + res.data.cellSize;
        };
        if (velCodeVal != res.data.velocityCode && res.data.velocityCode) {
          if (match != '') { match += ', Velocity Code'; expected += ' and Velocity Code: ' + res.data.velocityCode } else { match += 'Velocity Code'; expected += 'Velocity Code: ' + res.data.velocityCode };
        };
        if (match != '') {
          this.toastr.info('Provided ' + match + ' do not match Inventory Master.' + expected + ' for specified Item and Zone', 'Info!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
      }

    });
  }

  updateItemNumber(col?: string, val?: any) {

    if (col === 'zone') {
      this.zone = val.toString();
    }
    if (col === 'carousel') {
      this.carousel = val.toString();
    }
    if (col === 'row') {
      this.row = val.toString();
    }
    if (col === 'shelf') {
      this.shelf = val.toString();
    }
    if (col === 'bin') {
      this.bin = val.toString();
    }
    this.autoFillLocNumber = this.zone + this.carousel + this.row + this.shelf + this.bin;
  }



  dialogClose() {
    this.dialogRef.close('close');
  }

  @HostListener('unloaded')
  ngOnDestroy() {
    
  }

  focusinmethod(){
    this.itemNumberScroll = "";
  }
  focusoutmethod(){
    this.itemNumberScroll = "vertical";
  }
}
