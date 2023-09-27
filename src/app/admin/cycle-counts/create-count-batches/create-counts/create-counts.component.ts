import { LiveAnnouncer } from '@angular/cdk/a11y';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table'; 
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/init/auth.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import {
  FormGroup,
  FormControl,
  FormBuilder,
} from '@angular/forms';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component';
import { FloatLabelType } from '@angular/material/form-field';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { Router } from '@angular/router';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-ccb-create-counts',
  templateUrl: './create-counts.component.html',
  styleUrls: ['./create-counts.component.scss'],
})
export class CCBCreateCountsComponent implements OnInit {
  public userData: any;
  @ViewChild('matRefAction') matRefAction: MatSelect;

  selectedTabIndex: number = 0;
  orderNumber;
  countType: string = '';
  completeDate: Date;
  localCompleteDate: string;
  warehouse: string = '';
  subCategory: any;
  math = Math;
  printCC:boolean=false;
  @Input() updateTable: boolean;
  warehouses: any = [];
  customPagination: any = {
    total: '',
    recordsPerPage: 10,
    startIndex: 1,
    endIndex: 10,
  };
  filtersForm: FormGroup;
  searchByItem: any = new Subject<string>();
  searchAutocompleteItemNumber: any = [];
  searchAutocompleteFromLocation: any = [];
  searchAutocompleteToLocation: any = [];
  searchAutocompleteDescription: any = [];
  searchAutocompleteFromItem: any = [];
  searchAutocompleteToItem: any = [];
  isDataAvailable: boolean = false;
  searchAutocompletCategory: any = [];
  searchAutocompletBeginCost: any = [];
  searchAutocompletEndCost: any = [];

  dataSource: any = [];
  time = new Date();

  locRangeDiv: boolean = false;
  itemNumDiv: boolean = false;
  desDiv: boolean = false;
  catDiv: boolean = false;
  pageEvent: PageEvent;
  hideRequiredControl = new FormControl(false);
  notCouSinDiv: boolean = false;
  pickDateRanDiv: boolean = false;
  putDateRanDiv: boolean = false;
  costRanDiv: boolean = false;
  curCountOrders: any = [];
  searchField = new Subject<string>();
  descriptionTA = new Subject<string>();
  fromLocationTA = new Subject<string>();
  toLocationTA = new Subject<string>();
  fromItemTA = new Subject<string>();
  toItemTA = new Subject<string>();
  @Output() eventChange = new EventEmitter<Event>();

  categoryTA = new Subject<string>();
  beginCostTA = new Subject<string>();
  endCostTA = new Subject<string>();
  @Output() countsUpdated = new EventEmitter<string>();
  // variables for mat-sort and mat-paginator with viewChild
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  searchAutocompleteListDescription = [];
  selection: any = 'LocationRange';
  location:boolean = false;
  sdate: any = new Date();
  edate: any = new Date();
  notCountSince: any = new Date();

  displayedColumns: string[] = [
    'itemNumber',
    'description',
    'itemQuantity',
    'unitofMeasure',
    'warehouse',
    'location',
    'goldenZone',
    'cellSize',
    'serialNumber',
    'lotNumber',
    'expirationDate',
    'actions',
  ];
  dataSourceList: any;
  fromLocationCrossbtn
  toLocationCrossbtn
  constructor(
    public Api: ApiFuntions,
    public toastService: ToastrService,
    private authService: AuthService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private global:GlobalService
    
  ) {
    this.filtersForm = new FormGroup({
      countType: new FormControl(''),
      fromLocation: new FormControl(''),
      toLocation: new FormControl(''),
      includeEmpty: new FormControl(false),
      includeOther: new FormControl(false),
      fromItem: new FormControl(''),
      toItem: new FormControl(''),
      description: new FormControl(''),
      category: new FormControl(''),
      subCategory: new FormControl({ value: '', disabled: true }),
      notCounted: new FormControl(new Date()),
      pickedStart: new FormControl(new Date())    ,
      pickedStartTime: new FormControl(new Date()),
      pickedEnd: new FormControl(new Date()),
      putStart: new FormControl(new Date()),
      putEnd: new FormControl(new Date()),
      costStart: new FormControl(''),
      costEnd: new FormControl(''),
      warehouse: new FormControl(''),
    });

    this.completeDate = new Date();
    const offsetMs = this.completeDate.getTimezoneOffset() * 60 * 1000;
    const msLocal =  this.completeDate.getTime() - offsetMs;
    const dateLocal = new Date(msLocal);
    const iso = dateLocal.toISOString();
    const isoLocal = iso.slice(0, 19)+".932Z";

    //alert(isoLocal);
   // this.localCompleteDate = this.completeDate.toISOString();

    //var test = "2023-09-25T19:48:18.932Z" //  2023-09-25T19:39:19.932Z
    this.localCompleteDate=isoLocal.substring(0, isoLocal.length - 8);


    
    //this.localCompleteDate.substring(0, isoLocal.length - 1)
    //alert(isoLocal);


    //alert(this.localCompleteDate.substring(0, this.localCompleteDate.length - 1));

    //alert(this.localCompleteDate.toLocaleString());


    //this.localCompleteDate = this.localCompleteDate.substring(0, this.localCompleteDate.length - 1);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['updateTable']['currentValue']) {
      this.resetVal();
    }
  }
  nextStep() {
    this.countsUpdated.emit('next');
  }
  clearMatSelectList(){
    this.matRefAction.options.forEach((data: MatOption) => data.deselect());
  }
 countAction(event:any){
    this.clearMatSelectList();

  }
  updateQueCountEvent(obj) {
    this.eventChange.emit(obj);
  }
  onChangeDemo(e, type) {
    if (type === 'empty') {
      this.filtersForm.controls['includeEmpty'].setValue(e.checked);
    } else {
      this.filtersForm.controls['includeOther'].setValue(e.checked);
    }
    this.fillData();
  }
  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getWareAndCurOrd();

    this.searchField
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        
        if (value === '') return;
        this.fillData();
      });

    this.descriptionTA
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        
        if (value === '') return;

        this.getTypeAheads('Description');
        this.fillData();
      });

    this.fromLocationTA
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        
        this.getTypeAheads('FromLocation');
        this.fillData();
      });

    this.toLocationTA
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        
        this.getTypeAheads('ToLocation');
        this.fillData();
      });

    this.fromItemTA
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        
        if (value === '') return;

        this.getTypeAheads('FromItem');
        this.fillData();
      });

    this.toItemTA
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        
        if (value === '') return;

        this.getTypeAheads('ToItem');
        this.fillData();
      });

    this.categoryTA
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {

        if (value === '') return;
      this.filtersForm.controls['category'].setValue(value);

        this.getTypeAheads('Category');
        this.fillData();
      });

    this.beginCostTA
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        

        if (value === '') return;

        this.getTypeAheads('BeginCost');
        this.fillData();
      });

    this.endCostTA
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value) => {
        

        if (value === '') return;

        this.getTypeAheads('EndCost');
        this.fillData();
      });
  }
  searchData() {

  }
  onSelFunc(item, event: any) {
    if (event.isUserInput) {  
    this.subCategory = item.subCategory;
    this.fillData();
    }
  }
  printCountOrders(){
    if(this.printCC){
      this.global.Print(`FileName:PrintCycleCountReport|OrderNum:${this.orderNumber?this.orderNumber:''}`)

     }else{
      window.open(`/#/report-view?file=PrintCycleCountReport-lst-prv|OrderNum:${this.orderNumber?this.orderNumber:''}`, '_blank', 'width=' + screen.width + ',height=' + screen.height + ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0')


      }

  }
  resetVal() {
    this.filtersForm.controls['fromLocation'].setValue('');
    this.filtersForm.controls['toLocation'].setValue('');
    this.filtersForm.controls['description'].setValue('');
    this.filtersForm.controls['category'].setValue('');
    this.filtersForm.controls['subCategory'].setValue('');
    this.filtersForm.controls['fromItem'].setValue('');
    this.filtersForm.controls['toItem'].setValue('');
    this.filtersForm.controls['notCounted'].setValue(new Date());
    this.filtersForm.controls['pickedStart'].setValue(new Date());
    this.filtersForm.controls['pickedEnd'].setValue(new Date());
    this.filtersForm.controls['putStart'].setValue(new Date());
    this.filtersForm.controls['pickedStart'].setValue(new Date());
    this.filtersForm.controls['putEnd'].setValue(new Date());
    this.filtersForm.controls['costStart'].setValue('');
    this.filtersForm.controls['costEnd'].setValue('');
    this.filtersForm.controls['warehouse'].setValue('');


    this.fillData();
  }
  getTypeAheads(type) {
    if (type === 'Description') {
      let paylaod = {
        description: this.filtersForm.value.description,
        userName: this.userData.userName,
        wsid: this.userData.wsid,
      };
      this.Api
        .GetCCDescriptionTypeAhead(paylaod)
        .subscribe((res: any) => {
          this.searchAutocompleteDescription = res.data;
        });

      // this is the first time the component is rendered
      // get the data from the server
      // and display it
    } else if (type === 'Category') {
      let paylaod = {
        category: this.filtersForm.value.category,
        userName: this.userData.userName,
        wsid: this.userData.wsid,
      };
      this.Api
        .GetCCCategoryTypeAhead(paylaod)
        .subscribe((res: any) => {
          this.searchAutocompletCategory = res.data;
        });
    } else if (type === 'BeginCost' || type === 'EndCost') {
      let payload={};
      if(type === 'BeginCost'){
         payload = {
          beginCost: this.filtersForm.value.costStart
            ? this.filtersForm.value.costStart
            : '',
          endCost: '',
          userName: this.userData.userName,
          wsid: this.userData.wsId,
        };
      }else if(type === 'EndCost'){
         payload = {
          beginCost:'',
          endCost: this.filtersForm.value.costEnd
            ? this.filtersForm.value.costEnd
            : '',
          userName: this.userData.userName,
          wsid: this.userData.wsId,
        };
      }
   
      this.Api
        .GetCCCountToCostTypeAhead(payload)
        .subscribe((res: any) => {
          if (type === 'BeginCost') {
            this.searchAutocompletBeginCost = res.data;
          } else {
            this.searchAutocompletEndCost = res.data;
          }
        });
    } else if (type === 'FromLocation') {
      let payload = {
        Query: this.filtersForm.value.fromLocation,
        Unique: true,
        Username: this.userData.userName,
        WSID: this.userData.wsid,
      };
      this.Api
        .LocationBegin(payload)
        .subscribe((res: any) => {
          this.searchAutocompleteFromLocation = res.data;
        });
    } else if (type === 'ToLocation') {
      let payload = {
        Query: this.filtersForm.value.toLocation,
        BeginLocation: this.filtersForm.value.fromLocation,
        Unique: true,
        Username: this.userData.userName,
        WSID: this.userData.wsid,
      };
      this.Api
        .LocationEnd(payload)
        .subscribe((res: any) => {
          this.searchAutocompleteToLocation = res.data;
        });
    } else if (type === 'FromItem' || type === 'ToItem') {
      let payload = {
        itemNumber:
          type === 'FromItem'
            ? this.filtersForm.value.fromItem
            : this.filtersForm.value.toItem,
        beginItem: '---',
        isEqual: false,
        username: this.userData.userName,
        wsid: this.userData.wsid,
      };
      this.Api
        .SearchItem(payload)
        .subscribe((res: any) => {
          if (type === 'FromItem') {
            this.searchAutocompleteFromItem = res.data;
          } else {
            this.searchAutocompleteToItem = res.data;
          }
        });
    }
  }

  // function to get warehouses and current orders
  // This function gets the list of warehouses and the list of current count orders.
  getWareAndCurOrd() {
    // Try to run this code
    try {
      // Create a payload to send to the server
       
      // Run the service to get the list of warehouses and the list of current count orders.
      this.Api.GetCountBatches().subscribe(
        // If the request is successful, get the data
        (res: any) => {
          // If the data is returned, set the list of warehouses and the list of current count orders
          if (res.data && res.isExecuted) {
            this.warehouses = res.data.warehouses ? res.data.warehouses : [];
            this.curCountOrders = res.data.countOrders
              ? res.data.countOrders
              : [];

              if (this.curCountOrders.length > 0) {
                this.orderNumber = this.curCountOrders[0].orderNumber;
              }
          }
          // If the data is not returned, show an error message
          else {
            this.toastService.error('Something went wrong', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        },
        // If the request is not successful, show an error message
        (error) => {
          this.toastService.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      );
    } catch (error) {
      // If the code cannot be run, show an error message
      this.toastService.error('Something went wrong', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000,
      });
    }
  }

  // function returns an object with 18 values
  getPayload() {
    return {

      fromLocation: this.filtersForm.value.fromLocation
        ? this.filtersForm.value.fromLocation
        : '',
      toLocation: this.filtersForm.value.toLocation
        ? this.filtersForm.value.toLocation
        : '',
      includeEmpty: this.filtersForm.value.includeEmpty,
      includeOther: this.filtersForm.value.includeOther,
      countType: this.selection ? this.selection : 'Description',
      fromItem: this.filtersForm.value.fromItem
        ? this.filtersForm.value.fromItem
        : '',
      toItem: this.filtersForm.value.toItem
        ? this.filtersForm.value.toItem
        : '',
      description: this.filtersForm.value.description
        ? this.filtersForm.value.description
        : '',
      category: this.filtersForm.value.category
        ? this.filtersForm.value.category
        : '',
      subCategory: this.filtersForm.value.subCategory
        ? this.filtersForm.value.subCategory
        : '',
      notCounted:
        this.filtersForm.value.notCounted === ''
          ? new Date()
          : this.filtersForm.value.notCounted,
      pickedStart:
        this.filtersForm.value.pickedStart === ''
          ? new Date()
          : this.filtersForm.value.pickedStart,
      pickedEnd:
        this.filtersForm.value.pickedEnd === ''
          ? new Date()
          : this.filtersForm.value.pickedEnd,
      putStart:
        this.filtersForm.value.putStart === ''
          ? new Date()
          : this.filtersForm.value.putStart,
      putEnd:
        this.filtersForm.value.putEnd === ''
          ? new Date()
          : this.filtersForm.value.putEnd,
      costStart: this.filtersForm.value.costStart,
      costEnd: this.filtersForm.value.costEnd,
      warehouseFilter: this.warehouse,
    };
  }

  // function to fill data to the data table with mattabledata by calling API with payload using admin services with get method
  // and then assign the response to the dataSource variable with check type of response and if there is response.data and isExecuted is true else add error toast
  // handle with try catch
  fillData() { 
      const  queryData:any =  {
        fromLocation: this.filtersForm.value.fromLocation
          ? this.filtersForm.value.fromLocation
          : '',
        toLocation: this.filtersForm.value.toLocation
          ? this.filtersForm.value.toLocation
          : '',
        includeEmpty: this.filtersForm.value.includeEmpty,
        includeOther: this.filtersForm.value.includeOther,
        CountType: this.selection ? this.selection : 'Description',
        fromItem: this.filtersForm.value.fromItem
          ? this.filtersForm.value.fromItem
          : '',
        toItem: this.filtersForm.value.toItem
          ? this.filtersForm.value.toItem
          : '',
        description: this.filtersForm.value.description,
        category: this.filtersForm.value.category
          ? this.filtersForm.value.category
          : '',
        subCategory: this.subCategory ? this.subCategory : '',
        notCounted:
          this.filtersForm.value.notCounted === '' ||
          this.filtersForm.value.notCounted === null
            ? new Date()
            : this.filtersForm.value.notCounted,
        pickStart:
          this.filtersForm.value.pickedStart === '' ||
          this.filtersForm.value.pickedStart === null
            ? new Date()
            : this.filtersForm.value.pickedStart,
        pickEnd:
          this.filtersForm.value.pickedEnd === '' ||
          this.filtersForm.value.pickedEnd === null
            ? new Date() 
            : this.filtersForm.value.pickedEnd,
        putAwayStart:
          this.filtersForm.value.putStart === '' ||
          this.filtersForm.value.putStart === null
            ? new Date()
            : this.filtersForm.value.putStart,
        putAwayEnd:
          this.filtersForm.value.putEnd === '' ||
          this.filtersForm.value.putEnd === null
            ? new Date()
            : this.filtersForm.value.putEnd,
        costStart: this.filtersForm.value.costStart,
        costEnd: this.filtersForm.value.costEnd,
        warehouseFilter: this.warehouse,
      } ;  
    this.Api.BatchResultTable(queryData).subscribe(
      (res: any) => {
        if (res?.data && res.isExecuted) {
          this.dataSource = new MatTableDataSource(res.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          if (res.data.length > 0) {
            this.isDataAvailable = true;
          } else {
            this.isDataAvailable = false;
          }
        } else {
          this.toastService.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (err) => {
        this.toastService.error('Something went wrong', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
      }
    );
  }
  changeCountOrder(e) {
    this.orderNumber = e;
  }
  deleteCycleCount(ident: any) {
    if (this.orderNumber === '' || this.orderNumber == undefined) return;
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '600px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'delete-create-count',
        actionMessage: ` all ${
          ident === 1 ? 'Incomplete' : ''
        } count transactions for ${this.orderNumber}`,
        action: 'delete',
      },
    });
    dialogRef.afterClosed().subscribe((res) => {
      ;

      if (res == 'Yes') {
        const payLoad = {
          orderNumber: this.orderNumber,
          ident: ident,
          username: this.userData.userName,
          wsid: this.userData.wsid,
        };
        // Call the API
        this.Api.CountOrdersDelete(payLoad).subscribe(
          (res: any) => {
            // Check if the response is a success
            if (res.data && res.isExecuted) {
              // Display a success message
              this.toastService.success('Order Deleted', 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
              this.getWareAndCurOrd();

              this.orderNumber = '';
              // Get the orders again
            } else {
              // Display an error message
              this.toastService.error('Something went wrong', 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000,
              });
            }
          },
          // This function will be called if there is an error
          (error: any) => {
            // Display an error message
            this.toastService.error('Something went wrong', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000,
            });
          }
        );
      }
    });
  }
  insertCCQueue(ids: any) {
    const payLoad = {
      InvMapIDs: ids,
      username: this.userData.username,
      wsid: this.userData.wsid,
    };
    this.Api.CycleCountQueueInsert(payLoad).subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          this.dataSource = [];
          this.selectedTabIndex = 1;
          this.nextStep();
          this.updateQueCountEvent(res.data);
        } else {
          this.toastService.error('Something went wrong', 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
        }
      },
      (error) => {}
    );
  }

  insertQueue() {

          let invMapIDs = new Array();
          let finaliter = Math.floor(this.dataSource.data.length / 1000);
          let curriter = 0;

          if (finaliter == 0) {
            this.dataSource.data.forEach((element) => {
              

              invMapIDs.push(element.invMapID);
            });

            this.insertCCQueue(invMapIDs);
          } else {
            this.dataSource.data.forEach((element) => {
              invMapIDs.push(element.invMapID);

              if (invMapIDs.length == 1000) {
                const payLoad = {
                  InvMapIDs: invMapIDs,
                  username: this.userData.username,
                  wsid: this.userData.wsid,
                };
                this.Api
                  .CycleCountQueueInsert(payLoad)
                  .subscribe(
                    (res: any) => {
                      if (res.data && res.isExecuted) {
                        curriter++;
                        if (curriter == finaliter) {
                          if (invMapIDs.length > 0) {
                            this.insertCCQueue(invMapIDs);
                          } else {
                            this.dataSource = [];
                            this.selectedTabIndex = 1;
                          }
                        }
                      } else {
                        this.toastService.error(
                          'Something went wrong',
                          'Error!',
                          {
                            positionClass: 'toast-bottom-right',
                            timeOut: 2000,
                          }
                        );
                      }
                    },
                    (error) => {}
                  );
                invMapIDs = [];
              }
            });
          }

  }
  deleteRow(rowId) {

        this.dataSource.data = this.dataSource.data.filter((value, key) => {
          return value.invMapID != rowId;
        });

      }
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.customPagination.startIndex = e.pageSize * e.pageIndex;
    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;
    this.fillData();
  }
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  ngOnDestroy() {
    this.searchField.unsubscribe();
    this.descriptionTA.unsubscribe();
    this.fromLocationTA.unsubscribe();
    this.toLocationTA.unsubscribe();
    this.fromItemTA.unsubscribe();
    this.toItemTA.unsubscribe();
    this.categoryTA.unsubscribe();
    this.beginCostTA.unsubscribe();
    this.endCostTA.unsubscribe();
  }

  checkvalue(event){
    if(event != 'LocationRange'){ 
      this.location = true;
      
    }
    else{
      this.location = false;
    }

  }
}
