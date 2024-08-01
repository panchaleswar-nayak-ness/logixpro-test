import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-utilization-header',
  templateUrl: './utilization-header.component.html',
  styleUrls: ['./utilization-header.component.scss']
})
export class UtilizationHeaderComponent  {
  @Input() zones: string[];
  @Output() backButtonClicked = new EventEmitter<void>();
  @Output() zoneSelected = new EventEmitter<string>();

  onBackButtonClick() {
    this.backButtonClicked.emit();
  }

  onZoneSelect(zone: string) {
    this.zoneSelected.emit(zone);
  }

}
