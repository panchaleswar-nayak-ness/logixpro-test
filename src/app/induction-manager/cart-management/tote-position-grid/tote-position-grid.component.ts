import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TotePostionInfo } from '../models/cart-management-models';
import { TotePositionClasses, TotePositionTextClasses } from '../constants/string.constants';

export interface TotePosition {
  position: number;
  toteId: string;
  isSelected: boolean;
  isDisabled: boolean;
  status: string;
  cartRow: string;
  cartColumn: string;
  hasError: boolean;
}

@Component({
  selector: 'app-tote-position-grid',
  templateUrl: './tote-position-grid.component.html',
  styleUrls: ['./tote-position-grid.component.scss']
})
export class TotePositionGridComponent {
  @Input() positions: TotePosition[] = [];
  @Input() selectedPosition: number = 0;
  @Input() readonly: boolean = false;
  @Input() disabledPositions: number[] = [];
  @Input() cols;
  @Input() rows;
  @Output() positionSelect = new EventEmitter<number>();
  @Output() positionClear = new EventEmitter<number>();
  @Output() generateStorageLocationId = new EventEmitter<TotePostionInfo>();
  @Output() selectTote = new EventEmitter<string>();

  

  onPositionClick(position: number): void {
    if (this.readonly || this.isPositionDisabled(position)) {
      return;
    }
    this.positionSelect.emit(position);
    this.positionSelect.emit(position);
    this.generateStorageLocationId.emit(this.getRowAndColumn(this.rows,this.cols,position));
  }

  onPositionClear(position: number, event: Event): void {
    event.stopPropagation();
    if (this.readonly) {
      return;
    }
    this.positionClear.emit(position);
  }

  getRowAndColumn(totalRows: number, totalColumns: number, number: number) {
    if (number < 1 || number > totalRows * totalColumns) {
      throw new Error("Selected number is out of range.");
    }

    // Row is determined by dividing (0-based index) then shifting to 1-based
    const row = Math.floor((number - 1) / totalColumns) + 1;

    // Column is determined by modulus (0-based index) then shifting to 1-based
    const col = ((number - 1) % totalColumns) + 1;

    return { row, col };
  }

  isPositionSelected(position: number): boolean {
    return this.selectedPosition === position;
  }

  isPositionDisabled(position: number): boolean {
    const positionData = this.positions.find(p => p.position === position);
    return this.disabledPositions.includes(position) || 
           (positionData?.status?.toString() === 'Closed');
  }

  getPositionClass(position: TotePosition): string {

    let statusClass = this.getStatusClass(position.status);
    
    if (this.isPositionDisabled(position.position)) {
      statusClass = statusClass === "" ? TotePositionClasses.DISABLED : statusClass;
      return `${statusClass}`;
    }
    
    // Check for error state first
    if (position.hasError) {
      return TotePositionClasses.ERROR;
    }
    
    if (this.isPositionSelected(position.position)) {
      return TotePositionClasses.SELECTED;
    }
    if (position.toteId) {

      statusClass = statusClass === "" ? TotePositionClasses.FILLED : statusClass;
      return `${statusClass}`;
    }
    return TotePositionClasses.EMPTY;
  }

  getPositionNumberClass(position: TotePosition): string {
    if (this.isPositionDisabled(position.position)) {

      return TotePositionTextClasses.DISABLED;
    }
    // Check for error state first
    if (position.hasError) {
      return TotePositionTextClasses.ERROR;
    }

    if (this.isPositionSelected(position.position)) {
      return TotePositionTextClasses.SELECTED;
    }
    if (position.toteId) {
      return TotePositionTextClasses.FILLED;
    }
    return TotePositionTextClasses.EMPTY;
  }

  getStatusClass(status: string): string {
    if (!status) {
      return '';
    }
    
    switch (status.toLowerCase()) {
      case 'closed':
        return TotePositionClasses.CLOSED;
      default:
        return '';
    }
  }

  onClickTote(totePosition: TotePosition){
    this.selectTote.emit(totePosition.toteId)
  }
}
