import { Component, ElementRef, Inject, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs'; 
import { AuthService } from '../../../common/init/auth.service';
import labels from 'src/app/common/labels/labels.json';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component'
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType ,DialogConstants,Style,UniqueConstants,StringConditions} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {
  @ViewChildren('whname', { read: ElementRef }) whname: QueryList<ElementRef>;
  public warehouseList: any;
  public userData: any;
  disableBtn
  spliUrl
  onDestroy$: Subject<boolean> = new Subject();
  @ViewChild('inputEl') public inputEl: ElementRef;
  enableButton = [{ index: -1, value: true }];

  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<any>,
    private global:GlobalService,
    private renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.iCommonAPI = commonAPI; 
  }


  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getWarehouse();
    if(this.data.check == 'fromReelDetail') this.disableBtn =true
    else this.disableBtn =false;
  }

  deleteWH(warehosue: any) { 
    if(warehosue != ''){
      let dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
        height: 'auto',
        width: Style.w480px,
        autoFocus: DialogConstants.autoFocus,
      disableClose:true,
        data: {
          mode: 'delete-warehouse',
          warehouse: warehosue,
          action: UniqueConstants.delete,
        }
      })
      dialogRef.afterClosed().pipe(takeUntil(this.onDestroy$)).subscribe(() => {
        this.getWarehouse();
      })
    }
    else{
      this.warehouseList.shift();
      this.getWarehouse();
    }
  }

  getWarehouse() {
    this.enableButton = [];
    this.iCommonAPI.GetWarehouses().subscribe((res) => {
      this.warehouseList = res.data;
      for (let i = 0; i < this.warehouseList.length; i++) {
        this.enableButton.push({ index: i, value: true });
      }
    });
  }

  addwhRow() {
    this.warehouseList.unshift([]);
    this.enableButton.push({ index: -1, value: true })
    const lastIndex = this.warehouseList.length - 1;
    setTimeout(() => {
      const inputElements = this.whname.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }

  enableDisableButton(i: any) {
    this.enableButton[i].value = false;
  }

  saveWareHouse(warehosue: any, oldWh: any) {
    let condition = true;
    this.warehouseList.forEach(element => {
      if (element == warehosue && condition) {
        condition = false
        this.global.ShowToastr(ToasterType.Error,'Conflict: Warehouse cannot be saved! Another warehouse matches the current. Please save any pending changes before attempting to save this entry.', ToasterTitle.Error);
      }
    });
    if (condition) {
      let paylaod = {
        "oldWarehouse": oldWh.toString(),
        "warehouse": warehosue
      }

      this.iCommonAPI.saveWareHouse(paylaod).subscribe((res) => {
        if(res.isExecuted){
          this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
          this.getWarehouse();
        }
        else {
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("saveWareHouse:", res.responseMessage);
        }
      });
    }
  }

  dltWareHouse(warehosue: any) {
    let paylaod = { "warehouse": warehosue }
    this.iCommonAPI.dltWareHouse(paylaod).subscribe(() => {
      this.global.ShowToastr(ToasterType.Success,labels.alert.delete, ToasterTitle.Success);
      this.getWarehouse();
    });
  }

  selectWearHouse(selectedWh: any) {
    this.dialogRef.close(selectedWh);
  }

  clearWareHouse() {
    this.dialogRef.close(StringConditions.clear);
  }
}
