import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  AfterViewInit,
  ViewChild,
  Renderer2,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/common/init/auth.service';

import { DeleteConfirmationComponent } from '../../admin/dialogs/delete-confirmation/delete-confirmation.component';
import { Location } from '@angular/common';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { GlobalService } from 'src/app/common/services/global.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import {  ToasterTitle ,ResponseStrings,ToasterType,ToasterMessages,DialogConstants,UniqueConstants,Style,TableConstant,ColumnDef} from 'src/app/common/constants/strings.constants';
import { ToteSetupMessages } from 'src/app/common/constants/tote-setup.constants';
import { PrintApiService} from "../../common/services/print-api/print-api.service";
import { HttpResponse } from '@angular/common/http';
import { ApiResponse, UserSession } from 'src/app/common/types/CommonTypes';
import {
  ToteElement,
  ToteSetupPayload,
  SavedTote,
  ToteTypeAheadItem,
  SelectedTote,
  TotesAddEditDialogData,
} from './totes-add-edit.types';

@Component({
  selector: 'app-totes-add-edit',
  templateUrl: './totes-add-edit.component.html',
  styleUrls: ['./totes-add-edit.component.scss'],
})
export class TotesAddEditComponent implements OnInit, AfterViewInit {

  @ViewChild('fieldFocus') fieldFocus: ElementRef;
  @ViewChildren('category_category', { read: ElementRef })
  category_category: QueryList<ElementRef>;
  isRowAdded = false;
  floatLabelControl1 = new FormControl('auto' as FloatLabelType);
  floatLabelControl2 = new FormControl('auto' as FloatLabelType);
  elementDataTote = [
    {
      toteID: '',
      cells: '',
      position: 1,
      oldToteID: '',
      isInserted: 1,
      isDuplicate: false,
      isEdit: false,
    },
  ];
  displayedColumns: string[] = [ColumnDef.Actions, TableConstant.zone, 'locationdesc'];
  alreadySavedTotesList: SavedTote[] = [];
  dataSource = new MatTableDataSource<ToteElement>(this.elementDataTote);
  dataSourceManagedTotes = new MatTableDataSource<ToteElement>(
    this.elementDataTote
  );
  selection = new SelectionModel<ToteElement>(true, []);
  position: number = 0;
  isIMPath = false;
  public iAdminApiService: IAdminApiService;
  public iInductionManagerApi: IInductionManagerApiService;
  toteID = '';
  cellID = '';
  fromTote = '';
  toTote = '';
  userData: UserSession;
  searchAutocompleteList: ToteTypeAheadItem[] = [];
  searchAutocompleteListFiltered1: ToteTypeAheadItem[] = [];
  searchAutocompleteListFiltered2: ToteTypeAheadItem[] = [];
  hideRequiredControl = new FormControl(false);
  imPreferences: { printDirectly: boolean } = { printDirectly: false };
  onDestroy$: Subject<boolean> = new Subject();
  @ViewChild(MatAutocompleteTrigger)
  autocompleteInventory1: MatAutocompleteTrigger;
  @ViewChild(MatAutocompleteTrigger)
  autocompleteInventory2: MatAutocompleteTrigger;
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  addRow() {
    this.isRowAdded = true;
    this.elementDataTote.unshift({
      toteID: '',
      cells: '',
      position: this.elementDataTote.length - 1,
      oldToteID: '',
      isInserted: 0,
      isDuplicate: false,
      isEdit: false,
    });
    this.dataSourceManagedTotes = new MatTableDataSource<ToteElement>(
      this.elementDataTote
    );
    const lastIndex = this.elementDataTote.length - 1;

    setTimeout(() => {
      const inputElements = this.category_category.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[lastIndex]
          .nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }
  printTote(type: string, element: ToteElement): void {
    let ident = 0;
    let sTote = '';
    let eTote = '';
    let batch = '';
    let ToteID = element?.toteID ?? '';
    if (type.toLowerCase() === 'tote') {
      //print single tote id
      sTote = ' ';
      eTote = ' ';
      batch = ' ';
    } else if (type.toLowerCase() === 'batch') {
      // print batch
      ToteID = ' ';
      sTote = ' ';
      eTote = ' ';
    } else {
      //print range tote id
      ident = 1;
      ToteID = ' ';
      batch = ' ';
    }

    this.printApiService.PrintPrevToteManLabel(ToteID, ident, sTote, eTote, batch);
  }
  printRange(): void {
    const ident = 1;
    const ToteID = '';
    const batch = '';
    const sTote = this.fromTote;
    const eTote = this.toTote;

    if (this.imPreferences.printDirectly) {
      this.printApiService.PrintPrevToteManLabel(ToteID, ident, sTote, eTote, batch);
    } else {
      window.open(
        `/#/report-view?file=FileName:PrintPrevToteManLabel|ToteID:${ToteID}|Ident:${ident}|FromTote:${sTote}|ToTote:${eTote}|BatchID:${batch}`,
        UniqueConstants._blank,
        'width=' +
          screen.width +
          ',height=' +
          screen.height +
          ',toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0'
      );
    }
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  getFloatLabelValue1(): FloatLabelType {
    return this.floatLabelControl1.value ?? 'auto';
  }
  getFloatLabelValue2(): FloatLabelType {
    return this.floatLabelControl2.value ?? 'auto';
  }
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ToteElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : UniqueConstants.Select} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : UniqueConstants.Select} row ${
      row.position + 1
    }`;
  }
  autocompleteSearchColumn(): void {
    this.iInductionManagerApi
      .GetFromToteTypeAhead()
      .pipe(takeUntil(this.onDestroy$))
      .pipe(
        catchError(() => {
          this.global.ShowToastr(
            ToasterType.Error,
            ToteSetupMessages.ErrorRetrievingData,
            ToasterTitle.Error
          );
          return of({ isExecuted: false, data: null });
        })
      )
      .subscribe((res: ApiResponse<ToteTypeAheadItem[]>) => {
        if (res.isExecuted && res.data) {
          this.searchAutocompleteList = res.data;
          this.searchAutocompleteListFiltered1 = res.data;
          this.searchAutocompleteListFiltered2 = res.data;
        }
      });
  }

  async saveTote(
    toteID: string,
    cells: string,
    oldToteID: string,
    isInserted: number,
    index: number
  ): Promise<void> {
    // Frontend validation: Check for duplicate tote ID in existing data
    const isDuplicateInTable = this.elementDataTote.some(
      (tote, i) => i !== index && tote.toteID === toteID && tote.isInserted === 1
    );

    if (isDuplicateInTable) {
      this.dataSourceManagedTotes.data[index].isDuplicate = true;
      this.global.ShowToastr(
        ToasterType.Error,
        ToasterMessages.ToteIDAlreadyExists,
        ToasterTitle.Error
      );
      return;
    }

    const oldTote = isInserted === 1 ? oldToteID : '';
    const searchPayload: ToteSetupPayload = {
      oldToteID: oldTote,
      toteID: toteID,
      cells: cells,
    };

    try {
      const res: HttpResponse<ApiResponse<boolean>> = await this.iAdminApiService.ToteSetupInsert(searchPayload);
      if (res.body?.data && res.body?.isExecuted) {
        this.global.ShowToastr(
          ToasterType.Success,
          isInserted === 1 ? ToteSetupMessages.UpdateSuccessful : res.body.responseMessage,
          ToasterTitle.Success
        );
        this.dataSourceManagedTotes.data[index].isDuplicate = false;
        this.isRowAdded = false;
        this.getTotes();
      } else {
        this.dataSourceManagedTotes.data[index].isDuplicate = true;
        this.global.ShowToastr(
          ToasterType.Error,
          ToasterMessages.DuplicateToteIDError,
          ToasterTitle.Error
        );
      }
    } catch (err) {
      this.dataSourceManagedTotes.data[index].isDuplicate = true;
      this.global.ShowToastr(
        ToasterType.Error,
        ToasterMessages.DuplicateToteIDError,
        ToasterTitle.Error
      );
    }
  }

  deleteTote(toteID: string, index: number): void {
    const dialogRef = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: Style.auto,
      width: Style.w480px,
      autoFocus: DialogConstants.autoFocus,
      disableClose: true,
      data: {
        mode: '',
        action: UniqueConstants.delete,
      },
    });
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === ResponseStrings.Yes) {
        const data = this.dataSourceManagedTotes.data;
        if (data[index].isDuplicate || data[index].isInserted === 0) {
          // Local delete for unsaved/duplicate rows
          this.elementDataTote.splice(index, 1);
          this.dataSourceManagedTotes = new MatTableDataSource<ToteElement>(this.elementDataTote);
          this.isRowAdded = this.elementDataTote.some((obj) => obj.isInserted === 0);
        } else {
          const deleteTotePayload = {
            toteID: toteID,
          };
          this.iAdminApiService.ToteSetupDelete(deleteTotePayload).subscribe(
            (res: ApiResponse<boolean>) => {
              if (res.data && res.isExecuted) {
                this.global.ShowToastr(
                  ToasterType.Success,
                  ToteSetupMessages.DeletedSuccessfully,
                  ToasterTitle.Success
                );
                // Find unsaved items to preserve after refresh
                const unsavedItems = this.elementDataTote.filter((obj) => obj.isInserted === 0);
                if (unsavedItems.length > 0) {
                  this.getTotes(unsavedItems);
                } else {
                  this.isRowAdded = false;
                  this.getTotes();
                }
              } else {
                this.global.ShowToastr(ToasterType.Error, ToteSetupMessages.AlreadyExists, ToasterTitle.Error);
              }
            },
            () => {}
          );
        }
      }
    });
  }

  getTotes(unsavedItems?: ToteElement[]): void {
    const itemsToPreserve = unsavedItems ? structuredClone(unsavedItems) : undefined;
    this.elementDataTote.length = 0;
    this.iAdminApiService.ToteSetup().subscribe(
      (res: ApiResponse<ToteElement[]>) => {
        if (res.data && res.isExecuted) {
          this.elementDataTote = res.data;
          for (const value of this.elementDataTote) {
            value.isInserted = 1;
            value.isDuplicate = false;
            value.oldToteID = value.toteID;
            value.isEdit = false;
          }
          // Preserve all unsaved items at the beginning of the list
          if (itemsToPreserve && itemsToPreserve.length > 0) {
            this.elementDataTote.unshift(...itemsToPreserve);
            this.isRowAdded = true;
          }
          this.dataSourceManagedTotes = new MatTableDataSource<ToteElement>(
            this.elementDataTote
          );
        } else {
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
        }
      },
      () => {}
    );
  }

  onToteChange($event: Event, position: number, cells = ''): void {
    const target = $event.target as HTMLInputElement;
    this.elementDataTote[position].isEdit = true;
    if (cells === '') {
      if (this.elementDataTote[position].toteID !== target.value) {
        this.elementDataTote[position].toteID = target.value;
      }
    } else if (this.elementDataTote[position].cells !== target.value) {
      this.elementDataTote[position].cells = target.value;
    }
  }

  selectTote(toteIDs: string | null = null, cells: string | null = null, isManagedTote = false): void {
    if (!isManagedTote) {
      if (this.toteID === '') return;
    }

    const toteIdToCheck = toteIDs ?? this.toteID;
    const exists = this.alreadySavedTotesList?.some(
      (savedTote: SavedTote) => savedTote.toteid === toteIdToCheck
    ) ?? false;

    if (exists) {
      this.global.ShowToastr(
        ToasterType.Error,
        ToteSetupMessages.ToteAlreadySetInBatch,
        ToasterTitle.Error
      );
    } else {
      let selectedTote: SelectedTote;
      if (toteIDs === null && cells === null) {
        if (!this.cellID) {
          this.global.ShowToastr(
            ToasterType.Error,
            ToteSetupMessages.ToteCellsEmpty,
            ToasterTitle.Error
          );
          return;
        }
        selectedTote = {
          toteID: this.toteID,
          cellID: this.cellID,
          position: this.position,
        };
        this.dialogRef.close(selectedTote);
      } else {
        if (!cells) {
          this.global.ShowToastr(
            ToasterType.Error,
            ToteSetupMessages.ToteCellsEmpty,
            ToasterTitle.Error
          );
          return;
        }
        selectedTote = {
          toteID: toteIDs!,
          cellID: cells,
          position: this.position,
        };
        this.isRowAdded = false;
        this.dialogRef.close(selectedTote);
      }
    }
  }

  displayedColumns1: string[] = [UniqueConstants.Select, TableConstant.zone, 'locationdesc', 'options'];
  displayedColumnsIM: string[] = [TableConstant.zone, TableConstant.locationdesc, TableConstant.options];
  dataSource1 = new MatTableDataSource<ToteElement>(this.elementDataTote);
  selection1 = new SelectionModel<ToteElement>(true, []);

  constructor(
    public dialogRef: MatDialogRef<TotesAddEditComponent>,
    public inductionManagerApi: InductionManagerApiService,
    public adminApiService: AdminApiService,
    private readonly location: Location,
    private readonly renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA) public data: TotesAddEditDialogData,
    private readonly authService: AuthService,
    private readonly global: GlobalService,
    public printApiService: PrintApiService
  ) {
    this.iAdminApiService = adminApiService;
    const pathArr = this.location.path().split('/');
    this.isIMPath = pathArr.at(-1) === 'ImToteManager';
    this.iInductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.elementDataTote.length = 0;
    this.position = this.data.position;
    this.userData = this.authService.userData();
    this.alreadySavedTotesList = this.data.alreadySavedTotes ?? [];
    this.cellID = this.data.defaultCells ?? '';
    this.getTotes();
    this.autocompleteSearchColumn();
    this.imPreferences = this.global.getImPreferences();
  }
  ngAfterViewInit(): void {
    this.fieldFocus?.nativeElement.focus();
  }

  searchAutocompleteListFilter1(): void {
    this.searchAutocompleteListFiltered1 = this.searchAutocompleteList.filter(
      (item: ToteTypeAheadItem) => item.toteID.startsWith(this.fromTote)
    );
  }

  searchAutocompleteListFilter2(): void {
    this.searchAutocompleteListFiltered2 = this.searchAutocompleteList.filter(
      (item: ToteTypeAheadItem) => item.toteID.startsWith(this.toTote)
    );
  }
}
