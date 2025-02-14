import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-manual-transactions',
  templateUrl: './manual-transactions.component.html',
  styleUrls: [],
})
export class ManualTransactionsComponent {
  selectedIndex: number = 0;

@HostListener('copy', ['$event'])
onCopy(event: ClipboardEvent) {
const selection = window.getSelection()?.toString().trim(); // Trim copied text
if (selection) {
  event.clipboardData?.setData('text/plain', selection);
  event.preventDefault(); // Prevent default copy behavior
}
}
}