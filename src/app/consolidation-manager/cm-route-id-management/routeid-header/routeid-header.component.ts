// Angular and RxJS imports
import { Component, EventEmitter, OnInit, Output,Input, OnDestroy ,SimpleChanges} from '@angular/core';
import { FormControl } from '@angular/forms';
import { FloatLabelType } from '@angular/material/form-field';
import { Subscription } from 'rxjs';

// Services and interfaces
import { ConsolidationApiService } from 'src/app/common/services/consolidation-api/consolidation-api.service';
import { IConsolidationApi } from 'src/app/common/services/consolidation-api/consolidation-api-interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterTitle, ToasterType, ToasterMessages } from 'src/app/common/constants/strings.constants';

// Interfaces for API response
import { IConZoneResponse } from '../routeid-header/Irouteid-header';
import { IConHeaderResponse } from '../routeid-header/Irouteid-list';
import { IConsolidationStatus } from '../routeid-header/IConsolidationStatus';
import { IRouteIdStatusCountResponse } from '../routeid-header/IRouteStatusCount';

import { HttpResponse } from '@angular/common/http';
import { FieldMappingService } from 'src/app/common/services/field-mapping/field-mapping.service';

// Interface for status card display
interface Info {
  title: string;
  value: string;
  colorClass: string;
}

@Component({
  selector: 'app-routeid-header',
  templateUrl: './routeid-header.component.html',
  styleUrls: ['./routeid-header.component.scss']
})
export class RouteidHeaderComponent implements OnInit, OnDestroy {
  // Read field mappings from local storage
  consolidationStatusCard:string;
  routeIdStatusCountCard:string;
  minThreshold = 0;
  maxThreshold = 100;
  minGap = 1;
  @Output() zoneChanged = new EventEmitter<string>();
  // Consolidation zones and thresholds
  consolidationZones: IConZoneResponse[] = [];
  Zone: string = '';
  upperThreshold: number;
  lowerThreshold: number;

  // Route status counters
  statusConNotStarted: string = '0';
  statusInConsolidation: string = '0';
  statusReadyForRelease: string = '0';
  statusReleaseRequested: string = '0';
  statusActiveRelease: string = '0';

  // Control for float label setting in form fields
  floatLabelControl = new FormControl('auto' as FloatLabelType);

  // Status summary cards for header UI
  info: Info[] = [
    { title: 'Initialized', value: '0', colorClass: 'label-blue2' },
    { title: 'Induction Started', value: '0', colorClass: 'Open-card' },
    { title: 'Complete', value: '0', colorClass: 'Compete-cart' }
  ];

  // Maps backend status names to component property names
  statusMap = {
    'Consolidation Not Started': 'statusConNotStarted',
    'In Consolidation': 'statusInConsolidation',
    'Ready For Release': 'statusReadyForRelease',
    'Release Requested': 'statusReleaseRequested',
    'Active Release': 'statusActiveRelease'
  };

  // timeout references
  private updateTimeout?: ReturnType<typeof setTimeout>;
  private subscription: Subscription = new Subscription();

  // Interface-based abstraction of API service
  public iConsolidationApi: IConsolidationApi;

  constructor(
    private global: GlobalService,
    public consolidationApiService: ConsolidationApiService,
    private fieldNameMappingService: FieldMappingService
  ) {
    // Assign concrete service to interface property
    this.iConsolidationApi = consolidationApiService;
    this.fieldNameMappingService=fieldNameMappingService;
  }

  // OnInit lifecycle hook
  ngOnInit(): void {
    this.setFieldNameMapping();
    this.loadConsolidationZones(); // Load zones on component initialization
  }
 
    private setFieldNameMapping(){
    const fieldMapping = this.fieldNameMappingService.getFieldMappingAlias();
    if (fieldMapping) {
    this.consolidationStatusCard = fieldMapping.consolidationStatusCard;
    this.routeIdStatusCountCard = fieldMapping.routeIdStatusCountCard;
    }
  }
  // OnDestroy lifecycle hook to clean up resources
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // Fetch list of consolidation zones from API
  loadConsolidationZones() {
    this.iConsolidationApi.GetConZones().then((response: HttpResponse<IConZoneResponse[]>) => {
      if (response?.body) {
        this.consolidationZones = response.body;
        const selectedZone = this.consolidationZones[0];
        this.Zone = selectedZone.resource.description;
        this.onSelectionChange(this.Zone); // Trigger data load for first zone
      } else {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.Consolidationzones, ToasterTitle.Error);
      }
    }).catch(console.error);
  }

  // Triggered when user selects a different zone
  onSelectionChange(value: string) {
    this.zoneChanged.emit(value); // Emit zone value to parent
    this.loadSelectedConZoneData(value); // Load thresholds, statuses, etc.
  }

  // Load all data associated with a selected zone
  loadSelectedConZoneData(selectedZone: string) {
    if (!selectedZone) return;
    this.loadthresholds(selectedZone);
    this.loadConsolidationStatus(selectedZone);
    this.loadRouteIDStatusCount(selectedZone);
  }

  // Load threshold values for selected zone
  loadthresholds(selectedZone: string) {
    const matchedZone = this.consolidationZones.find(
      zone => zone.resource.description === selectedZone
    );
    if (matchedZone) {
      this.upperThreshold = matchedZone.resource.autoReleaseUpperThreshold;
      this.lowerThreshold = matchedZone.resource.autoReleaseLowerThreshold;
    }
  }

  // Load header card values for consolidation status
  loadConsolidationStatus(selectedZone: string) {
    this.iConsolidationApi.GetSelectedConZoneData(selectedZone).then((response: HttpResponse<IConsolidationStatus>) => {
      if (response?.body) {
        const statusCounts = response.body.consolidationStatusCounts;

        if (Array.isArray(statusCounts)) {
          this.info.forEach(infoItem => {
            const match = statusCounts.find(status => status.statusName === infoItem.title);
            infoItem.value = match ? match.count.toString() : '0';
          });
        } else {
          console.error("Expected consolidationStatusCounts to be an array.");
        }
      } else {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.Consolidationstatuscount, ToasterTitle.Error);
      }
    }).catch(() => {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.Consolidationstatuscount, ToasterTitle.Error);
    });
  }

  // Load header card values for route ID statuses
  loadRouteIDStatusCount(selectedZone: string): void {
    this.iConsolidationApi.GetSelectedConZoneRouteIDCount(selectedZone).then((response: HttpResponse<IRouteIdStatusCountResponse>) => {
      if (response?.body) {
        const counts = response.body.routeIdStatusCounts;

        if (Array.isArray(counts)) {
          Object.keys(this.statusMap).forEach(status => {
            const count = counts.find(c => c.statusName === status)?.count ?? 0;
            this[this.statusMap[status]] = count.toString();
          });
        } else {
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.RouteidCount, ToasterTitle.Error);
        }
      } else {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.RouteidCount, ToasterTitle.Error);
      }
    }).catch(() => {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.RouteidCount, ToasterTitle.Error);
    });
  }

  // Update thresholds in the backend
  async updateConZone() {
    const payload = {
      UpperThreshold: this.upperThreshold,
      LowerThreshold: this.lowerThreshold
    };
    try {
      const res = await this.iConsolidationApi.updateSelectedConZoneData(this.Zone, payload);
      if (res) {
        this.global.ShowToastr(ToasterType.Success, "Threshold updated successfully", ToasterTitle.Success);
      } else {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.ConsolidationThreshold, ToasterTitle.Error);
      }
    } catch {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.ConsolidationThreshold, ToasterTitle.Error);
    }
  }

  // Utility method to delay execution to the next JavaScript tick.
// This is useful for UI components (like sliders) that may not refresh properly
// if threshold values are updated immediately during input event handlers.
private correctThresholdLater(setFn: () => void): void {
  setTimeout(setFn, 0);
}

adjustUpperThreshold(value: number | null): void {
  // Clamp input to valid threshold range
  const newValue = this.clamp(value, this.minThreshold, this.maxThreshold);

  if (newValue <= this.lowerThreshold) {
    // If the new upper threshold would cross the lower threshold,
    // defer the correction to prevent slider handle overlap.
    this.correctThresholdLater(() => {
      this.upperThreshold = Math.min(this.lowerThreshold + this.minGap, this.maxThreshold);
    });
  } else {
    // Valid position: set it directly
    this.upperThreshold = newValue;
  }

  // Trigger debounced update (e.g. for API call or UI refresh)
  this.debounceUpdate();
}

adjustLowerThreshold(value: number | null): void {
  // Clamp input to valid threshold range
  const newValue = this.clamp(value, this.minThreshold, this.maxThreshold);

  if (newValue >= this.upperThreshold) {
    // If the new lower threshold would cross the upper threshold,
    // defer the correction to prevent slider handle overlap.
    this.correctThresholdLater(() => {
      this.lowerThreshold = Math.max(this.upperThreshold - this.minGap, this.minThreshold);
    });
  } else {
    // Valid position: set it directly
    this.lowerThreshold = newValue;
  }

  // Trigger debounced update (e.g. for API call or UI refresh)
  this.debounceUpdate();
}

  
  clamp(val: number | null, min: number, max: number): number {
    const value = val ?? 0;
    return Math.min(Math.max(value, min), max);
  }
  
  
  // Delay updating backend to avoid rapid API calls
  debounceUpdate() {
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => this.updateConZone(), 500);
  }

  // For *ngFor trackBy
  trackByTitle(index: number, item: Info): string {
    return item.title;
  }
  // Get current value for float label mode
  getFloatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value ?? 'auto';
  }
}
