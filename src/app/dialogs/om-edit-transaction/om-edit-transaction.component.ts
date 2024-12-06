import { Component, ElementRef, ViewChild } from '@angular/core';
import { Placeholders } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-om-edit-transaction',
  templateUrl: './om-edit-transaction.component.html',
  styleUrls: ['./om-edit-transaction.component.scss'],
})
export class OmEditTransactionComponent {
  placeholders = Placeholders;
  @ViewChild('procfocus') procfocus: ElementRef;

  ngAfterViewInit(): void {
    this.procfocus.nativeElement.focus();
  }
}
