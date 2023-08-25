import { SelectionModel } from '@angular/cdk/collections';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BatchDeleteComponent } from 'src/app/dialogs/batch-delete/batch-delete.component';
import { SelectZonesComponent } from 'src/app/dialogs/select-zones/select-zones.component';
import { SelectionTransactionForToteComponent } from 'src/app/dialogs/selection-transaction-for-tote/selection-transaction-for-tote.component';
import { TotesAddEditComponent } from 'src/app/dialogs/totes-add-edit/totes-add-edit.component';
import { ToastrService } from 'ngx-toastr';
 
import { AuthService } from 'src/app/init/auth.service';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { FloatLabelType } from '@angular/material/form-field';
import { FormControl } from '@angular/forms';
import { ToteTransactionViewComponent } from 'src/app/dialogs/tote-transaction-view/tote-transaction-view.component';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { MarkToteFullComponent } from 'src/app/dialogs/mark-tote-full/mark-tote-full.component';
import { AlertConfirmationComponent } from 'src/app/dialogs/alert-confirmation/alert-confirmation.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { ReelDetailComponent } from 'src/app/dialogs/reel-detail/reel-detail.component';
import { ReelTransactionsComponent } from 'src/app/dialogs/reel-transactions/reel-transactions.component';
import { event } from 'jquery';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { GlobalService } from 'src/app/common/services/global.service';


export interface PeriodicElement {
  position: string;
}

@Component({
  selector: 'app-process-put-aways',
  templateUrl: './process-put-aways.component.html',
  styleUrls: ['./process-put-aways.component.scss'],
})
export class ProcessPutAwaysComponent implements OnInit {
  ELEMENT_DATA = [{ position: 0, cells: '', toteid: '', locked: '' }];
  displayedColumns: string[] = ['positions', 'cells', 'toteid', 'save'];
  dataSource: any;
  selection = new SelectionModel<PeriodicElement>(true, []);
  licAppData;
  rowSelected = false;
  isViewTote = true;
  public ifAllowed: boolean = false
  public userData: any;
  public cellSize = '0';
  public batchId = '';
  public status = 'Not Processed';
  public assignedZones = '';
  public autoPutToteIDS = false;
  public pickBatchQuantity = 0;
  public currentToteID = 0;
  public toteID = '';
  public cell = '';
  public toteNumber = '';
  public toteQuantity: any
  public actionDropDown: any;
  fieldNames:any;
  imPreferences:any;
  public assignedZonesArray = [{ zone: '' }];
  searchAutocompleteItemNum: any = [];
  searchByItem: any = new Subject<string>();
  floatLabelControlItem: any = new FormControl('item' as FloatLabelType);
  hideRequiredControlItem = new FormControl(false);
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('matRef') matRef: MatSelect;
  @ViewChild('actionRef1') actionRef1: MatSelect;
  @ViewChild('actionRef') actionRef: MatSelect;
  @ViewChild('inputVal') inputVal: ElementRef;
  @ViewChild('batchVal') batchVal: ElementRef;
  @ViewChild('batchFocus') batchFocus: ElementRef;
  selectedOption: any;
  displayedColumns1: string[] = [
    'status',
    'totesPosition',
    'toteID',
    'cells',
    'toteQuantity',
    'zoneLabel',
  ];

  selectedIndex: number = 0;
  // Process Put Away
  batchId2: string = '';

  searchAutocompleteItemNum2: any = [];
  dataSource2: any= new MatTableDataSource<any>([]);

  inputType = "any";
  inputValue = "";

  nextPos: any;
  nextPutLoc: any;
  nextCell: any;

  postion: any;
  tote: any;
  minPos: any;
  maxPos: any;

  // Global
  processPutAwayIndex: any;

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }


  // // arbash variables
  applyStrip:any;
  stripLength:any;
  stripSide:any;
  toteOptions:any
  posOptions:any
  selectedToteID:any
  openCell:any
  upperBound = 5
  lowerBound = 1
  


  constructor(
    private dialog: MatDialog,
    private toastr: ToastrService, 
    private Api:ApiFuntions,
    private global:GlobalService,
    private authService: AuthService,
    private _liveAnnouncer: LiveAnnouncer,
  ) { }
  ngAfterViewInit() {
    setTimeout(() => {
      this.inputVal.nativeElement.focus();
      }, 2000);
    this.imPreferences=this.global.getImPreferences();
  }

  
  onTabChange(event: MatTabChangeEvent) {
    // This method will be called whenever the user changes the selected tab
    const newIndex = event.index;
    console.log('Tab changed to index:', newIndex);
    if(newIndex===1){
      
      setTimeout(() => {
      this.inputVal.nativeElement.focus();
        
      }, 100);
   
      this.autocompleteSearchColumnItem2();
    }else if(newIndex===0){
      setTimeout(() => {
      this.batchFocus.nativeElement.focus();
          
        }, 100);
    }

  }
  ngOnInit(): void {
    this.ELEMENT_DATA.length = 0;
    this.userData = this.authService.userData();
    this.getCurrentToteID();
    this.getProcessPutAwayIndex();
    this.OSFieldFilterNames();
    this.imPreferences=this.global.getImPreferences();
    this.searchByItem
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        if (value == 1) {
          this.autocompleteSearchColumnItem2();
        } else {
          this.autocompleteSearchColumnItem();
        }
      });
  }

  batchIdKeyup(){
    this.getRow(this.batchId);
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
  public OSFieldFilterNames() { 
    this.Api.ColumnAlias().subscribe((res: any) => {
      this.fieldNames = res.data;
      // this.sharedService.updateFieldNames(this.fieldNames)
    })
  }
  clearFormAndTable() {
    this.batchId = '';
    this.status = 'Not Processed';
    this.assignedZones = '';
    this.ELEMENT_DATA.length = 0;
    this.dataSource = [];
    this.assignedZonesArray.length=0;   // after deleting zones array reset to select zones 
    this.batchId2 = "";
    this.dataSource2 = new MatTableDataSource<any>([]);
    this.inputValue = "";
    this.nextPos = "";
    this.nextPutLoc = "";
    this.nextCell = "";
    this.postion = "";
    this.tote = "";
  }
  print(tote){
      this.global.Print(`FileName:PrintPrevToteContentsLabel|ToteID:${tote}|BatchID:${this.batchId}|ZoneLabel:''|TransType:'Put Away'|printDirect:true|ID:-1`,'lbl')
    // window.open(`/#/report-view?file=FileName:PrintPrevToteContentsLabel|ToteID:${tote}|BatchID:${this.batchId}|ZoneLabel:''|TransType:'Put Away'|printDirect:true|ID:-1`, '_blank', "location=yes");
    // this.global.Print(`FileName:PrintPrevToteContentsLabel|ToteID:${tote}|BatchID:${this.batchId}|ZoneLabel:''|TransType:'Put Away'|printDirect:true|ID:-1`,'lbl','lbl');
 
  }
  printToteLoc(){
    if(this.imPreferences.printDirectly){

      this.global.Print(`FileName:PrintPrevToteContentsLabel|ToteID:${this.toteID}|BatchID:${this.batchId}|ZoneLabel:''|TransType:'Put Away'|printDirect:true|ID:-1`,'lbl')

    }else{

      window.open(`/#/report-view?file=FileName:PrintPrevToteContentsLabel|ToteID:${this.toteID}|BatchID:${this.batchId}|ZoneLabel:''|TransType:'Put Away'|printDirect:true|ID:-1`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')

    }

      // this.global.Print(`FileName:PrintPrevToteContentsLabel|ToteID:${this.toteID}|BatchID:${this.batchId}|ZoneLabel:''|TransType:'Put Away'|ID:-1`);
    
  }
  printTotePut(){
    this.clearMatSelectList();
      this.global.Print(`FileName:PrintOffCarList|BatchID:${this.batchId}`)
    // window.open(`/#/report-view?file=IMOCPut-lst`, '_blank', "location=yes");
    // window.open(`/#/report-view?file=FileName:PrintOffCarList|BatchID:${this.batchId}`, '_blank', "location=yes");
     this.global.Print(`FileName:PrintOffCarList|BatchID:${this.batchId}`);
  }
  getCurrentToteID() {
    this.Api.NextTote().subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          this.currentToteID = res.data;
        } else {
          this.toastr.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (error) => { }
    );
  }

  getFloatLabelValueItem(): FloatLabelType {
    return this.floatLabelControlItem.value || 'item';
  }

  gridAction(action: any) {
    if (action == 'assignAll') {
      for (let index = 0; index < this.pickBatchQuantity; index++) {
        if (!this.ELEMENT_DATA[index].locked) {
          this.ELEMENT_DATA[index].toteid = this.currentToteID.toString();
          this.currentToteID++;
        }
      }

      this.actionDropDown = null;
    } else {
      this.actionDropDown = null;
    }
    this.clearMatSelectList()
  }

  getRow(batchID) {
    // debugger
    var payLoad = {
      batchID: batchID,
      username: this.userData.username,
      wsid: this.userData.wsid,
    };    
    this.Api.BatchTotes(payLoad).subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          if (res.data.length > 0) {
            this.status = "Processed";
          }
          else{
            this.status = "Not Processed";
          }
          this.ELEMENT_DATA.length = 0;
          for (var ix = 0; ix < res.data.length; ix++) {
            this.ELEMENT_DATA.push({
             
              position: parseInt(res.data[ix].totePosition),
              cells: res.data[ix].cells,
              toteid: res.data[ix].toteID.toString(),
              locked: res.data[ix].locked.toString()
            });

            if (ix == 0) {
              try {
                this.assignedZones = res.data[ix].zoneLabel;
                var zones = res.data[ix].zoneLabel.split(' ');
                for (var i = 1; i < zones.length; i++) { 
                  this.assignedZonesArray.push({ zone: zones[i] });
                }
              } catch (e) { }
            }
          }
          this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);


        } else {
          this.toastr.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (error) => { }
    );
  }

  openSelectZonesDialogue() {
    // if(this.dataSource2.length==0){
    //   this.assignedZonesArray.forEach(item=>{
    //    console.log(item);
       
    //   })
    // }
    if (this.batchId != '') {
      const dialogRef = this.dialog.open(SelectZonesComponent, {
        height: 'auto',
        width: '60%',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          batchId: this.batchId,
          userId: this.userData.username,
          wsid: this.userData.wsid,
          assignedZones: this.assignedZonesArray,
          status:this.status,
          isNewBatch:this.dataSource2 && this.dataSource2.length>0?false:true
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          var zones = 'Zones:';
          this.assignedZonesArray = result;
          for (var i = 0; i < result.length; i++) {
            zones = zones + ' ' + result[i].zone;
          }
          this.assignedZones = zones;
        }
      });
    } else {
      this.showMessage('Please select batch', 2000, 'error');
    }
  }

  openTotesDialogue(position: any,index?) {
    const dialogRef = this.dialog.open(TotesAddEditComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data:
      {
        position: position,
        alreadySavedTotes: this.ELEMENT_DATA,
        validateTotes: this.processPutAwayIndex.imPreference.validateTotes,
        defaultCells: this.processPutAwayIndex.imPreference.defaultCells
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.toteID != "") {
          if (result.toteID.toString() != '') {

            this.ELEMENT_DATA[index].toteid = result.toteID.toString();
          }
          if (result.cellID.toString() != '') {
            for (var i = 0; i < this.ELEMENT_DATA.length; i++) {
              this.ELEMENT_DATA[i].cells = result.cellID.toString();
            }
          }


        }

      }
    });



  }
  onFocusOutBatchID(val) {
    if (val) {
      try {
        setTimeout(() => {
          let payload = {
            batchID: this.batchId2,
            username: this.userData.userName,
            wsid: this.userData.wsid
          }

          this.Api.BatchExist(payload).subscribe((res: any) => {
            if (res && !res.data) {
              const dialogRef = this.dialog.open(AlertConfirmationComponent, {
                height: 'auto',
                width: '50vw',
                autoFocus: '__non_existing_element__',
                 disableClose:true,
                data: {
                  message: "This Batch ID either does not exists or is assigned to a different workstation.Use the Tote Setup tab to create a new batch or choose an existing batch for this workstation.",
                  heading: 'Invalid Batch ID'
                },
              });
              dialogRef.afterClosed().subscribe(result => {
                this.clearFormAndTable();
              });
            } else {
              this.fillToteTable();
            }
          });

          // this.batchVal.nativeElement.blur();
          this.inputVal.nativeElement.blur();

        }, 200);

      } catch (error) { 
      }
    }
  }

  openDeleteBatchDialogue() {
    const dialogRef = this.dialog.open(BatchDeleteComponent, {
      height: 'auto',
      width: '50vw',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        deleteAllDisable: false,
        batchId: this.batchId2,
        toteId: this.toteNumber ? this.toteNumber : '',
        userName: this.userData.userName,
        wsid: this.userData.wsid,
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res.isDeleted) {
        this.clearFormAndTable();
        this.autocompleteSearchColumnItem2();
      } else if (res.isExecuted) {
        this.fillToteTable();
      }
    });
  }

  clearBatch() {
    this.batchId = '';
  }

  ngAfterViewChecked(): void {
    // if (this.selectedIndex == 1) {
    //   this.inputVal.nativeElement.focus();
    // }
  }

  processIfZoneSelected() {
    if (this.assignedZonesArray.length <= 0) {
      const dialogRef = this.dialog.open(AlertConfirmationComponent, {
        height: 'auto',
        width: '50vw',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          message: "You must select one or more zones. If there are no zones available for selection check your Location Zones settings and/or delete or deallocate a batch to free up a zone.",
          heading: 'Error'
        },
      });
    }
    else {
      this.processBath();
    }
  }

  processBath() {

    if (this.batchId == '') {
      this.showMessage('You must provide a Batch ID.', 2000, 'error');
    } else {
      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          message:
            'Batch processed!  Click OK to move onto the next step or cancel to remain on this screen to create/edit more batches.',
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'Yes') {
          var toteID = '',
            cells = '',
            position = '';
          for (var i = 0; i < this.ELEMENT_DATA.length; i++) {
            if (i == 0) {
              toteID = toteID + this.ELEMENT_DATA[i].toteid;
              cells = cells + this.ELEMENT_DATA[i].cells;
              position = position + this.ELEMENT_DATA[i].position;
            } else {
              toteID = toteID + ',' + this.ELEMENT_DATA[i].toteid;
              cells = cells + ',' + this.ELEMENT_DATA[i].cells;
              position = position + ',' + this.ELEMENT_DATA[i].position;
            }
          }
          const totePaylaod = {
            "ToteID": toteID,
            userName: this.userData.userName,
            wsid: this.userData.wsid,
          }
          this.Api.ValidateTotesForPutAways(totePaylaod).subscribe(res => {
            if (res.data != '') {
              this.toastr.error(`The tote id ${res.data} already exists in Open Transactions. Please select another tote`, 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
              for (var i = 0; i < this.ELEMENT_DATA.length; i++) {
                if (this.ELEMENT_DATA[i].toteid == res.data) {
                  this.ELEMENT_DATA[i].toteid = '';
                  this.ELEMENT_DATA[i].locked = '';
                }
              }
            }
            else {
              var payLoad = {
                batchID: this.batchId,
                zoneLabel: this.assignedZones,
                totes: [toteID, cells, position],
                username: this.userData.userName,
                wsid: this.userData.wsid,
              };
              this.Api.ProcessBatch(payLoad).subscribe(
                (res: any) => {
                  if (res.data && res.isExecuted) {
                    if(this.imPreferences.autoPrintPutAwayToteLabels){
                      if(this.imPreferences.printDirectly){
                        this.global.Print(`FileName:PrintPrevToteContentsLabel|ToteID:-1|ZoneLabel:|TransType:Put Away|ID:-1|BatchID:${this.batchId}`)
                      }else{
                        window.open(`/#/report-view?file=FileName:PrintPrevToteContentsLabel|ToteID:-1|ZoneLabel:|TransType:Put Away|ID:-1|BatchID:${this.batchId}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
                      }
                    }
                    this.toastr.success(res.responseMessage, 'Success!', {
                      positionClass: 'toast-bottom-right',
                      timeOut: 2000,
                    });
                    this.status = 'Processed';
                    this.selectedIndex = 1;
                    this.batchId2 = this.batchId;
                    setTimeout(() => {
                      this.inputVal.nativeElement.focus();
                      // this.batchVal.nativeElement.focus();
                    }, 500);
                    this.fillToteTable(this.batchId);
                  } else {
                    this.toastr.error('Something went wrong', 'Error!', {
                      positionClass: 'toast-bottom-right',
                      timeOut: 2000,
                    });
                  }
                },
                (error) => { }
              );

            }
          });
        }
      });
    }
  }

  showMessage(message: any, timeout: any, type: any) {
    if (type == 'error') {
      this.toastr.error(message, 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: timeout,
      });
    } else {
      this.toastr.success(message, 'Success!', {
        positionClass: 'toast-bottom-right',
        timeOut: timeout,
      });
    }
  }

   IMPreferences:any;
  getProcessPutAwayIndex() {
    this.Api.ProcessPutAwayIndex().subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          this.IMPreferences =  res.data.imPreference;
          this.cellSize = res.data.imPreference.defaultCells;
          this.autoPutToteIDS = res.data.imPreference.autoPutAwayToteID;
          this.pickBatchQuantity = res.data.imPreference.pickBatchQuantity;
          this.processPutAwayIndex = res.data;
          
          this.inputType = res.data.imPreference.defaultPutAwayScanType;
          this.applyStrip = res.data.imPreference.stripScan
          this.stripLength = res.data.imPreference.stripNumber
          this.stripSide = res.data.imPreference.stripSide
          if (res.data.batchIDs) {
            this.batchId = res.data.batchIDs;
            this.selectedIndex = 1;
            this.batchId2 = res.data.batchIDs;
            this.fillToteTable(res.data.batchIDs);
            setTimeout(() => {
              this.inputVal.nativeElement.focus();
              this.autocompleteSearchColumnItem2();
              // this.batchVal.nativeElement.focus();
            }, 500);
          }

        } else {
          this.toastr.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (error) => { }
    );
  }

  makeTotes(numTotes, defaultCells, defaultIDs) {
    // var btc = $('#batch_totes_container');
    // btc.children().remove();
    // for (var x = 1; x <= numTotes; x++) {
    // btc.append(makeTote(x, defaultCells, '', ''));
    // };
  }

  getNextBatchID() { 
    this.Api.NextBatchID().subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          this.batchId = res.data;
          this.openSelectZonesDialogue();
        } else {
          this.toastr.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (error) => { }
    );
  }

  updateNxtTote() {
    let updatePayload = {
      "tote": this.currentToteID,
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }
    this.Api.NextToteUpdate(updatePayload).subscribe(res => {
      if (!res.isExecuted) {
        this.toastr.error('Something is wrong.', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }

    });
  }

  createNewBatch(withID = '') {



    if (withID == '') {
      if (this.batchId == '') {
        this.showMessage(
          'You must assign a Batch ID before creating a new batch.',
          2000,
          'error'
        );
      } else {
        const dialogRef = this.dialog.open(AlertConfirmationComponent, {
          height: 'auto',
          width: '560px',
          data: {
            message: 'Click OK to start a new batch and discard any changes to the current batch.',
            heading: '',
            notificationPrimary: true,
          },
          autoFocus: '__non_existing_element__',
      disableClose:true,
        });
        dialogRef.afterClosed().subscribe((result) => {
          if(result){
            this.ELEMENT_DATA.length = 0;
            for (let index = 0; index < this.pickBatchQuantity; index++) {
              if (!this.autoPutToteIDS) {
                this.ELEMENT_DATA.push({
                  position: index + 1,
                  cells: this.cellSize,
                  toteid: '',
                  locked: ""
                });
              } else {
                this.ELEMENT_DATA.push({
                  position: index + 1,
                  cells: this.cellSize,
                  toteid: this.currentToteID.toString(),
                  locked: ""
                });
                this.currentToteID++;
              }
            }
            this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
          }
        })
      
      }
    } else {

 
      // if(this.dataSource && this.dataSource.data && this.dataSource.data.length==0){
        if( this.ELEMENT_DATA.length != 0){
        const dialogRef = this.dialog.open(AlertConfirmationComponent, {
          height: 'auto',
          width: '560px',
          data: {
            message: 'Click OK to start a new batch and discard any changes to the current batch.',
            heading: '',
            notificationPrimary: true,
          },
          autoFocus: '__non_existing_element__',
      disableClose:true,
        });
        dialogRef.afterClosed().subscribe((result) => {
          if(result){
   //Getting and setting next batch ID
   this.getNextBatchID();
   //setup totes
   //this.pickBatchQuantity;
   //ELEMENT_DATA.push({ position: 'uzair' });
   this.ELEMENT_DATA.length = 0;
   for (let index = 0; index < this.pickBatchQuantity; index++) {
     if (!this.autoPutToteIDS) {
       this.ELEMENT_DATA.push({
         position: index + 1,
         cells: this.cellSize,
         toteid: '',
         locked: ""
       });
     } else {
       this.ELEMENT_DATA.push({
         position: index + 1,
         cells: this.cellSize,
         toteid: this.currentToteID.toString(),
         locked: ""
       });
       this.currentToteID++;
     }
   }
   this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
   this.updateNxtTote()
          }
        });
      }
      else{
          //Getting and setting next batch ID
      this.getNextBatchID();
      //setup totes
      //this.pickBatchQuantity;
      //ELEMENT_DATA.push({ position: 'uzair' });
      this.ELEMENT_DATA.length = 0;
      for (let index = 0; index < this.pickBatchQuantity; index++) {
        if (!this.autoPutToteIDS) {
          this.ELEMENT_DATA.push({
            position: index + 1,
            cells: this.cellSize,
            toteid: '',
            locked: ""
          });
        } else {
          this.ELEMENT_DATA.push({
            position: index + 1,
            cells: this.cellSize,
            toteid: this.currentToteID.toString(),
            locked: ""
          });
          this.currentToteID++;
        }
      }
      this.dataSource = new MatTableDataSource<any>(this.ELEMENT_DATA);
      this.updateNxtTote()
      }
    
    }
  }

  onToteChange($event, position, cells = '') {
    if (cells == '') {
      if (this.ELEMENT_DATA[position - 1].toteid != $event.target.value) {
        this.ELEMENT_DATA[position - 1].toteid = $event.target.value;
      }
    } else {
      if (this.ELEMENT_DATA[position - 1].cells != $event.target.value) {
        this.ELEMENT_DATA[position - 1].cells = $event.target.value;
      }
    }
  }

  async autocompleteSearchColumnItem() {
    let searchPayload = {
      batchID: this.batchId,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api
      .BatchIDTypeAhead(searchPayload)
      .subscribe(
        (res: any) => {
          if (res.data) {
            this.searchAutocompleteItemNum = res.data;
          } else {
            this.toastr.error('Something went wrong', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        },
        (error) => { }
      );
  }

  async autocompleteSearchColumnItem2() {
    let searchPayload = {
      batchID: this.batchId2,
      username: this.userData.userName,
      wsid: this.userData.wsid,
    };
    this.Api.BatchIDTypeAhead(searchPayload).subscribe(
      (res: any) => {
        if (res.data) {
          this.searchAutocompleteItemNum2 = res.data;
        } else {
          this.toastr.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (error) => { }
    );
  }

  updateToteID($event) {
    for (var i = 0; i < this.pickBatchQuantity; i++) {
      if(this.ELEMENT_DATA && this.ELEMENT_DATA[i]){
      if (this.ELEMENT_DATA[i].toteid == '') {
        this.ELEMENT_DATA[i].toteid = $event.target.value;
        this.toteID = '';
        break;
      }
    }
    }
  }

  assignToteAtPosition(element: any, clear = 0,index?) {
    if (clear == 0) {
      this.ELEMENT_DATA[index].toteid =
        this.currentToteID.toString();
      this.currentToteID++;
    } else {
      this.ELEMENT_DATA[index].toteid = '';
    }
  }

  setToDefaultQuantity() {
    if (this.batchId == '') {
      this.showMessage('You must provide a Batch ID.', 2000, 'error');
    } else {

      let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          message: 'Click OK to update all totes (except allocated ones) to have their default cell count.',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'Yes') {
          for (var i = 0; i < this.pickBatchQuantity; i++) {
            this.ELEMENT_DATA[i].cells = this.cellSize.toString();
          }
        }
      });





    }
  }

  selectionChanged(value: any) {
    this.inputType = value;
  }

  openST(event: any) {
    if (event.key === 'Enter') {
      this.openSelectionTransactionDialogue();
    }
  }

  applyStripIfApplicable(){
    if(this.applyStrip){
      if (this.stripSide.toLowerCase() == 'right') {
        this.inputValue = this.inputValue.substring(0, this.inputValue.length - this.stripLength);
      } 
      else {
        this.inputValue = this.inputValue.substring(this.stripLength, this.inputValue.length);
      };
    }
  }

  openSelectionTransactionDialogue() {

    this.applyStripIfApplicable();

    if (this.cell == this.toteQuantity) {
      const dialogRef = this.dialog.open(AlertConfirmationComponent, {
        height: 'auto',
        width: '50vw',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          message: "The Tote you've selected is already marked as full. Putting the item in this tote will go over define cells",
          heading: 'Assign Transaction To Selected Tote'
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (!result) return
        if (this.inputValue == "") {
          this.toastr.error('Please enter input value', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
        else {
          // debugger
          const dialogRef = this.dialog.open(SelectionTransactionForToteComponent, {
            height: 'auto',
            width: '1100px',
            autoFocus: '__non_existing_element__',
      disableClose:true,
            data: {
              inputType: this.inputType,
              inputValue: this.inputValue,
              userName: this.userData.userName,
              wsid: this.userData.wsid,
              batchID: this.batchId,
              zones: this.assignedZones,
              totes: this.dataSource2.data,
              selectIfOne: this.processPutAwayIndex.imPreference.selectIfOne,
              defaultPutAwayQuantity: this.processPutAwayIndex.imPreference.defaultPutAwayQuantity,
              autoForwardReplenish: this.processPutAwayIndex.imPreference.autoForwardReplenish,
              propFields:this.fieldNames
            }
          }); 
          dialogRef.afterClosed().subscribe((result) => {
            if (result == 'NO') {
              if(this.inputType !='Serial Number' && this.processPutAwayIndex.imPreference.createItemMaster ){
                this.ifAllowed=false;
    
                const dialogRef = this.dialog.open(AlertConfirmationComponent, {
                  height: 'auto',
                  width: '50vw',
                  autoFocus: '__non_existing_element__',
          disableClose:true,
                  data: {
                    message: "The input code provided was not recognized.  Click OK to add the item to inventory or cancel to return.",
                    heading: ''
                  },
                });
          
                dialogRef.afterClosed().subscribe((result) => {
                  if(result){
                    this.ifAllowed=false;
                    window.open(`/#/InductionManager/Admin/InventoryMaster?addItemNumber=${this.inputValue}`, '_self');
    
                  }
                  
                })
    
                return
              }
              if (this.inputType == 'Any') {
                this.toastr.error('The input code provided was not recognized as an Item Number, Lot Number, Serial Number, Host Transaction ID, Scan Code or Supplier Item ID.', 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
              } else {
                this.toastr.error(`The input code provided was not recognized as a ${this.inputType}.`, 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
              }
            } else if (result == "Task Completed") {
              
              this.inputValue='';
              this.fillToteTable(this.batchId2);
          
            } else if (result == "New Batch") {
              
              this.inputValue='';

              this.clearFormAndTable();
            }
            else if(result.category == "isReel"){
              const d: Date = new Date();
              const now: string = `${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}-IM`;
                    let hvObj =  {
                        order: now,
                        uf1: '',
                        uf2: '',
                        lot: 0,
                        warehouse: '',
                        expdate: '',
                        notes: ''
                      }
                    let itemObj =  {
                        number: result.item.itemNumber,
                        numReels: 1,
                        totalParts: 0,
                        description: result.item.description,
                        whseRequired: result.item.warehouseSensitive
                        
                      }
                      
                      this.ReelTransactionsDialogue(hvObj,itemObj,this.fieldNames)
                      
              
            }
          });

        }
      });
    }
    else if (this.inputValue == "") {
      this.toastr.error('Please enter input value', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000,
      });
    }
    else {
      // debugger
      const dialogRef = this.dialog.open(SelectionTransactionForToteComponent, {
        height: 'auto',
        width: '1100px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          inputType: this.inputType,
          inputValue: this.inputValue,
          userName: this.userData.userName,
          wsid: this.userData.wsid,
          batchID: this.batchId,
          zones: this.assignedZones,
          totes: this.dataSource2.data,
          selectIfOne: this.processPutAwayIndex.imPreference.selectIfOne,
          defaultPutAwayQuantity: this.processPutAwayIndex.imPreference.defaultPutAwayQuantity,
          autoForwardReplenish: this.processPutAwayIndex.imPreference.autoForwardReplenish,
          propFields:this.fieldNames
        }
        
      });

      // debugger
      dialogRef.afterClosed().subscribe((result) => {
        if (result == 'NO') {

      
          if(this.inputType !='Serial Number' && this.processPutAwayIndex.imPreference.createItemMaster ){
            this.ifAllowed=false;

            const dialogRef = this.dialog.open(AlertConfirmationComponent, {
              height: 'auto',
              width: '50vw',
              autoFocus: '__non_existing_element__',
      disableClose:true,
              data: {
                message: "The input code provided was not recognized.  Click OK to add the item to inventory or cancel to return.",
                heading: ''
              },
            });
      
            dialogRef.afterClosed().subscribe((result) => {
              if(result){
                this.ifAllowed=false;
                window.open(`/#/InductionManager/Admin/InventoryMaster?addItemNumber=${this.inputValue}`, '_self');

              }
              
            })

            return
          }
          if (this.inputType == 'Any') {
            this.toastr.error('The input code provided was not recognized as an Item Number, Lot Number, Serial Number, Host Transaction ID, Scan Code or Supplier Item ID.', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          } else {
            this.toastr.error(`The input code provided was not recognized as a ${this.inputType}.`, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        } else if (result == "Task Completed") {
          debugger
          this.inputValue='';
          this.fillToteTable(this.batchId2);
        } else if (result == "New Batch") {
          debugger
          this.inputValue='';
          this.selectedIndex = 0;
          // this.clearFormAndTable();
        }
          else if(result.category == "isReel"){
            const d: Date = new Date();
            const now: string = `${d.getFullYear()}${d.getMonth() + 1}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}-IM`;
                  let hvObj =  {
                      order: now,
                      uf1: '',
                      uf2: '',
                      lot: 0,
                      warehouse: '',
                      expdate: '',
                      notes: ''
                    }
                  let itemObj =  {
                      number: result.item.itemNumber,
                      numReels: 1,
                      totalParts: 0,
                      description: result.item.description,
                      whseRequired: result.item.warehouseSensitive
                      
                    }
                    
                    this.ReelTransactionsDialogue(hvObj,itemObj,this.fieldNames)
                    
            
          }
      });
    }

  }


  zoneLabels:any;
  selectTotes(i: any) {
    for (const iterator of this.dataSource2.data) {
      iterator.isSelected = false;
    }
    this.dataSource2.data[i].isSelected = !this.dataSource2.data[i].isSelected;
    this.tote = this.dataSource2.data[i].toteID;
    this.postion = this.dataSource2.data[i].totesPosition;
    this.cell = this.dataSource2.data[i].cells;
    this.toteNumber = this.dataSource2.data[i].toteID;
    this.rowSelected = true;
    this.toteQuantity = this.dataSource2.data[i].toteQuantity;
    this.zoneLabels = this.dataSource2.data[i].zoneLabel;

    if (this.toteQuantity == this.cell) {
      this.isViewTote = false;

    } else {
      this.isViewTote = true;
    }
  }

  fillToteTable(batchID: string = '') {
    try {
      var payLoad = {
        batchID: batchID ? batchID : this.batchId2,
        sortOrder: 'asc',
        sortColumn: 0,
        username: this.userData.username,
        wsid: this.userData.wsid,
      };

      this.Api.TotesTable(payLoad).subscribe(
        (res: any) => {
          if (res.data && res.isExecuted) {
            for (const iterator of res.data.totesTable) {
              iterator.isSelected = false;
              if (iterator.cells <= iterator.toteQuantity) {
                iterator.status = 1;
              } else {
                iterator.status = 0;
              }
            }
            res.data.totesTable[0].isSelected = true;
            this.dataSource2 = new MatTableDataSource<any>(res.data.totesTable);
            this.dataSource2.paginator = this.paginator;
            this.minPos = 1;
            this.maxPos = this.dataSource2.data.length;
            // this.toteTable  = new MatTableDataSource<any>(res.data.totesTable);
            this.selectTotes(0)
            this.goToNext();
            this.getRow(batchID ? batchID : this.batchId2);
            this.inputValue == ""
          } else {
            this.toastr.error('Something went wrong', 'Error!', {
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

  completeBatch() {
    try {
      if (this.batchId2 == '') {
        this.showMessage('You must provide a Batch ID.', 2000, 'error');
      } else {
        let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          height: 'auto',
          width: '560px',
          autoFocus: '__non_existing_element__',
      disableClose:true,
          data: {
            message: 'Click OK to complete this batch.',
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result == 'Yes') {
            var payLoad = {
              batchID: this.batchId2,
              username: this.userData.userName,
              wsid: this.userData.wsid,
            };

            this.Api.CompleteBatch(payLoad).subscribe(
              (res: any) => {
                if (res.isExecuted) {


                  if(this.imPreferences.autoPrintOffCarouselPutAwayList){
                    if(this.imPreferences.printDirectly){
                      this.global.Print(`FileName:PrintOffCarList|batchID:${this.batchId2}`);
                    }
                    else{
                      window.open(`/#/report-view?file=FileName:PrintOffCarList|batchID:${this.batchId2}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
                    }
                    this.clearFormAndTable();
                  }
                  else if(!this.imPreferences.autoPrintOffCarouselPutAwayList) {

                    let dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
                      height: 'auto',
                      width: '560px',
                      autoFocus: '__non_existing_element__',
                      disableClose:true,
                      data: {
                        message: 'Click OK to print an Off-Carousel Put Away List.',
                      },
                    });
            
                    dialogRef2.afterClosed().subscribe((result) => {
                      if (result == 'Yes') {
  
                          if(this.imPreferences.printDirectly){
                            this.global.Print(`FileName:PrintOffCarList|batchID:${this.batchId2}`);
                          }
                          else{
                            window.open(`/#/report-view?file=FileName:PrintOffCarList|batchID:${this.batchId2}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')
                          }
                          this.clearFormAndTable();

                        // this.global.Print(`FileName:PrintOffCarList|batchID:${this.batchId2}`);
                        // this.clearFormAndTable();
                      }else{
                        this.toastr.success(
                          'Batch Completed Successfully',
                          'Success!',
                          {
                            positionClass: 'toast-bottom-right',
                            timeOut: 2000,
                          }
                        );
                        this.clearFormAndTable();
                        this.selectedIndex = 0;
                        setTimeout(() => {
                        this.batchFocus.nativeElement.focus();
                          
                        }, 100);
                      }
                    });   
                  }
                        
                 
                
                  // this.getRow(this.batchId);
                } else {
                  this.toastr.error('Something went wrong', 'Error!', {
                    positionClass: 'toast-bottom-right',
                    timeOut: 2000,
                  });
                }
              },
              (error) => { }
            );
          }
        });
      }
    } catch (error) { 
    }
  }


  goToNext() {
    var fil = this.dataSource2.data.filter((e: any) => e.status == 0);
    if (fil.length > 0) {
      this.selectTotes(this.dataSource2.data.indexOf(fil[0]));
      this.nextPutLoc = fil[0].toteID;
      this.nextPos = fil[0].totesPosition;
      this.nextCell = fil[0].cells;
    } else {
      this.nextPutLoc = '';
      this.nextPos = '';
      this.nextCell = '';
    }
  }

  selectPosOrTote(type: number, value: any = '') {
    if (type == 0) {

      if (this.postion === 0) {
        this.postion = 1;
        value = 1;
      }
      if (this.postion != "") {
        if (parseInt(this.postion) < parseInt(this.minPos)) { this.postion = this.minPos; value = this.minPos; }
        if (parseInt(this.postion) > parseInt(this.maxPos)) { this.postion = this.maxPos; value = this.maxPos; }
      }

      var fil = this.dataSource2.data.filter((e: any) => e.totesPosition == value?.toString());
      // fil.length > 0 ? this.tote = fil[0].toteID : this.tote = '';
      if (fil.length > 0) {
        this.tote = fil[0].toteID
      } else {
        // value > 0 ? this.postion = value - 1 : this.postion = value + 1;
        this.tote = ''
      }
    }
    else if (type == 1) {
      var fil = this.dataSource2.data.filter((e: any) => e.toteID == value?.toString());
      fil.length > 0 ? this.postion = fil[0].totesPosition : this.postion = '';
    }
    else {
      var fil = this.dataSource2.data.filter((e: any) => { return (e.totesPosition == this.postion?.toString() && e.toteID == this.tote) });
      if (fil.length > 0) {
        for (const iterator of this.dataSource2.data) { iterator.isSelected = false; }
        this.dataSource2.data[
          this.dataSource2.data.indexOf(fil[0])
        ].isSelected = true;
      } else {
        this.showMessage('The selected position and/or tote ID was not found in the table.', 2000, 'error');
      }
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
    this.dataSource2.sort = this.sort;
  }

  clearMatSelectList() {
    this.actionRef1.options.forEach((data: MatOption) => data.deselect());
    this.actionRef.options.forEach((data: MatOption) => data.deselect());
  }

  actionDialog(opened: boolean) {
    if (!opened && this.selectedOption && this.selectedOption === 'markTote') {

      const dialogRef = this.dialog.open(MarkToteFullComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          mode: 'add-trans',
          message: 'Click OK to mark this Tote as being Full',
          userName: this.userData.userName,
          wsid: this.userData.wsid,
        },
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (this.toteQuantity <= 0)
          this.clearMatSelectList();
        if (res) {
          let payLoad = {
            toteNumber: this.postion,
            cell: this.toteQuantity,
            batchID: this.batchId2,
            username: this.userData.userName,
            wsid: this.userData.wsid,
          };

          this.Api.MarkToteFull(payLoad).subscribe(
            (res: any) => {
              if (res.data && res.isExecuted) {
                this.toastr.success(
                  'Marked Successfully',
                  'Success!',
                  {
                    positionClass: 'toast-bottom-right',
                    timeOut: 2000,
                  }
                );
                this.fillToteTable();
          this.clearMatSelectList();

              } else {
                this.toastr.error('Something went wrong', 'Error!', {
                  positionClass: 'toast-bottom-right',
                  timeOut: 2000,
                });
              }
            },
            (error) => { }
          );

        }
      });
    } else if (
      !opened &&
      this.selectedOption &&
      this.selectedOption === 'ViewTote'
    ) {
      this.clearMatSelectList();
      const dialogRef = this.dialog.open(ToteTransactionViewComponent, {
        height: 'auto',
        width: '80vw',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {


          batchID: this.batchId2,
          tote: this.postion,
          toteID: this.toteNumber,
          cell: this.toteQuantity,
          userName: this.userData.userName,
          wsid: this.userData.wsid,
          IMPreferences :this.IMPreferences,
          zoneLabels: this.zoneLabels
        }
      })

      dialogRef.afterClosed().subscribe(result => {
        this.clearMatSelectList();
        this.fillToteTable();
      });
    }
  } 

  reelQty
  ReelDetailDialogue(hv,item) {
    
    const dialogRef = this.dialog.open(ReelDetailComponent, {
      height: 'auto',
      width: '932px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        hvObj: hv,
        itemObj:item
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if(result !=true || result != 'undefined'){
        this.reelQty =result.reelQty
      }
    })
  }

  ReelTransactionsDialogue(hv,item,fieldNames?) {
    const dialogRef = this.dialog.open(ReelTransactionsComponent, {
      height: 'auto',
      width: '932px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        hvObj: hv,
        itemObj:item,
        reelQuantity:this.reelQty?this.reelQty:'',
        fieldName:fieldNames
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // console.log(result)
      if(result !=true ){
        // console.log(result)
        this.inputValue = result
        this.openSelectionTransactionDialogue();
      }
    
     
    })

  }

  clear(){
    this.batchId = ''
    this.dataSource = []
    this.autocompleteSearchColumnItem()
  }

  ///////






  }

