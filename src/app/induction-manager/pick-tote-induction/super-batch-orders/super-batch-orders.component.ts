import {
  AfterViewInit,
  Component,
  OnInit,
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
import { MatPaginator } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatInput } from '@angular/material/input';
import { AuthService } from 'src/app/common/init/auth.service';

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
  displayedColumns: string[] = [
    'itemNumber',
    'priority',
    'quality',
    'requiredDate',
    'totalOrderQty',
    'toteScanned',
  ];

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

  public iInductionManagerApi: IInductionManagerApiService;
  filters: PickToteInductionFilter[] = [];
  orderNumberFilter: string = '';
  dataSource: MatTableDataSource<any>;
  toteScanned: any;

  ngOnInit(): void {}

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

  rebind(data?: any[]) {
    let mappedData = data?.map((m) => {
      return {
        itemNumber: m.itemNumber,
        priority: m.minPriority,
        quality: m.quality,
        requiredDate: m.minRequiredDate,
        totalOrderQty: m.totalQuantity,
      };
    });

    this.dataSource = new MatTableDataSource(mappedData);
    this.updatedPaginator();
    this.updateSorting();
    this.focusFirstInput();
  }

  updatedPaginator() {
    if (this.dataSource && this.dataSource.filteredData.length > 0)
      this.dataSource.paginator = this.paginator;
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

      if (result) {
        this.orderNumberFilter = result.orderNumberFilter
          // .split(',')
          .map((m: string) =>
            this.global.getTrimmedAndLineBreakRemovedString(m)
          );

        // send the currently selected order number filters to parent component via observable
        this.global.sendMessage({ orderNumberFilters: this.orderNumberFilter });
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

        // send the currently selected column filters to parent component via observable
        this.global.sendMessage({ columnFilters: this.filters });
      }
    });
  }

  retrieveFilteredSuperBatchOrders(values: any) {
    this.Api.RetrieveSuperBatchOrders({...values, wsId : this.userData.wsid}).subscribe((filteredOrders) => {
      this.rebind(filteredOrders.data);
    });
  }

  onEnter(element: any) {
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
    };

    let response: Observable<any> = this.iInductionManagerApi.PreferenceIndex();
    response.subscribe((res: any) => {
      if (res.data && res.isExecuted) {
        const values = res.data.imPreference;

        //Pick Tote Induction Settings
        valueToInduct.maxToteQuantity = values.maximumQuantityperTote;
        valueToInduct.maxSuperBatchSize = values.defaultSuperBatchSize;

        // call api to induct this tote as per PLST-2772
        if (valueToInduct.toteScanned) {
          this.Api.PerformSuperBatchOrderInduction(valueToInduct)
            .pipe(
              catchError((errResponse) => {
                // Check if the error is a 400 status
                if (errResponse.error.status === 400) {
                  this.global.ShowToastr(
                    ToasterType.Error,
                    errResponse.error.responseMessage,
                    ToasterTitle.Error
                  );
                } else {
                  // Handle other errors
                  this.global.ShowToastr(
                    ToasterType.Error,
                    errResponse.error.responseMessage,
                    ToasterTitle.Error
                  );
                }
                // Throw the error again if needed, or return an observable
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
              } else {
                this.global.ShowToastr(
                  ToasterType.Error,
                  innerResponse.responseMessage,
                  ToasterTitle.Error
                );
              }

              console.log(this.dataSource.filteredData);

              if (this.dataSource && this.dataSource.filteredData) {
                let updated = this.dataSource.filteredData.filter(
                  (f) => f.itemNumber !== valueToInduct.itemNumber
                );
                this.rebind(updated);
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
}
