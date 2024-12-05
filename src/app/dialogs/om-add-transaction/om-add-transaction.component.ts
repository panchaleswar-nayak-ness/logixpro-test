import { Component, ElementRef, ViewChild } from '@angular/core';
import { Placeholders } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-om-add-transaction',
  templateUrl: './om-add-transaction.component.html',
  styleUrls: ['./om-add-transaction.component.scss']
})
export class OmAddTransactionComponent {
  placeholders = Placeholders
  @ViewChild('proccfocus') proccfocus: ElementRef; 
  ngAfterViewInit(): void {
    this.proccfocus.nativeElement.focus();
  }
}
