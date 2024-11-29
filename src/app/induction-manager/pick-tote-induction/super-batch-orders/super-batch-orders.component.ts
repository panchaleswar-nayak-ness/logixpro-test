import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
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
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { catchError, Observable, throwError } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatInput } from '@angular/material/input';
import { AuthService } from 'src/app/common/init/auth.service';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-super-batch-orders',
  templateUrl: './super-batch-orders.component.html',
  styleUrls: ['./super-batch-orders.component.scss'],
})
export class SuperBatchOrdersComponent implements OnInit, AfterViewInit {
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

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator') paginator: MatPaginator;
  @ViewChildren(MatInput) toteInputs!: QueryList<MatInput>;

  userData;
  @Input() zones: string[] = []; // Accept zones as input

  elementData = [
    {
      itemNumber: 'Zone 1',
      priority: 'Location 1',
      quality: '1',
      requiredDate: '02/02/2024',
      totalOrderQty: '5',
    },
    {
      itemNumber: 'Zone 2',
      priority: 'Location 1',
      quality: '2',
      requiredDate: '02/02/2024',
      totalOrderQty: '5',
    },
    {
      itemNumber: 'Zone 3',
      priority: 'Location 1',
      quality: '3',
      requiredDate: '02/02/2024',
      totalOrderQty: '5',
    },
  ];

  displayedColumns: string[] = [
    'itemNumber',    
    'priority',
    'quality',
    'requiredDate',
    'numberOfOrders',
    'totalOrderQty',
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
  orderNumberFilter: string = '';
  dataSource: MatTableDataSource<any>;
  toteScanned: any;
  filteredOrderResults = [];
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

    this.getTags();
  }

  ngAfterViewInit(): void {
    this.updatedPaginator();
    this.focusFirstInput();
  }

  focusFirstInput() {
    setTimeout(() => {
      const firstInput = this.toteInputs?.first;
      if (firstInput) {
        firstInput.focus();
      }
    });
  }

  rebind(data?: any[], isGrid: boolean = false) {
    let mappedData = data?.map((m) => {
      return {
        zone: m.zone,
        itemNumber: m.itemNumber ?? m.itemNumber,
        priority: m.minPriority ?? m.priority,
        quality: m.quality,
        requiredDate: m.minRequiredDate ?? m.requiredDate,
        totalOrderQty: m.totalQuantity ?? m.totalOrderQty,
        numberOfOrders: m.numberOfOrders
      };
    });

    this.dataSource = new MatTableDataSource(mappedData);
    this.updatedPaginator();
    this.updateSorting();

    if (isGrid === false) {
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

  getTags() {
    console.log(this.filters);
    this.tags = [];

    if (this.filters && this.filters.length > 0) {
      this.filters.forEach((f) => {
        let alias = f.alias?.toString();
        if (alias) this.tags.push({ alias: f.alias, value: f.Value });
      });
    }
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
            this.filters = [];
            this.someEvent.next('superbatchfilterclear');
          }
        }
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
        this.getTags();

        // send the currently selected column filters to parent component via observable
        this.global.sendMessage({
          columnFilters: this.filters,
          orderNumberFilters: this.orderNumberFilter,
        });
      }
    });
  }

  retrieveFilteredSuperBatchOrders(values: any) {
    this.Api.RetrieveSuperBatchOrders({
      ...values,
      wsId: this.userData.wsid,
    }).subscribe((filteredOrders) => {
      this.rebind(filteredOrders.data);
    });
  }

  onEnter(element: any, index: number) {
    const {
      itemNumber,
      priority,
      quality,
      requiredDate,
      totalOrderQty,
      toteScanned,
    } = element;

    var valueToInduct = {
      itemNumber,
      priority,
      quality,
      requiredDate,
      totalOrderQty,
      toteScanned,
      maxToteQuantity: 0,
      maxSuperBatchSize: 0,
      inductionType: 'SuperBatch',
      wsId: this.userData.wsid,
      filterResultsRequestParams: {
        ColumnFilters:  this.filters,
        Zones: this.zones
      },
      SelectedZones: this.zones, // Pass the selected zones
    };

    this.iInductionManagerApi.PreferenceIndex().subscribe((res: any) => {
      if (res.data && res.isExecuted) {
        const values = res.data.imPreference;

        // Pick Tote Induction Settings
        valueToInduct.maxToteQuantity = values.maximumQuantityperTote;
        valueToInduct.maxSuperBatchSize = values.defaultSuperBatchSize;

        // call API to induct this tote as per PLST-2772
        if (valueToInduct.toteScanned) {
          element.toteScanned = '';

          this.Api.PerformSuperBatchOrderInduction(valueToInduct)
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
                if (innerResponse.data.remainingQuantity > 0 &&innerResponse.data.notInductedOrders.length>1) {
                  // Update the UI with the remaining quantity

                  
                  const orderIndex = this.dataSource.filteredData.findIndex(
                    (item) =>
                      item.itemNumber === itemNumber &&
                      item.priority === valueToInduct.priority
                  );

                  if (orderIndex !== -1) {
                    // Update totalOrderQuantity with remainingQuantity
                    this.dataSource.filteredData[orderIndex].totalOrderQty =
                      innerResponse.data.remainingQuantity;
                      this.dataSource.filteredData[orderIndex].numberOfOrders= innerResponse.data.notInductedOrders.length;
                    
                    // Use setTimeout to focus on the toteScanned input box
                  }

                  // Retain focus on the current input element for further induction
                } else {
                  // If no remaining quantity, remove the order row
                  let updated = this.dataSource.filteredData.filter(
                    (f) =>
                      !(
                        f.itemNumber === valueToInduct.itemNumber &&
                        f.priority === valueToInduct.priority
                      )
                  );

                  this.rebind(updated, true);
                }

                // Success message if all item are successfully
                if (
                  innerResponse?.data?.inductedOrders?.length > 0 &&
                  innerResponse?.data?.notInductedOrders?.length === 0
                ) {
                  this.global.ShowToastr(
                    ToasterType.Success,
                    innerResponse.responseMessage,
                    ToasterTitle.Success
                  );
                }

                if (
                  innerResponse?.data?.notInductedOrders?.length > 0
                ) {
                  this.global.ShowToastr(
                    ToasterType.Info,
                    `Orders: ${innerResponse?.data?.notInductedOrders.join(', ')} skipped due to exceeding tote capacity, max batch size, or the max tote quantity`,
                    ToasterTitle.Alert
                  );
                }
              } else {
                this.global.ShowToastr(
                  ToasterType.Error,
                  innerResponse.responseMessage,
                  ToasterTitle.Error
                );
              }

              setTimeout(() => {
                this.moveFocusToNextElement(index);
              }, 0);
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

    // Ensure that index + 1 doesn't exceed the length of totes array
    if (totes[index + 1]) {
      setTimeout(() => {
        totes[index].focus();
      }, 0); // Allow DOM update
    } else if (totes[0]) {
      // If there's no next item, loop back to the first item
      setTimeout(() => {
        totes[0].focus();
      }, 0);
    }
  }
}
