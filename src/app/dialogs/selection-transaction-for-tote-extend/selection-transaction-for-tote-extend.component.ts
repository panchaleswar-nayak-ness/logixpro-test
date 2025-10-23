import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from 'src/app/common/init/auth.service';
import { CrossDockTransactionComponent } from '../cross-dock-transaction/cross-dock-transaction.component';
import labels from 'src/app/common/labels/labels.json';
import { CellSizeComponent } from 'src/app/admin/dialogs/cell-size/cell-size.component';
import { VelocityCodeComponent } from 'src/app/admin/dialogs/velocity-code/velocity-code.component';
import { ChooseLocationComponent } from '../choose-location/choose-location.component';
import { WarehouseComponent } from 'src/app/admin/dialogs/warehouse/warehouse.component';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
import { PaPrintLabelConfirmationComponent } from '../pa-print-label-confirmation/pa-print-label-confirmation.component';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { AlertConfirmationComponent } from '../alert-confirmation/alert-confirmation.component';
import {  ToasterTitle ,ResponseStrings,ToasterType,ToasterMessages,DialogConstants,Style,UniqueConstants,StringConditions,ColumnDef, Placeholders} from 'src/app/common/constants/strings.constants';
import { DialogCommunicationService } from 'src/app/common/services/dialog-communication.service';
import { Subscription } from 'rxjs';
import { BatchTotesTableResponse } from 'src/app/induction-manager/process-put-aways/process-put-aways.component';
import { ApiResponse } from 'src/app/common/types/CommonTypes';

@Component({
  selector: 'app-selection-transaction-for-tote-extend',
  templateUrl: './selection-transaction-for-tote-extend.component.html',
  styleUrls: ['./selection-transaction-for-tote-extend.component.scss']
})
export class SelectionTransactionForToteExtendComponent implements OnInit, OnDestroy {
  @ViewChild('fieldFocus') fieldFocus: ElementRef;
  @ViewChild('tooltip') tooltip: any = ElementRef;
  @ViewChild('inputToteQty') inputToteQty: ElementRef;
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  ItemNumber: string = this.fieldMappings.itemNumber;
  UnitOfMeasure: string = this.fieldMappings.unitOfMeasure;

  public userData   : any;
  isWarehouseSensitive: boolean = false;
  toteForm          : FormGroup;
  cellSizeList      : any = [];
  velocityCodeList  : any = [];
  orderNum          : any;
  totes             : any = [];
  selectedTotePosition: any = '';
  selectedToteID: any = '';
  fieldNames: any;
  imPreferences: any;
  toolTipMsgForTransQty: string = '';
  QtyToAssignFieldColor: string = 'primary';
  initialFocus: boolean = true;
  blindInductionReason:boolean = false
  blindInductOptions: any[] = [];  // Array to store the API response

  public iInductionManagerApi : IInductionManagerApiService;
  public iAdminApiService : IAdminApiService;
  public iCommonAPI : ICommonApi;
  event: Event;
  placeholders = Placeholders;
  private readonly subscriptions: Subscription[] = [];

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef,
    public commonAPI : CommonApiService,
    public dialogRef : MatDialogRef<SelectionTransactionForToteExtendComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public adminApiService: AdminApiService,
    public formBuilder : FormBuilder,
    private authService : AuthService,
    public inductionManagerApi: InductionManagerApiService,
    public router: Router,
    private global:GlobalService,
    private dialogCommunicationService: DialogCommunicationService
  ) {
    const selectedTote = this.data?.totes?.find((e) => e.isSelected);
    let cell = selectedTote?.toteQuantity != null ? Number(selectedTote.toteQuantity) + 1 : 0;
    this.iInductionManagerApi = inductionManagerApi;
    this.iAdminApiService = adminApiService;
    this.iCommonAPI = commonAPI;
    this.toteForm = this.formBuilder.group({
      // Header
      itemNumber                        : new FormControl('', Validators.compose([])),
      description                       : new FormControl('', Validators.compose([])),
      batchID                           : new FormControl('', Validators.compose([])),
      zones                             : new FormControl('', Validators.compose([])),

      // Trans Info
      orderNumber                       : new FormControl('', Validators.compose([])),
      category                          : new FormControl('', Validators.compose([])),
      subCategory                       : new FormControl('', Validators.compose([])),
      userField1                        : new FormControl('', Validators.compose([])),
      userField2                        : new FormControl('', Validators.compose([])),
      lotNumber                         : new FormControl('', Validators.compose([])),
      expirationDate                    : new FormControl('', Validators.compose([])),
      serialNumber                      : new FormControl('', Validators.compose([])),
      transactionQuantity               : new FormControl('', Validators.compose([])),
      warehouse                         : new FormControl('', Validators.compose([])),
      returnToStock                     : new FormControl(false, Validators.compose([])),
      blindInduct                       : new FormControl('', Validators.compose([])),

      // Item Info
      supplierItemID                    : new FormControl('', Validators.compose([])),
      warehouseSensitive                : new FormControl({value : false, disabled : true}, Validators.compose([])),
      dateSensitive                     : new FormControl({value : false, disabled : true}, Validators.compose([])),
      fifo                              : new FormControl({value : false, disabled : true}, Validators.compose([])),
      fifoDate                          : new FormControl('', Validators.compose([])),
      unitOfMeasure                     : new FormControl('', Validators.compose([])),
      carouselCellSize                  : new FormControl('', Validators.compose([])),
      bulkCellSize                      : new FormControl('', Validators.compose([])),
      cfCellSize                        : new FormControl('', Validators.compose([])),
      carouselVelocity                  : new FormControl('', Validators.compose([])),
      bulkVelocity                      : new FormControl('', Validators.compose([])),
      cfVelocity                        : new FormControl('', Validators.compose([])),
      primaryPickZone                   : new FormControl('', Validators.compose([])),
      secondaryPickZone                 : new FormControl('', Validators.compose([])),

      // Location Info
      zone                              : new FormControl('', Validators.compose([])),
      carousel                          : new FormControl('', Validators.compose([])),
      row                               : new FormControl('', Validators.compose([])),
      shelf                             : new FormControl('', Validators.compose([])),
      bin                               : new FormControl('', Validators.compose([])),
      cellSize                          : new FormControl('', Validators.compose([])),
      velocityCode                      : new FormControl('', Validators.compose([])),
      itemQuantity                      : new FormControl('', Validators.compose([])),
      maximumQuantity                   : new FormControl('', Validators.compose([])),
      quantityAllocatedPutAway          : new FormControl('', Validators.compose([])),
      replenishment                     : new FormControl(0, Validators.compose([])),

      // Complete Transaction
      toteID                            : new FormControl('', Validators.compose([])),
      totePos                           : new FormControl('', Validators.compose([])),
      toteCells                         : new FormControl({value : '', disabled : true}, Validators.compose([])),
      toteQty                           : new FormControl({ value: 0, disabled: false}, Validators.compose([])),

      invMapID                          : new FormControl(0, Validators.compose([])),
      dedicated                         : new FormControl(false, Validators.compose([])),
      cell                              : new FormControl(cell, Validators.compose([])),
    });
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.OSFieldFilterNames();
    this.getCellSizeList();
    this.getVelocityCodeList();
    this.getDetails();
    this.imPreferences = this.global.getImPreferences();
    this.pickToteSetupIndex();          
    this.subscribeToUpdates();
  }

  subscribeToUpdates() {
    this.subscriptions.push(
      this.dialogCommunicationService.batchUpdate$.subscribe((newBatchId: string) => {
        if (newBatchId) {
          this.toteForm.patchValue({ batchID: newBatchId });
          this.data.batchID = newBatchId;
        }
      }),
      this.dialogCommunicationService.zoneUpdate$.subscribe((newZones: string) => {
        if (newZones) {
          this.toteForm.patchValue({ zones: newZones });
          this.data.zones = newZones;
        }
      }),
      this.dialogCommunicationService.totesUpdate$.subscribe((newTotes: BatchTotesTableResponse[]) => {
        if (newTotes) {
          this.data.totes = newTotes;
          this.totes = this.data.totes;
          let fil = this.totes.filter((e: any) => e.isSelected);
          if(fil.length > 0) {
          this.toteForm.patchValue({
            toteID                            : fil[0].toteID,
              totePos                           : fil[0].totesPosition,
              toteCells                         : fil[0].cells
            });
          }
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.fieldFocus?.nativeElement.focus();
    this.blindInductionReason = this.data.blindInductionReason
    if (this.blindInductionReason) {
      this.getBlindInductionTable();
    }
  }

  public OSFieldFilterNames() {
    this.iAdminApiService.ColumnAlias().subscribe((res: any) => {
      if (res.data && res.isExecuted) this.fieldNames = res.data;
      else this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
    });
  }




  getBlindInductionTable() {
    this.iAdminApiService.getLookupTableData("BlindInduct").subscribe(res => {
      if (res.isExecuted) {
        this.blindInductOptions = res.data.sort((a, b) => a.sequence - b.sequence);
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      }
    });
  }

  onToteChange(event,type){
    this.totes.filter(item => {
      if(type === 'toteId'){  // change position on id base
        if(item.toteID === event.value) {
          this.selectedTotePosition=item.totesPosition
          return
        }
      } else if(item.totesPosition===event.value) { //change id on position base
          this.selectedToteID=item.toteID
          return;
      }
    });
  }

  getDetails() {
    try {
      let payload = {
        "otid": this.data.otid,
        "itemNumber": this.data.itemNumber,
      }
      this.iInductionManagerApi.ItemDetails(payload).subscribe(
        (res: any) => {
          if (res.data && res.isExecuted) {
            const values = res.data[0];
            this.isWarehouseSensitive = values.warehouseSensitive;
            this.orderNum = values.orderNumber;
            this.totes = this.data.totes;
            let fil = this.totes.filter((e: any) => e.isSelected);
            this.toteForm.patchValue({

              // Header
              itemNumber                        : values.itemNumber,
              description                       : values.description,
              batchID                           : this.data.batchID,
              zones                             : this.data.zones,

              // Trans Info
              orderNumber                       : values.orderNumber,
              category                          : values.category,
              subCategory                       : values.subCategory,
              userField1                        : values.userField1,
              userField2                        : values.userField2,
              lotNumber                         : values.lotNumber,
              expirationDate                    : values.expirationDate ? formatDate(values.expirationDate, 'yyyy-MM-dd', 'en') : '',
              serialNumber                      : values.serialNumber,
              transactionQuantity               : this.data.transactionQuantity ? this.data.transactionQuantity : this.data.defaultPutAwayQuantity,
              warehouse                         : values.warehouse,

              // Item Info
              supplierItemID                    : values.supplierItemID,
              warehouseSensitive                : values.warehouseSensitive,
              dateSensitive                     : values.dateSensitive,
              fifo                              : values.fifo,
              fifoDate                          : values.fifoDate,
              unitOfMeasure                     : values.unitOfMeasure,
              carouselCellSize                  : values.carouselCellSize,
              bulkCellSize                      : values.bulkCellSize,
              cfCellSize                        : values.cfCellSize,
              carouselVelocity                  : values.carouselVelocity,
              bulkVelocity                      : values.bulkVelocity,
              cfVelocity                        : values.cfVelocity,
              primaryPickZone                   : values.primaryPickZone!.toLowerCase(),
              secondaryPickZone                 : values.secondaryPickZone!.toLowerCase(),

              // Location Info
              zone                              : values.zone,
              carousel                          : values.carousel,
              row                               : values.row,
              shelf                             : values.shelf,
              bin                               : values.bin,
              cellSize                          : values.cellSize,
              velocityCode                      : values.velocityCode,
              itemQuantity                      : values.itemQuantity,
              maximumQuantity                   : values.maximumQuantity,
              quantityAllocatedPutAway          : values.quantityAllocatedPutAway,

              // Complete Transaction
              toteID                            : fil[0].toteID,
              totePos                           : fil[0].totesPosition,
              toteCells                         : fil[0].cells,
              toteQty                           : this.data.transactionQuantity ? this.data.transactionQuantity : this.data.defaultPutAwayQuantity,

              invMapID                          : values.invMapID,
              dedicated                         : values.dedicated,
            });
            this.toolTipMsgForTransQty = `Current Transaction Quantity is ${this.toteForm.value.transactionQuantity}`;
            this.checkRepenishment();
            this.inputToteQty.nativeElement.focus();
          } else {
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
            console.log("ItemDetails",res.responseMessage);
          }
        },
        (error) => { }
      );
    } catch (error) {}
  }

  clearTransInfo() {
    let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        message: 'Click OK to clear serial number, lot number, expiration date, warehouse, Ship VIA, and Ship To Name',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == ResponseStrings.Yes) {
        this.toteForm.patchValue({
          userField1                        : '',
          userField2                        : '',
          lotNumber                         : '',
          expirationDate                    : '',
          serialNumber                      : '',
          warehouse                         : '',
        });
      }
    });
  }

  getCellSizeList() {
    this.iCommonAPI.getCellSize().subscribe((res) => {
      if (res.isExecuted && res.data) this.cellSizeList = res.data;
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("getCellSize",res.responseMessage);
      }
    });
  }

  getVelocityCodeList() {
    this.iCommonAPI.getVelocityCode().subscribe((res) => {
      if (res.isExecuted && res.data) this.velocityCodeList = res.data;
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("getVelocityCode",res.responseMessage);
      }
    });
  }

  updateItemInfo() {
    try {
      let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
        disableClose:true,
        data: {
          message: 'Click OK to save current cell sizes and velocity codes for this item to the inventory master.',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result == ResponseStrings.Yes) {
          const values = this.toteForm.value;
          let payload = {
            "itemNumber": values.itemNumber,
            "ccell": values.carouselCellSize,
            "bcell": values.bulkCellSize,
            "cFcell": values.cfCellSize,
            "cvel": values.carouselVelocity,
            "bvel": values.bulkVelocity,
            "cFvel": values.cfVelocity,
            "pzone": values.primaryPickZone,
            "szone": values.secondaryPickZone,
          }

          this.iInductionManagerApi.IMUpdate(payload).subscribe(
            (res: any) => {
              if (res.data && res.isExecuted) this.global.ShowToastr(ToasterType.Success,labels.alert.update, ToasterTitle.Success);
              else {
                this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
                console.log("IMUpdate",res.responseMessage);
              }
            },
            (error) => { }
          );
        }
      });
    } catch (error) {}
  }

  public openCellSizeDialog(param : any) {
    let currentValue="";

    if(param == UniqueConstants.cellSize) currentValue = this.toteForm.controls['carouselCellSize'].value;
    else if(param == 'bulkCellSize') currentValue = this.toteForm.controls['bulkCellSize'].value;
    else if(param == 'cfCellSize') currentValue = this.toteForm.controls['cfCellSize'].value;

    let dialogRef:any = this.global.OpenDialog(CellSizeComponent, {
      height: 'auto',
      width: '750px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        mode: '',
        cs:currentValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
        if(param == UniqueConstants.cellSize) this.toteForm.patchValue({ 'carouselCellSize' : result });
        else if(param == 'bulkCellSize') this.toteForm.patchValue({ 'bulkCellSize' : result });
        else if(param == 'cfCellSize') this.toteForm.patchValue({ 'cfCellSize' : result });
      this.getCellSizeList();
    });
  }

  public openVelocityCodeDialog(param : any) {
    let currentValue="";

    if(param == UniqueConstants.goldenZone) currentValue  = this.toteForm.controls['carouselVelocity'].value;
    else if(param == 'bulkVelocity') currentValue  = this.toteForm.controls['bulkVelocity'].value;
    else if(param == 'cfVelocity') currentValue  = this.toteForm.controls['cfVelocity'].value;

    let dialogRef:any = this.global.OpenDialog(VelocityCodeComponent, {
      height: 'auto',
      width: '750px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        mode: '',
        vc: currentValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result)
        if(param == UniqueConstants.goldenZone) this.toteForm.patchValue({ 'carouselVelocity' : result });
        else if(param == 'bulkVelocity') this.toteForm.patchValue({ 'bulkVelocity' : result });
        else if(param == 'cfVelocity') this.toteForm.patchValue({ 'cfVelocity' : result });
      this.getVelocityCodeList();
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openChooseLocation() {
    const values = this.toteForm.value;
    const dialogRef:any = this.global.OpenDialog(ChooseLocationComponent, {
      height: 'auto',
      width: '70vw',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: values
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res?.responseMessage  === "Reserved Successfully") {
        this.toteForm.patchValue({
          zone                              : res.zone,
          carousel                          : res.carousel,
          row                               : res.row,
          shelf                             : res.shelf,
          bin                               : res.bin,
          cellSize                          : res.cellSize,
          velocityCode                      : res.velocity,
          itemQuantity                      : res.qty,
          maximumQuantity                   : res.max,
          quantityAllocatedPutAway          : res.qtyPut,
          invMapID                          : res.invMapID,
          warehouse                         : res.warehouse ? res.warehouse : values.warehouse
        });
      }
    });
  }

  checkRepenishment() {
    try {
      const values = this.toteForm.value;
      if (!this.validationPopups({...values, type : 0})) { return; }
      let payLoad = { 'item': values.itemNumber };
      this.iInductionManagerApi.CheckForwardLocations(payLoad).subscribe(
        (res: any) => {
          if(res.isExecuted) {
            if (res.data > 0 && this.data.autoForwardReplenish) {
              let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
                height: 'auto',
                width: Style.w560px,
                autoFocus: DialogConstants.autoFocus,
                disableClose: true,
                data: {
                  message: 'There is a need for ' + res.data + ' of item: ' + values.itemNumber + '. Press OK to find a location needing replenishment. Otherwise press CANCEL to do a normal location search',
                }
              });

              dialogRef.afterClosed().subscribe((result) => {
                if (result == ResponseStrings.Yes) {
                  const transactionQty = this.data.transactionQuantity ? this.data.transactionQuantity : this.data.defaultPutAwayQuantity;
                  const checkForwardLocationsQty = res.data || 0;
                  
                  // Update toteQty to CheckForwardLocations data if it's less than transactionQty
                  const toteQtyValue = (transactionQty > checkForwardLocationsQty && checkForwardLocationsQty > 0) 
                    ? checkForwardLocationsQty 
                    : transactionQty;
                  
                  this.toteForm.patchValue({
                    toteQty: toteQtyValue
                  });

                  this.findLocation(true, res.data)
                }
              });

            } else this.findLocation(false, 0);
          }
          else {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.log("CheckForwardLocations",res.responseMessage);
          }
        },
        (error) => { console.log(error); }
      );
    } catch (error) {console.log(error); }
  }

  findLocation(replenfwd : any, repQty : number) {
    try {
      this.toteForm.patchValue({ replenishment : replenfwd ? repQty : 0 });
      const values = this.toteForm.value;
      let payLoad = {
        "qtyPut": values.quantityAllocatedPutAway ? parseInt(values.quantityAllocatedPutAway) : 0,
        'item': values.itemNumber,
        "ccell": values.carouselCellSize,
        "cvel": values.carouselVelocity,
        "bcell": values.bulkCellSize,
        "bvel": values.bulkVelocity,
        "cfcell": values.cfCellSize,
        "cfvel": values.cfVelocity,
        "whse": values.warehouse,
        "dateSens": this.toteForm.getRawValue().dateSensitive,
        "fifo": this.toteForm.getRawValue().fifo,
        "isReel": false,
        "lot": values.lotNumber,
        "ser": values.serialNumber,
        "replenfwd": replenfwd,
        "prevZone": values.zones.replace("Zones:",""),
        "dedicate": values.dedicate,
        "rts": values.returnToStock,
        "expDate": values.expirationDate,
        "primaryZone": values.primaryPickZone,
        "secondaryZone": values.secondaryPickZone,
      };
      this.iInductionManagerApi.FindLocation(payLoad).subscribe(
        (res: any) => {
          if (res.data && res.isExecuted) {
            if (res.data.success) {
              // Validate zone and update batch if needed
              let payload = { zone: res.data.zone };
              this.iInductionManagerApi.BatchByZone(payload).subscribe(
                (batchRes: ApiResponse<string>) => {
                  if (batchRes.isExecuted) {
                    const zoneBatchId = batchRes.data;
                    
                    if (zoneBatchId) {
                      if(zoneBatchId != this.data.batchID) {
                      // Zone belongs to different batch - broadcast update
                        this.dialogCommunicationService.updateBatch(zoneBatchId);
                      }
                      this.toteForm.patchValue({
                        // Location Info
                        zone                              : res.data.zone,
                        carousel                          : res.data.carousel,
                        row                               : res.data.row,
                        shelf                             : res.data.shelf,
                        bin                               : res.data.bin,
                        cellSize                          : res.data.cellSz,
                        velocityCode                      : res.data.velCode,
                        itemQuantity                      : res.data.locQty,
                        maximumQuantity                   : res.data.locMaxQty,
                        quantityAllocatedPutAway          : res.data.qtyAlloc,
                        invMapID                          : res.data.invMapID
                      });
                    } else {
                      let dialogRef = this.global.OpenDialog(ConfirmationDialogComponent, {
                        height: DialogConstants.auto,
                        width: Style.w560px,
                        autoFocus: DialogConstants.autoFocus,
                        disableClose: true,
                        data: {
                          message: ToasterMessages.NoBatchesWithZone.replace('{{zone}}', res.data.zone),
                        },
                      });

                      dialogRef.afterClosed().subscribe((res) => {
                        if (res == ResponseStrings.Yes) this.dialogRef.close("New Batch");
                      });                      
                    }
                  }
                }
              );              
            } else this.global.ShowToastr(ToasterType.Error,'No available locations were found for this item.', ToasterTitle.Error);
          } else {
            this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
            console.log("FindLocation",res.responseMessage);
          }
        },
        (error) => { console.log(error); }
      );
    } catch (error) {
      console.log(error)
    }
  }

  openCrossDockTransactionDialogue() {
    const values = this.toteForm.value;

    const dialogRef:any = this.global.OpenDialog(CrossDockTransactionComponent, {
      height: 'auto',
      width: '70vw',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        itemWhse: values.itemNumber,
        userId: this.userData.userName,
        wsid: this.userData.wsid,
        warehouse: values.warehouse,
        batchID: this.data.batchID,
        zone: values.zones,
        description: values.description,
        values,
        otid : this.data.otid
      }
    });

    dialogRef.afterClosed().subscribe((res) => {
      this.toteForm.patchValue({
        transactionQuantity    : values.transactionQuantity - (values.otid > 0 ?  (res.qtyToSubtract ? res.qtyToSubtract : 0) : 0), // Used for existing transaction qty. Only update the qty if the transaction is an existing transaction.
        toteQty                : values.toteQty, // Just update the UI with what is in the values object since the cross-dock-transaction.component.ts#295 is updating the value.
      });
      if(res.data == "Submit") this.completeTransaction();
    });
  }

  openWareHouse() {
    if(!this.isWarehouseSensitive) return;
    const values = this.toteForm.value;
    const dialogRef:any = this.global.OpenDialog(WarehouseComponent, {
      height: 'auto',
      width: '640px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        userName: this.userData.userName,
        wsid: this.userData.wsid,
        supplierID: values.supplierItemID,
        check: 'fromReelDetail'
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if(res && res != StringConditions.clear) {
        this.toteForm.patchValue({ 'warehouse' : res });
        this.findLocation(false, 0);
      } else if(res == StringConditions.clear) this.toteForm.patchValue({ 'warehouse' : '' });
    });
  }

  validationPopups(val : any) {
    if (val.type == 1) {
      if (val.invMapID <= 0 || !val.invMapID || val.zone == "") {
        this.global.ShowToastr(ToasterType.Error,'You must select a location for this transaction before it can be processed.', ToasterTitle.Error);
        return false;
      }

      if (this.toteForm.getRawValue().dateSensitive && !val.expirationDate) {
        this.global.ShowToastr(ToasterType.Error,'This item is date sensitive. You must provide an expiration date.', ToasterTitle.Error);
        return false;
      }
      if (this.blindInductionReason && !this.toteForm.get('blindInduct')?.value && this.blindInductOptions.length > 0) {
        this.global.ShowToastr(ToasterType.Error, 'No reason code selected. Please select a reason code for this induction.', ToasterTitle.Error);
        return false;
      }
    }

    if (this.toteForm.getRawValue().fifo && val.fifoDate.toLowerCase() == 'expiration date' && !val.expirationDate) {
      this.global.ShowToastr(ToasterType.Error,'This item is marked as FIFO with Expiration Date and its FIFO Date.You must provide an Expiration Date.', ToasterTitle.Error);
      return false;
    }

    if (this.toteForm.getRawValue().warehouseSensitive && !val.warehouse) {
      this.global.ShowToastr(ToasterType.Error,'This item is warehouse sensitive and must be assigned a warehouse before process can continue.', ToasterTitle.Error);
      return false;
    }

    return true;
  }

  completeTransaction() {
    try {
      const values = this.toteForm.value;
      if (!this.validationPopups({...values, type : 1})) return;
      if (!this.validateOverReciept(values.otid)) return;

      let payload = { zone: this.toteForm.value.zone };
      this.iInductionManagerApi.BatchByZone(payload).subscribe(
        (res: any) => {
          if (res.isExecuted) {
            if (!res.data || res.data != this.toteForm.value.batchID) {
              let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
                height: 'auto',
                width: Style.w560px,
                autoFocus: DialogConstants.autoFocus,
                data: {
                  message: 'There are no batches with this zone (' + this.toteForm.value.zone + ') assigned.  Click OK to start a new batch or cancel to choose a different location/transaction.',
                },
              });

              dialogRef.afterClosed().subscribe((res) => {
                if(res == ResponseStrings.Yes) this.dialogRef.close("New Batch");
              });
            } else {
              let payLoad = {
                sRow: 1,
                eRow: 5,
                itemWhse: [
                  values.itemNumber,
                  values.warehouse,
                  "1=1"
                ],
              };

              this.iInductionManagerApi.CrossDock(payLoad).subscribe(
                (res: any) => {
                  if (res.data && res.isExecuted) {
                    if(res.data.transaction.length > 0) {
                      let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
                        height: 'auto',
                        width: Style.w560px,
                        autoFocus: DialogConstants.autoFocus,
                        disableClose:true,
                        data: {
                          message: 'Cross Dock opportunity!  Click OK to view backorder transactions for the item you are putting away.',
                        },
                      });

                      dialogRef.afterClosed().subscribe((result) => {
                        if (result == ResponseStrings.Yes) this.openCrossDockTransactionDialogue();
                        else this.complete(values);
                      });
                    }
                    else this.complete(values);
                  } else {
                    this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error );
                    console.log("CrossDock",res.responseMessage);
                  }
                },
                (error) => { console.log(error); }
              );
            }
          }
          else {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.log("BatchByZone",res.responseMessage);
          }
      });
    } catch (error) {}
  }

  validateOverReciept(otid: number) {
    let toteQty = this.toteForm?.get('toteQty')?.value;
    let transactionQuantity = this.toteForm?.get(ColumnDef.TransactionQuantity)?.value;
    if(otid > 0 && this.imPreferences.dontAllowOverReceipt && toteQty > transactionQuantity) {
      this.global.ShowToastr(ToasterType.Error, "Quantity cannot be greater than current transaction quantity.", ToasterTitle.Error);
      this.inputToteQty.nativeElement.focus();
      this.QtyToAssignFieldColor = 'warn';
      return false;
    }
    else {
      this.QtyToAssignFieldColor = 'primary';
      return true;
    }
  }

  taskComplete(values : any) {
    let payload2 = {
      "otid": this.data.otid,
      "splitQty": values.splitQty || 0,
      "qty": values.toteQty,
      'toteID': values.toteID,
      "batchID": this.data.batchID,
      "item": values.itemNumber,
      "uF1": values.userField1,
      "uF2": values.userField2,
      "lot": values.lotNumber,
      "ser": values.serialNumber,
      "totePos": values.totePos ? parseInt(values.totePos) : 0,
      'cell': values.cell,
      "warehouse": values.warehouse,
      "expDate": values.expirationDate,
      "revision": "",
      "zone": values.zone,
      'carousel' : values.carousel,
      'row': values.row,
      "shelf": values.shelf,
      "bin": values.bin,
      "invMapID": values.invMapID,
      "locMaxQty": values.maximumQuantity ? parseInt(values.maximumQuantity) : 0,
      "reel": false,
      "dedicate": values.dedicated,
      "orderNumber": values.orderNumber,
      "reasonCode":values.blindInduct
    }

    this.iInductionManagerApi.TaskComplete(payload2).subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          let OTID = res.data
          if(this.imPreferences.autoPrintPutAwayLabels) {
            let numLabel = 1;
            if(this.imPreferences.requestNumberOfPutAwayLabels && this.imPreferences.printDirectly) {
              // here pop up will be implemented which will ask for number of labels
              let dialogRef:any = this.global.OpenDialog(PaPrintLabelConfirmationComponent, {
                height: 'auto',
                width: Style.w560px,
                autoFocus: DialogConstants.autoFocus,
                disableClose:true,
              });

              dialogRef.afterClosed().subscribe((result) => {
                if (result > 0)
                  if (!this.imPreferences.printDirectly) {
                    window.open(`/#/report-view?file=FileName:PrintPutAwayItemLabels|OTID:${OTID}`, UniqueConstants._blank, 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
                  }
                  else {
                    // TODO: Replace with print controller call and remove for loop.  Send number of labels to controller
                    for (let i = 0; i < result; i++)
                      this.iAdminApiService.PrintPutAwayItemLabels(OTID);
                  }
              });
            }
            else if (numLabel > 0)
              if(!this.imPreferences.printDirectly) {
                window.open(`/#/report-view?file=FileName:PrintPutAwayItemLabels|OTID:${OTID}`, UniqueConstants._blank, 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
              }
              else {
                // TODO: Replace with print controller call
                  this.iAdminApiService.PrintPutAwayItemLabels(OTID);
              }
          }
          this.dialogRef.close("Task Completed");
          this.global.ShowToastr(ToasterType.Success,labels.alert.update, ToasterTitle.Success );
        } else {
          this.global.ShowToastr(ToasterType.Error,ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
          console.log("TaskComplete",res.responseMessage);
        }
      },
      (error) => { }
    );
  }

  pickToteSetupIndex() {
    return new Promise(() => {
      this.iInductionManagerApi.PickToteSetupIndex({}).subscribe(res => {
        if (res.isExecuted && res.data) this.imPreferences = res?.data?.imPreference;
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("PickToteSetupIndex",res.responseMessage);
        }
      });
    });
  }

  complete(values : any) {

    if (!this.validationPopups({...values, type : 1})) return;

    let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        message: 'Click OK to complete this transaction and assign it to the selected batch and tote.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == ResponseStrings.Yes) {
        if (values.toteQty <= 0) this.global.ShowToastr(ToasterType.Error,'Quantity should be greater 0', ToasterTitle.Error);
        else {

          let splitQty = 0;
          if (this.imPreferences.splitShortPutAway && this.imPreferences.defaultPutAwayShortQuantity === 'Prompt user on short quantity' && parseInt(values.toteQty) < parseInt(values.transactionQuantity) && this.data.otid != '') {

            let dialogRef : any = this.global.OpenDialog(ConfirmationDialogComponent, {
              height: 'auto',
              width: Style.w560px,
              autoFocus: DialogConstants.autoFocus,
              disableClose:true,
              data: {
                message: 'This transaction quantity is greater than the assigned quantity.  Click OK if you will receive more of this order/item.  Click Cancel to mark this transaction as received short.',
              },
            });

            dialogRef.afterClosed().subscribe((result) => {
              if (result == ResponseStrings.Yes) 
                splitQty = parseInt(values.transactionQuantity) - parseInt(values.toteQty);

              this.taskComplete({ splitQty : splitQty, ...values });
            });

          } else if(this.imPreferences.splitShortPutAway && this.imPreferences.defaultPutAwayShortQuantity === 'Split transaction on short quantity') {
            splitQty = parseInt(values.transactionQuantity) - parseInt(values.toteQty);
            this.taskComplete({ splitQty : splitQty, ...values });

          } else if(this.imPreferences.splitShortPutAway && this.imPreferences.defaultPutAwayShortQuantity === 'Cancel on short quantity') {
            this.taskComplete(values);

          } else {
            this.taskComplete(values);
          } 
        }
      }
    });
  }

  onViewItemDetail(itemNum:any) {
    this.router.navigate([]).then(() => {
      window.open(`/#/admin/inventoryMaster?itemNumber=${itemNum}`, UniqueConstants._blank);
    });
    localStorage.setItem("prevTab","/InductionManager/ProcessPutAways");
  }

  forSameSKU() {
    this.toteForm.patchValue({
      orderNumber                       : '',
      lotNumber                         : '',
      expirationDate                    : '',
      serialNumber                      : '',
      transactionQuantity               : '',
      warehouse                         : '',

      zone                              : '',
      carousel                          : '',
      row                               : '',
      shelf                             : '',
      bin                               : '',
      cellSize                          : '',
      velocityCode                      : '',
      itemQuantity                      : '',
      maximumQuantity                   : '',
      quantityAllocatedPutAway          : '',

      toteQty                           : this.data.defaultPutAwayQuantity
    });
    this.blindInduction()
  }

    public blindInduction() {
    // Call the AdminCompanyInfo API to get the blindInductionReason
    this.iAdminApiService.AdminCompanyInfo().subscribe((res: any) => {
      if (res.data && res.isExecuted) {
        this.blindInductionReason = res.data.requireHotReasons;
        // If blindInductionReason is true, call getBlindInductionTable
        if (this.blindInductionReason) {
          this.getBlindInductionTable();
        }
      } else {
        // Handle error if the API response is not executed successfully
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
      }
    });
  }


  selectTotePosOrID(col : string, value : string) {
    let data = this.totes.filter((e: any) => e[col] == value?.toString());
    if (data.length > 0) {
      this.toteForm.patchValue({
        toteID   : data[0].toteID,
        totePos  : data[0].totesPosition,
      });

      if (data[0].cells <= data[0].toteQuantity) {
        this.global.OpenDialog(AlertConfirmationComponent, {
          height: 'auto',
          width: Style.w50vw,
          autoFocus: DialogConstants.autoFocus,
          disableClose: true,
          data: {
            message: "The Tote you've selected is already marked as full. Putting the item in this tote will go over define cells",
            heading: 'Assign Transaction To Selected Tote',
            disableCancel: true
          },
        });
      }
    }
  }

  tooltipShowDelay: number = 100000;
  lastScrollPosition: number = 1000;
  scrollDirection: string = '';

  onScroll(event: Event) {
    const currentScrollPosition = (event.target as Element).scrollTop;
    // Check if the input field is focused
    if (this.inputToteQty ) {
      // Perform actions when the input loses focus due to scrolling
      this.inputToteQty.nativeElement.blur();
    }
    if (this.initialFocus) {
      this.inputToteQty.nativeElement.focus();
      this.initialFocus = false;
      this.tooltipShowDelay = 100000;
    }
    else if(currentScrollPosition < this.lastScrollPosition){
      this.tooltip.hide();
      this.tooltipShowDelay = 0;
    }
    if (currentScrollPosition > this.lastScrollPosition) this.tooltipShowDelay = 100000;
    this.lastScrollPosition = currentScrollPosition; // Update last known scroll position
  }

  /**
   * Validates zone and checks if it belongs to a batch
   * Shows confirmation dialog if no batch is found
   * @param zone - Zone to validate
   */
  validateZoneBatch(zone: string) {
    
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions to prevent memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
