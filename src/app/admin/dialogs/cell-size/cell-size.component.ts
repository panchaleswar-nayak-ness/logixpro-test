import { Component, OnInit, Inject, ViewChildren, ElementRef, QueryList, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr'; 
import { AuthService } from '../../../../app/init/auth.service';
import labels from '../../../labels/labels.json'
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';

@Component({
  selector: 'app-cell-size',
  templateUrl: './cell-size.component.html',
  styleUrls: []
})
export class CellSizeComponent implements OnInit {
  @ViewChildren('cell_size', { read: ElementRef }) cell_size: QueryList<ElementRef>;
  
  public cellsize_list: any;
  public userData: any;
  public currentCellValue = "";
  enableButton = [{ index: -1, value: true }];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiFuntions,
    private authService: AuthService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<any>,
    private dialog: MatDialog,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.currentCellValue = this.data.cs
    this.getCellSizeList();

  }


  getCellSizeList() {
    this.enableButton = [];
    this.api.getCellSize().subscribe((res) => {
      for(let i=0;i<res.data.length;i++){
        res.data[i].isInserted = 1;
        this.enableButton.push({ index: i, value: true });
      }
      this.cellsize_list = res.data;
      setTimeout(() => {
        const inputElements = this.cell_size.toArray();
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
          this.renderer.selectRootElement(inputElement).focus();
      }, 100);
   
    });
  }

  addczRow(row: any) {
    this.cellsize_list.unshift({ cells: '', cellTypes: '' });
    this.enableButton.push({ index: -1, value: true })
    const lastIndex = this.cellsize_list.length - 1;
    setTimeout(() => {
      const inputElements = this.cell_size.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }
  enableDisableButton(i: any) {
    this.enableButton[i].value = false;
  }
  
  saveCellSize(cell: any, cellType: any, i,isInserted:any) {

    if (cell) {
      let cond = true;
      if(isInserted!=1)
      {
        this.cellsize_list.forEach(element => {
          if (element.cells.toLowerCase() == cell.toLowerCase() && !cond) {
            cond = false;
            this.toastr.error('Cell Size already exists. Ensure any pending changes are saved before attempting to save this entry.', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
        });
      }
      

      if (cond) {
        let oldVal = this.cellsize_list[i].cells;
        let paylaod = {
          "oldCell": oldVal.toString(),
          "newCell": cell,
          "cellType": cellType,
          "username": this.userData.userName,
          "wsid": this.userData.wsid,
        }
        this.api.saveCellSize(paylaod).subscribe((res) => {
          if (res.isExecuted) {
            this.getCellSizeList();
            this.toastr.success(labels.alert.success, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
          else {
            this.toastr.error('Cell Size already exists. Ensure any pending changes are saved before attempting to save this entry.', 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
        });
      }
    } else {
      this.toastr.error('Cell Size cannot be empty', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    }
  }
  dltCellSize(cell: any, i) { 
    
    if (cell.cells != '') {
      const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
        height: 'auto',
        width: '480px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
      })
      dialogRef.afterClosed().subscribe(result => {
       if(result === 'Yes'){
        let paylaod = {
        "cell": cell.cells.toString(),
        "username": this.userData.userName,
        "wsid": this.userData.wsid,
      }
      this.api.dltCellSize(paylaod).subscribe((res) => {
        if (res.isExecuted) {
          this.getCellSizeList();
          this.toastr.success(labels.alert.delete, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
      });
       }
      })
      
    } else {
      this.cellsize_list.shift();
      this.getCellSizeList();
    }
  }

  selectCellSize(selectedCZ: any) {
    const cellExists =  this.cellsize_list.some(obj => obj.cells === selectedCZ)
    if(cellExists){
      this.dialogRef.close(selectedCZ);   
    }
    else{
      this.dialogRef.close();   
    }
    
  }
  clearCellSize() {
    this.dialogRef.close('');
  }

}
