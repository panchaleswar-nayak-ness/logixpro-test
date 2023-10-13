import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-open-trans-pick-mapping',
  templateUrl: './open-trans-pick-mapping.component.html',
  styleUrls: ['./open-trans-pick-mapping.component.scss']
})
export class OpenTransPickMappingComponent {
  @ViewChild('opcol_focus') opcol_focus: ElementRef;
    ELEMENT_DATA: any[] =[
      {open_transaction: ''},
      {open_transaction: ''},
      {open_transaction: ''},

      
    ]
  
      displayedColumns: string[] = ['open_transaction','xmi_node','field_type','actions'];
      tableData = this.ELEMENT_DATA
      dataSourceList:any
  

  constructor(
    private global:GlobalService,
  ) { }
 
  ngAfterViewInit(): void {
    this.opcol_focus.nativeElement.focus();
  }
  

}
