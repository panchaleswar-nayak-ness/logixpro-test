import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-om-edit-transaction',
  templateUrl: './om-edit-transaction.component.html',
  styleUrls: ['./om-edit-transaction.component.scss'],
})
export class OmEditTransactionComponent {
  @ViewChild('procfocus') procfocus: ElementRef;

  ngAfterViewInit(): void {
    this.procfocus.nativeElement.focus();
  }
}
