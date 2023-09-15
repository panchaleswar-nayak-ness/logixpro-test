import { Component, OnInit, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { formatDate } from '@angular/common' 
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component'; 
import { AuthService } from 'src/app/init/auth.service';
import { CrossDockTransactionComponent } from '../cross-dock-transaction/cross-dock-transaction.component';
import labels from '../../labels/labels.json';
import { CellSizeComponent } from 'src/app/admin/dialogs/cell-size/cell-size.component';
import { VelocityCodeComponent } from 'src/app/admin/dialogs/velocity-code/velocity-code.component';  
import { ChooseLocationComponent } from '../choose-location/choose-location.component';
import { WarehouseComponent } from 'src/app/admin/dialogs/warehouse/warehouse.component';
import { Router } from '@angular/router';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';
import { PaPrintLabelConfirmationComponent } from '../pa-print-label-confirmation/pa-print-label-confirmation.component';

@Component({
  selector: 'app-selection-transaction-for-tote-extend',
  templateUrl: './selection-transaction-for-tote-extend.component.html',
  styleUrls: ['./selection-transaction-for-tote-extend.component.scss']
})
export class SelectionTransactionForToteExtendComponent implements OnInit {
  @ViewChild('field_focus') field_focus: ElementRef;

  public userData   : any;
  isWarehouseSensitive:boolean=false;
  toteForm          : FormGroup;
  cellSizeList      : any = [];
  velocityCodeList  : any = [];
  orderNum          : any;
  totes             : any = [];
  selectedTotePosition:any='';
  selectedToteID:any='';
  fieldNames:any;
  imPreferences:any;
  constructor(public dialogRef                  : MatDialogRef<SelectionTransactionForToteExtendComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private dialog                    : MatDialog,
              public formBuilder                : FormBuilder,
              private authService               : AuthService,
              private toast                     : ToastrService, 
              private Api : ApiFuntions, 
              private toastr: ToastrService,
              public router: Router,
              private global:GlobalService,
              ) {

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
      toteQty                           : new FormControl(0, Validators.compose([])),

      invMapID                          : new FormControl(0, Validators.compose([])),
      dedicated                         : new FormControl(false, Validators.compose([])),

    });

  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.OSFieldFilterNames();
    this.getCellSizeList();
    this.getVelocityCodeList();
    this.getDetails();    
    this.imPreferences=this.global.getImPreferences();
  }
  ngAfterViewInit(): void {
    this.field_focus.nativeElement.focus();
  }
  public OSFieldFilterNames() { 
    this.Api.ColumnAlias().subscribe((res: any) => {
      this.fieldNames = res.data;

    })
  }
  onToteChange(event,type){
  // event.value
    this.totes.filter(item=>{
      if(type==='toteId'){  // change position on id base
        if(item.toteID===event.value){
          this.selectedTotePosition=item.totesPosition
          return
        }
      }else{ //change id on position base
        if(item.totesPosition===event.value){
          this.selectedToteID=item.toteID
          return
        }
      }
    
    });
  }

  getDetails() {
    try {
      var payload = { 
        "otid": this.data.otid,
        "itemNumber": this.data.itemNumber,
        "username": this.userData.userName,
        wsid: this.userData.wsid 
      }
      this.Api.ItemDetails(payload).subscribe(
        (res: any) => {
          if (res.data && res.isExecuted) {
            const values = res.data[0];  
            this.isWarehouseSensitive=values.warehouseSensitive
            this.orderNum = values.orderNumber;
            this.totes = this.data.totes;

            var fil = this.totes.filter((e: any) => e.isSelected == true);

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
              primaryPickZone                   : values.primaryPickZone,
              secondaryPickZone                 : values.secondaryPickZone,

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

            this.checkRepenishment();
          } else {
            this.toast.error('Something went wrong', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        },
        (error) => { }
      );
    } catch (error) {
      
    }
  }

  clearTransInfo() {

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        message: 'Click OK to clear serial number, lot number, expiration date, warehouse, Ship VIA, and Ship To Name',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
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
    this.Api.getCellSize().subscribe((res) => {
      this.cellSizeList = res.data;
    });
  }

  getVelocityCodeList() {
    this.Api.getVelocityCode().subscribe((res) => {
      this.velocityCodeList = res.data;
    });
  }

  updateItemInfo() {
    try {

      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          message: 'Click OK to save current cell sizes and velocity codes for this item to the inventory master.',
        },
      });
  
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'Yes') {

          const values = this.toteForm.value;

          var payload = { 
            "itemNumber": values.itemNumber,
            "ccell": values.carouselCellSize,
            "bcell": values.bulkCellSize,
            "cFcell": values.cfCellSize,
            "cvel": values.carouselVelocity,
            "bvel": values.bulkVelocity,
            "cFvel": values.cfVelocity,
            "pzone": values.primaryPickZone,
            "szone": values.secondaryPickZone,
            username: this.userData.userName,
            wsid: this.userData.wsid 
          }
          
          this.Api.IMUpdate(payload).subscribe(
            (res: any) => {
              if (res.data && res.isExecuted) {
                this.toast.success(labels.alert.update, 'Success!',{
                  positionClass: 'toast-bottom-right',
                  timeOut:2000
               });            
              } else {
                this.toast.error('Something went wrong', 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
              }
            },
            (error) => { }
          );
          
        }
      }); 
      
    } catch (error) {
      
    }
  }

  public openCellSizeDialog(param : any) {

    let currentValue="";

    if(param == 'cellSize') {
      currentValue  = this.toteForm.controls['carouselCellSize'].value
    } else if(param == 'bulkCellSize'){
      currentValue  = this.toteForm.controls['bulkCellSize'].value
    } else if(param == 'cfCellSize'){
      currentValue  = this.toteForm.controls['cfCellSize'].value
    }
    
    let dialogRef = this.dialog.open(CellSizeComponent, {
      height: 'auto',
      width: '750px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: '',
        cs:currentValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
     
      if(result){
        if(param == 'cellSize'){
          this.toteForm.patchValue({
            'carouselCellSize' : result
          });
        } else if(param == 'bulkCellSize'){
          this.toteForm.patchValue({
            'bulkCellSize' : result
          });
        } else if(param == 'cfCellSize'){
          this.toteForm.patchValue({
            'cfCellSize' : result
          });
        }
      }

      this.getCellSizeList();


    });

  }

  public openVelocityCodeDialog(param : any) {
    
    let currentValue="";

    if(param == 'goldenZone') {
      currentValue  = this.toteForm.controls['carouselVelocity'].value
    } else if(param == 'bulkVelocity') {
      currentValue  = this.toteForm.controls['bulkVelocity'].value
    } else if(param == 'cfVelocity') {
      currentValue  = this.toteForm.controls['cfVelocity'].value
    }
    
    let dialogRef = this.dialog.open(VelocityCodeComponent, {
      height: 'auto',
      width: '750px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: '',
        vc: currentValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        if(param == 'goldenZone'){
          this.toteForm.patchValue({
            'carouselVelocity' : result
          });
        } else if(param == 'bulkVelocity'){
          this.toteForm.patchValue({
            'bulkVelocity' : result
          });
        } else if(param == 'cfVelocity'){
          this.toteForm.patchValue({
            'cfVelocity' : result
          });
        }
      }
      this.getVelocityCodeList();
    });    
    
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  openChooseLocation() {
    const values = this.toteForm.value;
    const dialogRef = this.dialog.open(ChooseLocationComponent, {
      height: 'auto',
      width: '70vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: values
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (res && res.responseMessage  === "Reserved Successfully") {        
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

      if (!this.validationPopups({...values, type : 0})) {
        return;
      }

      var payLoad = {
        "item": values.itemNumber,        
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };

      this.Api.CheckForwardLocations(payLoad).subscribe(
        (res: any) => {
          if (res.data > 0 && res.isExecuted && this.data.autoForwardReplenish) {
            
            let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
              height: 'auto',
              width: '560px',
              autoFocus: '__non_existing_element__',
      disableClose:true,
              data: {
                message: 'There is a need for ' + res.data + ' of item: ' + values.itemNumber + '. Press OK to find a location needing replenishment. Otherwise press CANCEL to do a normal location search',
              }
            });

            dialogRef.afterClosed().subscribe((result) => {
              if (result == 'Yes') {
                this.findLocation(true, res.data);
              }
            });

          } else {
            this.findLocation(false, 0);
            // this.toastr.error('Something went wrong', 'Error!', {
            //   positionClass: 'toast-bottom-right',
            //   timeOut: 2000,
            // });
          }
        },
        (error) => {}
      );      

    } catch (error) {
      
    }    
  }

  findLocation(replenfwd : any, repQty : number) {
    try {

      this.toteForm.patchValue({
        replenishment : replenfwd ? repQty : 0
      });

      const values = this.toteForm.value;

      var payLoad = {
        "qtyPut": values.quantityAllocatedPutAway ? parseInt(values.quantityAllocatedPutAway) : 0,
        "item": values.itemNumber,
        "ccell": values.carouselCellSize,
        "cvel": values.carouselVelocity,
        "bcell": values.bulkCellSize,
        "bvel": values.bulkVelocity,
        "cfcell": values.cfCellSize,
        "cfvel": values.cfVelocity,
        "whse": values.warehouse,
        "dateSens": this.toteForm.getRawValue().dateSensitive,
        "fifo": values.fifo,
        "isReel": false,
        "lot": values.lotNumber,
        "ser": values.serialNumber,
        "replenfwd": replenfwd,
        "prevZone": values.zones.replace("Zones:",""),
        "dedicate": values.dedicate,
        "rts": false,
        "expDate": values.expirationDate,
        "primaryZone": values.primaryPickZone,
        "secondaryZone": values.secondaryPickZone,
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };
      this.Api.FindLocation(payLoad).subscribe(
        (res: any) => {
          if (res.data && res.isExecuted) {

            if (res.data.success) {
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
              this.toastr.error('No available locations were found for this item.', 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            }

          } else {
            this.toastr.error('Something went wrong', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        },
        (error) => {}
      );      

    } catch (error) {
      console.log(error)
    }
  }

  openCrossDockTransactionDialogue() {
    const values = this.toteForm.value;
    
    const dialogRef = this.dialog.open(CrossDockTransactionComponent, {
      height: 'auto',
      width: '70vw',
      autoFocus: '__non_existing_element__',
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
        transactionQuantity    : values.transactionQuantity - (res.qtyToSubtract ? res.qtyToSubtract : 0),
        toteQty                : values.toteQty - (res.qtyToSubtract ? res.qtyToSubtract : 0),
      });
      if (res.data == "Submit") {        
        this.completeTransaction();
      }
      
    });
  }
  
  openWareHouse() {
    if(!this.isWarehouseSensitive)return
    const values = this.toteForm.value;
    const dialogRef = this.dialog.open(WarehouseComponent, {
      height: 'auto',
      width: '640px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        userName: this.userData.userName,
        wsid: this.userData.wsid,
        supplierID: values.supplierItemID,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {      
      if (res && res != 'clear') {
        this.toteForm.patchValue({
          'warehouse' : res
        });
        this.findLocation(false, 0);
      } else if (res == 'clear') {
        this.toteForm.patchValue({
          'warehouse' : ''
        });
      }
    });
  }

  validationPopups(val : any) {
    if (val.type == 1) {
      if (val.invMapID <= 0 || !val.invMapID || val.zone == "") {
        this.toast.error('You must select a location for this transaction before it can be processed.', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        return false;
      } 

      if (this.toteForm.getRawValue().dateSensitive && !val.expirationDate) {
        this.toast.error('This item is date sensitive. You must provide an expiration date.', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        return false;
      }

    }    

    if (this.toteForm.getRawValue().fifo && val.fifoDate.toLowerCase() == 'expiration date' && !val.expirationDate) {
      this.toast.error('This item is marked as FIFO with Expiration Date and its FIFO Date.You must provide an Expiration Date.', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      return false;
    }

    if (this.toteForm.getRawValue().warehouseSensitive && !val.warehouse) {
      this.toast.error('This item is warehouse sensitive and must be assigned a warehouse before process can continue.', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      return false;
    }    

    if (val.toteQty <= 0) {
      this.toast.error('Quantity should be greater 0', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000,
      });
      return false;
    }

    return true;
  }

  completeTransaction() {
    try {

      const values = this.toteForm.value;
      if (!this.validationPopups({...values, type : 1})) {
        return;
      }

        let payload = {
        zone: this.toteForm.value.zone,      
        username: this.userData.userName,
        wsid: this.userData.wsid
      };
      
      this.Api
        .BatchByZone(payload)
        .subscribe(
          (res: any) => {
            if (res.isExecuted) {
              if (!res.data) {
                let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                  height: 'auto',
                  width: '560px',
                  autoFocus: '__non_existing_element__',
                  data: {
                    message: 'There are no batches with this zone (' + this.toteForm.value.zone + ') assigned.  Click OK to start a new batch or cancel to choose a different location/transaction.',
                  },
                });
  
                dialogRef.afterClosed().subscribe((res) => {
                  if (res == 'Yes') {
                    this.dialogRef.close("New Batch"); 
                  }      
                });
              }
              else{
                let payLoad = {
                  sRow: 1,
                  eRow: 5,
                  itemWhse: [
                    values.itemNumber,
                    // "238562",
                    values.warehouse,
                    "1=1"
                  ],
                  username: this.userData.userName,
                  wsid: this.userData.wsid 
                };
          
                this.Api
                  .CrossDock(payLoad)
                  .subscribe(
                    (res: any) => {
                      if (res.data && res.isExecuted) 
                      {
                        if(res.data.transaction.length > 0)
                        {
                          let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                            height: 'auto',
                            width: '560px',
                            autoFocus: '__non_existing_element__',
                disableClose:true,
                            data: {
                              message: 'Cross Dock opportunity!  Click OK to view backorder transactions for the item you are putting away.',
                            },
                          });
          
                          dialogRef.afterClosed().subscribe((result) => {
                            if (result == 'Yes') {
                              this.openCrossDockTransactionDialogue();
                            }
                            else {
                              this.complete(values);
                            }
                          });                
                        }
                        else 
                        {
                          this.complete(values);              
                        }
                      } else {
                        this.toastr.error('Something went wrong', 'Error!', {
                          positionClass: 'toast-bottom-right',
                          timeOut: 2000,
                        });
                      }
                    },
                    (error) => {}
                  );   
              }
            }
          });
   
              
      
    } catch (error) {
      
    }
  }


  
  complete(values : any) {

    if (!this.validationPopups({...values, type : 1})) {
      return;
    }

    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        message: 'Click OK to complete this transaction and assign it to the selected batch and tote.',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {                                                              

        if (values.toteQty <= 0) {
          this.toast.error('Quantity should be greater 0', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        } else {

          var payload2 = {
            "otid": this.data.otid,
            "splitQty": 0, // (values.toteQty ? parseInt(values.toteQty) : 0) - (values.quantityAllocatedPutAway ? parseInt(values.quantityAllocatedPutAway) : 0),
            "qty": values.toteQty,
            "toteID": values.toteID,
            "batchID": this.data.batchID,
            "item": values.itemNumber,
            "uF1": values.userField1,
            "uF2": values.userField2,
            "lot": values.lotNumber,
            "ser": values.serialNumber,
            "totePos": values.totePos ? parseInt(values.totePos) : 0,
            "cell": values.cellSize,
            "warehouse": values.warehouse,
            "expDate": values.expirationDate,
            "revision": "",
            "zone": values.zone,
            "carousel": values.carousel,
            "row": values.row,
            "shelf": values.shelf,
            "bin": values.bin,
            "invMapID": values.invMapID,
            "locMaxQty": values.maximumQuantity ? parseInt(values.maximumQuantity) : 0,
            "reel": false,
            "dedicate": values.dedicated,
            "orderNumber": values.orderNumber,
            "username": this.userData.userName,
            wsid: this.userData.wsid 
          }
          
          this.Api.TaskComplete(payload2).subscribe(
            (res: any) => {
              
              if (res.data && res.isExecuted) {
                let OTID = res.data
                if(this.imPreferences.autoPrintPutAwayLabels){
                  let numLabel = 1
                    if(this.imPreferences.requestNumberOfPutAwayLabels && this.imPreferences.printDirectly){
                      // here pop up will be implemented which will ask for number of labels
                      let dialogRef = this.dialog.open(PaPrintLabelConfirmationComponent, {
                        height: 'auto',
                        width: '560px',
                        autoFocus: '__non_existing_element__',
                        disableClose:true,
                    
                      });
                      dialogRef.afterClosed().subscribe((result) => {
                        if(result>0){
                          if(!this.imPreferences.printDirectly){
                            window.open(`/#/report-view?file=FileName:PrintPutAwayItemLabels|OTID:${OTID}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

                          }
                          else{
                            for (var i = 0; i < result; i++) {
                              this.global.Print(`FileName:PrintPutAwayItemLabels|OTID:${OTID}`)
                          };
                          }
                        }
                     
                      })

                    }
                    else{
                      if(numLabel>0){
                        if(!this.imPreferences.printDirectly){
                          window.open(`/#/report-view?file=FileName:PrintPutAwayItemLabels|OTID:${OTID}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

                        }
                        else{
                          for (var i = 0; i < numLabel; i++) {
                            this.global.Print(`FileName:PrintPutAwayItemLabels|OTID:${OTID}`)
                        };
                        }
                      }
                   
                    }

                 

                }


                this.dialogRef.close("Task Completed");
                this.toast.success(labels.alert.update, 'Success!',{
                  positionClass: 'toast-bottom-right',
                  timeOut:2000
                });            
              } else {
                this.toast.error('Something went wrong', 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
              }
            },
            (error) => { }
          );
        }                      
      }
    });
  }

  onViewItemDetail(itemNum:any) { 
    this.router.navigate([]).then(() => {
      window.open(`/#/admin/inventoryMaster?itemNumber=${itemNum}`, '_blank');
    });
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
  }

}
