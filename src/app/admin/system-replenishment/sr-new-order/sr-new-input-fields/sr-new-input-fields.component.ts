import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sr-new-input-fields',
  templateUrl: './sr-new-input-fields.component.html',
  styleUrls: ['./sr-new-input-fields.component.scss']
})
export class SrNewInputFieldsComponent implements OnInit {
  @Input() numberSelectedRep: number;
  @Input() kanban: boolean;

  @Output() onChangeKanbanEmit = new EventEmitter();
  @Output() createNewOrdersListEmit = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  onChangeKanban(event) {
    this.onChangeKanbanEmit.emit(event);
  }

  createNewOrdersList() {
    this.createNewOrdersListEmit.emit(this.kanban);
  }

}
