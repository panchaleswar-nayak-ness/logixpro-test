import { Component, OnInit } from '@angular/core';
import { PickTotes } from './models/cm-markout-new-models';


@Component({
  selector: 'app-cm-markout-new',
  templateUrl: './cm-markout-new.component.html',
  styleUrls: ['./cm-markout-new.component.scss']
})
export class CmMarkoutNewComponent {

  rowSelected: PickTotes;

  constructor() {}

  onRowSelected(row: PickTotes) {  
    this.rowSelected = row;
  }


}
