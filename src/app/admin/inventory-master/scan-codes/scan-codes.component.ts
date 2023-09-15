import { Component, OnInit, TemplateRef, ViewChild,Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms'; 
import { AuthService } from 'src/app/init/auth.service';
import { ToastrService } from 'ngx-toastr';
import labels from '../../../labels/labels.json'
import { ScanTypeCodeComponent } from '../../dialogs/scan-type-code/scan-type-code.component';
import { CustomValidatorService } from '../../../../app/init/custom-validator.service';
import { ConfirmationDialogComponent } from '../../dialogs/confirmation-dialog/confirmation-dialog.component';
import { DeleteConfirmationComponent } from '../../dialogs/delete-confirmation/delete-confirmation.component';
import { SharedService } from 'src/app/services/shared.service';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-scan-codes',
  templateUrl: './scan-codes.component.html',
  styleUrls: ['./scan-codes.component.scss']
})
export class ScanCodesComponent implements OnInit , OnChanges {

  displayedColumns: string[] = ['ScanCode', 'ScanType', 'ScanRange', 'StartPosition','CodeLength','Actions'];

  @Input() scanCodes: FormGroup;
  public userData: any;
  scanCodesList: any;
  OldscanCodesList: any;
  disableButton=false;
  scanTypeList: any = [];
  scanRangeList: any =['Yes', 'No'];
  isAddRow=false;
  @Output() notifyParent: EventEmitter<any> = new EventEmitter();
  sendNotification(e?) {
    this.notifyParent.emit(e);
  }
  

  constructor( private api:ApiFuntions, private sharedService:SharedService,
    private authService: AuthService, private toastr: ToastrService,  private dialog: MatDialog,private cusValidator: CustomValidatorService) {

    this.userData = this.authService.userData();
 //   this.getScanTypeList();

  }

  // getScanTypeList(){
  //   let paylaod = {
  //     "username": this.userData.userName,
  //     "wsid": this.userData.wsid,
  //   }
  //   this.invMasterService.get(paylaod, '/Common/ScanCodeTypes').subscribe((res: any) => {
  //     if (res.isExecuted) {
  //       this.scanTypeList = res.data;
  //     }
  //   })
  // }
  ngOnChanges(changes: SimpleChanges) {
      this.scanCodesList = [...this.scanCodes.controls['scanCode'].value];
      this.OldscanCodesList = JSON.parse(JSON.stringify(this.scanCodesList));
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

  ngOnInit(): void {
  }

  openPrintRangeDialog(){

  }
  addCatRow(e: any){
    this.isAddRow=true
    this.scanCodesList.unshift({scanCode: '', scanType: '', scanRange: 'No', startPosition:0, codeLength:0,isDisabled:true});
    this.scanCodesList = [...this.scanCodesList];
    this.OldscanCodesList = JSON.parse(JSON.stringify(this.scanCodesList));


  }

  dltCategory(item){


    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      height: 'auto',
      width: '480px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    })
    dialogRef.afterClosed().subscribe(result => {
     if(result === 'Yes'){
      if(item.scanCode){
        let paylaod = {
          "itemNumber": this.scanCodes.controls['itemNumber'].value,
          "scanCode": item.scanCode,
          "scanType": item.scanType,
          "scanRange": item.scanRange,
          "startPosition": item.startPosition,
          "codeLength": item.codeLength,
          "username": this.userData.userName,
          "wsid": this.userData.wsid,
        }
        this.api.DeleteScanCode(paylaod).subscribe((res: any) => {
          if (res.isExecuted) {
            this.isAddRow=false
            this.toastr.success(labels.alert.delete, 'Success!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
            this.refreshScanCodeList();
          } else{
            
            this.toastr.error(res.responseMessage, 'Error!', {
              positionClass: 'toast-bottom-right',
              timeOut: 2000
            });
          }
        })
      } else{
        this.isAddRow=false
        this.scanCodesList.shift();
      }
     }
    })








   
  }

  saveCategory(item, scanCode, startPosition, codeLength, scanRange, scanType,index:any){ 
    let newRecord = true;
    if(scanCode=='') {
      this.toastr.error('Scan code not saved, scan code field must not be empty.', 'Alert!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      return;
    }
    if(startPosition=='') {
      this.toastr.error('Scan code not saved,Start position field must be an integer.', 'Alert!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      return;
    }
    if(codeLength=='') {
      this.toastr.error('Scan code not saved, Scan code field must not be empty..', 'Alert!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      return;
    }
    this.scanCodes.controls['scanCode'].value.forEach(element => {
      if(element.scanCode== scanCode || (element.startPosition== startPosition && element.scanType== scanType  && element.scanRange== scanRange && element.codeLength== codeLength)){
        newRecord = false;
        return;
      }
    });

    if(!newRecord || item.scanCode=='' ){
      this.toastr.error('Already Exists', 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
      return;
    }

    else if(newRecord){
    let paylaod = {
      "itemNumber": this.scanCodes.controls['itemNumber'].value,
      "scanCode": scanCode,
      "scanType": scanType,
      "scanRange": scanRange,
      "startPosition": startPosition,
      "codeLength": codeLength,
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }
    this.api.InsertScanCodes(paylaod).pipe(
      catchError((error) => {
        // Handle the error here
        console.error('An error occurred while making the API call:', error);
        // Return a fallback value or trigger further error handling if needed
        return of({ isExecuted: false,isDuplicate:true });
      })
    ).subscribe((res: any) => {
      if (res.isExecuted) {
        this.isAddRow=false
        this.toastr.success(labels.alert.success, 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        this.refreshScanCodeList();
        this.sendNotification();
      } 
      else if(res.isDuplicate){
        this.toastr.error('New Scan Code not saved!  Ensure that the scan code being added is not a duplicate and try again.', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        
      }
      else{
        this.toastr.error(res.responseMessage, 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    })
  } else if (item.scanCode!='') {
    
    let paylaod = {
      "itemNumber": this.scanCodes.controls['itemNumber'].value,
      "oldScanCode": this.OldscanCodesList[index].scanCode,
      "scanCode": scanCode,
      "scanType": scanType,
      "oldScanRange": this.OldscanCodesList[index].scanRange,
      "scanRange": scanRange,
      "oldStartPosition": this.OldscanCodesList[index].startPosition,
      "newStartPosition": startPosition,
      "oldCodeLength": this.OldscanCodesList[index].codeLength,
      "newCodeLength": codeLength,
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }
    this.api.UpdateScanCodes(paylaod).subscribe((res: any) => {
      if (res.isExecuted) {
        this.isAddRow=false
        this.toastr.success(labels.alert.success, 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
        this.refreshScanCodeList();
      }else{
        this.toastr.error('Already Exists', 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    })
  }
  }
  
  changeScanType(e){
  
  }
  changeScanRange(item){
    if(item.scanRange == 'No'){
      item.startPosition = 0
      item.codeLength = 0
    }
    this.sharedService.updateInvMasterState(item,true)
  }

  refreshScanCodeList(){
    let paylaod = {
      "itemNumber": this.scanCodes.controls['itemNumber'].value,
      "username": this.userData.userName,
      "wsid": this.userData.wsid,
    }
    this.api.RefreshScanCodes(paylaod).subscribe((res: any) => {
      if (res.isExecuted) {

        this.scanCodes.controls['scanCode'].setValue([...res.data]);
           res.data=res.data.map(item=>{
          return { ...item, isDisabled: true };
        })
        this.scanCodesList = res.data;
        this.OldscanCodesList = JSON.parse(JSON.stringify(this.scanCodesList));
        

      }
    })
  }


  openScanTypePopup(item){
    let dialogRef = this.dialog.open(ScanTypeCodeComponent, {
      height: 'auto',
      width: '750px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: '',
      }
    })
    dialogRef.afterClosed().subscribe(result => {
      if(result){
      item.scanType = result
      this.sharedService.updateInvMasterState(result,true)
    }

    })
  }
  handleInputChangeInput(event: any) {
    this.sharedService.updateInvMasterState(event,true)
  }
}
