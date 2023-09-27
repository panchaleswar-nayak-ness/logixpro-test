import { Component, ElementRef,  ViewChild } from '@angular/core';

@Component({
  selector: 'app-transfer-file-path',
  templateUrl: './transfer-file-path.component.html',
  styleUrls: []
})
export class TransferFilePathComponent {
  @ViewChild('field_focus') field_focus: ElementRef;

  
  ngAfterViewInit(): void {
    this.field_focus.nativeElement.focus();
  }
}
