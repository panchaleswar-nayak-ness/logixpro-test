import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GcPrintServiceTestBeginComponent } from '../gc-print-service-test-begin/gc-print-service-test-begin.component';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-gc-print-service-test',
  templateUrl: './gc-print-service-test.component.html',
  styleUrls: []
})
export class GcPrintServiceTestComponent {
  ELEMENT_DATA = [{ select: "Xerox"},
  { select: "Brother Label"}];
  
  displayedColumns: any[] = ['select'];
  dataSource = (this.ELEMENT_DATA);
 
  ELEMENT_DATA_1 = [{ select:"Xerox Lists"},
  { select:"CutePDF"},
  { select:"Jon Desktop"}];
  displayedColumns_1: any[] = ['select'];
  dataSource_1 = (this.ELEMENT_DATA);


  constructor(private global:GlobalService) { }


  openGcBeginTest() { 
    this.global.OpenDialog(GcPrintServiceTestBeginComponent, { 
      height: 'auto',
      width: '1424px',
      autoFocus: '__non_existing_element__',
      disableClose:true, 
    })
    }

}
