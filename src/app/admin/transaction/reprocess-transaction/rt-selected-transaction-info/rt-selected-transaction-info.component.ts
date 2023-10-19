import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-rt-selected-transaction-info',
  templateUrl: './rt-selected-transaction-info.component.html',
  styleUrls: ['./rt-selected-transaction-info.component.scss']
})
export class RtSelectedTransactionInfoComponent implements OnInit {

  @Input() createdBy = "";
  @Input() transactionDateTime = "";
  @Input() reason = "";
  @Input() reasonMessage = "";
  @Input() isEnabled = true;
  @Input() isHistory = true;
  @Output() openReprocessTransactionDialogueEmitter = new EventEmitter<any>();
  @Output() openReasonDialogEmitter = new EventEmitter<any>();

  constructor(
  ) { }

  ngOnInit(): void {
  }

  openReprocessTransactionDialogue(){
    this.openReprocessTransactionDialogueEmitter.emit();
  }
  
  openReasonDialog(){
    this.openReasonDialogEmitter.emit();
  }

}
