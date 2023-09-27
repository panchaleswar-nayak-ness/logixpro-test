import { Component, OnInit, ElementRef, Renderer2, ViewChildren, QueryList, } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationComponent } from 'src/app/admin/dialogs/delete-confirmation/delete-confirmation.component'; 
import { AuthService } from 'src/app/init/auth.service';
import { ToastrService } from 'ngx-toastr';
import labels from '../../labels/labels.json'
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ApiFuntions } from 'src/app/services/ApiFuntions';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/common/services/global.service';

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

  constructor(
    private dialog: MatDialog,
    private Api: ApiFuntions,
    private authService: AuthService,
    private toastr: ToastrService,
    private renderer: Renderer2,
    private global:GlobalService,
    private router: Router
    
  ) { }

  ngOnInit(): void {
    this.userData = this.authService.userData();
    this.getServiceStatus();
    this.GetAllPrinters();
  }

  GetAllPrinters() {
    let payload = {
      "userName": this.userData.userName,
      "wsid": this.userData.wsid,
      "appName": ""
    };
    this.Api.GetAllPrinters(payload).subscribe((res: any) => {
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
    this.Api.StatusPrintService(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.running = res.data;
      }
    });
  }

  startService(loader: boolean = false) {
    let payload: any = {};
    this.Api.StartPrintService(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.running = true;
        this.toastr.success("Service start was successful.", 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
      else {
        this.toastr.error("Service start was unsuccessful. Please try again or contact Scott Tech for support.", 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    });
  }

  stopService(loader: boolean = false) {
    let payload: any = {};
    this.Api.StopPrintService(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.running = false;
        this.toastr.success("Service stop was successful.", 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
      else {
        this.toastr.error("Service stop encountered an error. Please try again or contact Scott Tech for support.", 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    });
  }

  restartService(loader: boolean = false) {
    let payload: any = {};
    this.Api.RestartPrintService(payload).subscribe((res: any) => {
      if (res.isExecuted && res.data) {
        this.running = true;
        this.toastr.success("Service restart was successful.", 'Success!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
      else {
        this.toastr.error("Service restart was unsuccessful. Please try again or contact Scott Tech for support.", 'Error!', {
          positionClass: 'toast-bottom-right',
          timeOut: 2000
        });
      }
    });
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  RemovePrinter(printer: any) {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
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
          this.Api.deletePrinter(payload).subscribe((res: any) => {
            if (res.isExecuted && res.data) {
              this.toastr.success(labels.alert.delete, 'Success!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
              this.allPinters = this.allPinters.filter((item: any) => item.currentPrinter != printer.currentPrinter);
            } else {
              this.toastr.error("Delete Failed", 'Error!', {
                positionClass: 'toast-bottom-right',
                timeOut: 2000
              });
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
      this.Api.InsertNewPrinter(payload).subscribe((res: any) => {
        debugger
        if (res.isExecuted) {
          this.toastr.success(labels.alert.success, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
          printer.isNew = false;
          printer.currentPrinter = printer.printer;
          printer.currentprinterAdd = printer.printerAdd;
          printer.currentlabelPrinter = printer.labelPrinter;
          this.addingNew = false;
        } else {
          this.toastr.error(res.responseMessage, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
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
      this.Api.UpdateCurrentPrinter(payload).subscribe((res: any) => {
        if (res.isExecuted) {
          this.toastr.success(labels.alert.update, 'Success!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
          printer.currentPrinter = printer.printer;
          printer.currentprinterAdd = printer.printerAdd;
          printer.currentlabelPrinter = printer.labelPrinter;
        } else {
          this.toastr.error(res.responseMessage, 'Error!', {
            positionClass: 'toast-bottom-right',
            timeOut: 2000
          });
        }
      });
    }
  }

  Print(printer: any) {
    if (printer.printer.trim() == '' || printer.printerAdd.trim() == '') {
      this.toastr.error("Must specify name and address to print!", 'Error!', {
        positionClass: 'toast-bottom-right',
        timeOut: 2000
      });
    } 
    else {
      let dialogRef2 = this.dialog.open(ConfirmationDialogComponent, {
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

