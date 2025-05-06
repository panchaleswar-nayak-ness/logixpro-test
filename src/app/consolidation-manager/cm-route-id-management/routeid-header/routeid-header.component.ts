// Angular and RxJS imports
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
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
  fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');
  consolidationStatusCard: string = this.fieldMappings.consolidationStatusCard;
  routeIDStatusCountCard: string = this.fieldMappings.routeIDStatusCountCard;

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

  // Emit updated Route ID data
  @Output() RouteIDListDataChange = new EventEmitter<typeof this.RouteIDListData>();

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

  // Interval and timeout references
  private intervalId?: ReturnType<typeof setInterval>;
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
    clearInterval(this.intervalId);
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
    this.loadSelectedConZoneData(value); // Load thresholds, statuses, etc.
    clearInterval(this.intervalId); // Reset interval
    this.fetchConsolidationTableData(value); // Initial fetch
    this.intervalId = setInterval(() => this.fetchConsolidationTableData(value), 5000); // Auto-refresh
  }

  // Load all data associated with a selected zone
  loadSelectedConZoneData(selectedZone: string) {
    if (!selectedZone) return;
    this.loadthresholds(selectedZone);
    this.loadConsolidationStatus(selectedZone);
    this.loadRouteIDStatusCount(selectedZone);
    this.fetchConsolidationTableData(selectedZone);
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
        this.global.ShowToastr(ToasterType.Success, "threshold updated successfully", ToasterTitle.Success);
      } else {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.ConsolidationThreshold, ToasterTitle.Error);
      }
    } catch {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.ConsolidationThreshold, ToasterTitle.Error);
    }
  }

  // Handle upper threshold value changes
  setUpperThreshold(value: number | null) {
    const newValue = value ?? this.upperThreshold;
    if (newValue !== this.upperThreshold) {
      this.upperThreshold = newValue;
      if (this.upperThreshold < this.lowerThreshold) this.lowerThreshold = this.upperThreshold;
      this.debounceUpdate(); // Wait before updating backend
    }
  }

  // Handle lower threshold value changes
  setLowerThreshold(value: number | null) {
    const newValue = value ?? this.lowerThreshold;
    if (newValue !== this.lowerThreshold) {
      this.lowerThreshold = newValue;
      if (this.lowerThreshold > this.upperThreshold) this.upperThreshold = this.lowerThreshold;
      this.debounceUpdate(); // Wait before updating backend
    }
  }

  // Delay updating backend to avoid rapid API calls
  debounceUpdate() {
    clearTimeout(this.updateTimeout);
    this.updateTimeout = setTimeout(() => this.updateConZone(), 500);
  }

  // Fetch route ID consolidation table data
  async fetchConsolidationTableData(selectedZone: string) {
    try {
      const response: HttpResponse<IConHeaderResponse[]> = await this.iConsolidationApi.GetSelectedConZoneConHeadersData(selectedZone);
      const fullItems = response?.body;
      if (Array.isArray(fullItems)) {
        const resources = fullItems.map(x => x.resource);
        this.processConsolidationData(resources);
      }
    } catch {
      this.global.ShowToastr(ToasterType.Error, ToasterMessages.ConheaderData, ToasterTitle.Error);
    }
  }

  // Format and emit route ID list data
  processConsolidationData(data: IConHeaderResponse['resource'][]): void {
    const newData = data.map((item) => ({
      RouteID: item.routeID,
      StatusDate: item.statusDate ? new Date(item.statusDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '',
      rawStatusDate: item.statusDate,
      ConsolidationStatus: item.consolidationStatus ?? '',
      RouteIDStatus: item.routeIdStatus ?? '',
      ConsolidationProgress: item.consolidationProgress ?? '-'
    }));

    let dataChanged = !Array.isArray(this.RouteIDListData) || JSON.stringify(this.RouteIDListData) !== JSON.stringify(newData);

    if (dataChanged) {
      this.RouteIDListData = newData;
      this.RouteIDListDataChange.emit(this.RouteIDListData); // Notify parent
    }
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
