import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/init/auth.service'; 
import labels from '../../../labels/labels.json';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-column-sequence-dialog',
  templateUrl: './column-sequence-dialog.component.html',
  styleUrls: ['./column-sequence-dialog.component.scss'],
})
export class ColumnSequenceDialogComponent implements OnInit {
  dialogData;
  payload;
  userData;
  unorderedCol: any = [];
  defaultCol: any = [];
  constructor(
    private Api: ApiFuntions,
    private authService: AuthService,
    public dialogRef: MatDialogRef<any>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) data,
    private dialog: MatDialog,
    
  ) {
    this.dialogData = data;
   
  }
  @ViewChild('table') table: MatTable<any>;

  ngOnInit(): void {
    this.userData=this.authService.userData()
    this.initializePayload(this.dialogData.tableName);
    this.getColumnsSeqDetail();
  }
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  addArr(index) {
    this.defaultCol.push(...this.unorderedCol.splice(index, 1));
  }

  remove(index) {
    this.unorderedCol.push(...this.defaultCol.splice(index, 1));
  }

  autofill() {
    const autoArray = [...this.unorderedCol, ...this.defaultCol];
    this.defaultCol = autoArray;
    this.unorderedCol.length = 0;
  }
  restoreCol() {
    this.defaultCol.length=0;
    this.getColumnsSeqDetail();
  }
  save() {
    this.payload.columns = this.defaultCol;
    this.saveColumnsSeq();
  }
  deleteColSeq() {

    
    
    this.Api
      .DeleteColumns(this.payload)
      .subscribe({
        next: (res: any) => {
          if (res.isExecuted) {
              this.defaultCol.length=0;
              this.getColumnsSeqDetail();
           
          } 
        },
        error: (error)=>{}
      });

  }
  initializePayload(tableName) {
    let userData = this.authService.userData();
    this.payload = {
      username: userData.userName,
      wsid: userData.wsid,
      viewName: tableName,
    };
  }

  saveColumnsSeq() {
    this.Api.SaveColumns(this.payload).subscribe(
      {next: (res: any) => {
        if (res.isExecuted) {
          this.toastr.success(labels.alert.success, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000,
          });
          this.dialogRef.close({ isExecuted: true });
        } else {
          this.dialogRef.close('');
        }
      },
      error: (error) => {
        this.toastr.error(labels.alert.went_worng, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000,
        });
        this.dialogRef.close({ isExecuted: false });
      }}
    );
  }

  getColumnsSeqDetail() {
    this.Api
      .GetColumnSequenceDetail(this.payload)
      .subscribe((res: any) => {
        this.unorderedCol = res.data?.allColumnSequence;
        if (res.data?.columnSequence.length) {
          this.defaultCol = res.data.columnSequence;

          const namesToDeleteSet = new Set(this.defaultCol);
          const newArr = this.unorderedCol.filter((name) => {
            return !namesToDeleteSet.has(name);
          });
          this.unorderedCol = newArr;
        }
      });
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) { 
    const target = event.target as HTMLElement;
    if (!this.isInputField(target) && event.key === 'a') {
      event.preventDefault();
      this.autofill();
    }
    if (!this.isInputField(target) && event.key === 'b') {
      event.preventDefault();
      this.dialogRef.close();
    }
    if (!this.isInputField(target) && event.key === 'c') {
      event.preventDefault();
      this.deleteColSeq();
    }
    if (!this.isInputField(target) && event.key === 'r') {
      event.preventDefault();
      this.restoreCol();
    }
    if (!this.isInputField(target) && event.key === 's') {
      event.preventDefault();
      this.save();
    }
  }

  isInputField(element: HTMLElement): boolean {
    return element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.isContentEditable;
  }

}
