import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FilterationColumns } from 'src/app/common/Model/pick-Tote-Manager';
import { AppliedFilterDisplay } from 'src/app/common/interface/common-interfaces';
import { FiltrationDataTypes } from 'src/app/common/enums/CommonEnums';
import { convertCamelCaseToTitleCase } from 'src/app/common/CommonHelpers/data-utils.helper';

type FilterValue = string | number | Date | boolean | null | undefined;
type FilterColumnType = string | number | Date | boolean;
type ColumnType = 'string' | 'number' | 'date' | 'datetime' | 'int' | 'boolean';

const LABELS = {
  AppliedFilters: 'Applied Filters',
  ClearFilters: 'Clear filters',
  InfoText: 'Records can be filtered by right-clicking a cell.'
};

const TOOLTIPS = {
  Expand: 'Expand to view all applied filters',
  Collapse: 'Collapse applied filters'
};

const OPERATION_DISPLAY_TEXT: Record<string, string> = {
  'Equals': 'Equals',
  'NotEquals': 'Not Equals',
  'GreaterThanOrEqual': 'Greater Than Or Equal',
  'LessThanOrEqual': 'Less Than Or Equal',
  'GreaterThan': 'Greater Than',
  'LessThan': 'Less Than',
  'Like': 'Like',
  'Contains': 'Contains',
  'NotLike': 'Not Like',
  'DoesNotContain': 'Does Not Contain',
  'Begins': 'Begins With',
  'DoesNotBegin': 'Does Not Begin With',
  'EndsWith': 'Ends With',
  'DoesNotEndWith': 'Does Not End With',
  'Between': 'Between'
};

const EMPTY_VALUE = 'Empty';

@Component({
  selector: 'app-applied-filters-display',
  templateUrl: './applied-filters-display.component.html',
  styleUrls: ['./applied-filters-display.component.scss']
})
export class AppliedFiltersDisplayComponent implements OnChanges, AfterViewInit, AfterViewChecked {
  @Input() appliedFilters: FilterationColumns[] = [];
  @Input() columnDisplayMap: Record<string, string> = {};
  @Input() showInfoText: boolean = true;
  @Input() infoText: string = LABELS.InfoText;
  
  @Output() clearAllFilters = new EventEmitter<void>();
  @Output() clearFilter = new EventEmitter<FilterationColumns>();
  @Output() viewFilters = new EventEmitter<void>();

  @ViewChild('chipsContainer', { static: false }) chipsContainer: ElementRef<HTMLDivElement>;

  readonly labels = LABELS;
  readonly tooltips = TOOLTIPS;

  displayFilters: AppliedFilterDisplay[] = [];
  isExpanded: boolean = false;
  hasFilters: boolean = false;
  showExpandButton: boolean = false;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appliedFilters']) {
      this.updateDisplayFilters();
      this.isExpanded = false;
      // Reset button state, will be updated in AfterViewChecked
      this.showExpandButton = false;
    }
  }

  ngAfterViewInit(): void {
    // Handle initial load case (when ngOnChanges doesn't fire)
    if (!this.displayFilters.length && this.appliedFilters.length > 0) {
      this.updateDisplayFilters();
    }
    this.checkScrollbar();
  }

  ngAfterViewChecked(): void {
    // Check scrollbar after view updates (when filters change or layout changes)
    if (this.hasFilters && this.chipsContainer?.nativeElement) {
      this.checkScrollbar();
    }
  }

  private checkScrollbar(): void {
    if (!this.chipsContainer?.nativeElement) {
      this.showExpandButton = false;
      return;
    }
    const element = this.chipsContainer.nativeElement;
    const hasScroll = element.scrollWidth > element.clientWidth;
    
    // Show button if scrollbar exists OR if expanded (to allow collapse)
    this.showExpandButton = hasScroll || this.isExpanded;
  }

  onViewFilters(): void {
    this.viewFilters.emit();
  }

  private updateDisplayFilters(): void {
    this.hasFilters = this.appliedFilters.length > 0;
    
    if (!this.hasFilters) {
      this.displayFilters = [];
      this.showExpandButton = false;
      return;
    }

    this.displayFilters = this.appliedFilters.map(filter => ({
      columnName: filter.ColumnName,
      columnDisplayName: this.getColumnDisplayName(filter.ColumnName),
      criteria: OPERATION_DISPLAY_TEXT[filter.GridOperation] || filter.GridOperation,
      value: this.formatFilterValue(filter.Value, filter.ColumnType),
      value2: filter.Value2 ? this.formatFilterValue(filter.Value2, filter.ColumnType) : undefined,
      filter
    }));
  }

  private getColumnDisplayName(columnName: string): string {
    if (this.columnDisplayMap && this.columnDisplayMap[columnName]) {
      return this.columnDisplayMap[columnName];
    }
    // Use common helper utility for camelCase to Title Case conversion
    return convertCamelCaseToTitleCase(columnName);
  }

  private formatFilterValue(value: FilterValue, columnType: FilterColumnType): string {
    if (value == null || value === '') {
      return EMPTY_VALUE;
    }

    const typeString = String(columnType) as ColumnType;

    if (typeString === FiltrationDataTypes.Datetime || typeString === FiltrationDataTypes.Date) {
      if (typeof value === 'string') {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
      }
    }

    return String(value);
  }

  // Toggle expand/collapse state
  toggleExpand(): void {
    if (!this.chipsContainer?.nativeElement) return;
    
    const element = this.chipsContainer.nativeElement;
    const hasScroll = element.scrollWidth > element.clientWidth;
    
    // If no scrollbar exists, auto-collapse
    if (!hasScroll && !this.isExpanded) {
      this.isExpanded = false;
      return;
    }
    
    this.isExpanded = !this.isExpanded;
    // Update button visibility after toggle
    this.checkScrollbar();
  }

  getExpandTooltip(): string {
    return this.isExpanded ? this.tooltips.Collapse : this.tooltips.Expand;
  }

  onClearAll(): void {
    this.clearAllFilters.emit();
  }

  onClearFilter(filter: FilterationColumns): void {
    this.clearFilter.emit(filter);
  }
}
