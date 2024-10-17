import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  DialogConstants,
  ToasterMessages,
  ToasterTitle,
  ToasterType,
} from 'src/app/common/constants/strings.constants';
import { GlobalService } from 'src/app/common/services/global.service';
import { SelectZonesComponent } from 'src/app/dialogs/select-zones/select-zones.component';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NonSuperBatchOrdersComponent } from './non-super-batch-orders/non-super-batch-orders.component';
import { SuperBatchOrdersComponent } from './super-batch-orders/super-batch-orders.component';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { PickToteInFilterComponent } from './pick-tote-in-filter/pick-tote-in-filter.component';
import { FilterOrderNumberComponent } from './filter-order-number/filter-order-number.component';
import { Observable, Subscription } from 'rxjs';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';

interface IZoneGroup {
  Id: number;
  ZoneGroup: string;
  Zone: string;
}

enum TabNames {
  NonSuperBatch = 0,
  SuperBatch = 1,
}

@Component({
  selector: 'app-pick-tote-induction',
  templateUrl: './pick-tote-induction.component.html',
  styleUrls: ['./pick-tote-induction.component.scss'],
})
export class PickToteInductionComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  constructor(
    private global: GlobalService,
    private Api: ApiFuntions,
    public inductionManagerApi: InductionManagerApiService
  ) {
    this.iInductionManagerApi = inductionManagerApi;
  }

  public iInductionManagerApi: IInductionManagerApiService;
  zoneGroupingsList: IZoneGroup[] = [];
  zoneAllGroupingsList: IZoneGroup[] = [];
  selectedZoneGrouping: IZoneGroup | undefined;
  zoneList: string[];
  selectedZones: string = '';
  activeTab: TabNames;
  @ViewChild('zoneGroupSelect') zoneGroupSelect;
  @ViewChild('tabGroup') tabGroup;
  @ViewChild('orderNumberInput') orderNumberInput: ElementRef;
  @ViewChild(NonSuperBatchOrdersComponent, { static: true })
  NonSuperBatchOrdersComponent: NonSuperBatchOrdersComponent;
  @ViewChild(SuperBatchOrdersComponent, { static: true })
  SuperBatchOrdersComponent: SuperBatchOrdersComponent;
  @ViewChild(PickToteInFilterComponent, { static: true })
  PickToteInductionFilter: PickToteInFilterComponent;
  @ViewChild(FilterOrderNumberComponent, { static: true })
  FilterOrderNumberComponent: FilterOrderNumberComponent;
  orderNumber: string = '';
  toteId: string = '';
  splitToggle: boolean = false;

  // this is the global filteration object used to refresh and select various filters on the tote induction screen
  // this will be passed to the respective api for loading data in tables based on induction type currently selected
  selectedFilters: any = {
    Zones: [],
    SpecificFilters: {
      orderNumber: '',
      toteId: '',
      splitToggle: false,
    },
    OrderNumberFilters: [],
    ColumnFilters: [],
  };
  subscription: Subscription;

  ngOnInit(): void {
    this.getZoneGroups();

    if (!this.activeTab) this.activeTab = 0;
    this.refreshOrders();

    this.subscription = this.global.currentMessage.subscribe((message) => {
      console.log(message);

      if (message) {
        if (
          message.orderNumberFilters &&
          message.orderNumberFilters.length > 0
        ) {
          const uniqueOrderNumberFilters = [
            ...new Set(message.orderNumberFilters),
          ];
          this.selectedFilters.OrderNumberFilters = uniqueOrderNumberFilters;
        }

        if (message.columnFilters && message.columnFilters.length > 0) {
          this.selectedFilters.ColumnFilters = message.columnFilters;
        }

        this.retrieveOrders();
      }
    });
  }

  ngAfterViewInit(): void {
    console.log('afterViewInit => ', this.tabGroup.selectedIndex);
    this.setNonSuperBatchAsDefaultTab();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  clearToteAndOrderFields() {
    // Clear toteId and orderNumber fields
    this.toteId = '';
    this.orderNumber = '';

    // Focus on the order number input field
    // this.orderNumberInput.nativeElement.focus();
  }

  showChange(selectedValue: any) {
    this.selectedZoneGrouping = this.zoneGroupingsList.find(
      (x) => x.Id === selectedValue
    );
    let selectedZones: IZoneGroup[] = [];

    if (this.selectedZoneGrouping) {
      selectedZones = this.zoneAllGroupingsList.filter(
        (x) => x.ZoneGroup === this.selectedZoneGrouping?.ZoneGroup
      );
    }

    this.zoneList = selectedZones.map((zone) => zone.Zone);
    this.selectedZones = this.zoneList.join(' ');

    // Reload the orders based on induction type and selected filters
    this.selectedFilters.Zones = this.zoneList;

    this.retrieveOrders();
  }

  async getZoneGroups() {
    try {
      this.Api.GetZoneGroupings().subscribe((res: any) => {
        if (res.data && res.isExecuted) {
          res.data.forEach((f) => {
            const existingItem = this.zoneGroupingsList.find(
              (item) => item.ZoneGroup === f.zoneGroupName
            );

            if (!existingItem) {
              this.zoneGroupingsList.push({
                Id: f.id,
                ZoneGroup: f.zoneGroupName,
                Zone: f.zoneName,
              });
            }

            this.zoneAllGroupingsList.push({
              Id: f.id,
              ZoneGroup: f.zoneGroupName,
              Zone: f.zoneName,
            });

            this.zoneList = [];
          });
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.SomethingWentWrong,
            ToasterTitle.Error
          );
        }
      });
    } catch (error) {}
  }

  openSelectZones() {
    const dialogRef: any = this.global.OpenDialog(SelectZonesComponent, {
      height: 'auto',
      width: '60%',
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        zoneList: this.zoneList,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const selectedZoneValues = result.selectedRecords.map(
          (item) => item.zone
        );

        this.zoneList = selectedZoneValues;
        this.selectedZones = this.zoneList.join(' ');

        // Reload the orders based on induction type and selected filters
        this.selectedFilters.Zones = selectedZoneValues;

        this.retrieveOrders();
      }
    });
  }

  private setNonSuperBatchAsDefaultTab() {
    if (!this.activeTab) {
      this.tabGroup.selectedIndex = 0;
      this.activeTab = this.tabGroup.selectedIndex;
    }
  }

  private retrieveOrders() {
    // Get the list of selected zone values
    // Call the function to filter orders
    if (this.activeTab === TabNames.NonSuperBatch) {
      if (this.NonSuperBatchOrdersComponent) {
        this.NonSuperBatchOrdersComponent.retrieveFilteredNonSuperBatchOrders(
          this.selectedFilters
        );
      }
    } else if (this.activeTab === TabNames.SuperBatch) {
      if (this.SuperBatchOrdersComponent) {
        this.SuperBatchOrdersComponent.retrieveFilteredSuperBatchOrders(
          this.selectedFilters
        );
      }
    }
  }

  refreshOrders() {
    // refresh orders in table based on currently selcted filters this includes all filters currently selected
    // Reload the orders based on induction type and selected filters
    this.selectedFilters.Zones = this.zoneList;
    console.log(this.selectedFilters);

    this.retrieveOrders();
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
        let confirm = result.toLowerCase();

        if (confirm === 'yes') {
          this.zoneList = [];
          this.selectedZones = '';
          this.zoneGroupSelect.value = '';

          if (this.PickToteInductionFilter) {
            this.PickToteInductionFilter.filters = [];
            this.selectedFilters.ColumnFilters = [];
          }

          if (this.FilterOrderNumberComponent) {
            this.FilterOrderNumberComponent.orderNumberFilter = [];
            this.selectedFilters.OrderNumberFilters = [];
          }

          this.retrieveOrders();
        }
      }
    });
  }

  onTabClick(tabChangeEvent: MatTabChangeEvent) {
    console.log('tabChangeEvent => ', tabChangeEvent);
    console.log('index => ', tabChangeEvent.index);

    if (tabChangeEvent.index === 0) {
      this.activeTab = TabNames.NonSuperBatch;
    } else if (tabChangeEvent.index === 1) {
      this.activeTab = TabNames.SuperBatch;
    }

    // Reload the orders based on induction type and selected filters
    this.selectedFilters.Zones = this.zoneList;

    this.retrieveOrders();
  }


  
  onEnter() {
    console.log(this.orderNumber, this.toteId, this.splitToggle);
    if (this.orderNumber && this.toteId) {
      let valueToInduct: any = {
        orderNumber: this.orderNumber,
        toteId: this.toteId,
        splitToggle: this.splitToggle
      };
  
      if (this.splitToggle) {
        // Fetch the max tote quantity and proceed with induction
        this.getMaxToteQuantity().subscribe(
          (maxToteQuantity: number) => {
            valueToInduct.maxToteQuantity = maxToteQuantity;
            this.performInduction(valueToInduct);
          },
          (error: any) => {
            this.global.ShowToastr(
              ToasterType.Error,
              ToasterMessages.SomethingWentWrong,
              ToasterTitle.Error
            );
          }
        );
      } else {
        // Perform induction without maxToteQuantity
        this.performInduction(valueToInduct);
      }
    }
  }
  
  getMaxToteQuantity(): Observable<number> {
    return new Observable<number>((observer) => {
      this.iInductionManagerApi.PreferenceIndex().subscribe(
        (res: any) => {
          if (res.data && res.isExecuted) {
            const values = res.data.imPreference;
            observer.next(values.maximumQuantityperTote);
          } else {
            observer.error('Error fetching max tote quantity');
          }
        },
        (err) => observer.error(err)
      );
    });
  }
  
  performInduction(valueToInduct: any) {
    this.Api.PerformSpecificOrderInduction(valueToInduct).subscribe(
      (res: any) => {
        if (res.data) {
          this.refreshOrders()
          this.clearToteAndOrderFields();
          // Success handling
        } else {
          this.global.ShowToastr(
            ToasterType.Error,
            ToasterMessages.SomethingWentWrong,
            ToasterTitle.Error
          );
        }
      },
      (error: any) => {
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.SomethingWentWrong,
          ToasterTitle.Error
        );
      }
    );
  }
}
