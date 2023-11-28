import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-employees-information',
  templateUrl: './employees-information.component.html',
  styleUrls: ['./employees-information.component.scss']
})
export class EmployeesInformationComponent{

  @Input() isLookUp : boolean = false;
  @Input() env : string = '';
  @Input() empData;

  @ViewChild('matRef') matRef: MatSelect;

  @Output() backEmpActionEmit = new EventEmitter();
  @Output() actionDialogEmit = new EventEmitter<{ value, empData, event }>();
  @Output() openDialogEmit = new EventEmitter();
  @Output() printEmpListEmit = new EventEmitter();
  @Output() updateIsLookUpEmit = new EventEmitter();

  clearMatSelectList(){
    this.matRef.options.forEach((data: MatOption) => data.deselect());
  }

  backEmpAction() {
    this.clearMatSelectList();
    this.backEmpActionEmit.emit();
  }

  actionDialog(value, empData, event) {
    this.actionDialogEmit.emit({ value, empData, event });
  }

  openDialog() {
    this.openDialogEmit.emit();
  }

  printEmpList() {
    this.printEmpListEmit.emit();
  }

  updateIsLookUp(event) {
    this.updateIsLookUpEmit.emit(event);
  }

}
