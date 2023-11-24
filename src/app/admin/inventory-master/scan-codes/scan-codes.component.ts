import { Component, Input,SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms'; 
import { AuthService } from 'src/app/common/init/auth.service';
import labels from 'src/app/common/labels/labels.json';
import { ScanTypeCodeComponent } from '../../dialogs/scan-type-code/scan-type-code.component';
import { CustomValidatorService } from '../../../common/init/custom-validator.service';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { SharedService } from 'src/app/common/services/shared.service';
import { catchError, of } from 'rxjs';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { IAdminApiService } from 'src/app/common/services/admin-api/admin-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import {  ToasterTitle ,ResponseStrings,ToasterType,DialogConstants} from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-scan-codes',
  templateUrl: './scan-codes.component.html',
  styleUrls: ['./scan-codes.component.scss']
})
export class ScanCodesComponent{

  displayedColumns: string[] = ['ScanCode', 'ScanType', 'ScanRange', 'StartPosition','CodeLength','Actions'];

  @Input() scanCodes: FormGroup;

  public userData: any;
  scanCodesList: any;
  oldScanCodesList: any;
  disableButton=false;
  scanTypeList: any = [];
  scanRangeList: any =[ResponseStrings.Yes, 'No'];
  isAddRow=false;
  
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  sendNotification(e?) {
    this.notifyParent.emit(e);
  }

  public iAdminApiService: IAdminApiService;

  constructor(
    private sharedService:SharedService,
    private authService: AuthService,   
    public adminApiService: AdminApiService,
    private global:GlobalService,
    private cusValidator: CustomValidatorService
  ) {  
    this.iAdminApiService = adminApiService;
    this.userData = this.authService.userData();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.scanCodesList = [...this.scanCodes.controls['scanCode'].value];
    this.oldScanCodesList = JSON.parse(JSON.stringify(this.scanCodesList));
  }

  numberOnly(event): boolean {
    return this.cusValidator.numberOnly(event);
  }

  handleInputChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = parseFloat(inputElement.value);
    let limit = inputElement.value.trim();

    if (value < 0) {
      value = 0; // Or any other desired behavior when a negative value is entered
      inputElement.value = value.toString();
    }
    if (limit.length > 9) {
      limit = limit.slice(0, 9);
      inputElement.value = limit;
    }
    this.sharedService.updateInvMasterState(event,true)
  }

  addCatRow(){
    this.isAddRow = true;
    this.scanCodesList.unshift({scanCode: '', scanType: '', scanRange: 'No', startPosition:0, codeLength:0, isDisabled:true, isAddedNew : true});
    this.scanCodesList = [...this.scanCodesList];
    this.oldScanCodesList = JSON.parse(JSON.stringify(this.scanCodesList));
  }

  dltCategory(item, index : number){
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
    });

    dialogRef.afterClosed().subscribe(result => {
     if(result === ResponseStrings.Yes){
      if(item.scanCode && !item.isAddedNew) {
        let payLoad = {
          "itemNumber": this.scanCodes.controls['itemNumber'].value,
          "scanCode": item.scanCode,
          "scanType": item.scanType,
          "scanRange": item.scanRange,
          "startPosition": item.startPosition,
          "codeLength": item.codeLength, 
        }
        this.iAdminApiService.DeleteScanCode(payLoad).subscribe((res: any) => {
          if (res.isExecuted) {
            this.isAddRow=false
            this.global.ShowToastr(ToasterType.Success,labels.alert.delete, ToasterTitle.Success);
            this.refreshScanCodeList();
          } else{
            this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
            console.log("DeleteScanCode",res.responseMessage);
          }
        })
      } else {
        this.isAddRow = false;
        this.scanCodesList = this.scanCodesList.slice(index + 1, this.scanCodesList.length);
      }
     }
    });
  }

  saveCategory(item, scanCode, startPosition, codeLength, scanRange, scanType, index:any) { 
    let newRecord = item.isAddedNew || false;

    if(scanCode == '') {
      this.global.ShowToastr(ToasterType.Error,'Scan code not saved, scan code field must not be empty.', 'Alert!');
      return;
    }

    if(startPosition == '') {
      this.global.ShowToastr(ToasterType.Error,'Scan code not saved,Start position field must be an integer.', 'Alert!');
      return;
    }

    if(codeLength == '') {
      this.global.ShowToastr(ToasterType.Error,'Scan code not saved, Scan code field must not be empty..', 'Alert!');
      return;
    }

    if(newRecord) {
      let payLoad = {
        "itemNumber": this.scanCodes.controls['itemNumber'].value,
        "scanCode": scanCode,
        "scanType": scanType,
        "scanRange": scanRange,
        "startPosition": startPosition,
        "codeLength": codeLength, 
      }
      this.iAdminApiService.InsertScanCodes(payLoad).pipe(
        catchError((error) => {
          // Handle the error here
          console.error('An error occurred while making the API call:', error);
          // Return a fallback value or trigger further error handling if needed
          return of({ isExecuted: false,isDuplicate:true });
        })
      ).subscribe((res: any) => {
        if (res.isExecuted) {
          this.isAddRow = false
          this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
          this.refreshScanCodeList();
          this.sendNotification();
        } 
        else if(!res.isExecuted) this.global.ShowToastr(ToasterType.Error,'New Scan Code not saved!  Ensure that the scan code being added is not a duplicate and try again.', ToasterTitle.Error);
        else {
          this.global.ShowToastr(ToasterType.Error, res.responseMessage, ToasterTitle.Error);
          console.log("InsertScanCodes", res.responseMessage);
        }})
    } else if (item.scanCode != '') {
      let payLoad = {
        "itemNumber": this.scanCodes.controls['itemNumber'].value,
        "oldScanCode": this.oldScanCodesList[index].scanCode,
        "scanCode": scanCode,
        "scanType": scanType,
        "oldScanRange": this.oldScanCodesList[index].scanRange,
        "scanRange": scanRange,
        "oldStartPosition": this.oldScanCodesList[index].startPosition,
        "newStartPosition": startPosition,
        "oldCodeLength": this.oldScanCodesList[index].codeLength,
        "newCodeLength": codeLength, 
      };
      this.iAdminApiService.UpdateScanCodes(payLoad).subscribe((res: any) => {
        if (res.isExecuted) {
          this.isAddRow = false;
          this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
          this.refreshScanCodeList();
        } else {
          this.global.ShowToastr(ToasterType.Error,'Already Exists', ToasterTitle.Error);
          console.log("UpdateScanCodes",res.responseMessage);
        }
      },
      (error) => {
        const { isExecuted, ResponseMessage } = error.error;
        if (!isExecuted && ResponseMessage.indexOf('PRIMARY KEY') != -1) this.global.ShowToastr(ToasterType.Error,'Already Exists', ToasterTitle.Error);
        else console.log("UpdateScanCodes",error.responseMessage);
        this.refreshScanCodeList();
      }
      );
    }
  }
  
 
  changeScanRange(item){
    if(item.scanRange == 'No'){
      item.startPosition = 0
      item.codeLength = 0
    }
    this.sharedService.updateInvMasterState(item,true)
  }

  refreshScanCodeList(){
    let payLoad = { "itemNumber": this.scanCodes.controls['itemNumber'].value };
    this.iAdminApiService.RefreshScanCodes(payLoad).subscribe((res: any) => {
      if (res.isExecuted) {
        this.scanCodes.controls['scanCode'].setValue([...res.data]);
        res.data = res.data.map(item => { return { ...item, isDisabled: true, isAddedNew : false }; })
        this.scanCodesList = res.data;
        this.oldScanCodesList = JSON.parse(JSON.stringify(this.scanCodesList));
      } else {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("RefreshScanCodes",res.responseMessage);
      }
    });
  }

  openScanTypePopup(item){
    let dialogRef:any = this.global.OpenDialog(ScanTypeCodeComponent, {
      height: 'auto',
      width: '750px',
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        mode: '',
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        item.scanType = result
        this.sharedService.updateInvMasterState(result,true)
      }
    });
  }

  handleInputChangeInput(event: any) {
    this.sharedService.updateInvMasterState(event,true)
  }
}
