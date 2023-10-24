import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-employees-information',
  templateUrl: './employees-information.component.html',
  styleUrls: ['./employees-information.component.scss']
})
export class EmployeesInformationComponent{

  @Input() isLookUp : boolean = false;
  @Input() env : string = '';
  @Input() empData;

  @Output() backEmpActionEmit = new EventEmitter();
  @Output() actionDialogEmit = new EventEmitter<{ value, empData, event }>();
  @Output() openDialogEmit = new EventEmitter();
  @Output() printEmpListEmit = new EventEmitter();
  @Output() updateIsLookUpEmit = new EventEmitter();



  backEmpAction() {
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
