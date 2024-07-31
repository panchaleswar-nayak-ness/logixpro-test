import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToasterTitle, ToasterType } from 'src/app/common/constants/strings.constants';
import { pieChartData } from 'src/app/common/Model/utilization-report';
import { AdminApiService } from 'src/app/common/services/admin-api/admin-api.service';
import { GlobalService } from 'src/app/common/services/global.service';

@Component({
  selector: 'app-utilization-dashboard',
  templateUrl: './utilization-dashboard.component.html',
  styleUrls: ['./utilization-dashboard.component.scss']
})
export class UtilizationDashboardComponent implements OnInit {
  zones: string[] = [];
  pieChartData: pieChartData[] = [];
  errorMessage: string | null = null; // Property for storing error messages

  constructor(private router: Router, public adminApiService: AdminApiService, public global: GlobalService) {}

  ngOnInit(): void {
    this.adminApiService.getZones().subscribe({
      next: (res: any) => {
        this.zones = res.data;
      },
      error: (err: any) => {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.error('Error loading zones:', err);
      }
    });
  }

  getRequiredZone(zone: any) {
    this.adminApiService.getZoneData(zone).subscribe({
      next: (res: any) => {
        this.pieChartData = res.map((item: any) => {
          return {
            ...item,
            utilizedPercentage: Math.floor(item.utilizedPercentage)
          };
        });
      },
      error: (err: any) => {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.error('Error loading zone data:', err);
      }
    });
  }

  navigateBasedOnCondition() {
    const currentUrl = this.router.url;
    try {
      if (currentUrl.includes('report')) {
        this.router.navigate(['/admin/reports']).catch(err => {
          console.error('Navigation error:', err);
        });
      } else if (currentUrl.includes('admin/inventoryMaster/utilize')) {
        this.router.navigate(['/admin/inventoryMaster']).catch(err => {
          console.error('Navigation error:', err);
        });
      } else {
        // Default navigation or other conditions
      }
    } catch (err) {
      console.error('Error in navigation logic:', err);
    }
  }
}
