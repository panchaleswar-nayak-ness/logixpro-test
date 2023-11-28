import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AuthService } from 'src/app/common/init/auth.service';
import { ITransactionModelIndex } from 'src/app/common/interface/transaction'; 
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';

@Component({
  selector: 'app-open-transaction',
  templateUrl: './open-transaction.component.html',
  styleUrls: ['./open-transaction.component.scss'],
})
export class OpenTransactionComponent implements OnInit {
  transactions;
  userData: any;
  transactionIndex: ITransactionModelIndex;
  selectedIndex: number = 0;
  event: any;
  displayOrderCols: any = []; 

  @Input() tabIndex:any;

  @Output() emitOrderTab = new EventEmitter<string>();

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.userData();
  }

  nexScreen() {
    this.previousStep();
  }

  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedIndex = tabChangeEvent.index;
  }

  returnFromComp() {
    this.nextStep();
  }

  returnToOrder() {
   this.emitOrderTab.emit()
  }

  nextStep() {
    if(this.selectedIndex != 2) this.selectedIndex = this.selectedIndex + 1;
  }

  onFilterChange(event: any) {
    this.event = event;
  }

  previousStep() {
    if (this.selectedIndex != 0) this.selectedIndex = this.selectedIndex - 1;
  }
}
