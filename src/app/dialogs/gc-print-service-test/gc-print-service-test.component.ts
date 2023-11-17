import { Component } from '@angular/core';
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
 
  PRINTER_DATA = [{ select:"Xerox Lists"},
  { select:"CutePDF"},
  { select:"Jon Desktop"}];
  displayedColumnsForSelect: any[] = ['select'];


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
