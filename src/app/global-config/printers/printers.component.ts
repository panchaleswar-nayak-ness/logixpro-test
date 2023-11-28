import { Component, OnInit, ElementRef, Renderer2, ViewChildren, QueryList, } from '@angular/core';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component'; 
import { AuthService } from 'src/app/common/init/auth.service';

import labels from 'src/app/common/labels/labels.json';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
import { IGlobalConfigApi } from 'src/app/common/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/common/services/globalConfig-api/global-config-api.service';
import {StringConditions , ToasterTitle, ToasterType ,ResponseStrings,DialogConstants,Style,UniqueConstants,TableConstant} from 'src/app/common/constants/strings.constants';
@Component({
  selector: 'app-printers',
  templateUrl: './printers.component.html',
  styleUrls: ['./printers.component.scss']
})
export class PrintersComponent implements OnInit {
  @ViewChildren('printerNameInput', { read: ElementRef }) printerNameInputs: QueryList<ElementRef>;


  sideBarOpen: boolean = true;
  displayedColumns: string[] = ['printerName', 'printerAddress', 'labelPrinter', 'actions'];
  running: boolean = false;
  userData: any;
  allPinters: any[] = [];
  addingNew = false;
  public  iGlobalConfigApi: IGlobalConfigApi;
  constructor(
    private global:GlobalService,
    private Api: ApiFuntions,
    public globalConfigApi: GlobalConfigApiService,
    private authService: AuthService,
    
    private renderer: Renderer2, 
    private router: Router
    
  ) { 
    this.iGlobalConfigApi = globalConfigApi;
  }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getServiceStatus();
    this.getAllPrinters();
  }

  getAllPrinters() {
    this.iGlobalConfigApi.GetAllPrinters().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.allPinters = res.data;
        this.allPinters.forEach((element: any) => {
          element.labelPrinter = element.label == "Able to Print Labels" ? ResponseStrings.Yes : "No";
          element.isNew = false;
          element.currentPrinter = element.printer;
          element.currentprinterAdd = element.printerAdd;
          element.currentlabelPrinter = element.labelPrinter;
        });
      }
      else{
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("GetAllPrinters",res.responseMessage);
      }
    });
  }

  isEdited(printer: any) {
    if ((printer.currentPrinter != printer.printer || printer.currentprinterAdd != printer.printerAdd || printer.currentlabelPrinter != printer.labelPrinter) && printer.printer.trim() != '') {
      return true;
    }
    return false;
  }

  getServiceStatus(loader: boolean = false) {
    let payload: any = {};
    this.iGlobalConfigApi.StatusPrintService(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.running = res.data;
      }
      else{
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.log("StatusPrintService",res.responseMessage);
      }
    });
  }

  startService(loader: boolean = false) {
    let payload: any = {};
    this.iGlobalConfigApi.StartPrintService(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.running = true;
        this.global.ShowToastr(ToasterType.Success,"Service start was successful.", ToasterTitle.Success);
      }
      else {
        this.global.ShowToastr(ToasterType.Error,"Service start was unsuccessful. Please try again or contact Scott Tech for support.", ToasterTitle.Error);
      }
    });
  }

  stopService(loader: boolean = false) {
    let payload: any = {};
    this.iGlobalConfigApi.StopPrintService(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.running = false;
        this.global.ShowToastr(ToasterType.Success,"Service stop was successful.", ToasterTitle.Success);
      }
      else {
        this.global.ShowToastr(ToasterTitle.Error,"Service stop encountered an error. Please try again or contact Scott Tech for support.", ToasterTitle.Error);
        console.log("StopPrintService",res.responseMessage);
      }
    });
  }

  restartService(loader: boolean = false) {
    let payload: any = {};
    this.iGlobalConfigApi.RestartPrintService(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.running = true;
        this.global.ShowToastr(ToasterType.Success,"Service restart was successful.",ToasterTitle.Success);
      }
      else {
        this.global.ShowToastr(ToasterTitle.Error,"Service restart was unsuccessful. Please try again or contact Scott Tech for support.", ToasterTitle.Error);
        console.log("RestartPrintService",res.responseMessage);
      }
    });
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  removePrinter(printer: any) {
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: Style.w560px,
      autoFocus: DialogConstants.autoFocus,
      disableClose:true,
      data: {
        mode: 'remove-printer',
        ErrorMessage: `Are you sure you wish to delete this printer: ${printer.isNew ? 'New' : printer.currentPrinter}?`,
        action: UniqueConstants.delete
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === StringConditions.Yes) {
        if (printer.isNew) {
          this.allPinters = this.allPinters.filter((item: any) => !item.isNew);
          this.addingNew = false;
        }
        else {
          let payload = {
            "printerName": printer.printer
          };
          this.iGlobalConfigApi.deletePrinter(payload).subscribe((res: any) => {
            if (res.isExecuted && res.data) {
              this.global.ShowToastr(ToasterType.Success,labels.alert.delete, ToasterTitle.Success);
              this.allPinters = this.allPinters.filter((item: any) => item.currentPrinter != printer.currentPrinter);
            } else {
              this.global.ShowToastr(ToasterType.Error,"Delete Failed", ToasterTitle.Error);
              console.log("deletePrinter",res.responseMessage);
            }
          });
        }
      }
    });
  }

  addNewPrinter() {
    this.addingNew = true;
    this.allPinters.splice(0,0,
      { 
        printer: '', 
        currentPrinter: '',
        printerAdd: '',
        currentprinterAdd: '',
        label: 'Not Able to Print Labels', 
        labelPrinter: 'No',
        currentlabelPrinter: 'No',
        isNew: true 
      }
    );
    this.allPinters = [...this.allPinters];
    const lastIndex = this.allPinters.length - 1;
    setTimeout(() => {
      const inputElements = this.printerNameInputs.toArray();
      if (inputElements.length > lastIndex) {
        const inputElement = inputElements[lastIndex].nativeElement as HTMLInputElement;
        this.renderer.selectRootElement(inputElement).focus();
      }
    });
  }

  savePrinter(printer: any) {
     
    if (printer.isNew) {
      let payload = {
        "printerName": printer.printer,
        "printerString": printer.printerAdd,
        'label': printer.labelPrinter == StringConditions.Yes 
      };
      this.iGlobalConfigApi.InsertNewPrinter(payload).subscribe((res: any) => {
        if (res.isExecuted) {
          this.global.ShowToastr(ToasterType.Success,labels.alert.success, ToasterTitle.Success);
          printer.isNew = false;
          printer.currentPrinter = printer.printer;
          printer.currentprinterAdd = printer.printerAdd;
          printer.currentlabelPrinter = printer.labelPrinter;
          this.addingNew = false;
        } else {
          this.global.ShowToastr(ToasterType.Error,res.responseMessage,ToasterTitle.Error);
          console.log("InsertNewPrinter",res.responseMessage);
        }
      });
    }
    else {
      let payload = {
        "currentPrinter": printer.currentPrinter,
        "newPrinter": printer.printer,
        "printerString": printer.printerAdd,
        'label': printer.labelPrinter == StringConditions.Yes
      };
      this.iGlobalConfigApi.UpdateCurrentPrinter(payload).subscribe((res: any) => {
        if (res.isExecuted) {
          this.global.ShowToastr(ToasterType.Success,labels.alert.update, ToasterTitle.Success);
          printer.currentPrinter = printer.printer;
          printer.currentprinterAdd = printer.printerAdd;
          printer.currentlabelPrinter = printer.labelPrinter;
        } else {
          this.global.ShowToastr(ToasterType.Error,res.responseMessage, ToasterTitle.Error);
          console.log("UpdateCurrentPrinter",res.responseMessage);
        }
      });
    }
  }

  print(printer: any) {
    if (printer.printer.trim() == '' || printer.printerAdd.trim() == '') {
      this.global.ShowToastr(ToasterType.Error,"Must specify name and address to print!", ToasterTitle.Error);
    } 
    else {
      let dialogRef2:any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: Style.w560px,
        autoFocus: DialogConstants.autoFocus,
      disableClose:true,
        data: {
          message: `Click OK to test print.`
        },
      });
      dialogRef2.afterClosed().subscribe((result) => {
        if (result == StringConditions.Yes) {
          this.global.Print(`FileName:TestPrint|islabel:${printer.labelPrinter == StringConditions.Yes}|PrinterName:${printer.printer}|PrinterAddress:${printer.printerAdd}`,'lbl'); 
        }
      });
    }
  }
}

