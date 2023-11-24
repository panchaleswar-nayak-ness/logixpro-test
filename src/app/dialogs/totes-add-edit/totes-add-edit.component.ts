import { SelectionModel } from '@angular/cdk/collections';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
  Renderer2,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/common/init/auth.service';

import { DeleteConfirmationComponent } from '../../admin/dialogs/delete-confirmation/delete-confirmation.component';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { GlobalService } from 'src/app/common/services/global.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IInductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api-interface';
import { InductionManagerApiService } from 'src/app/common/services/induction-manager-api/induction-manager-api.service';
import {  ToasterTitle } from 'src/app/common/constants/strings.constants';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface ToteElement {
  toteID: string;
  cells: string;
  position: number;
  oldToteID: string;
  isInserted: number;
}


@Component({
  selector: 'app-totes-add-edit',
  templateUrl: './totes-add-edit.component.html',
  styleUrls: ['./totes-add-edit.component.scss'],
})
export class TotesAddEditComponent implements OnInit {
  
  elementData: PeriodicElement[] = [
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  ];
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
  displayedColumns: string[] = ['actions', 'zone', 'locationdesc'];
  alreadySavedTotesList: any;
  dataSource = new MatTableDataSource<PeriodicElement>(this.elementData);
  dataSourceManagedTotes = new MatTableDataSource<ToteElement>(
    this.elementDataTote
  );
  selection = new SelectionModel<PeriodicElement>(true, []);
  position: any;
  isIMPath = false;
  public iAdminApiService: IAdminApiService;
  public iInductionManagerApi: IInductionManagerApiService;
  toteID = '';
  cellID = '';
  fromTote: any;
  toTote;
  userData: any;
  searchAutocompleteList: any;
  searchAutocompleteListFiltered1: any;
  searchAutocompleteListFiltered2: any;
  hideRequiredControl = new FormControl(false);
  imPreferences: any;
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
    this.dataSourceManagedTotes = new MatTableDataSource<any>(
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
  printTote(type, element) {
    let ident = 0;
    let sTote = '';
    let eTote = '';
    let batch = '';
    let ToteID = element?.toteID;
    if (type.toLowerCase() == 'tote') {
      //print single tote id
      sTote = ' ';
      eTote = ' ';
      batch = ' ';
    } else if (type.toLowerCase() == 'batch') {
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

    this.global.Print(
      `FileName:PrintPrevToteManLabel|ToteID:${ToteID}|Ident:${ident}|FromTote:${sTote}|ToTote:${eTote}|BatchID:${batch}`,
      'lbl'
    );
  }
  printRange() {
    let ident = 1;
    let ToteID = '';
    let batch = '';
    let sTote = this.fromTote;
    let eTote = this.toTote;

    if (this.imPreferences.printDirectly) {
      this.global.Print(
        `FileName:PrintPrevToteManLabel|ToteID:${ToteID}|Ident:${ident}|FromTote:${sTote}|ToTote:${eTote}|BatchID:${batch}`
      );
    } else {
      window.open(
        `/#/report-view?file=FileName:PrintPrevToteManLabel|ToteID:${ToteID}|Ident:${ident}|FromTote:${sTote}|ToTote:${eTote}|BatchID:${batch}`,
        '_blank',
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
  checkboxLabel(row?: PeriodicElement): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.position + 1
    }`;
  }
  autocompleteSearchColumn() {
    this.iInductionManagerApi
      .GetFromToteTypeAhead()
      .pipe(takeUntil(this.onDestroy$))
      .pipe(
        catchError((error) => {
          // Handle the error here
          this.global.ShowToastr(
            'error',
            'An Error occured while retrieving data.',
            'Error!'
          );
          // Return a fallback value or trigger further error handling if needed
          console.log('GetFromToteTypeAhead');
          return of({ isExecuted: false });
        })
      )
      .subscribe((res: any) => {
        if (res.isExecuted) {
          if (res.data) {
            this.searchAutocompleteList = res.data;
            this.searchAutocompleteListFiltered1 = res.data;
            this.searchAutocompleteListFiltered2 = res.data;
          }
        }
      });
  }

  async saveTote(
    toteID: any,
    cells: any,
    oldToteID: any,
    isInserted: any,
    index: any
  ) {
    let oldTote = '';
    let updateMessage = 'Update Successful';
    if (isInserted == '1') {
      oldTote = oldToteID;
    }
    let searchPayload = {
      oldToteID: oldTote,
      toteID: toteID,
      cells: cells,
    };
    try {
      let res: any = await this.iAdminApiService.ToteSetupInsert(searchPayload);
      if (res.data && res.isExecuted) {
        this.global.ShowToastr(
          'success',
          isInserted == '1' ? updateMessage : res.responseMessage,
          ToasterTitle.Success
        );
        this.dataSourceManagedTotes.data[index]['isDuplicate'] = false;
        this.isRowAdded = false;
        this.getTotes();
      } else {
        this.dataSourceManagedTotes.data[index]['isDuplicate'] = true;
        this.global.ShowToastr(
          'error',
          'Cannot set the selected tote because it is already set in the batch.',
          'Error!'
        );
      }
    } catch (err) {
      this.dataSourceManagedTotes.data[index]['isDuplicate'] = true;
      this.global.ShowToastr(
        'error',
        'Cannot set the selected tote because it is already set in the batch.',
        'Error!'
      );
    }
  }

  deleteTote(toteID: any, index) {
    const dialogRef: any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose: true,
      data: {
        mode: '',
        action: 'delete',
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == 'Yes') {
        const data = this.dataSourceManagedTotes.data;
        if (data[index]['isDuplicate'] || data[index]['isInserted'] == 0) {
          data.splice(index, 1);
          this.dataSourceManagedTotes.data = data;
          console.log(this.dataSourceManagedTotes.data);
          this.isRowAdded = false;
        } else {
          let deleteTote = {
            toteID: toteID,
          };
          this.iAdminApiService.ToteSetupDelete(deleteTote).subscribe(
            (res: any) => {
              if (res.data && res.isExecuted) {
                this.global.ShowToastr(
                  'success',
                  'Deleted successfuly',
                  ToasterTitle.Success
                );
                this.isRowAdded = false;
                let isUnsavedItem = false;
                this.dataSourceManagedTotes.data.forEach((obj) => {
                  if (obj.isInserted === 0) {
                    isUnsavedItem = true;
                  } else {
                    isUnsavedItem = false;
                  }
                });
                if (isUnsavedItem) {
                  this.getTotes(this.dataSourceManagedTotes.data);
                } else {
                  this.getTotes();
                }
              } else {
                this.global.ShowToastr('error', 'Already exists', 'Error!');
                console.log('ToteSetupDelete', res.responseMessage);
              }
            },
            (error) => {}
          );
        }
      }
    });
  }

  getTotes(item?) {
    let items: any;
    if (item) {
      items = JSON.parse(JSON.stringify(item));
    }
    this.elementDataTote.length = 0;
    this.iAdminApiService.ToteSetup().subscribe(
      (res: any) => {
        if (res.data && res.isExecuted) {
          this.elementDataTote = res.data;
          for (let value of this.elementDataTote) {
            value.isInserted = 1;
            value.isDuplicate = false;
            value.oldToteID = value.toteID;
            value.isEdit = false;
          }
          if (items) {
            this.elementDataTote.push(items[items.length - 1]);
            this.isRowAdded = true;
          }
          this.dataSourceManagedTotes = new MatTableDataSource<any>(
            this.elementDataTote
          );
        } else {
          this.global.ShowToastr('error', 'Something went wrong', 'Error!');
          console.log('ToteSetup', res.responseMessage);
        }
      },
      (error) => {}
    );
  }

  onToteChange($event, position, cells = '') {
    this.elementDataTote[position].isEdit = true;
    if (cells == '') {
      if (this.elementDataTote[position].toteID != $event.target.value) {
        this.elementDataTote[position].toteID = $event.target.value;
      }
    } else if (this.elementDataTote[position].cells != $event.target.value) {
      this.elementDataTote[position].cells = $event.target.value;
    }
  }

  selectTote(toteIDs = null, cells = null, isManagedTote = false) {
    if (!isManagedTote) {
      if (this.toteID === '') return;
    }

    let exists = false;
    for (let i = 0; i < this.alreadySavedTotesList?.length; i++) {
      if (toteIDs == null) {
        if (this.alreadySavedTotesList[i].toteid == this.toteID) {
          exists = true;
          break;
        }
      } else if (this.alreadySavedTotesList[i].toteid == toteIDs) {
        exists = true;
        break;
      }
    }

    if (exists) {
      this.global.ShowToastr(
        'error',
        'Cannot set the selected tote because it is already set in the batch.',
        'Error!'
      );
    } else {
      let selectedTote;
      if (toteIDs == null && cells == null) {
        if (!this.cellID) {
          this.global.ShowToastr(
            'error',
            'Cannot set the selected tote because it is cells is empty.',
            'Error!'
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
            'error',
            'Cannot set the selected tote because it is cells is empty.',
            'Error!'
          );
          return;
        }
        selectedTote = {
          toteID: toteIDs,
          cellID: cells,
          position: this.position,
        };
        this.isRowAdded = false;
        this.dialogRef.close(selectedTote);
      }
    }
  }

  displayedColumns1: string[] = ['select', 'zone', 'locationdesc', 'options'];
  dataSource1 = new MatTableDataSource<PeriodicElement>(this.elementData);
  selection1 = new SelectionModel<PeriodicElement>(true, []);

  constructor(
    public dialogRef: MatDialogRef<TotesAddEditComponent>,
    public inductionManagerApi: InductionManagerApiService,
    public adminApiService: AdminApiService, 
    private location: Location,
    private renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private authService: AuthService, 
    private global: GlobalService
  ) {
    this.iAdminApiService = adminApiService;
    let pathArr = this.location.path().split('/');
    this.isIMPath = pathArr[pathArr.length - 1] === 'ImToteManager';
    this.iInductionManagerApi = inductionManagerApi;
  }

  ngOnInit(): void {
    this.elementDataTote.length = 0;
    this.position = this.data.position;
    this.userData = this.authService.userData();
    this.alreadySavedTotesList = this.data.alreadySavedTotes;
    this.cellID = this.data.defaultCells ? this.data.defaultCells : 0;
    this.getTotes();
    this.autocompleteSearchColumn();
    this.imPreferences = this.global.getImPreferences();
  }
  ngAfterViewInit(): void {
    this.fieldFocus?.nativeElement.focus();
  }

  searchAutocompleteListFilter1() {
    this.searchAutocompleteListFiltered1 = this.searchAutocompleteList.filter(
      (str: any) => str.toteID.startsWith(this.fromTote)
    );
  }
  searchAutocompleteListFilter2() {
    this.searchAutocompleteListFiltered2 = this.searchAutocompleteList.filter(
      (str: any) => str.toteID.startsWith(this.toTote)
    );
  }
}
