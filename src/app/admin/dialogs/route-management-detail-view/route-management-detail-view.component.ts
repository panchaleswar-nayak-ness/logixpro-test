import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpResponse } from '@angular/common/http';

import { IRouteOrder, IRouteOrderDisplay } from '../route-management-detail-view/IRouteOrder';
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { CommonApiService } from 'src/app/common/services/common-api/common-api.service';
import { GlobalService } from 'src/app/common/services/global.service';
import { DialogConstants } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-route-management-detail-view',
  templateUrl: './route-management-detail-view.component.html',
  styleUrls: ['./route-management-detail-view.component.scss']
})
export class RouteManagementDetailViewComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSort) sort!: MatSort;

  // field name mapping
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  HeadingRouteID: string  = this.fieldMappings.routeID;
  HeadingstatusDate: string  = this.fieldMappings.statusDate;
  HeadingconsolidationStatus: string  = this.fieldMappings.consolidationStatus;
  HeadingrouteIDStatus: string  = this.fieldMappings.routeIDStatus;
  HeadingconsolidationProgress: string  = this.fieldMappings.consolidationProgress;

  RouteID: any;
  StatusDate: any;
  ConsolidationStatus: any;
  ConsolidationProgress: any;
  RouteIDStatus: any;

  progressFraction: string = '0/0';
  progressPercentage: string = '0%';
  Percentage: number = 0;
  ProgressTotalValue: number = 50;

  displayedColumns: string[] = ['OrderID', 'ToteID', 'ToteStatus'];
  dataSource: MatTableDataSource<IRouteOrderDisplay> = new MatTableDataSource<IRouteOrderDisplay>();

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _liveAnnouncer: LiveAnnouncer,
    private ConsolidationApiService: ConsolidationApiService,
    public commonAPI: CommonApiService,
    private global: GlobalService
  ) {
    this.loadDetails(data.detailData);
  }

  ngOnInit(): void {
    this.extractValues();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  extractValues(): void {
    const match = this.ConsolidationProgress?.match(/^(.+)\s\((.+)\)$/);
    if (match) {
      this.progressFraction = match[1] || '0/0';
      this.progressPercentage = match[2] || '0%';
      this.Percentage = parseFloat(this.progressPercentage.replace('%', '')) || 0;
    }
  }

  loadDetails(item: any): void {
    this.RouteID = item.RouteID;
    this.StatusDate = item.StatusDate;
    this.ConsolidationStatus = item.ConsolidationStatus;
    this.ConsolidationProgress = item.ConsolidationProgress;
    this.RouteIDStatus = item.RouteIDStatus;
    this.fetchRouteIdDetails(item.RouteID);
  }

  dialogClose(): void {
    this.dialogRef.close(DialogConstants.close);
  }

  getStyling(percentage: number): { class: string, color: any } {
    return { class: 'ProgressBarStyling', color: 'var(--clr-pure-white)' };
  }

  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  async fetchRouteIdDetails(RouteID: string): Promise<void> {
    try {
      const response = await this.ConsolidationApiService.GetRouteIDDetailsData(RouteID) as HttpResponse<{ routeOrders: IRouteOrder[] }>;
      if (response?.body?.routeOrders && Array.isArray(response.body.routeOrders)) {
        const transformedData: IRouteOrderDisplay[] = response.body.routeOrders.map(item => ({
          OrderID: item.orderId || '',
          ToteID: item.toteId || 'N/A',
          ToteStatus: item.toteStatusName || 'Unknown'
        }));
        this.dataSource = new MatTableDataSource<IRouteOrderDisplay>(transformedData);
      } else {
        console.warn('Unexpected API response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching consolidation data:', error);
    }
  }
}
