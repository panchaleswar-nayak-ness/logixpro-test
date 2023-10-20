import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-groups-employees-group-management',
  templateUrl: './groups-employees-group-management.component.html',
  styleUrls: ['./groups-employees-group-management.component.scss']
})
export class GroupsEmployeesGroupManagementComponent implements OnInit {

  @Input() isGroupLookUp : boolean = false;
  @Input() env : string = '';
  @Input() grpData;
  @Input() updateGrpTable;
  @Input() selectedIndex : number = 0;

  @Output() backGroupActionEmit = new EventEmitter();
  @Output() actionGroupDialogEmit = new EventEmitter<{ value, grpData, event }>();
  @Output() openGroupDialogEmit = new EventEmitter();
  @Output() printSelectedEmit = new EventEmitter();
  @Output() printAllEmit = new EventEmitter();
  @Output() updateGrpLookUpEmit = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  backGroupAction() {
    this.backGroupActionEmit.emit();
  }

  actionGroupDialog(value, grpData, event) {
    this.actionGroupDialogEmit.emit({ value, grpData, event })
  }

  openGroupDialog() {
    this.openGroupDialogEmit.emit();
  }

  printSelected() {
    this.printSelectedEmit.emit();
  }

  printAll() {
    this.printAllEmit.emit();
  }
  
  updateGrpLookUp(event) {
    this.updateGrpLookUpEmit.emit(event);
  }

}
