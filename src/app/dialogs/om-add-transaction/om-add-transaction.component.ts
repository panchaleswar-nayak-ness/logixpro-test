import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-om-add-transaction',
  templateUrl: './om-add-transaction.component.html',
  styleUrls: []
})
export class OmAddTransactionComponent {
  @ViewChild('proccfocus') proccfocus: ElementRef; 
  ngAfterViewInit(): void {
    this.proccfocus.nativeElement.focus();
  }
}
