import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module'; 
import { AdminComponent } from './admin.component';
import { MaterialModule } from '../material-module';
import { GeneralModule } from '../gen-module';
import { CdkTableModule} from '@angular/cdk/table';

import { EmployeesComponent } from './employees/employees.component';
import { EmployeesLookupComponent } from './employees/employees-lookup/employees-lookup.component';
import { EmployeePickupLevelComponent } from './employees/employee-pickup-level/employee-pickup-level.component';
import { GroupsAllowedComponent } from './employees/groups-allowed/groups-allowed.component';
import { GroupsLookupComponent } from './employees/groups-lookup/groups-lookup.component';
import { AssignedFunctionsComponent } from './employees/assigned-functions/assigned-functions.component';
import { UnassignedFunctionsComponent, filterUnassignedFunc } from './employees/unassigned-functions/unassigned-functions.component';
import { StatisticsLookupComponent } from './employees/statistics-lookup/statistics-lookup.component';

import { AddNewEmployeeComponent } from './dialogs/add-new-employee/add-new-employee.component';
import { AddZoneComponent } from './dialogs/add-zone/add-zone.component';
import { DeleteConfirmationComponent } from './dialogs/delete-confirmation/delete-confirmation.component';
import { AddLocationComponent } from './dialogs/add-location/add-location.component';
import { AddPickuplevelsComponent } from './dialogs/add-pickuplevels/add-pickuplevels.component';
import { AddGroupAllowedComponent } from './dialogs/add-group-allowed/add-group-allowed.component';
import { AddNewGroupComponent } from './dialogs/add-new-group/add-new-group.component';
import { FunctionAllocationComponent } from './dialogs/function-allocation/function-allocation.component';
import { InventoryMapComponent } from './inventory-map/inventory-map.component';
import { AddInvMapLocationComponent } from './dialogs/add-inv-map-location/add-inv-map-location.component';
import { WarehouseComponent } from './dialogs/warehouse/warehouse.component';
import { SetColumnSeqComponent } from './dialogs/set-column-seq/set-column-seq.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CellSizeComponent } from './dialogs/cell-size/cell-size.component';
import { VelocityCodeComponent } from './dialogs/velocity-code/velocity-code.component';
import { InventoryMasterComponent } from './inventory-master/inventory-master.component';
import { ItemNumberComponent } from './dialogs/item-number/item-number.component';
import { ItemCategoryComponent } from './dialogs/item-category/item-category.component';
import { PrintRangeComponent } from './dialogs/print-range/print-range.component';
import { UnitMeasureComponent } from './dialogs/unit-measure/unit-measure.component';
import { ItemSetupComponent } from './inventory-master/item-setup/item-setup.component';
import { QuarantineConfirmationComponent } from './dialogs/quarantine-confirmation/quarantine-confirmation.component';
import { AdjustQuantityComponent } from './dialogs/adjust-quantity/adjust-quantity.component';
import { BatchManagerComponent } from './batch-manager/batch-manager.component';
import { BatchDeleteComponent } from './batch-manager/batch-delete/batch-delete.component';
import { BatchOrderListComponent } from './batch-manager/batch-order-list/batch-order-list.component';
import { BatchSelectedOrdersComponent } from './batch-manager/batch-selected-orders/batch-selected-orders.component';
import { CycleCountsComponent } from './cycle-counts/cycle-counts.component';
import { CCDiscrepanciesComponent } from './cycle-counts/ccdiscrepancies/ccdiscrepancies.component';
import { CCCountQueueComponent } from './cycle-counts/cccount-queue/cccount-queue.component';
import { CreateCountsComponent } from './cycle-counts/create-transaction/create-counts/create-counts.component';
import { CreateTransactionComponent } from './cycle-counts/create-transaction/create-transaction.component';
import { CountQueueComponent } from './cycle-counts/create-transaction/count-queue/count-queue.component';
import { ImportFieldMappingComponent } from './cycle-counts/import-field-mapping/import-field-mapping.component';
import { ReelTrackingComponent } from './inventory-master/reel-tracking/reel-tracking.component';
import { ScanCodesComponent } from './inventory-master/scan-codes/scan-codes.component';
import { LocationAssignmentComponent } from './location-assignment/location-assignment.component';
import { CountComponent } from './location-assignment/count/count.component';
import { PickComponent } from './location-assignment/pick/pick.component';
import { PutAwayComponent } from './location-assignment/put-away/put-away.component';
import { DetailComponent } from './inventory-master/detail/detail.component';
import { KitItemComponent } from './inventory-master/kit-item/kit-item.component';
import { LocationComponent } from './inventory-master/location/location.component';
import { WeightScaleComponent } from './inventory-master/weight-scale/weight-scale.component';
import { OthersComponent } from './inventory-master/others/others.component';
import { GroupAllowedComponent } from './dialogs/group-allowed/group-allowed.component';
import { SearchPipe } from './employees/search.pipe';
import { customFuncAllowedSearch } from './employees/customFuncAllowedSearch.pipe';
import { CloneGroupComponent } from './dialogs/clone-group/clone-group.component';
import { ToastrModule } from 'ngx-toastr';
import { UpdateDescriptionComponent } from './dialogs/update-description/update-description.component';
import { CreateBatchConfirmationComponent } from './dialogs/create-batch-confirmation/create-batch-confirmation.component';
import { CreateBatchComponent } from './dialogs/create-batch/create-batch.component';
import { TransactionComponent } from './transaction/transaction.component';
import { OpenTransactionComponent } from './transaction/open-transaction/open-transaction.component';
import { OpenTransactionFiltersComponent } from './transaction/open-transaction/open-transaction-filters/open-transaction-filters.component';
import { OpenTransactionDataTableComponent } from './transaction/open-transaction/open-transaction-data-table/open-transaction-data-table.component';
import { TransactionHistoryComponent } from './transaction/transaction-history/transaction-history.component';
import { TransactionHistoryFiltersComponent } from './transaction/transaction-history/transaction-history-filters/transaction-history-filters.component';
import { TransactionHistoryListComponent } from './transaction/transaction-history/transaction-history-list/transaction-history-list.component';
import { OrderStatusComponent } from './transaction/order-status/order-status.component';
import { TranSelectOrderComponent } from './transaction/order-status/tran-select-order/tran-select-order.component';
import { TranCarouselLzoneComponent } from './transaction/order-status/tran-carousel-lzone/tran-carousel-lzone.component';
import { TranOffCarouselLzoneComponent } from './transaction/order-status/tran-off-carousel-lzone/tran-off-carousel-lzone.component';
import { TranOrderListComponent } from './transaction/order-status/tran-order-list/tran-order-list.component';
import { OpenTransactionOnHoldComponent } from './transaction/open-transaction/open-transaction-on-hold/open-transaction-on-hold.component';
import { MatInputModule } from '@angular/material/input';
import { DeleteConfirmationTransactionComponent } from './dialogs/delete-confirmation-transaction/delete-confirmation-transaction.component';
import { ReprocessedTransactionComponent } from './transaction/reprocessed-transaction/reprocessed-transaction.component';
import { ReprocessTransactionComponent } from './transaction/reprocess-transaction/reprocess-transaction.component';
import { TranInReprocessComponent } from './transaction/reprocess-transaction/tran-in-reprocess/tran-in-reprocess.component';
import { ReprocessChoiceComponent } from './transaction/reprocess-transaction/reprocess-choice/reprocess-choice.component';
import { ItemNumUpdateConfirmationComponent } from './dialogs/item-num-update-confirmation/item-num-update-confirmation.component';
import { ScanTypeCodeComponent } from './dialogs/scan-type-code/scan-type-code.component';
import { ColumnSequenceDialogComponent } from './dialogs/column-sequence-dialog/column-sequence-dialog.component';
import { SearchFilterPipe } from './transaction/pipes/search-filter.pipe';
import { GlobalConfigSetSqlComponent } from './dialogs/global-config-set-sql/global-config-set-sql.component';
import { SendTranHistoryComponent } from './dialogs/send-tran-history/send-tran-history.component';
import { ReprocessTransactionDetailComponent } from './dialogs/reprocess-transaction-detail/reprocess-transaction-detail.component';
import { HoldReasonComponent } from './dialogs/hold-reason/hold-reason.component';
import { ClearAppGlobalconfigComponent } from './dialogs/clear-app-globalconfig/clear-app-globalconfig.component';
import { LicensingInvalidComponent } from './dialogs/licensing-invalid/licensing-invalid.component';
import { SqlAuthConfirmationComponent } from './dialogs/sql-auth-confirmation/sql-auth-confirmation.component';
import { ManualTransactionsComponent } from './manual-transactions/manual-transactions.component';
import { GenerateOrderComponent } from './manual-transactions/generate-order/generate-order.component';
import { AddNewTransactionToOrderComponent } from './dialogs/add-new-transaction-to-order/add-new-transaction-to-order.component';
import { DeleteConfirmationManualTransactionComponent } from './dialogs/delete-confirmation-manual-transaction/delete-confirmation-manual-transaction.component';
import { ManualTransPostConfirmComponent } from './dialogs/manual-trans-post-confirm/manual-trans-post-confirm.component';
import { GenerateTransactionComponent } from './manual-transactions/generate-transaction/generate-transaction.component';
import { SetItemLocationComponent } from './dialogs/set-item-location/set-item-location.component';
import { SupplierItemIdComponent } from './dialogs/supplier-item-id/supplier-item-id.component';
import { TemporaryManualOrderNumberAddComponent } from './dialogs/temporary-manual-order-number-add/temporary-manual-order-number-add.component';

import { ItemExistGenerateOrderComponent } from './dialogs/item-exist-generate-order/item-exist-generate-order.component';
import { EmptyFieldsComponent } from './dialogs/empty-fields/empty-fields.component';
import { UserFieldsEditComponent } from './dialogs/user-fields-edit/user-fields-edit.component';
import { PostManualTransactionComponent } from './dialogs/post-manual-transaction/post-manual-transaction.component';
import { InvalidQuantityComponent } from './dialogs/invalid-quantity/invalid-quantity.component';
import { FilterToteComponent } from './dialogs/filter-tote/filter-tote.component';
import { CCBCreateCountsComponent } from './cycle-counts/create-count-batches/create-counts/create-counts.component';
import { CCBCountQueueComponent } from './cycle-counts/create-count-batches/count-queue/count-queue.component';
import { CreateCountBatchesComponent } from './cycle-counts/create-count-batches/create-count-batches.component';
import { BatchManagerDetailViewComponent } from './dialogs/batch-manager-detail-view/batch-manager-detail-view.component';
import { InputSpacesPreventDirective } from '../init/input-spaces-prevent.directive';
import { BmToteidEntryComponent } from './dialogs/bm-toteid-entry/bm-toteid-entry.component';
import { SystemReplenishmentComponent } from './system-replenishment/system-replenishment.component';
import { SrNewOrderComponent } from './system-replenishment/sr-new-order/sr-new-order.component';
import { FilterItemNumbersComponent } from './dialogs/filter-item-numbers/filter-item-numbers.component';
import { SrCurrentOrderComponent } from './system-replenishment/sr-current-order/sr-current-order.component';
import { SortPipe } from '../init/sort.pipe';
import { LaLocationAssignmentQuantitiesComponent } from './dialogs/la-location-assignment-quantities/la-location-assignment-quantities.component';
import { MoveItemsComponent } from './move-items/move-items.component';
import { AdminPreferencesComponent } from './admin-preferences/admin-preferences.component';
import { WorkstationPreferencesComponent } from './admin-preferences/workstation-preferences/workstation-preferences.component';
import { SystemPreferencesComponent } from './admin-preferences/system-preferences/system-preferences.component';
import { SpGeneralSetupComponent } from './admin-preferences/system-preferences/sp-general-setup/sp-general-setup.component';
import { SpLocationZonesComponent } from './admin-preferences/system-preferences/sp-location-zones/sp-location-zones.component';
import { SpFieldNameMappingComponent } from './admin-preferences/system-preferences/sp-field-name-mapping/sp-field-name-mapping.component';
import { SpDevicePreferenceComponent } from './admin-preferences/system-preferences/sp-device-preference/sp-device-preference.component';
import { AddNewDeviceComponent } from './dialogs/add-new-device/add-new-device.component';
import { SpBulkHandheldSettingComponent } from './admin-preferences/system-preferences/sp-bulk-handheld-setting/sp-bulk-handheld-setting.component';
import { SpLightTreeSetupComponent } from './admin-preferences/system-preferences/sp-light-tree-setup/sp-light-tree-setup.component';
import { SpScanVerificationSetupComponent } from './admin-preferences/system-preferences/sp-scan-verification-setup/sp-scan-verification-setup.component';
import { ScanVerificationDefaultsComponent } from './dialogs/scan-verification-defaults/scan-verification-defaults.component';
import { LocationNameComponent } from './dialogs/location-name/location-name.component';
import { KanbanZoneAllocationConflictComponent } from './dialogs/kanban-zone-allocation-conflict/kanban-zone-allocation-conflict.component';
import { WpWorkstationSetupComponent } from './admin-preferences/workstation-preferences/wp-workstation-setup/wp-workstation-setup.component';
import { DeAllocateOrdersComponent } from './de-allocate-orders/de-allocate-orders.component';
import { ReportsComponent } from './reports/reports.component';
import { WpBulkZonesComponent } from './admin-preferences/workstation-preferences/wp-bulk-zones/wp-bulk-zones.component';
import { WpPodSetupComponent } from './admin-preferences/workstation-preferences/wp-pod-setup/wp-pod-setup.component';
import { BasicReportsAndLabelsComponent } from './reports/basic-reports-and-labels/basic-reports-and-labels.component';
import { CustomReportsAndLabelsComponent } from './reports/custom-reports-and-labels/custom-reports-and-labels.component';
import { AddNotesComponent } from './dialogs/add-notes/add-notes.component';
import { WpPickLevelsComponent } from './admin-preferences/workstation-preferences/wp-pick-levels/wp-pick-levels.component';
import { WpCustomAppsComponent } from './admin-preferences/workstation-preferences/wp-custom-apps/wp-custom-apps.component';
import { WpMiscellaneousSettingsComponent } from './admin-preferences/workstation-preferences/wp-miscellaneous-settings/wp-miscellaneous-settings.component';
import { WpSortBarSetupComponent } from './admin-preferences/workstation-preferences/wp-sort-bar-setup/wp-sort-bar-setup.component';
import { SpLookupListsComponent } from './admin-preferences/system-preferences/sp-lookup-lists/sp-lookup-lists.component';
import { LookupUserTwoSetupComponent } from './admin-preferences/system-preferences/sp-lookup-lists/lookup-user-two-setup/lookup-user-two-setup.component';
import { LookupUserOneSetupComponent } from './admin-preferences/system-preferences/sp-lookup-lists/lookup-user-one-setup/lookup-user-one-setup.component';
import { LookupAdjustmentLookupSetupComponent } from './admin-preferences/system-preferences/sp-lookup-lists/lookup-adjustment-lookup-setup/lookup-adjustment-lookup-setup.component';
import { LookupToteSetupComponent } from './admin-preferences/system-preferences/sp-lookup-lists/lookup-tote-setup/lookup-tote-setup.component';



@NgModule({
  declarations: [
    AdminComponent,
    EmployeesComponent,
    EmployeesLookupComponent,
    EmployeePickupLevelComponent,
    GroupsAllowedComponent,
    GroupsLookupComponent,
    AssignedFunctionsComponent,
    UnassignedFunctionsComponent,
    filterUnassignedFunc,
    StatisticsLookupComponent,
    AddNewEmployeeComponent,
    AddZoneComponent,
    DeleteConfirmationComponent,
    AddLocationComponent,
    AddPickuplevelsComponent,
    AddGroupAllowedComponent,
    AddNewGroupComponent,
    FunctionAllocationComponent,
    InventoryMapComponent,
    AddInvMapLocationComponent,
    WarehouseComponent,
    SetColumnSeqComponent,
    CellSizeComponent,
    VelocityCodeComponent,
    InventoryMasterComponent,
    ItemNumberComponent,
    ItemCategoryComponent,
    PrintRangeComponent,
    UnitMeasureComponent,
    ItemSetupComponent,
    QuarantineConfirmationComponent,
    AdjustQuantityComponent,
    BatchManagerComponent,
    BatchDeleteComponent,
    BatchOrderListComponent,
    BatchSelectedOrdersComponent,
    CycleCountsComponent,
    CCDiscrepanciesComponent,
    CCCountQueueComponent,
    CreateCountsComponent,
    CreateTransactionComponent,
    CountQueueComponent,
    ImportFieldMappingComponent,
    ReelTrackingComponent,
    ScanCodesComponent,
    LocationAssignmentComponent,
    CountComponent,
    PickComponent,
    PutAwayComponent,
    DetailComponent,
    KitItemComponent,
    LocationComponent,
    ReelTrackingComponent,
    ScanCodesComponent,
    WeightScaleComponent,
    OthersComponent,
    GroupAllowedComponent,
    SearchPipe,
    customFuncAllowedSearch,
    CloneGroupComponent,
    UpdateDescriptionComponent,
    CreateBatchConfirmationComponent,
    CreateBatchComponent,
    TransactionComponent,
    OpenTransactionComponent,
    OpenTransactionFiltersComponent,
    OpenTransactionDataTableComponent,
    TransactionHistoryComponent,
    TransactionHistoryFiltersComponent,
    TransactionHistoryListComponent,
    OrderStatusComponent,
    TranSelectOrderComponent,
    TranCarouselLzoneComponent,
    TranOffCarouselLzoneComponent,
    TranOrderListComponent,
    OpenTransactionOnHoldComponent,
    DeleteConfirmationTransactionComponent,
    ReprocessedTransactionComponent,
    ReprocessTransactionComponent,
    TranInReprocessComponent,
    ReprocessChoiceComponent,
    ItemNumUpdateConfirmationComponent,
    ScanTypeCodeComponent,
    ColumnSequenceDialogComponent,
    SearchFilterPipe,
    GlobalConfigSetSqlComponent,
    SendTranHistoryComponent,
    ReprocessTransactionDetailComponent,
    HoldReasonComponent,
    ClearAppGlobalconfigComponent,
    LicensingInvalidComponent,
    SqlAuthConfirmationComponent,
    ManualTransactionsComponent,
    GenerateOrderComponent,
    AddNewTransactionToOrderComponent,
    DeleteConfirmationManualTransactionComponent,
    ManualTransPostConfirmComponent,
    GenerateTransactionComponent,
    SetItemLocationComponent,
    SupplierItemIdComponent,
    TemporaryManualOrderNumberAddComponent,
    ItemExistGenerateOrderComponent,
    EmptyFieldsComponent,
    UserFieldsEditComponent,
    PostManualTransactionComponent,
    InvalidQuantityComponent,
    FilterToteComponent,
    CCBCreateCountsComponent,
    CCBCountQueueComponent,
    CreateCountBatchesComponent,
    BatchManagerDetailViewComponent,
    InputSpacesPreventDirective,
    BmToteidEntryComponent,
    SystemReplenishmentComponent,
    SrNewOrderComponent,
    FilterItemNumbersComponent,
    SrCurrentOrderComponent,
    SortPipe,
    LaLocationAssignmentQuantitiesComponent,
    MoveItemsComponent,
    AdminPreferencesComponent,
    WorkstationPreferencesComponent,
    SystemPreferencesComponent,
    SpGeneralSetupComponent,
    SpLocationZonesComponent,
    SpFieldNameMappingComponent,
    SpDevicePreferenceComponent,
    AddNewDeviceComponent,
    SpBulkHandheldSettingComponent,
    SpLightTreeSetupComponent,
    SpScanVerificationSetupComponent,
    ScanVerificationDefaultsComponent,
    LocationNameComponent,
    KanbanZoneAllocationConflictComponent,
    WpWorkstationSetupComponent,
    DeAllocateOrdersComponent,
    ReportsComponent,
    WpBulkZonesComponent,
    WpPodSetupComponent,
    BasicReportsAndLabelsComponent,
    CustomReportsAndLabelsComponent,
    AddNotesComponent,
    WpPickLevelsComponent,
    WpCustomAppsComponent,
    WpMiscellaneousSettingsComponent,
    WpSortBarSetupComponent,
    SpLookupListsComponent,
    LookupUserTwoSetupComponent,
    LookupUserOneSetupComponent,
    LookupAdjustmentLookupSetupComponent,
    LookupToteSetupComponent,

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MaterialModule,
    GeneralModule,
    CdkTableModule,
    DragDropModule,
    MatInputModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      extendedTimeOut: 0,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning',
      }
    })
  ],
 
})
export class AdminModule { }
