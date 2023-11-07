import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sr-new-input-fields',
  templateUrl: './sr-new-input-fields.component.html',
  styleUrls: []
})
export class SrNewInputFieldsComponent {
  @Input() numberSelectedRep: number;
  @Input() kanban: boolean;

  @Output() onChangeKanbanEmit = new EventEmitter();
  @Output() createNewOrdersListEmit = new EventEmitter();

 

  onChangeKanban(event) {
    this.onChangeKanbanEmit.emit(event);
  }

  createNewOrdersList() {
    this.createNewOrdersListEmit.emit(this.kanban);
  }

}
