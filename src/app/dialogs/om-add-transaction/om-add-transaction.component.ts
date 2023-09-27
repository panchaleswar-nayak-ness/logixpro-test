import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-om-add-transaction',
  templateUrl: './om-add-transaction.component.html',
  styleUrls: []
})
export class OmAddTransactionComponent {
  @ViewChild('procc_focus') procc_focus: ElementRef;
 

  
  ngAfterViewInit(): void {
    this.procc_focus.nativeElement.focus();
  }
}
