import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-om-edit-transaction',
  templateUrl: './om-edit-transaction.component.html',
  styleUrls: []
})
export class OmEditTransactionComponent {
  @ViewChild('proc_focus') proc_focus: ElementRef;


  
  ngAfterViewInit(): void {
    this.proc_focus.nativeElement.focus();
  }
}
