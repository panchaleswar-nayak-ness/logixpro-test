import { Directive, Input, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appSort]'
})
export class SortDirective {
  @Input() data: any[];
  @Input() sortBy: string;
  @Output() dataChange: EventEmitter<any[]> = new EventEmitter<any[]>();

  sort(): void {
    this.data.sort((a, b) => {
      if (a[this.sortBy] > b[this.sortBy]) {
        return 1;
      } else if (a[this.sortBy] < b[this.sortBy]) {
        return -1;
      } else {
        return 0;
      }
    });

    this.dataChange.emit(this.data);
  }
}
