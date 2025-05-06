import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cm-route-id-management',
  templateUrl: './cm-route-id-management.component.html',
  styleUrls: ['./cm-route-id-management.component.scss']
})
export class CmRouteIdManagementComponent implements OnInit {
  RouteIDListData : any;
  constructor() { }

  ngOnInit(): void {
  }

}
