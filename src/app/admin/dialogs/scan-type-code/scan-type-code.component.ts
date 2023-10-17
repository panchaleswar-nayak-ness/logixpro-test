import { Component, ElementRef, OnInit, QueryList, Renderer2, ViewChildren } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
 
import { AuthService } from '../../../../app/init/auth.service';
import labels from '../../../labels/labels.json'; 
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { ICommonApi } from 'src/app/services/common-api/common-api-interface';
import { CommonApiService } from 'src/app/services/common-api/common-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-scan-type-code',
  templateUrl: './scan-type-code.component.html',
  styleUrls: []
})
export class ScanTypeCodeComponent implements OnInit {
  @ViewChildren('scan_code_type', { read: ElementRef }) scan_code_type: QueryList<ElementRef>;

  public scanTypeCode_list: any;
  public scanTypeCode_list_Response: any;
  public userData: any;


  public iCommonAPI : ICommonApi;

  constructor(
    public commonAPI : CommonApiService,
    private global:GlobalService,
    // private Api: ApiFuntions, 
    private authService: AuthService,
    
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<any>) { this.iCommonAPI = commonAPI; }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getScanCodeType()
  }
  getScanCodeType(){
    
    this.iCommonAPI.ScanCodeTypes().subscribe((res) => {
      if (res.isExecuted) {
        this.scanTypeCode_list_Response = [...res.data];
        this.scanTypeCode_list = res.data;
        setTimeout(() => {
          const inputElements = this.scan_code_type.toArray();
          const inputElement = inputElements[0].nativeElement as HTMLInputElement;
            this.renderer.selectRootElement(inputElement).focus();
        }, 100);
  
      }
      else {
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("ScanCodeTypes:", res);
        
      }

    });
  }

  addUMRow(row : any){
    this.scanTypeCode_list.unshift("");
    const lastIndex = this.scanTypeCode_list.length - 1;
    setTimeout(() => {
      const inputElements = this.scan_code_type.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[0].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }

  saveScanCodeType(newScanCode : any, oldScanCode  : any) {

    let cond = true;
    this.scanTypeCode_list_Response.forEach(element => {
      if(element.toLowerCase() == newScanCode.toLowerCase() && cond) {
        cond = false;
       this.global.ShowToastr('error','Already Exists', 'Error!');
      }   
    });

    if(newScanCode && cond){
    let paylaod = {      
      "oldScanCodeType": oldScanCode.toString()  ,
      "scanCodeType": newScanCode
    }
    
    this.iCommonAPI.CodeTypeSave(paylaod).subscribe((res) => {
      if(res.isExecuted){
        this.getScanCodeType();
        this.global.ShowToastr('success',labels.alert.success, 'Success!');
      }
      else{
        this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
        console.log("CodeTypeSave:", res.responseMessage);
      }
  
    });
  } else {
    this.global.ShowToastr('error','Scan Codes cannot be empty', 'Error!');
    console.log("CodeTypeSave");
  }
  }

  dltScanTypeCode(newScanTypeCode : any) {

    let dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'dltScanTypeCode',
        ErrorMessage: `Are you sure you want to delete Scan Type ${newScanTypeCode}?`,
        action: 'delete'
      },
    })
    dialogRef.afterClosed().subscribe(result => {
      if (result == 'Yes') {
        if(newScanTypeCode){
          let paylaod = {
            "scanCodeType": newScanTypeCode
          }
          
          this.iCommonAPI.ScanCodeTypeDelete(paylaod).subscribe((res) => {
            if(res.isExecuted){
              this.getScanCodeType();
            this.global.ShowToastr('success',labels.alert.delete, 'Success!');
          }
          else {
            this.global.ShowToastr('error', this.global.globalErrorMsg(), 'Error!');
            console.log("ScanCodeTypeDelete:", res.responseMessage);
          }
          });
        } else {
          this.scanTypeCode_list.shift();
        }
      }
    })
    
  }

  selectScanTypeCode(selectedrecord: any){

    let notselected = true;
    this.scanTypeCode_list_Response.forEach(element => {
      if(element.toLowerCase() == selectedrecord.toLowerCase() && notselected ) {
        notselected = false;
        this.dialogRef.close(selectedrecord);
       
      }   
    });
    if(notselected){
      this.global.ShowToastr('error','Please save the record first.', 'Error!');
    }

  }

  clearScanTypeCode(){
    this.dialogRef.close('');
  }

}