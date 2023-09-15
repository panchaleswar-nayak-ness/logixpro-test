import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AuthService } from 'src/app/init/auth.service';
import {
  ITransactionModelIndex,
  OpenTransactionResponse,
} from 'src/app/interface/transaction'; 
import { ApiFuntions } from 'src/app/services/ApiFuntions';

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
  @Output() emitOrderTab = new EventEmitter<string>();
  // displayOrderCols : string[] = ["orderNumber", "countOfOrderNumber", "minOfPriority", "detail", "action"];
  displayOrderCols: any = []; //'position', 'name', 'weight', 'symbol'
  constructor(
    private Api:ApiFuntions,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userData = this.authService.userData();
    // this.getTransactionModelIndex();
  }
  nexScreen(event) {
    this.previousStep();
  }
  public tabChanged(tabChangeEvent: MatTabChangeEvent): void {
    this.selectedIndex = tabChangeEvent.index;
  }
  returnFromComp(event) {
    this.nextStep();
  }
  returnToOrder(event) {
   this.emitOrderTab.emit()
  }
  nextStep() {
    if (this.selectedIndex != 2) {
      this.selectedIndex = this.selectedIndex + 1;
    }
  }
  onFilterChange(event: any) {
    this.event = event;
  }
  previousStep() {
    if (this.selectedIndex != 0) {
      this.selectedIndex = this.selectedIndex - 1;
    }

  }
}
