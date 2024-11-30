import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  DialogConstants,
  LiveAnnouncerMessage,
  Style,
  ToasterMessages,
  ToasterTitle,
  ToasterType,
} from 'src/app/common/constants/strings.constants';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { GlobalService } from 'src/app/common/services/global.service';
import { FilterOrderNumberComponent } from '../filter-order-number/filter-order-number.component';
import { PickToteInFilterComponent } from '../pick-tote-in-filter/pick-tote-in-filter.component';
import { PickToteInductionFilter } from '../../models/PickToteInductionModel';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatInput } from '@angular/material/input';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { catchError, Observable, throwError } from 'rxjs';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { AuthService } from 'src/app/common/init/auth.service';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-non-super-batch-orders',
  templateUrl: './non-super-batch-orders.component.html',
  styleUrls: ['./non-super-batch-orders.component.scss'],
})
export class NonSuperBatchOrdersComponent implements OnInit, AfterViewInit {
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private global: GlobalService,
    private Api: ApiFuntions,
    public inductionManagerApi: InductionManagerApiService,
    private authService: AuthService
  ) {
    this.iInductionManagerApi = inductionManagerApi;
    this.userData = this.authService.userData();
  }

  @ViewChild('table') table: MatTable<any>;
  @ViewChildren(MatInput) toteInputs!: QueryList<MatInput>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  @Input() set specificInductionSuccess(event: EventEmitter<void>) {
    event.subscribe(() => this.focusFirstInput());
  }
  @Input() transactionQtyRecieved: any;
  userData;
  elementData = [
    {
      status: true,
      orderNumber: 'Zone 1',
      zone: 'Location 1',
      priority: 'Location 1',
      requiredDate: '02/02/2024',
      totalOrderQty: '5',
    },
    {
      status: true,
      orderNumber: 'Zone 2',
      zone: 'Location 2',
      priority: 'Location 1',
      requiredDate: '02/02/2024',
      totalOrderQty: '5',
    },
    {
      status: true,
      orderNumber: 'Zone 3',
      zone: 'Location 3',
      priority: 'Location 1',
      requiredDate: '02/02/2024',
      totalOrderQty: '5',
    },
  ];

  displayedColumns: string[] = [
    'status',
    'orderNumber',
    'zone',
    'priority',
    'requiredDate',
    'completedQuantity',
    'toteScanned',
  ];

  customPagination: any = {
    total: '',
    recordsPerPage: 10,
    startIndex: 0,
    endIndex: 10,
  };

  public iInductionManagerApi: IInductionManagerApiService;
  filters: PickToteInductionFilter[] = [];
  orderNumberFilters: string[] = [];
  orderNumberFilter: string = '';
  orderRange: { lowerBound: string; upperBound: string } = { lowerBound: '', upperBound: '' };

  dataSource: MatTableDataSource<any>;
  toteScanned: any;
  filteredOrderResults = [];
  @Input() zones: string[] = []; // Accept zones as input
  @Output() someEvent = new EventEmitter<string>();
  tags: {
    alias? : string,
    value? : string
  }[] = [];

  ngOnInit(): void {
    this.customPagination = {
      total: '',
      recordsPerPage: 10,
      startIndex: 0,
      endIndex: 10,
    };

   
  }

  ngAfterViewInit(): void {
    this.updatedPaginator();
    this.focusFirstInput();
  }

  rebind(data?: any[], isGrid: boolean = false) {
    this.dataSource = new MatTableDataSource(data);
    this.updatedPaginator();
    this.updateSorting();
    if (this.transactionQtyRecieved == 0 && isGrid === false) {
      this.focusFirstInput();
    }
  }

  handlePageEvent(e: PageEvent) {
    this.customPagination.startIndex = e.pageSize * e.pageIndex;
    this.customPagination.endIndex = e.pageSize * e.pageIndex + e.pageSize;
    this.customPagination.recordsPerPage = e.pageSize;
    this.rebind(this.filteredOrderResults);
  }

  updatedPaginator() {
    if (this.dataSource) this.dataSource.paginator = this.paginator;
  }

  updateSorting() {
    if (this.dataSource && this.dataSource.filteredData.length > 0)
      this.dataSource.sort = this.sort;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction)
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    else this._liveAnnouncer.announce(LiveAnnouncerMessage.SortingCleared);
    this.updateSorting();
  }


  clearFilters() {
    const dialogRef: any = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        message: 'Do you want to clear all filters?',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // check for confirmation then clear all filters on the screen
      if (result) {
        if (typeof result === 'boolean') {
        } else {
          let confirm = result.toLowerCase();
          if (confirm) {
            this.tags = [];
            this.orderNumberFilter = '';
            this.orderNumberFilters = [];
            this.filters = [];
            this.someEvent.next('nonsuperbatchfilterclear');
          }
        }
      }
    });
  }

  filterOrderNum() {
    const dialogRef: any = this.global.OpenDialog(FilterOrderNumberComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      data: {
        OrderNumberFilter: this.orderNumberFilter,
      },
      disableClose: true,
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (!result) return;
     
      if (result.orderNumberFilter) {
        this.applyOrderNumberFilter(result.orderNumberFilter);
      } else if (result.orderRange) {
        this.applyOrderRangeFilter(result.orderRange);
      } else {
        this.clearAllFilters();
      }
    });
  }
  
  openColumnFilter() {
    const dialogRef: any = this.global.OpenDialog(PickToteInFilterComponent, {
      height: 'auto',
      width: Style.w786px,
      autoFocus: DialogConstants.autoFocus,
      data: {
        ColumnFilter: this.filters,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result: PickToteInductionFilter[]) => {
      if (result) {
        this.filters = result;
        this.filters.forEach((filter) => {
          const alias = filter.alias?.toString();
          if (alias) this.updateTag(alias,'');
        });

        // send the currently selected column filters to parent component via observable
        this.global.sendMessage({
          columnFilters: this.filters,
          orderNumberFilters: this.orderNumberFilters,
        });
      }
    });
  }

  retrieveFilteredNonSuperBatchOrders(values: any) {
    this.Api.RetrieveNonSuperBatchOrders({
      ...values,
      wsId: this.userData.wsid,
    }).subscribe((filteredOrders) => {
      let response = filteredOrders.data.result;
      this.filteredOrderResults = response;

      if (response) {
        this.rebind(response);
      }
    });
  }

  focusFirstInput() {
    setTimeout(() => {
      const firstInput = this.toteInputs?.first;
      if (firstInput) {
        firstInput.focus();
      }
    });
  }

  onEnter(element: any, index: number) {
    const {
      completedQuantity,
      orderNumber,
      zone,
      priority,
      toteScanned,
      requiredDate,
      transactionQuantity,
    } = element;

    var valueToInduct = {
      orderNumber,
      zone,
      priority,
      requiredDate,
      completedQuantity,
      toteScanned,
      maxToteQuantity: 0,
      transactionQuantity,
      inductionType: 'NonSuperBatch',
      filterResultsRequestParams: {
        ColumnFilters:  this.filters,
        OrderNumberFilters: this.orderNumberFilters,
        Zones: this.zones,
      },
    };

    this.iInductionManagerApi.PreferenceIndex().subscribe((res: any) => {
      if (res.data && res.isExecuted) {
        const values = res.data.imPreference;

        valueToInduct.maxToteQuantity = values.maximumQuantityperTote;
        console.log(valueToInduct);

        if (valueToInduct.toteScanned) {
          this.Api.PerformNonSuperBatchOrderInduction(valueToInduct)
            .pipe(
              catchError((errResponse) => {
                if (errResponse.error.status === 400) {
                  this.global.ShowToastr(
                    ToasterType.Error,
                    errResponse.error.responseMessage,
                    ToasterTitle.Error
                  );
                } else {
                  this.global.ShowToastr(
                    ToasterType.Error,
                    errResponse.error.responseMessage,
                    ToasterTitle.Error
                  );
                }
                return throwError(errResponse);
              })
            )
            .subscribe((innerResponse: any) => {
              if (innerResponse.data && innerResponse.isExecuted) {
                this.global.ShowToastr(
                  ToasterType.Success,
                  innerResponse.responseMessage,
                  ToasterTitle.Success
                );
                // Check for remaining quantity
                if (innerResponse.data.remainingQuantity > 0) {
                  // Update the UI with the remaining quantity
                  const orderIndex = this.dataSource.filteredData.findIndex(
                    (item) => item.orderNumber === orderNumber
                  );

                  if (orderIndex !== -1) {
                    // Update totalOrderQuantity with remainingQuantity
                    this.dataSource.filteredData[
                      orderIndex
                    ].transactionQuantity =
                      innerResponse.data.remainingQuantity;
                      this.dataSource.filteredData[
                        orderIndex
                      ].zone =
                        innerResponse.data.zone;
                    element.toteScanned = '';
                    // Use setTimeout to focus on the toteScanned input box
                  }

                  // Retain focus on the current input element for further induction
                } else {
                  // If no remaining quantity, remove the order row
                  let updated = this.dataSource.filteredData.filter(
                    (f) => f.orderNumber !== valueToInduct.orderNumber
                  );

                  this.rebind(updated, true);
                  this.moveFocusToNextElement(index);
                }
              } else {
                this.global.ShowToastr(
                  ToasterType.Error,
                  innerResponse.responseMessage,
                  ToasterTitle.Error
                );
              }
            });
        }
      } else {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.SomethingWentWrong,
          ToasterTitle.Error
        );
      }
    });
  }

  private moveFocusToNextElement(index: number) {
    let totes = this.toteInputs.toArray();
    let totalSize = totes.length;
    let middleIndex = Math.floor(totalSize / 2);

    if (totes[index + 1]) {
      totes[index + 1].focus();
    } else if (index <= middleIndex) {
      this.focusFirstInput();
    }
  }
  private applyOrderNumberFilter(orderNumberFilter: string[]) {
    this.orderNumberFilters = orderNumberFilter.map((m: string) =>
      this.global.getTrimmedAndLineBreakRemovedString(m)
    );
  
    // Clear range-related data
    this.orderRange = { lowerBound: '', upperBound: '' };
  
    // Update tags: Remove range tag and add/ensure order number tag
    this.tags = this.tags.filter(tag => tag.alias !== 'Filter Order Number (Range)');
    this.updateTag('Filter Order Number', '');
  
    this.global.sendMessage({
      columnFilters: this.filters,
      orderNumberFilters: this.orderNumberFilters,
      orderRange: { lowerBound: '', upperBound: '' },
    });
  }
  
  private applyOrderRangeFilter(orderRange: { lowerBound: string; upperBound: string }) {
    this.orderRange = orderRange;
  
    // Clear order number-related data
    this.orderNumberFilters = [];
  
    // Update tags: Remove order number tag and add/ensure range tag
    this.tags = this.tags.filter(tag => tag.alias !== 'Filter Order Number');
    this.updateTag('Filter Order Number (Range)', `From ${orderRange.lowerBound} to ${orderRange.upperBound}`);
  
    this.global.sendMessage({
      columnFilters: this.filters,
      orderNumberFilters: [],
      orderRange: this.orderRange,
    });
  }
  private clearAllFilters() {
   
    this.orderNumberFilters = [];
    this.orderRange = { lowerBound: '', upperBound: '' };
  
    // Remove all related tags
    this.tags = this.tags.filter(
      tag => tag.alias !== 'Filter Order Number' && tag.alias !== 'Filter Order Number (Range)'
    );
  
    this.global.sendMessage({
      columnFilters: this.filters,
      orderNumberFilters: [],
      orderRange: { lowerBound: '', upperBound: '' },
    });
  }

  private updateTag(alias: string, value: string) {
    const existingTagIndex = this.tags.findIndex(tag => tag.alias === alias);
  
    if (existingTagIndex !== -1) {
      // Update existing tag
      this.tags[existingTagIndex].value = value;
    } else {
      // Add new tag
      this.tags.push({ alias, value });
    }
  }
  checkOrderStatus(isReprocess: any): string {
    if (isReprocess === false) {
      return 'Open';
    } else {
      return 'Re-process';
    }
  }

  getColors(isReprocess: any): string {
    if (isReprocess === false) {
      return 'background-color: #FFF0D6;color:#4D3B1A';
    } else {
      return 'background-color:   #F7D0DA;color:#4D0D1D';
    }
  }
}
