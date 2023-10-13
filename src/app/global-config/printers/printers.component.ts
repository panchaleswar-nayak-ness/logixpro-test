import { Component, OnInit, ElementRef, Renderer2, ViewChildren, QueryList, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component'; 
import { AuthService } from 'src/app/init/auth.service';

import labels from '../../labels/labels.json'
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';
import { IGlobalConfigApi } from 'src/app/services/globalConfig-api/global-config-api-interface';
import { GlobalConfigApiService } from 'src/app/services/globalConfig-api/global-config-api.service';

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
    this.GetAllPrinters();
  }

  GetAllPrinters() {
    this.iGlobalConfigApi.GetAllPrinters().subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.allPinters = res.data;
        this.allPinters.forEach((element: any) => {
          element.labelPrinter = element.label == "Able to Print Labels" ? "Yes" : "No";
          element.isNew = false;
          element.currentPrinter = element.printer;
          element.currentprinterAdd = element.printerAdd;
          element.currentlabelPrinter = element.labelPrinter;
        });
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
    });
  }

  startService(loader: boolean = false) {
    let payload: any = {};
    this.iGlobalConfigApi.StartPrintService(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.running = true;
        this.global.ShowToastr('success',"Service start was successful.", 'Success!');
      }
      else {
        this.global.ShowToastr('error',"Service start was unsuccessful. Please try again or contact Scott Tech for support.", 'Error!');
      }
    });
  }

  stopService(loader: boolean = false) {
    let payload: any = {};
    this.iGlobalConfigApi.StopPrintService(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.running = false;
        this.global.ShowToastr('success',"Service stop was successful.", 'Success!');
      }
      else {
        this.global.ShowToastr('error',"Service stop encountered an error. Please try again or contact Scott Tech for support.", 'Error!');
      }
    });
  }

  restartService(loader: boolean = false) {
    let payload: any = {};
    this.iGlobalConfigApi.RestartPrintService(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.running = true;
        this.global.ShowToastr('success',"Service restart was successful.", 'Success!');
      }
      else {
        this.global.ShowToastr('error',"Service restart was unsuccessful. Please try again or contact Scott Tech for support.", 'Error!');
      }
    });
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  RemovePrinter(printer: any) {
    const dialogRef:any = this.global.OpenDialog(DeleteConfirmationComponent, {
      height: 'auto',
      width: '560px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
      data: {
        mode: 'remove-printer',
        ErrorMessage: `Are you sure you wish to delete this printer: ${printer.isNew ? 'New' : printer.currentPrinter}?`,
        action: 'delete'
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'Yes') {
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
              this.global.ShowToastr('success',labels.alert.delete, 'Success!');
              this.allPinters = this.allPinters.filter((item: any) => item.currentPrinter != printer.currentPrinter);
            } else {
              this.global.ShowToastr('error',"Delete Failed", 'Error!');
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

  SavePrinter(printer: any) {
     
    if (printer.isNew) {
      let payload = {
        "printerName": printer.printer,
        "printerString": printer.printerAdd,
        "label": printer.labelPrinter == 'Yes' 
      };
      this.iGlobalConfigApi.InsertNewPrinter(payload).subscribe((res: any) => {
        debugger
        if (res.isExecuted) {
          this.global.ShowToastr('success',labels.alert.success, 'Success!');
          printer.isNew = false;
          printer.currentPrinter = printer.printer;
          printer.currentprinterAdd = printer.printerAdd;
          printer.currentlabelPrinter = printer.labelPrinter;
          this.addingNew = false;
        } else {
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
        }
      });
    }
    else {
      let payload = {
        "currentPrinter": printer.currentPrinter,
        "newPrinter": printer.printer,
        "printerString": printer.printerAdd,
        "label": printer.labelPrinter == 'Yes'
      };
      this.iGlobalConfigApi.UpdateCurrentPrinter(payload).subscribe((res: any) => {
        if (res.isExecuted) {
          this.global.ShowToastr('success',labels.alert.update, 'Success!');
          printer.currentPrinter = printer.printer;
          printer.currentprinterAdd = printer.printerAdd;
          printer.currentlabelPrinter = printer.labelPrinter;
        } else {
          this.global.ShowToastr('error',res.responseMessage, 'Error!');
        }
      });
    }
  }

  Print(printer: any) {
    if (printer.printer.trim() == '' || printer.printerAdd.trim() == '') {
      this.global.ShowToastr('error',"Must specify name and address to print!", 'Error!');
    } 
    else {
      let dialogRef2:any = this.global.OpenDialog(ConfirmationDialogComponent, {
        height: 'auto',
        width: '560px',
        autoFocus: '__non_existing_element__',
      disableClose:true,
        data: {
          message: `Click OK to test print.`
        },
      });
      dialogRef2.afterClosed().subscribe((result) => {
        if (result == 'Yes') {
          this.global.Print(`FileName:TestPrint|islabel:${printer.labelPrinter == 'Yes'}|PrinterName:${printer.printer}|PrinterAddress:${printer.printerAdd}`,'lbl'); 
        }
      });
    }
  }
}

