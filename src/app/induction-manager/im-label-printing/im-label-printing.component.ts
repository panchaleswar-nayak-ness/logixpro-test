import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { GlobalService } from 'src/app/common/services/global.service';
import { AuthService } from 'src/app/common/init/auth.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import { PrintApiService } from 'src/app/common/services/print-api/print-api.service';
import { IPrintApiService } from 'src/app/common/services/print-api/print-api-interface';
import { ToasterType, ToasterTitle, ToasterMessages, LabelPrintingModes, Style, DialogConstants, StringConditions, ConfirmationMessages, ConfirmationHeadings, Icons } from 'src/app/common/constants/strings.constants';
import { AvailableTote, PrintQueueItem } from 'src/app/common/interface/induction-manager/print-lable/print-lable.interface';
import { ApiResponse, ApiResult, UserSession } from 'src/app/common/types/CommonTypes';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-im-label-printing',
  templateUrl: './im-label-printing.component.html',
  styleUrls: ['./im-label-printing.component.scss']
})
export class ImLabelPrintingComponent implements OnInit, AfterViewInit {

  // Mode selector options
  readonly modeOptions: string[] = [LabelPrintingModes.NewTotes, LabelPrintingModes.PrintedHistory];
  selectedMode: string = LabelPrintingModes.NewTotes;

  // Available Totes table
  readonly availableTotesDisplayedColumns: string[] = ['toteId', 'priority', 'requiredDate', 'actions'];
  availableTotesDataSource = new MatTableDataSource<AvailableTote>([]);

  // Print Queue table
  readonly printQueueDisplayedColumns: string[] = ['toteId', 'priority', 'requiredDate', 'actions'];
  printQueueDataSource = new MatTableDataSource<PrintQueueItem>([]);

  // Search controls
  toteIdSearchControl = new FormControl('');
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);

  // Pagination and sorting
  @ViewChild('availablePaginator') availablePaginator: MatPaginator;
  @ViewChild('printQueuePaginator') printQueuePaginator: MatPaginator;
  @ViewChild('availableSort') availableSort: MatSort;
  @ViewChild('printQueueSort') printQueueSort: MatSort;

  // Data properties
  userData: UserSession;
  searchText: string = '';
  selectedSearchColumn: string = '';
  
  // Constants
  noRecordFound = ToasterMessages.NoRecordFound;

  // Services
  public iInductionManagerApi: IInductionManagerApiService;
  public iPrintApiService: IPrintApiService;

  constructor(
    public global: GlobalService,
    public authService: AuthService,
    public inductionManagerApi: InductionManagerApiService,
    public printApiService: PrintApiService
  ) {
    this.iInductionManagerApi = inductionManagerApi;
    this.iPrintApiService = printApiService;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.selectedSearchColumn = this.availableTotesDisplayedColumns[0];
    this.loadData();
    this.loadPrintQueue();
  }

  ngAfterViewInit(): void {    
    this.setUpPaginationAndSorting();
    this.setUpPaginationAndSortingPrintQueue();
  }

  private setUpPaginationAndSorting(): void {
    if (this.availablePaginator) {
      this.availableTotesDataSource.paginator = this.availablePaginator;
    }
    if (this.availableSort) {
      this.availableTotesDataSource.sort = this.availableSort;
    }
  }

  private setUpPaginationAndSortingPrintQueue(): void {
    if (this.printQueuePaginator) {
      this.printQueueDataSource.paginator = this.printQueuePaginator;
    }
    if (this.printQueueSort) {
      this.printQueueDataSource.sort = this.printQueueSort;
    }
  }

  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }

  onModeChange(): void {
    this.loadData();
  }

  private loadData(): void {
    if (this.selectedMode === LabelPrintingModes.NewTotes) {
      this.loadAvailableTotes();
    } else {
      this.loadPrintedHistory();
    }
  }

  onRefresh(): void {
    this.loadData();
    this.loadPrintQueue();
  }

  addAllToQueue(): void {
    if (this.availableTotesDataSource.data.length === 0) {
      this.global.ShowToastr(
        ToasterType.Info,
        ToasterMessages.NoTotesAvailableToAdd,
        ToasterTitle.Info
      );
      return;
    }

    // Move all totes from Available to Print Queue
    const availableTotes = [...this.availableTotesDataSource.data];
    const currentPrintQueue = [...this.printQueueDataSource.data];
    
    // Convert AvailableTote to PrintQueueItem
    const newPrintQueueItems: PrintQueueItem[] = availableTotes.map(tote => ({
      toteId: tote.toteId,
      priority: tote.priority,
      requiredDate: tote.requiredDate,
      zone: tote.zone // Preserve zone from original data if available
    }));

    // Update data sources
    this.printQueueDataSource.data = [...currentPrintQueue, ...newPrintQueueItems];
    this.availableTotesDataSource.data = [];
    
    // Refresh data sources
    this.printQueueDataSource._updateChangeSubscription();
    this.availableTotesDataSource._updateChangeSubscription();
  }

  addSingleToteToQueue(tote: AvailableTote): void {
    // Convert AvailableTote to PrintQueueItem
    const printQueueItem: PrintQueueItem = {
      toteId: tote.toteId,
      priority: tote.priority,
      requiredDate: tote.requiredDate,
      zone: tote.zone // Preserve zone from original data if available
    };

    // Remove from Available Totes
    const availableTotes = this.availableTotesDataSource.data.filter(t => t.toteId !== tote.toteId);
    this.availableTotesDataSource.data = availableTotes;

    // Add to Print Queue
    const currentPrintQueue = [...this.printQueueDataSource.data];
    this.printQueueDataSource.data = [...currentPrintQueue, printQueueItem];

    // Refresh data sources
    this.printQueueDataSource._updateChangeSubscription();
    this.availableTotesDataSource._updateChangeSubscription();
  }

  removeAllFromQueue(): void {
    if (this.printQueueDataSource.data.length === 0) {
      this.global.ShowToastr(
        ToasterType.Info,
        ToasterMessages.PrintQueueIsEmpty,
        ToasterTitle.Info
      );
      return;
    }

    // Move all items from Print Queue back to Available Totes
    const printQueueItems = [...this.printQueueDataSource.data];
    const currentAvailableTotes = [...this.availableTotesDataSource.data];
    
    // Convert PrintQueueItem to AvailableTote
    const newAvailableTotes: AvailableTote[] = printQueueItems.map(item => ({
      toteId: item.toteId,
      priority: item.priority,
      requiredDate: item.requiredDate,
      zone: item.zone // Preserve zone from original data if available
    }));

    // Update data sources
    this.availableTotesDataSource.data = [...currentAvailableTotes, ...newAvailableTotes];
    this.printQueueDataSource.data = [];
    
    // Refresh data sources
    this.printQueueDataSource._updateChangeSubscription();
    this.availableTotesDataSource._updateChangeSubscription();
  }

  printLabelsFromQueueConfirmation(): void {
    if (this.printQueueDataSource.data.length === 0) {
      this.global.ShowToastr(
        ToasterType.Info,
        ToasterMessages.PrintQueueIsEmpty,
        ToasterTitle.Info
      );
      return;
    }

    let dialogRef = this.global.OpenDialog(ConfirmationDialogComponent, {
      height: DialogConstants.auto,
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        heading: ConfirmationHeadings.PrintLabels,
        message: ConfirmationMessages.PrintLabelsFromQueue,
        customButtonText: true,
        btn1Text: StringConditions.Yes,
        btn2Text: StringConditions.No,
        icon: Icons.Print,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result == StringConditions.Yes) {
        this.printLabelsFromQueue();
      }
    });
    
    
  }

  printLabelsFromQueue(): void {
    const payload = this.printQueueDataSource.data.map(item => item.toteId);
    this.iPrintApiService.printToteLabels(payload).then(
      (response: ApiResponse<string[]>) => {
        this.global.ShowToastr(
          ToasterType.Success, 
          ToasterMessages.PrintingLabelsFromQueue(this.printQueueDataSource.data.length), 
          ToasterTitle.Success
        );
        this.addPrintedTotes(payload);        
      }
    ).catch(
      (error) => {
        console.error('Error printing tote labels:', error);
      }
    );
  }

  addPrintedTotes(payload: string[]): void {
    this.iInductionManagerApi.addPrintedTotes(payload).subscribe({
      next: (response) => {
        if (response?.isSuccess) {
          this.onRefresh();
        } else {
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
        }
      },
      error: (error) => {
        console.error('Error adding printed totes:', error);
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
      }
    });    
  }

  removeSingleFromQueue(item: PrintQueueItem): void {
    // Convert PrintQueueItem to AvailableTote
    const availableTote: AvailableTote = {
      toteId: item.toteId,
      priority: item.priority,
      requiredDate: item.requiredDate,
      zone: item.zone // Preserve zone from original data if available
    };

    // Remove from Print Queue
    const printQueueItems = this.printQueueDataSource.data.filter(i => i.toteId !== item.toteId);
    this.printQueueDataSource.data = printQueueItems;

    // Add back to Available Totes
    const currentAvailableTotes = [...this.availableTotesDataSource.data];
    this.availableTotesDataSource.data = [...currentAvailableTotes, availableTote];

    // Refresh data sources
    this.printQueueDataSource._updateChangeSubscription();
    this.availableTotesDataSource._updateChangeSubscription();
  }

  // Search functionality
  applyFilter(): void {
    // apply filter to the available totes data source to filter the data based on the search text and the selected search column
    this.availableTotesDataSource.filterPredicate = (data: AvailableTote, filter: string) => {
      const searchTerms = this.searchText.trim().toLowerCase();
      const rawValue = data[this.selectedSearchColumn];
      const columnValue = rawValue ? rawValue.toString().toLowerCase() : "";
      return columnValue.includes(searchTerms.toLowerCase());
    };
    this.availableTotesDataSource.filter = this.searchText.trim().toLowerCase();

    if (this.availableTotesDataSource.paginator) {
      this.availableTotesDataSource.paginator.firstPage();
    }
  }

  clearSearch(): void {
    this.searchText = '';
    this.applyFilter();
  }

  // Column display name mapping
  getColumnDisplayName(column: string): string {
    const columnMap: { [key: string]: string } = {
      'toteId': 'Tote ID',
      'priority': 'Priority', 
      'requiredDate': 'Required Date',
      'zone': 'Zone'
    };
    return columnMap[column] || column;
  }

  // Sort change handler
  announceSortChange(sortState: Sort): void {
    // Handle sort changes for accessibility
    console.log('Sort changed:', sortState);
    this.availableTotesDataSource.sort = this.availableSort;
    this.printQueueDataSource.sort = this.printQueueSort;
  }

  // Private helper methods
  private loadAvailableTotes(): void {
    this.iInductionManagerApi.getAvailableTotes().subscribe(
      (response: ApiResult<AvailableTote[]>) => {
        if (response.isSuccess && response.value) {
          // remove totes that are already in the print queue
          this.availableTotesDataSource.data = response.value.filter(tote => !this.printQueueDataSource.data.some(item => item.toteId === tote.toteId));
        } else {
          // If no data or not executed, set empty array
          this.availableTotesDataSource.data = [];
        }
      },
      (error) => {
        console.error('Error loading available totes:', error);
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
        // Set empty array on error to avoid UI issues
        this.availableTotesDataSource.data = [];
      }
    );
  }

  private loadPrintQueue(): void {
    this.printQueueDataSource.data = [];
    this.printQueueDataSource._updateChangeSubscription();
  }

  private loadPrintedHistory(): void {
    this.iInductionManagerApi.getPrintedTotes().subscribe(
      (response: ApiResult<AvailableTote[]>) => {
        if (response.isSuccess && response.value) {
          // remove totes that are already in the print queue
          this.availableTotesDataSource.data = response.value.filter(tote => !this.printQueueDataSource.data.some(item => item.toteId === tote.toteId));
        } else {
          // If no data or not successful, set empty array
          this.availableTotesDataSource.data = [];
        }
      },
      (error) => {
        console.error('Error loading printed totes:', error);
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.APIErrorMessage, ToasterTitle.Error);
        // Set empty array on error to avoid UI issues
        this.availableTotesDataSource.data = [];
      }
    );
  }

}
