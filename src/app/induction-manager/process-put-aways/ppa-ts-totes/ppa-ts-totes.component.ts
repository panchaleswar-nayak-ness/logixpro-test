import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PeriodicElement } from '../process-put-aways.component';

@Component({
  selector: 'app-ppa-ts-totes',
  templateUrl: './ppa-ts-totes.component.html',
  styleUrls: ['./ppa-ts-totes.component.scss']
})
export class PpaTsTotesComponent implements OnInit {

  @Input() actionDropDown: any;
  @Input() toteID = '';
  @Input() dataSource: any;
  @Input() displayedColumns: string[] = ['positions', 'cells', 'toteid', 'save'];
  @Input() selection = new SelectionModel<PeriodicElement>(true, []);

  @Output() funCall = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  callFun(funName:any,funParam1?:any,funParam2?:any,funParam3?:any){
    this.funCall.emit({funName:funName,funParam1:funParam1,funParam2:funParam2,funParam3:funParam3});
  }

}
