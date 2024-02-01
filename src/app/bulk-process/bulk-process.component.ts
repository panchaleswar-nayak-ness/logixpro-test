import { Component, OnInit } from '@angular/core';
import { SharedService } from '../common/services/shared.service';

@Component({
  selector: 'app-bulk-process',
  templateUrl: './bulk-process.component.html',
  styleUrls: ['./bulk-process.component.scss']
})
export class BulkProcessComponent implements OnInit {
updateMenu(arg0: string,arg1: string) {
throw new Error('Method not implemented.');
}

  tabHoverColor:string = '#cf9bff3d';

  constructor(
    private sharedService: SharedService,
    ) { }
  ngOnInit(): void {
  }
}
