import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-utilization-header',
  templateUrl: './utilization-header.component.html',
  styleUrls: ['./utilization-header.component.scss']
})
export class UtilizationHeaderComponent  {
  @Input() zones: any[];
  @Input() BulkVelocities: string[];
  @Input() BulkCellSizes: string[];
  @Input() isCarousel: boolean; 
  @Output() backButtonClicked = new EventEmitter<void>();
  @Output() zoneSelected = new EventEmitter<string>();
  @Output() bulkVelocitiesSelected = new EventEmitter<string>();
  @Output() bulkCellSizesSelected = new EventEmitter<string>();
  selectedBulkVelocity:string = ''
  selectedBulkCellSize: String = ''

  onBackButtonClick() {
    this.backButtonClicked.emit();
  }

  onZoneSelect(zone: string) {
    this.zoneSelected.emit(zone);
  }
  onBulkVelocitiesSelect(velocity: string) {
    this.bulkVelocitiesSelected.emit(velocity);
  }
  onBulkCellSizesSelect(cellSize: string) {
    this.bulkCellSizesSelected.emit(cellSize);
  }

}
