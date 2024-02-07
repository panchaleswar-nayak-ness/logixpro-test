import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-verify-bulk-put-away',
  templateUrl: './verify-bulk-put-away.component.html',
  styleUrls: ['./verify-bulk-put-away.component.scss']
})
export class VerifyBulkPutAwayComponent implements OnInit {
  @Output() back = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  backButton(){
    this.back.emit();
  }
}
