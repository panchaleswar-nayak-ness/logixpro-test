import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-bp-verify-bulk-pick',
  templateUrl: './bp-verify-bulk-pick.component.html',
  styleUrls: ['./bp-verify-bulk-pick.component.scss']
})
export class BpVerifyBulkPickComponent implements OnInit {
  @Output() back = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  backButton(){
    this.back.emit();
  }
}
