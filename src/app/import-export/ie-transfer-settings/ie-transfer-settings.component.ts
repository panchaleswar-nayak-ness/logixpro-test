import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/admin/dialogs/confirmation-dialog/confirmation-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ie-transfer-settings',
  templateUrl: './ie-transfer-settings.component.html',
  styleUrls: []
})
export class IeTransferSettingsComponent implements OnInit {
  @Output() back = new EventEmitter<string>();
  isDeleteVisible:any=localStorage.getItem('routeFromInduction')
  directAdmin;
  setVal
  throughOrderManager
  hideDelete

  showFilter: boolean =false;
  constructor(
    private router: Router, 
    private dialog: MatDialog,
  ) { }


  ngOnInit(): void {
    this.setVal = localStorage.getItem('routeFromOrderStatus') 
    if(this.router.url == '/OrderManager/OrderStatus' || this.setVal == 'true'){
      this.throughOrderManager = true;
      this.directAdmin = false;
    }
    else if(this.router.url == '/admin/transaction'|| this.setVal != 'true'){
      this.throughOrderManager = false;
      this.directAdmin = true;
    }
    this.hideDelete=JSON.parse(this.isDeleteVisible);

  }
  IeImportAllDialog(){
    this.dialog.open(ConfirmationDialogComponent, {
      height: 'auto',
      width: '550px',
      autoFocus: '__non_existing_element__',
      disableClose:true,
    });

  }

  retunrToPrev() {
    this.showFilter = !this.showFilter;
  }
}
