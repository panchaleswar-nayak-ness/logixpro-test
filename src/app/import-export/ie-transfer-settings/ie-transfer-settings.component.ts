import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes, StringConditions } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-ie-transfer-settings',
  templateUrl: './ie-transfer-settings.component.html',
  styleUrls: []
})
export class IeTransferSettingsComponent implements OnInit {
  @Output() back = new EventEmitter<string>();

  isDeleteVisible: any = localStorage.getItem('routeFromInduction')
  directAdmin;
  setVal
  throughOrderManager
  hideDelete;
  showFilter: boolean = false;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.setVal = localStorage.getItem('routeFromOrderStatus');
    if(this.router.url == AppRoutes.OrderManagerOrderStatus || this.setVal == StringConditions.True){
      this.throughOrderManager = true;
      this.directAdmin = false;
    }
    else if(this.router.url == AppRoutes.AdminTrans|| this.setVal != StringConditions.True){
      this.throughOrderManager = false;
      this.directAdmin = true;
    }
    this.hideDelete=JSON.parse(this.isDeleteVisible);
  }

  retunrToPrev() {
    this.showFilter = !this.showFilter;
  }
}
