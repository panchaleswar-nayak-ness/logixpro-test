import { Component, OnInit, Inject, ViewChildren, ElementRef, QueryList, Renderer2 } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
 
import { AuthService } from '../../../common/init/auth.service';
import labels from 'src/app/common/labels/labels.json';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { GlobalService } from 'src/app/common/services/global.service';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { ToasterTitle, ToasterType ,ResponseStrings,DialogConstants,Style,Column} from 'src/app/common/constants/strings.constants';


@Component({
  selector: 'app-cell-size',
  templateUrl: './cell-size.component.html',
  styleUrls: ['./cell-size.component.scss']
})
export class CellSizeComponent implements OnInit {


  
 
  public iCommonAPI : ICommonApi;
  constructor(
    public commonAPI : CommonApiService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private api: ApiFuntions,
    private authService: AuthService,
    
    public dialogRef: MatDialogRef<any>,
    private global:GlobalService,
    private renderer: Renderer2
  ) { this.iCommonAPI = commonAPI; }


  public userData: any;
  public currentCellValue = "";

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.currentCellValue = this.data.cs
    this.getCellSizeList();

  }

  enableButton = [{ index: -1, value: true }];
  @ViewChildren('cell_size', { read: ElementRef }) cell_size: QueryList<ElementRef>;
  public cellsize_list: any;
  getCellSizeList() {
    this.enableButton = [];
    this.commonAPI.getCellSize().subscribe((res) => {
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
          if (element.cells.toLowerCase() == cell.toLowerCase() && cond) {
            cond = false;
            this.global.ShowToastr(ToasterType.Error,'Cell Size already exists. Ensure any pending changes are saved before attempting to save this entry.', ToasterTitle.Error);
          }
        });
      }
      

      if (cond) {
        let oldVal = this.cellsize_list[i].cells;
        let paylaod = {
          "oldCell": oldVal.toString(),
          "newCell": cell,
          "cellType": cellType
        }
        this.iCommonAPI.saveCellSize(paylaod).subscribe((res) => {
          if (res.isExecuted) {
            this.getCellSizeList();
            this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
          }
          else {
            
            this.global.ShowToastr(ToasterType.Error,'Cell Size already exists. Ensure any pending changes are saved before attempting to save this entry.', ToasterTitle.Error);
            console.log("saveCellSize",res.responseMessage);
          }
        });
      }
    } else {
      
      this.global.ShowToastr(ToasterType.Error,'Cell Size cannot be empty', ToasterTitle.Error);
      console.log("saveCellSize");
    }
  }
  dltCellSize(cell: any, i) { 
    
    if (cell.cells != '') {
      const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
        height: 'auto',
        width: Style.w480px,
        autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      })
      dialogRef.afterClosed().subscribe(result => {
       if(result === ResponseStrings.Yes){
        let paylaod = {
          'cell': cell.cells.toString()
      }
      this.iCommonAPI.dltCellSize(paylaod).subscribe((res) => {
        if (res.isExecuted) {
          this.getCellSizeList();
          this.global.ShowToastr(ToasterType.Success,labels.alert.delete, ToasterTitle.Success);
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterType.Error);
          console.log("dltCellSize",res.responseMessage);
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
    // const cellExists =  this.cellsize_list.some(obj => obj.cells === selectedCZ)
    debugger
      this.dialogRef.close(selectedCZ);   
    
  }
  clearCellSize() {
    this.dialogRef.close(DialogConstants.close);
  }

}
