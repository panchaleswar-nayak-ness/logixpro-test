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
  zones: any[] = [];
  BulkVelocities: string[] = [];
  BulkCellSizes: string[] = [];
  pieChartData: pieChartData[] = [];
  selectedZone:string
  selectedVelocityCode?: string;
  selectedCellSize?: string;
  isCarousel: boolean = true;

  
  

  constructor(private router: Router, public adminApiService: AdminApiService, public global: GlobalService) {}

  ngOnInit(): void {
    this.adminApiService.getAllZone().subscribe({
      next: (res: any) => {
        this.zones = res
      },
      error: (err: any) => {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.error('Error loading zones:', err);
      }
    });
    this.adminApiService.getBulkVelocityAndCellSize().subscribe({
      next: (res: any) => {
        this.BulkVelocities = res.bulkVelocities.sort((a, b) => a - b);
        this.BulkCellSizes = res.bulkCellSizes.sort();
      },
      error: (err: any) => {
        this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
        console.error('Error loading Bulkzone velocity and cellsize details:', err);
      }
    });
  }

  getRequiredZone(zone: any, velocityCode?: string, cellSize?: string) {
    this.selectedZone = zone.zone;
    this.isCarousel = zone.isCarousel
    

    let payload: any = {
        zone: this.selectedZone,
    };
    this.selectedVelocityCode = ''
    this.selectedCellSize = ''


    if (!this.isCarousel) {
        this.selectedVelocityCode = velocityCode;
        this.selectedCellSize = cellSize;
        
        payload.velocityCode = this.selectedVelocityCode;
        payload.cellSize = this.selectedCellSize;
    }

    this.adminApiService.getZoneData(payload).subscribe({
        next: (res: pieChartData[]) => {
            console.log(res)
            // Process pieChartData
            this.pieChartData = res.map((item: any) => {
                return {
                    ...item,
                    usedPercentage: Math.floor(item.usedPercentage)
                };
            });
        },
        error: (err: any) => {
            this.global.ShowToastr(ToasterType.Error, this.global.globalErrorMsg(), ToasterTitle.Error);
            console.error('Error loading zone data:', err);
        }
    });
}

handleZoneSelected(zone: any) {
  this.getRequiredZone(zone, this.selectedVelocityCode, this.selectedCellSize);
}

handleVelocitySelected(velocity: string) {
  this.getRequiredZone({ zone: this.selectedZone, isCarousel: this.isCarousel }, velocity, this.selectedCellSize);
}

handleCellSizeSelected(cellSize: string) {
  this.getRequiredZone({ zone: this.selectedZone, isCarousel: this.isCarousel }, this.selectedVelocityCode, cellSize);
}

  navigateBasedOnCondition() {
    const currentUrl = this.router.url;
    try {
      if (currentUrl.includes('report')) {
        this.router.navigate(['/admin/reports']).catch(err => {
          console.error('Navigation error:', err);
        });
      } else if (currentUrl.includes('admin/inventoryMap/utilizationDashboard')) {
        this.router.navigate(['/admin/inventoryMap']).catch(err => {
          console.error('Navigation error:', err);
        });
      } 
    } catch (err) {
      console.error('Error in navigation logic:', err);
    }
  }
}
