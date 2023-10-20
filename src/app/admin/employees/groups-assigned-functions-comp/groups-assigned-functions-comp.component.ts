import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-groups-assigned-functions-comp',
  templateUrl: './groups-assigned-functions-comp.component.html',
  styleUrls: ['./groups-assigned-functions-comp.component.scss']
})
export class GroupsAssignedFunctionsCompComponent implements OnInit {

  @Input() isGroupLookUp : boolean = false;
  @Input() unassignedFunctions;
  @Input() assignedFunctions;

  @Output() saveAssignedFuncEmit = new EventEmitter();
  @Output() addPermissionEmit = new EventEmitter();
  @Output() removePermissionEmit = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  saveAssignedFunc() {
    this.saveAssignedFuncEmit.emit();
  }

  addPermission(event) {
    this.addPermissionEmit.emit(event);
  }

  removePermission(event) {
    this.removePermissionEmit.emit(event);
  }

}
