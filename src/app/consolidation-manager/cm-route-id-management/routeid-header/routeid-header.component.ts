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
  @Output() zoneChanged = new EventEmitter<string>();
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  consolidationStatusCard: string = this.fieldMappings.consolidationStatusCard;
  routeIDStatusCountCard: string = this.fieldMappings.routeIdStatusCountCard;
  // Consolidation zones and thresholds
  consolidationZones: IConZoneResponse[] = [];
  Zone: string = '';
  upperThreshold: number;
  lowerThreshold: number;

  // Route status counters
  StatusConNotStarted: string = '0';
  StatusInConsolidation: string = '0';
  StatusReadyForRelease: string = '0';
  StatusReleaseRequested: string = '0';
  StatusActiveRelease: string = '0';

  // Route ID list data to be passed to parent component
  RouteIDListData: {
    RouteID: string;
    StatusDate: string;
    rawStatusDate: string;
    ConsolidationStatus: string;
    RouteIDStatus: string;
    ConsolidationProgress: string;
  }[] = [];

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
    'Consolidation Not Started': 'StatusConNotStarted',
    'In Consolidation': 'StatusInConsolidation',
    'Ready For Release': 'StatusReadyForRelease',
    'Release Requested': 'StatusReleaseRequested',
    'Active Release': 'StatusActiveRelease'
  };

  // timeout references
  private updateTimeout?: ReturnType<typeof setTimeout>;
  private subscription: Subscription = new Subscription();

  // Interface-based abstraction of API service
  public iConsolidationApi: IConsolidationApi;

  constructor(
    private global: GlobalService,
    public consolidationApiService: ConsolidationApiService,
  ) {
    // Assign concrete service to interface property
    this.iConsolidationApi = consolidationApiService;
  }

  // OnInit lifecycle hook
  ngOnInit(): void {
    this.loadConsolidationZones(); // Load zones on component initialization
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

  setUpperThreshold(value: number | null) {
    let newValue = value ?? this.upperThreshold;
  
    // Clamp to valid range [0, 100]
    newValue = Math.min(Math.max(newValue, 0), 100);
  
    if (newValue <= this.lowerThreshold) {
      // Special case: trying to set upper to 0 — force to 1, lower to 0
      if (newValue === 0) {
        this.lowerThreshold = 0;
        this.upperThreshold = 1;
      } else {
        // General case: make sure upper > lower
        this.upperThreshold = newValue;
        this.lowerThreshold = newValue - 1;
      }
    } else {
      this.upperThreshold = newValue;
    }
  
    this.debounceUpdate();
  }
  
  setLowerThreshold(value: number | null) {
    let newValue = value ?? this.lowerThreshold;
  
    // Clamp to valid range [0, 100]
    newValue = Math.min(Math.max(newValue, 0), 100);
  
    if (newValue >= this.upperThreshold) {
      // Special case: trying to set lower to 100 — force to 99, upper to 100
      if (newValue === 100) {
        this.upperThreshold = 100;
        this.lowerThreshold = 99;
      } else {
        // General case: make sure lower < upper
        this.lowerThreshold = newValue;
        this.upperThreshold = newValue + 1;
      }
    } else {
      this.lowerThreshold = newValue;
    }
  
    this.debounceUpdate();
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
