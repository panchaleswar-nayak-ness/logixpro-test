import {NgModule, APP_INITIALIZER} from '@angular/core';
import {BrowserModule, Title} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {DashboardModule} from './dashboard/dashboard.module';
import {MaterialModule} from './material-module';
import {DatePipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {CustomHttpInterceptor} from './common/init/http-interceptor';
import {ChangePasswordComponent} from './login/change-password/change-password.component';
import {HeaderInterceptor} from './common/init/header-interceptor.interceptor';
import {GlobalConfigModule} from './global-config/global-config.module';
import {SelectZonesComponent} from './dialogs/select-zones/select-zones.component';
import {TotesAddEditComponent} from './dialogs/totes-add-edit/totes-add-edit.component';
import {ImLabelPrintingComponent} from './induction-manager/im-label-printing/im-label-printing.component';
import {GeneralModule} from './gen-module';
import {PickToteManagerComponent} from './dialogs/pick-tote-manager/pick-tote-manager.component';
import {ViewOrdersComponent} from './dialogs/view-orders/view-orders.component';
import {BlossomToteComponent} from './dialogs/blossom-tote/blossom-tote.component';
import {WorkstationZonesComponent} from './dialogs/workstation-zones/workstation-zones.component';
import {BatchDeleteComponent} from './dialogs/batch-delete/batch-delete.component';
import {ConfirmationDialogComponent} from './admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import {ErrorDialogComponent} from './dialogs/error-dialog/error-dialog.component';
import {AddFilterFunction} from './dialogs/add-filter-function/add-filter-function.component';
import {
  SelectionTransactionForToteComponent
} from './dialogs/selection-transaction-for-tote/selection-transaction-for-tote.component';
import {
  SelectionTransactionForToteExtendComponent
} from './dialogs/selection-transaction-for-tote-extend/selection-transaction-for-tote-extend.component';
import {CrossDockTransactionComponent} from './dialogs/cross-dock-transaction/cross-dock-transaction.component';
import {
  ReprocessTransactionDetailViewComponent
} from './dialogs/reprocess-transaction-detail-view/reprocess-transaction-detail-view.component';
import {ToteTransactionViewComponent} from './dialogs/tote-transaction-view/tote-transaction-view.component';
import {
  BatchDeleteConfirmationComponent
} from './dialogs/batch-delete-confirmation/batch-delete-confirmation.component';
import {MarkToteFullComponent} from './dialogs/mark-tote-full/mark-tote-full.component';
import {AlertConfirmationComponent} from './dialogs/alert-confirmation/alert-confirmation.component';
import {UserFieldsComponent} from './dialogs/user-fields/user-fields.component';
import {ChooseLocationComponent} from './dialogs/choose-location/choose-location.component';
import {InputFilterComponent} from './dialogs/input-filter/input-filter.component';
import {MinReelQtyComponent} from './dialogs/min-reel-qty/min-reel-qty.component';
import {TransactionQtyEditComponent} from './dialogs/transaction-qty-edit/transaction-qty-edit.component';
import {CmShippingComponent} from './dialogs/cm-shipping/cm-shipping.component';
import {CmShippingTransactionComponent} from './dialogs/cm-shipping-transaction/cm-shipping-transaction.component';
import {CmConfirmAndPackingComponent} from './dialogs/cm-confirm-and-packing/cm-confirm-and-packing.component';
import {CmShipSplitLineComponent} from './dialogs/cm-ship-split-line/cm-ship-split-line.component';
import {CmShipEditQtyComponent} from './dialogs/cm-ship-edit-qty/cm-ship-edit-qty.component';
import {CmShipEditConIdComponent} from './dialogs/cm-ship-edit-con-id/cm-ship-edit-con-id.component';
import {CmToteIdUpdateModalComponent} from './dialogs/cm-tote-id-update-modal/cm-tote-id-update-modal.component';
import {DeleteRangeComponent} from './dialogs/delete-range/delete-range.component';
import {PrintReplenLabelsComponent} from './dialogs/print-replen-labels/print-replen-labels.component';
import {SrDeleteOrderComponent} from './dialogs/sr-delete-order/sr-delete-order.component';
import {CmOrderNumberComponent} from './dialogs/cm-order-number/cm-order-number.component';
import {
  CmCarriersAddDeleteEditComponent
} from './dialogs/cm-carriers-add-delete-edit/cm-carriers-add-delete-edit.component';
import {CmItemSelectedComponent} from './dialogs/cm-item-selected/cm-item-selected.component';
import {
  CmConfirmAndPackingProcessTransactionComponent
} from './dialogs/cm-confirm-and-packing-process-transaction/cm-confirm-and-packing-process-transaction.component';
import {CmSplitLineComponent} from './dialogs/cm-split-line/cm-split-line.component';
import {
  CmConfirmAndPackingSelectTransactionComponent
} from './dialogs/cm-confirm-and-packing-select-transaction/cm-confirm-and-packing-select-transaction.component';
import {CmShippingCarrierComponent} from './dialogs/cm-shipping-carrier/cm-shipping-carrier.component';
import {OrderManagerComponent} from './order-manager/order-manager.component';
import {
  CmAddNewItemToShipmentComponent
} from './dialogs/cm-add-new-item-to-shipment/cm-add-new-item-to-shipment.component';
import {CmPrintOptionsComponent} from './dialogs/cm-print-options/cm-print-options.component';
import {CmOrderToteConflictComponent} from './dialogs/cm-order-tote-conflict/cm-order-tote-conflict.component';
import {OmEventLogEntryDetailComponent} from './dialogs/om-event-log-entry-detail/om-event-log-entry-detail.component';
import {OmCreateOrdersComponent} from './dialogs/om-create-orders/om-create-orders.component';
import {OmUpdateRecordComponent} from './dialogs/om-update-record/om-update-record.component';
import {OmAddRecordComponent} from './dialogs/om-add-record/om-add-record.component';
import {OmEditTransactionComponent} from './dialogs/om-edit-transaction/om-edit-transaction.component';
import {OmAddTransactionComponent} from './dialogs/om-add-transaction/om-add-transaction.component';
import {OmChangesConfirmationComponent} from './dialogs/om-changes-confirmation/om-changes-confirmation.component';
import {OmUserFieldDataComponent} from './dialogs/om-user-field-data/om-user-field-data.component';
import {OmChangePriorityComponent} from './dialogs/om-change-priority/om-change-priority.component';
import {AuthGuard} from './common/init/AuthGuard.service';
import {StagingLocationOrderComponent} from './dialogs/staging-location-order/staging-location-order.component';
import {FrNumpadComponent} from './dialogs/fr-numpad/fr-numpad.component';
import {ApiFuntions} from './common/services/ApiFuntions';
import {BaseService} from './common/services/base-service.service';
import {ShortTransactionComponent} from './dialogs/short-transaction/short-transaction.component';
import {CpbBlossomToteComponent} from './dialogs/cpb-blossom-tote/cpb-blossom-tote.component';
import {ReelDetailComponent} from './dialogs/reel-detail/reel-detail.component';
import {ReelTransactionsComponent} from './dialogs/reel-transactions/reel-transactions.component';
import {ImportExportComponent} from './import-export/import-export.component';
import {IeTransFieldMappingComponent} from './dialogs/ie-trans-field-mapping/ie-trans-field-mapping.component';
import {OpenTransPickMappingComponent} from './dialogs/open-trans-pick-mapping/open-trans-pick-mapping.component';
import {TransferFilePathComponent} from './dialogs/transfer-file-path/transfer-file-path.component';
import {IeFtpSettingsComponent} from './dialogs/ie-ftp-settings/ie-ftp-settings.component';
import {IeInventMapExportComponent} from './dialogs/ie-invent-map-export/ie-invent-map-export.component';
import {IeStatusComponent} from './import-export/ie-status/ie-status.component';
import {IeSystemSettingsComponent} from './import-export/ie-system-settings/ie-system-settings.component';
import {IeTransferSettingsComponent} from './import-export/ie-transfer-settings/ie-transfer-settings.component';
import {FiltersComponent} from './import-export/ie-transfer-settings/filters/filters.component';
import {IeAssignLocationsComponent} from './import-export/ie-assign-locations/ie-assign-locations.component';
import {IeManageDataComponent} from './import-export/ie-manage-data/ie-manage-data.component';
import {CrEditDesignTestDataComponent} from './dialogs/cr-edit-design-test-data/cr-edit-design-test-data.component';
import {CrDeleteConfirmationComponent} from './dialogs/cr-delete-confirmation/cr-delete-confirmation.component';
import {BrChooseReportTypeComponent} from './dialogs/br-choose-report-type/br-choose-report-type.component';
import {CrAddNewCustomReportComponent} from './dialogs/cr-add-new-custom-report/cr-add-new-custom-report.component';
import {IeFileBackupComponent} from './import-export/ie-file-backup/ie-file-backup.component';
import {IeInventoryComponent} from './import-export/ie-inventory/ie-inventory.component';
import {
  IeManageDataTransFieldMapComponent
} from './dialogs/ie-manage-data-trans-field-map/ie-manage-data-trans-field-map.component';
import {
  IeManageDataInvenMapTablesComponent
} from './dialogs/ie-manage-data-inven-map-tables/ie-manage-data-inven-map-tables.component';
import {IeArchivePurgeComponent} from './import-export/ie-archive-purge/ie-archive-purge.component';
import {IeInvFieldsComponent} from './import-export/ie-inv-fields/ie-inv-fields.component';
import {IeFtpComponent} from './import-export/ie-ftp/ie-ftp.component';
import {ShippingCompleteDialogComponent} from './dialogs/shipping-complete-dialog/shipping-complete-dialog.component';
import {
  CrDesignFilenameConfirmationComponent
} from './dialogs/cr-design-filename-confirmation/cr-design-filename-confirmation.component';
import {DPrinterSetupComponent} from './dialogs/d-printer-setup/d-printer-setup.component';
import {
  PaPrintLabelConfirmationComponent
} from './dialogs/pa-print-label-confirmation/pa-print-label-confirmation.component';
import {SharedComponentsModule} from './common/globalComponents/shared-components.module';
import {
  IeSsTransactionsComponent
} from './import-export/ie-system-settings/ie-ss-transactions/ie-ss-transactions.component';
import {IeSsImportComponent} from './import-export/ie-system-settings/ie-ss-import/ie-ss-import.component';
import {IeSsExportComponent} from './import-export/ie-system-settings/ie-ss-export/ie-ss-export.component';
import {
  IeSsCheckForDuplicatesComponent
} from './import-export/ie-system-settings/ie-ss-check-for-duplicates/ie-ss-check-for-duplicates.component';
import {
  IeTsImportExportJobTypeComponent
} from './import-export/ie-transfer-settings/ie-ts-import-export-job-type/ie-ts-import-export-job-type.component';
import {
  IeTsTransactionTypeToExportComponent
} from './import-export/ie-transfer-settings/ie-ts-transaction-type-to-export/ie-ts-transaction-type-to-export.component';
import {
  IeAlAutoLocationAssignmentComponent
} from './import-export/ie-assign-locations/ie-al-auto-location-assignment/ie-al-auto-location-assignment.component';
import {
  IeAlUnallocatedTransactionsComponent
} from './import-export/ie-assign-locations/ie-al-unallocated-transactions/ie-al-unallocated-transactions.component';
import {
  IeMdExportInvertoryMapComponent
} from './import-export/ie-manage-data/ie-md-export-invertory-map/ie-md-export-invertory-map.component';
import {
  IeMdImportInvertoryMapComponent
} from './import-export/ie-manage-data/ie-md-import-invertory-map/ie-md-import-invertory-map.component';
import {
  IeMdImportInvertoryComponent
} from './import-export/ie-manage-data/ie-md-import-invertory/ie-md-import-invertory.component';
import {
  IeMdExportInvertoryComponent
} from './import-export/ie-manage-data/ie-md-export-invertory/ie-md-export-invertory.component';
import {WorkstationLoginComponent} from './dialogs/workstation-login/workstation-login.component';
import {BpFullToteComponent} from './dialogs/bp-full-tote/bp-full-tote.component';
import {BpNumberSelectionComponent} from './dialogs/bp-number-selection/bp-number-selection.component';
import {OrderDetailsComponent} from './dialogs/order-details/order-details.component';
import { ZoneGroupsComponent } from './dialogs/zone-groups/zone-groups.component';
import { ImprefInductionFilterComponent } from './dialogs/impref-induction-filter/impref-induction-filter.component';
import { ImportCountBatchesComponent } from './admin/cycle-counts/import-count-batches/import-count-batches.component';
import { AuditTransferFileComponent } from './admin/cycle-counts/dialogs/audit-transfer-file/audit-transfer-file.component';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';

// import { MarkoutComponent } from './markout/markout.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  DirectFilterationColumnsService
} from './common/services/direct-filteration-columns.service';
import {
  DirectFilterationColumnsMenuComponent
} from './common/globalComponents/direct-filteration-columns-menu/direct-filteration-columns-menu.component';

@NgModule({
  declarations: [
    AppComponent,
   
    LoginComponent,
    ChangePasswordComponent,
    SelectZonesComponent,
    TotesAddEditComponent,
    ImLabelPrintingComponent,
    PickToteManagerComponent,
    ViewOrdersComponent,
    BlossomToteComponent,
    WorkstationZonesComponent,
    BatchDeleteComponent,
    ConfirmationDialogComponent,
    ErrorDialogComponent,
    SelectionTransactionForToteComponent,
    SelectionTransactionForToteExtendComponent,
    AddFilterFunction,
    SelectionTransactionForToteComponent,
    CrossDockTransactionComponent,
    ReprocessTransactionDetailViewComponent,
    ToteTransactionViewComponent,
    BatchDeleteConfirmationComponent,
    MarkToteFullComponent,
    AlertConfirmationComponent,
    UserFieldsComponent,
    ChooseLocationComponent,
   
    InputFilterComponent,
    MinReelQtyComponent,
    TransactionQtyEditComponent,
    CmShippingComponent,
    CmShippingTransactionComponent,
    CmConfirmAndPackingComponent,
    CmShipSplitLineComponent,
    CmShipEditQtyComponent,
    CmShipEditConIdComponent,
    CmToteIdUpdateModalComponent,
    DeleteRangeComponent,
    PrintReplenLabelsComponent,
    SrDeleteOrderComponent,
    CmOrderNumberComponent,
    CmCarriersAddDeleteEditComponent,
    CmItemSelectedComponent,
    CmConfirmAndPackingProcessTransactionComponent,
    CmSplitLineComponent,
    CmShippingCarrierComponent,
    CmConfirmAndPackingSelectTransactionComponent,
    OrderManagerComponent,
    CmAddNewItemToShipmentComponent,
    CmPrintOptionsComponent,
    CmOrderToteConflictComponent,
    OmEventLogEntryDetailComponent,
    OmCreateOrdersComponent,
    OmUpdateRecordComponent,
    OmAddRecordComponent,
    OmEditTransactionComponent,
    OmAddTransactionComponent,
    OmChangesConfirmationComponent,
    OmUserFieldDataComponent,
    OmChangePriorityComponent,
    StagingLocationOrderComponent,
    FrNumpadComponent,
    ShortTransactionComponent,
    CpbBlossomToteComponent,
    ReelDetailComponent,
    ReelTransactionsComponent,
    ImportExportComponent,
    IeTransFieldMappingComponent,
    OpenTransPickMappingComponent,
    TransferFilePathComponent,
    IeFtpSettingsComponent,
    IeInventMapExportComponent,
    IeStatusComponent,
    IeSystemSettingsComponent,
    IeTransferSettingsComponent,
    FiltersComponent,
    IeAssignLocationsComponent,
    IeManageDataComponent,
    CrEditDesignTestDataComponent,
    CrDeleteConfirmationComponent,
    BrChooseReportTypeComponent,
    CrAddNewCustomReportComponent,
    IeFileBackupComponent,
    IeInventoryComponent,
    IeManageDataTransFieldMapComponent,
    IeManageDataInvenMapTablesComponent,
    IeArchivePurgeComponent,
    IeInvFieldsComponent,
    IeFtpComponent,
    ShippingCompleteDialogComponent,
    CrDesignFilenameConfirmationComponent,
    DPrinterSetupComponent,
    PaPrintLabelConfirmationComponent,
    IeSsTransactionsComponent,
    IeSsImportComponent,
    IeSsExportComponent,
    IeSsCheckForDuplicatesComponent,
    IeTsImportExportJobTypeComponent,
    IeTsTransactionTypeToExportComponent,
    IeAlAutoLocationAssignmentComponent,
    IeAlUnallocatedTransactionsComponent,
    IeMdExportInvertoryMapComponent,
    IeMdImportInvertoryMapComponent,
    IeMdImportInvertoryComponent,
    IeMdExportInvertoryComponent,
    WorkstationLoginComponent,
    BpFullToteComponent,
    BpNumberSelectionComponent,
    OrderDetailsComponent,
    ZoneGroupsComponent,
    ImprefInductionFilterComponent,
    DirectFilterationColumnsMenuComponent,  // Add this line
    AuditTransferFileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GeneralModule,
    MaterialModule,
    AppRoutingModule,
    DashboardModule,
    GlobalConfigModule,
    SharedComponentsModule,
    MatSelectModule,
    MatCheckboxModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSliderModule,
    MatCardModule,
    MatTooltipModule
  ],
  providers: [
    Title,
    DatePipe,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: CustomHttpInterceptor,
    //   multi: true
    // },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeaderInterceptor,
      multi: true
    },
    AuthGuard,
    ApiFuntions,
    BaseService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
