import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, HostListener,OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BlossomToteComponent } from 'src/app/dialogs/blossom-tote/blossom-tote.component';

import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from '../../../app/init/auth.service';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs/internal/operators/startWith';
import { PickToteManagerComponent } from 'src/app/dialogs/pick-tote-manager/pick-tote-manager.component'; 
import { WorkstationZonesComponent } from 'src/app/dialogs/workstation-zones/workstation-zones.component';
import { map, Subject, takeUntil } from 'rxjs';
import labels from '../../labels/labels.json';
import { MatSelect } from '@angular/material/select';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';
import { IInductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/services/induction-manager-api/induction-manager-api.service';

@Component({
  selector: 'app-process-picks',
  templateUrl: './process-picks.component.html',
  styleUrls: ['./process-picks.component.scss']
})
export class ProcessPicksComponent implements OnInit {
  TOTE_SETUP: any = [];
  dialogClose: boolean = false;
  public userData: any;
  batchID: any = '';
  pickBatchQuantity: any = '';
  autoPickOrderSelection: any = '';
  autoPickToteID: any = '';
  usePickBatchManager: any = '';
  useInZonePickScreen: any;
  useDefaultFilter: any;
  useDefaultZone: any;
  countInfo: any;
  pickType: any = 'MixedZones';
  allZones: any;
  allOrders: any[] = [];
  resultObj: any[] = [];
  pickBatchesList: any[] = [];
  orderNumberList: any[] = [];
  pickBatches = new FormControl('');
  orderNumber = new FormControl('');
  batchWithID = false;
  toteEmpty = false;
  orderEmpty = false;
  filteredOptions: Observable<any[]>;
  filteredOrderNum: Observable<any[]>;

  dataSource: any;
  public iinductionManagerApi:IInductionManagerApiService;
  nxtToteID: any; 
  onDestroy$: Subject<boolean> = new Subject();
  @ViewChild('batchPickID') batchPickID: TemplateRef<any>;
  @ViewChild('processSetup') processSetup: TemplateRef<any>;
  @ViewChild('popupBlocked') popupBlocked: TemplateRef<any>;
  @ViewChild('batch_id') batch_id: ElementRef;
  isBatchIdFocus: boolean = false;
  pickBatchesCrossbtn
  imPreferences: any;
  public ifAllowed: boolean = false

  constructor(
    private global:GlobalService,
    private Api: ApiFuntions,
    
    private dialog:MatDialog,
    private authService: AuthService,
    private router: Router,
    private inductionManagerApi: InductionManagerApiService, 
    private sharedService: SharedService
  ) { 
    this.iinductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.pickToteSetupIndex();
    this.getAllZones();
    this.getAllOrders();
    this.isBatchIdFocus = true;
  }
  
 
 async printPick(type) {
    const counter = this.dataSource._data?._value?.length
    let PositionList: any = [];
    let ToteList: any = [];
    let OrderList: any = [];
    for (let i = 0; i <= counter - 1; i++) {

      if (this.dataSource._data?._value[i].orderNumber != "" && this.dataSource._data?._value[i].toteID != "") {
        PositionList.push(this.dataSource._data?._value[i].position);
        ToteList.push(this.dataSource._data?._value[i].toteID)
        OrderList.push(this.dataSource._data?._value[i].orderNumber)
      };
    };

    this.toteEmpty = this.dataSource?._data?._value.some(element => element.toteID != "");
    this.orderEmpty = this.dataSource?._data?._value.some(element => element.orderNumber != "");
    if (type === 'PrintTote') {
      if (!this.toteEmpty) {
        this.global.ShowToastr('error','Please enter in at least 1 tote id', 'Error!')
      }
      else if (!this.orderEmpty) {
        this.global.ShowToastr('error','Please enter in at least 1 order number', 'Error!')
      }
      else {
        if (this.imPreferences.printDirectly) {
        await  this.global.Print(`FileName:PrintPrevIMPickItemLabel|Positions:${PositionList}|ToteIDs:${ToteList}|OrderNums:${OrderList}|BatchID:${this.batchID}|WSID:${this.userData.wsid}`);

        } else {
          window.open(`/#/report-view?file=FileName:PrintPrevIMPickItemLabel|Positions:${PositionList}|ToteIDs:${ToteList}|OrderNums:${OrderList}|BatchID:${this.batchID}|WSID:${this.userData.wsid}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

        }

        await this.global.Print(`FileName:PrintPrevIMPickToteLabelButt|Positions:${PositionList}|ToteIDs:${ToteList}|OrderNums:${OrderList}`, 'lbl');

      }
    }
    if (type === 'PrintPickLabel') {
      if (this.batchID === '') {
        this.global.ShowToastr('error','Please enter in a batch id', 'Error!')
      } else if (!this.toteEmpty) {
        this.global.ShowToastr('error','Please enter in at least 1 tote id', 'Error!')
      } else if (!this.orderEmpty) {
        this.global.ShowToastr('error','Please enter in at least 1 order number', 'Error!')
      } else {
        if (this.imPreferences.printDirectly) {
          await  this.global.Print(`FileName:PrintPrevIMPickList|Positions:${PositionList}|ToteIDs:${ToteList}|OrderNums:${OrderList}|BatchID:${this.batchID}`);

        } else {
          window.open(`/#/report-view?file=FileName:PrintPrevIMPickList|Positions:${PositionList}|ToteIDs:${ToteList}|OrderNums:${OrderList}|BatchID:${this.batchID}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

        }

        await this.global.Print(`FileName:PrintPrevIMPickItemLabel|Positions:${PositionList}|ToteIDs:${ToteList}|OrderNums:${OrderList}|BatchID:${this.batchID}|WSID:${this.userData.wsid}`, 'lbl');
      }
    }
    if (type === 'PrintPickList') {
      if (!this.toteEmpty) {
        this.global.ShowToastr('error','Please enter in at least 1 tote id', 'Error!')
      }
      else if (!this.orderEmpty) {
        this.global.ShowToastr('error','Please enter in at least 1 order number', 'Error!')
      } else {
        if (this.imPreferences.printDirectly) {
          await  this.global.Print(`FileName:PrintPrevIMPickList|Positions:${PositionList}|ToteIDs:${ToteList}|OrderNums:${OrderList}|BatchID:${this.batchID}`);

        } else {
          window.open(`/#/report-view?file=FileName:PrintPrevIMPickList|Positions:${PositionList}|ToteIDs:${ToteList}|OrderNums:${OrderList}|BatchID:${this.batchID}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

        }


      }
    }
  }
  getAllOrders() {
    let paylaod = {
      "OrderView": 'All', 
    }
    this.iinductionManagerApi.OrdersInZone(paylaod).subscribe((res) => {
      if (res.data) {
        this.orderNumberList = res.data
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("OrdersInZone",res.responseMessage);

      }
      this.filteredOrderNum = this.orderNumber.valueChanges.pipe(
        startWith(""),
        map(value => (value)),
        map(name => (name ? this._orderFilter(name) : this.orderNumberList.slice()))
      );
    });
  }

  

  ngAfterViewChecked(): void {
    if (this.isBatchIdFocus) {
      this.batch_id.nativeElement.focus();
      this.isBatchIdFocus = false;
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  onbeforeunload(event) {
    if (this.ifAllowed) {
      event.preventDefault();
      event.returnValue = false;
    }
  }

  @HostListener('click')
  documentClick(event: MouseEvent) {
    this.global.changesConfirmation = true;
    this.ifAllowed = true
  }

  getAllZones() {
    let paylaod = { 
    }
    this.iinductionManagerApi.WSPickZoneSelect(paylaod).subscribe((res) => {
      if (res.data) {
        this.allZones = res.data;
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("WSPickZoneSelect",res.responseMessage);
      }
    });
  }

  pickToteSetupIndex() {
    return new Promise((resolve, reject) => {
    let paylaod = { 
    }
    this.iinductionManagerApi.PickToteSetupIndex(paylaod).subscribe(res => {

      if (res.isExecuted && res.data)
      {

      this.countInfo = res.data.countInfo;
      this.pickBatchesList = res.data.pickBatches;
      this.pickBatchQuantity = res.data.imPreference.pickBatchQuantity;
      this.autoPickOrderSelection = res.data.imPreference.autoPickOrderSelection;
      this.autoPickToteID = res.data.imPreference.autoPickToteID;
      this.useInZonePickScreen = res.data.imPreference.useInZonePickScreen;
      this.usePickBatchManager = res.data.imPreference.usePickBatchManager;
      this.useDefaultFilter = res.data.imPreference.useDefaultFilter;
      this.useDefaultZone = res.data.imPreference.useDefaultZone;
      this.createToteSetupTable(this.pickBatchQuantity);

      this.filteredOptions = this.pickBatches.valueChanges.pipe(
        startWith(""),
        map(value => (value)),
        map(name => (name ? this._filter(name) : this.pickBatchesList.slice()))
        
      );
      resolve(res?.data?.imPreference);

      } else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("PickToteSetupIndex",res.responseMessage);

      }
    });

  });
  }

  createToteSetupTable(pickBatchQuantity: any) {
    for (let index = 0; index < pickBatchQuantity; index++) {
      this.TOTE_SETUP.push({ position: index + 1, toteID: '', orderNumber: '', priority: '' },);
    }
    this.dataSource = new MatTableDataSource<any>(this.TOTE_SETUP);
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.pickBatchesList.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _orderFilter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.orderNumberList.filter(option => option.toLowerCase().includes(filterValue));
  }

  onAddBatch(val: string) {
    let filledTote: boolean = false;
    this.TOTE_SETUP.map(obj => {
      if (obj.toteID !== '') {
        filledTote = true;
      }
    });

    if (filledTote) {
      let dialogRef:any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
        disableClose: true,
        data: {
          message: 'Press OK to create a new Tote Setup. Press Cancel to keep the current Tote Setup.'
        }
      })
      dialogRef.afterClosed().subscribe(result => {
        if (result == 'Yes') {
          this.addingBatch(val);
        }
      })

    }
    else {
      this.addingBatch(val);
    }

  }

  addingBatch(val: any) {
    if (val === 'batchWithID') {
      this.batchWithID = true;
    }
    else {
      this.batchWithID = false;
    }
    const dialogRef:any = this.global.OpenDialog(this.batchPickID, {
      width: 'auto',
      autoFocus: '__non_existing_element__',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      if (this.dialogClose) {
        if (val === 'batchWithID') {
          this.iinductionManagerApi.NextBatchID().subscribe(res => {
            this.batchID = res.data;
            let payload = { 
              "type": this.pickType
            }
            if (!this.useInZonePickScreen) {
              if (!this.usePickBatchManager) {
                if (this.autoPickOrderSelection) {
                  this.iinductionManagerApi.FillOrderNumber(payload).subscribe(res => {
                    this.TOTE_SETUP.forEach((element, key) => {
                      element.orderNumber = res.data[key];
                    });
                  });
                }
                if (this.autoPickToteID) {
                  this.getAllToteIds(true)
                }
              }
              if (this.batchID != '') {
                if (this.autoPickToteID) {
                  this.getAllToteIds(true);
                  if (this.usePickBatchManager) {
                    this.openPickToteDialogue();
                  }
                }
              }
              this.TOTE_SETUP.map(obj => {
                obj.toteID = '';
                obj.orderNumber = '';
                obj.priority = '';
              });
              this.allOrders = [];
            }
            else if (this.autoPickToteID) {
               
                this.getAllToteIds(true);
              
            }
          });
        }
        else {
          if (this.batchID === '') {
            this.global.ShowToastr('error','Batch id is required.', 'Error!');
            console.log("NextBatchID");
          }
          else {
            let payload = { 
              "type": this.pickType
            }
            if (!this.useInZonePickScreen) {
              if (!this.usePickBatchManager) {
                if (this.autoPickOrderSelection) {
                  this.iinductionManagerApi.FillOrderNumber(payload).subscribe(res => {
                    this.TOTE_SETUP.forEach((element, key) => {
                      element.orderNumber = res.data[key];
                    });
                  });
                }
                if (this.autoPickToteID) {
                  this.getAllToteIds(true)
                }
              }
              this.TOTE_SETUP.map(obj => {
                obj.toteID = '';
                obj.orderNumber = '';
              });
            }
            else if (this.autoPickToteID){
               
                this.getAllToteIds(true)
            }


          }
        }
      }
    });
  }




  confirmAddBatchDialog() {
    this.dialogClose = true;
    this.dialog.closeAll();
  }
  closeBatchDialog() {
    this.dialogClose = false;
    this.dialog.closeAll();
  }

  openPickToteDialogue() {
    if (!this.batchID) {
      this.global.ShowToastr('error','Batch ID cannot be empty when opening the pick batch manager.', 'Error!');
    }
    else {
      const dialogRef:any = this.global.OpenDialog(PickToteManagerComponent, {
        height: 'auto',
        maxWidth: '95vw',
        width: '95vw',
        data: {
          pickBatchQuantity: this.pickBatchQuantity,
          useDefaultFilter: this.useDefaultFilter,
          useDefaultZone: this.useDefaultZone,
          allOrders: this.allOrders,
          resultObj: this.resultObj,
        },
        autoFocus: '__non_existing_element__'
      });
      dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(resultObj => {
        let result: any = [];
        resultObj?.forEach((val: any) => {
          result.push(val.orderNumber);
        })
        if (result.length > 0) {
          this.allOrders = result;
          this.resultObj = resultObj;
        }
        else {
          this.allOrders = []
          this.resultObj = []
          this.TOTE_SETUP.forEach((element) => {
            element.orderNumber = '';
          });
        }
        this.TOTE_SETUP.forEach((element, key) => {
          element.orderNumber = resultObj[key]?.orderNumber ?? '';
          element.priority = resultObj[key]?.priority ?? '';
        });
      });
    }

  }

  openBlossomToteDialogue() {
    this.global.OpenDialog(BlossomToteComponent, {
      height: 'auto',
      width: '786px',
      autoFocus: '__non_existing_element__'
    });
  }

  



  onToteAction(val: any) {
    switch (val.value) {
      case 'fill_all_tote':
        this.getAllToteIds();
        break;
      case 'fill_next_tote':
        this.getNextToteId();
        break;
      case 'clear_all_totes':
        this.clearAllTotes();
        break;
      case 'clear_all_orders':
        this.clearAllOrders();
        break;
      default:
          break;
    }
    const matSelect: MatSelect = val.source;
    matSelect.writeValue(null);
  }

  getAllToteIds(autoToteIds: boolean = false) {
    this.iinductionManagerApi.NextTote().subscribe(res => {
      this.nxtToteID = res.data;
      this.TOTE_SETUP.forEach((element, key) => {
        if (!element.toteID) {
          element.toteID = this.nxtToteID;
          this.nxtToteID = this.nxtToteID + 1;
        }
        if (autoToteIds) {
          element.toteID = this.nxtToteID;
          this.nxtToteID = this.nxtToteID + 1;
        }
      });
      this.updateNxtTote();
    });

  }

  updateNxtTote() {
    let updatePayload = {
      "tote": this.nxtToteID, 
    }
    this.iinductionManagerApi.NextToteUpdate(updatePayload).subscribe(res => {
      if (!res.isExecuted) {
        this.global.ShowToastr('error','Something is wrong.', 'Error!');
        console.log("NextToteUpdate",res.responseMessage);
      }

    });
  }
  getNextToteId() {
    this.iinductionManagerApi.NextTote().subscribe(res => {
      this.nxtToteID = res.data;
      for (let element of this.TOTE_SETUP) {
        if (element.toteID === '') {
          element.toteID = this.nxtToteID;
          this.nxtToteID = this.nxtToteID + 1;
          break;
        }
      }
      this.updateNxtTote();
    });
  }

  clearAllTotes() {
    this.TOTE_SETUP.forEach((element, key) => {
      element.toteID = "";
    });
  }

  clearAllOrders() {
    this.TOTE_SETUP.forEach((element, key) => {
      element.orderNumber = "";
      element.priority = "";
    });
    this.allOrders = [];
  }

 

 async previewWindow(url): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let newWindow: Window | null = null;
      let windowCheckInterval: any = null;

      newWindow = window.open(`/#/report-view?file=${url}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
      if (!newWindow) { // Check if popup was blocked
        reject(new Error('Popup was blocked by the browser.'));
      }
      else if (newWindow) {
        windowCheckInterval = setInterval(() => {
          if (newWindow?.closed) {
            clearInterval(windowCheckInterval);
            resolve(newWindow?.closed);
          }
        }, 1000); // Check every second
      }
    });
  }


  fillNextToteID(i: any) {
    this.iinductionManagerApi.NextTote().subscribe(res => {
      if (res.isExecuted && res.data)
      {
        this.nxtToteID = res.data;
        this.TOTE_SETUP[i].toteID = this.nxtToteID;
        this.nxtToteID = this.nxtToteID + 1;
        this.updateNxtTote();
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("NextTote",res.responseMessage);
      }
     
    });
  }

  clearOrderNumber(i: any) {
    this.TOTE_SETUP[i].orderNumber = "";
    this.TOTE_SETUP[i].priority = "";
    this.allOrders[i] = '';
  }

  confirmProcessSetup() {
    this.global.OpenDialog(this.processSetup, {
      width: '450px',
      autoFocus: '__non_existing_element__',
      disableClose: true,
    });
  }
  alertPopUpBlocked() {
    this.global.OpenDialog(this.popupBlocked, {
      width: '450px',
      height: 'auto',
      minHeight: 'auto',
      autoFocus: '__non_existing_element__',
      disableClose: true,
    });
  }
 async onPrcessBatch() {
    if (!this.batchID) {
      this.global.ShowToastr('error','Please enter in a batch id to proccess.', 'Error!');
      this.dialog.closeAll();
      return
    }

    let Positions: any[] = [];
    let ToteIDs: any[] = [];
    let OrderNumbers: any[] = [];
    this.TOTE_SETUP.map(obj => {
      Positions.push(obj.position?.toString() ?? '');
      ToteIDs.push(obj.toteID?.toString() ?? '');
      OrderNumbers.push(obj.orderNumber?.toString() ?? '');
    });
    if (this.TOTE_SETUP.filter(e => e.toteID).length == 0) {
      this.global.ShowToastr('error','Please enter in at least 1 tote id to process.', 'Error!');
      this.dialog.closeAll();
      return
    }
    if (this.TOTE_SETUP.filter(e => e.orderNumber).length == 0) {
      this.global.ShowToastr('error','Please enter in at least 1 order number to process.', 'Error!');
      this.dialog.closeAll();
      return
    }
   const isPref=await this.pickToteSetupIndex();
    this.imPreferences=isPref
    if ( isPref && this.useInZonePickScreen) {
      
      let paylaod = {
        Positions,
        ToteIDs,
        OrderNumbers,
        "BatchID": this.batchID
      }

      this.iinductionManagerApi.InZoneSetupProcess(paylaod).subscribe(res => {
        if (res.isExecuted) {
          let btId = this.batchID
          this.dialog.closeAll();
          this.TOTE_SETUP.map(obj => {
            obj.toteID = '';
            obj.orderNumber = '';
            obj.priority = '';
          });
          this.batchID = '';



          //  IN ZONE SETUP PROCESS PRINT CONDITIONS 

          this.InZoneProcessPrintPref(btId);


          this.global.ShowToastr('success',labels.alert.success, 'Success!');
        }
        else {
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
          console.log("InZoneSetupProcess",res.responseMessage);
        }
      });
    }
    else {
      let paylaod = {
        Positions,
        ToteIDs,
        OrderNumbers,
        "BatchID": this.batchID, 
        'Count': 0
      }
      this.iinductionManagerApi.PickToteSetupProcess(paylaod).subscribe(res => {
        if (res.isExecuted) {
          let batId = this.batchID
          this.dialog.closeAll();
          this.TOTE_SETUP.map(obj => {
            obj.toteID = '';
            obj.orderNumber = '';
            obj.priority = '';
          });
          this.batchID = '';

          this.global.ShowToastr('success',labels.alert.success, 'Success!');

          // AUTO PRINT PREFERENCES CONDITIONS ON PICK TOTE SETUP 

          if(isPref){
            this.ProcessPickPrintPref(Positions, ToteIDs, OrderNumbers, batId)
          }
        


        }
        else {
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
          console.log("PickToteSetupProcess",res.responseMessage);
        }
      });
    }


  }



  async ProcessPickPrintPref(Positions, ToteIDs, OrderNumbers, batchId) {
    try {
      let isWindowClosed: any = null;
      let isAnyWindowOpen = false;
      if (this.imPreferences.autoPrintPickToteLabels) {

        if (this.imPreferences.printDirectly) {
          await  this.global.Print(`FileName:PrintPrevPickToteLabel|Positions:${Positions}|ToteIDs:${ToteIDs}|OrderNums:${OrderNumbers}|BatchID:${batchId}`, 'lbl');
        } else {
          isAnyWindowOpen = true;
          isWindowClosed = await this.previewWindow(`FileName:PrintPrevPickToteLabel|Positions:${Positions}|ToteIDs:${ToteIDs}|OrderNums:${OrderNumbers}|BatchID:${batchId}`);
        }
        if (this.imPreferences.autoPrintOffCarouselPickList) {
          if (this.imPreferences.printDirectly) {
            await   this.global.Print(`FileName:PrintPrevOffCarPickList|Positions:${Positions}|ToteIDs:${ToteIDs}|OrderNums:${OrderNumbers}`);
          } else if (isWindowClosed) {
            isAnyWindowOpen = true;
            isWindowClosed = await this.previewWindow(`FileName:PrintPrevOffCarPickList|Positions:${Positions}|ToteIDs:${ToteIDs}|OrderNums:${OrderNumbers}`);
          }
        }

      }
     else if (this.imPreferences.autoPrintOffCarouselPickList) {
        if (this.imPreferences.printDirectly) {
          await   this.global.Print(`FileName:PrintPrevOffCarPickList|Positions:${Positions}|ToteIDs:${ToteIDs}|OrderNums:${OrderNumbers}`);
        } else {
          isAnyWindowOpen = true;
          isWindowClosed = await this.previewWindow(`FileName:PrintPrevOffCarPickList|Positions:${Positions}|ToteIDs:${ToteIDs}|OrderNums:${OrderNumbers}`);
        }

      }else if (this.imPreferences.autoPrintCaseLabel) {
        if (this.imPreferences.printDirectly) {
          await  this.global.Print(`FileName:PrintPrevInZoneCaseLabel|BatchID:${batchId}`, 'lbl');
        }

        else if (isAnyWindowOpen) {
          if (isWindowClosed) {
            window.open(`/#/report-view?file=FileName:PrintPrevInZoneCaseLabel|BatchID:${batchId}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
          }
        } else {
          window.open(`/#/report-view?file=FileName:PrintPrevInZoneCaseLabel|BatchID:${batchId}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
        }
      }


    } catch (error) {
      console.error('Error occurred:', error);
    }
  }

  async InZoneProcessPrintPref(batchId) {
    try {
      let isWindowClosed: any = null;
      
      if (this.imPreferences.autoPrintPickToteLabels) {

        if (this.imPreferences.printDirectly) {
           
          await this.global.Print(`FileName:PrintPrevInZoneBatchToteLabel|BatchID:${batchId}|WSID:${this.userData.wsid}`);
        } else {
          isWindowClosed = await this.previewWindow(`FileName:PrintPrevInZoneBatchToteLabel|BatchID:${batchId}|WSID:${this.userData.wsid}`);
          
        }
        if (this.imPreferences.autoPrintOffCarouselPickList) {
          if (this.imPreferences.printDirectly) {
            await this.global.Print(`FileName:PrintPrevIMPickBatchList|BatchID:${batchId}`);
          } else if (isWindowClosed) {
            isWindowClosed = await this.previewWindow(`FileName:PrintPrevIMPickBatchList|BatchID:${batchId}`);
          }
        }
        if (this.imPreferences.autoPrintCaseLabel) {
          if (this.imPreferences.printDirectly) {
            await this.global.Print(`FileName:PrintPrevInZoneCaseLabel|BatchID:${batchId}`);
          } else if (isWindowClosed) {
            isWindowClosed = await this.previewWindow(`FileName:PrintPrevInZoneCaseLabel|BatchID:${batchId}`);
          }
        }
        if (this.imPreferences.autoPrintPickBatchList) {
          if (this.imPreferences.printDirectly) {
            await this.global.Print(`FileName:PrintPrevPickBatchList|BatchID:${batchId}`);
          } else if (isWindowClosed) {
            isWindowClosed = await this.previewWindow(`FileName:PrintPrevPickBatchList|BatchID:${batchId}`);
          }
        }


      }
     else if (this.imPreferences.autoPrintOffCarouselPickList) {

        if (this.imPreferences.printDirectly) {
          await this.global.Print(`FileName:PrintPrevIMPickBatchList|BatchID:${batchId}`);
        } else {
          isWindowClosed = await this.previewWindow(`FileName:PrintPrevIMPickBatchList|BatchID:${batchId}`);
        }
        if (this.imPreferences.autoPrintCaseLabel) {
          if (this.imPreferences.printDirectly) {
            await this.global.Print(`FileName:PrintPrevInZoneCaseLabel|BatchID:${batchId}`);
          } else if (isWindowClosed) {
            isWindowClosed = await this.previewWindow(`FileName:PrintPrevInZoneCaseLabel|BatchID:${batchId}`);
          }
        }

        if (this.imPreferences.autoPrintPickBatchList) {
          if (this.imPreferences.printDirectly) {
            await this.global.Print(`FileName:PrintPrevPickBatchList|BatchID:${batchId}`);
          } else if (isWindowClosed) {
            isWindowClosed = await this.previewWindow(`FileName:PrintPrevPickBatchList|BatchID:${batchId}`);
          }
        }
      }
      else   if (this.imPreferences.autoPrintCaseLabel) {
        if (this.imPreferences.printDirectly) {
          await this.global.Print(`FileName:PrintPrevInZoneCaseLabel|BatchID:${batchId}`);
        } else {
          isWindowClosed = await this.previewWindow(`FileName:PrintPrevInZoneCaseLabel|BatchID:${batchId}`);
        }

        if (this.imPreferences.autoPrintPickBatchList) {
          if (this.imPreferences.printDirectly) {
            await this.global.Print(`FileName:PrintPrevPickBatchList|BatchID:${batchId}`);
          } else if (isWindowClosed) {
            isWindowClosed = await this.previewWindow(`FileName:PrintPrevPickBatchList|BatchID:${batchId}`);
          }
        }


      }
      else  if (this.imPreferences.autoPrintPickBatchList) {
        if (this.imPreferences.printDirectly) {
          await this.global.Print(`FileName:PrintPrevPickBatchList|BatchID:${batchId}`);
        } else {
          window.open(`/#/report-view?file=FileName:PrintPrevPickBatchList|BatchID:${batchId}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
        }
      }
    } catch (error) {
       this.alertPopUpBlocked();
      console.error('Error occurred:', error);
    }
  }

}
