import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-import-export',
  templateUrl: './import-export.component.html',
  styleUrls: []
})
export class ImportExportComponent implements OnInit {

  constructor(
    private sharedService:SharedService
  ) { }

  ngOnInit(): void {
    let appd=JSON.parse(localStorage.getItem('availableApps') ?? '');
    this.sharedService.setMenuData(appd);
  }


}
