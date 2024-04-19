import { Component, ElementRef, Inject, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import labels from 'src/app/common/labels/labels.json';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { ICommonApi } from 'src/app/common/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType ,ResponseStrings,DialogConstants,Style} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-unit-measure',
  templateUrl: './unit-measure.component.html',
  styleUrls: ['./unit-measure.component.scss']
})
export class UnitMeasureComponent implements OnInit {
  @ViewChildren('unit_name', { read: ElementRef }) unit_name: QueryList<ElementRef>;
  public unitOfMeasure_list: any;
  enableButton=[{index:-1,value:true,IsSelected:false}];


  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    private global:GlobalService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<any>)
    { this.iCommonAPI = commonAPI; }

  ngOnInit(): void {
    this.getUOM()
  }
  getUOM(){
    this.enableButton = [];
    this.iCommonAPI.getUnitOfMeasure().subscribe((res) => {
      if (res.isExecuted) {
        this.unitOfMeasure_list = res.data;

        for(let i=0;i<this.unitOfMeasure_list.length;i++)
      {
        let IsSelected:boolean = false;
        if(this.unitOfMeasure_list[i] == this.data.UOM) IsSelected = true;
        this.unitOfMeasure_list.fromDB = true;
        this.enableButton.push({index:i,value:true,IsSelected:IsSelected});
      }
      setTimeout(() => {
        const inputElements = this.unit_name.toArray();
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
          this.renderer.selectRootElement(inputElement).focus();
      }, 100)
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("getUnitOfMeasure",res.responseMessage);

      }
    });
  }
  addUMRow(row : any){
    this.unitOfMeasure_list.unshift("");
    this.enableButton.push({index:-1,value:true,IsSelected:false})

    const lastIndex = this.unitOfMeasure_list.length - 1;
    setTimeout(() => {
      const inputElements = this.unit_name.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }

  saveUnitMeasure(um : any, oldUM : any) {

    let cond = true;
    if(um){
    this.unitOfMeasure_list.forEach(element => {
      if(element.toLowerCase() == um.toLowerCase() && cond) {
        cond = false;
       this.global.ShowToastr(ToasterType.Error,'Already Exists', ToasterTitle.Error);

      }
    });
  }
    if(um && cond){
    let paylaod = {
      "newValue": um,
      "oldValue": oldUM.toString()
    }

    this.iCommonAPI.saveUnitOfMeasure(paylaod).subscribe((res) => {
      if(res.isExecuted){
        this.getUOM();
        this.global.ShowToastr(ToasterType.Success, oldUM.toString()==''?labels.alert.success:labels.alert.update, ToasterTitle.Success);
      }
      else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("saveUnitOfMeasure",res.responseMessage);
      }

    });
  }
  }

  enableDisableButton(i:any)
  {
  this.enableButton[i].value=false;
  }

  dltUnitMeasure(um : any,fromDB:any) {


    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: Style.w480px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe(result => {
     if(result === ResponseStrings.Yes){
      if(um){  //&& fromDB==true
        let paylaod = {
          "newValue": um
        }

        this.iCommonAPI.dltUnitOfMeasure(paylaod).subscribe((res) => {

          if(res.isExecuted){
            this.getUOM();
          this.global.ShowToastr(ToasterType.Success,labels.alert.delete, ToasterTitle.Success);
        }
        else{
          this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
          console.log("BatchManagerOrder:", res);
        }
        });
      } else {
        this.unitOfMeasure_list.shift();
      }
     }
    })
  }

  selectUnitMeasure(selectedUM: any){
    this.dialogRef.close(selectedUM);
  }

  clearUnitMeasure(){
    this.dialogRef.close('');
  }

}
