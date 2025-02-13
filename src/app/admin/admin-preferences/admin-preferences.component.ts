import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-admin-preferences',
  templateUrl: './admin-preferences.component.html',
  styleUrls: []
})
export class AdminPreferencesComponent  {

@HostListener('copy', ['$event'])
onCopy(event: ClipboardEvent) {
const selection = window.getSelection()?.toString().trim(); // Trim copied text
if (selection) {
  event.clipboardData?.setData('text/plain', selection);
  event.preventDefault(); // Prevent default copy behavior
}
}
}