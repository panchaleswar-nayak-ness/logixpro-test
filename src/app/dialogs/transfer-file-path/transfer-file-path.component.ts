import { Component, ElementRef,  ViewChild } from '@angular/core';

@Component({
  selector: 'app-transfer-file-path',
  templateUrl: './transfer-file-path.component.html',
  styleUrls: ['./transfer-file-path.component.scss']
})
export class TransferFilePathComponent {
  @ViewChild('fieldFocus') fieldFocus: ElementRef;

  
  ngAfterViewInit(): void {
    this.fieldFocus?.nativeElement.focus();
  }
}
