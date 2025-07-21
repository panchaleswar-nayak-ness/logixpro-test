import {
    Component,
    ElementRef,
    Inject,
    OnInit,
    OnDestroy,
    ViewChild,
  } from '@angular/core';
  import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
  import { MatInput } from '@angular/material/input';
  import { Subscription } from 'rxjs';
  import { GlobalService } from 'src/app/common/services/global.service';
  import { FilterType, QuantityFilterTypeUnion } from 'src/app/common/enums/CommonEnums';
  import { ToasterMessages } from 'src/app/common/constants/strings.constants';

export interface TotalQuantityFilter {
  filterType: QuantityFilterTypeUnion;
  value?: number;
  lowerBound?: number;
  upperBound?: number;
}

export interface FilterTotalQuantityDialogData {
  TotalQuantityFilter?: TotalQuantityFilter;
}

@Component({
  selector: 'app-filter-total-quantity',
  templateUrl: './filter-total-quantity.component.html',
  styleUrls: ['./filter-total-quantity.component.scss'],
})
export class FilterTotalQuantityComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: FilterTotalQuantityDialogData,
    private global: GlobalService,
    public dialogRef: MatDialogRef<FilterTotalQuantityComponent>
  ) {}

  @ViewChild('myText', { static: true }) myText: ElementRef;
  @ViewChild('quantityInput') quantityInput: ElementRef;
  totalQuantityFilter: string[] = [];
  subscription: Subscription[];
  filterType: QuantityFilterTypeUnion = FilterType.Equals;
  quantityValue: string = '';
  quantityRange: { lowerBound: string; upperBound: string } = { lowerBound: '', upperBound: '' };

  ngOnInit(): void {
    if (this.data.TotalQuantityFilter) {
      // Parse existing filter data if available
      if (typeof this.data.TotalQuantityFilter === 'object') {
        this.filterType = this.data.TotalQuantityFilter.filterType || FilterType.Equals;
        this.quantityValue = this.data.TotalQuantityFilter.value?.toString() || '';
        this.quantityRange = {
          lowerBound: this.data.TotalQuantityFilter.lowerBound?.toString() || '',
          upperBound: this.data.TotalQuantityFilter.upperBound?.toString() || ''
        };
      } else {
        // Handle legacy string array format
        this.totalQuantityFilter = this.data.TotalQuantityFilter;
        if (this.myText && this.totalQuantityFilter.length > 0) {
          this.myText.nativeElement.value = this.totalQuantityFilter.join('\n');
        }
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.forEach(sub => sub.unsubscribe());
    }
  }

  onPaste(event: ClipboardEvent) {
    if (event && event.clipboardData) {
      const pastedText = event.clipboardData.getData('text');
      this.totalQuantityFilter = pastedText.split('\n');
    }
  }

  onInput(content: string) {
    if (content && content !== '') {
      this.totalQuantityFilter = content.split('\n');
    } else {
      this.totalQuantityFilter = [];
    }
  }

  close() {
    this.dialogRef.close();
  }

  applyFilter() {
    if (this.filterType === FilterType.Range) {
      this.handleRangeFilter();
      return;
    }
    this.handleSingleValueFilter();
  }

  private handleRangeFilter(): void {
    const { lowerBound, upperBound } = this.quantityRange;

    if (!lowerBound || !upperBound) {
      this.showInfoToast(ToasterMessages.LowerBoundAndUpperBoundRequired);
      return;
    }

    const lower = parseFloat(lowerBound);
    const upper = parseFloat(upperBound);

    if (isNaN(lower) || isNaN(upper) || lower > upper) {
      this.showInfoToast(ToasterMessages.LowerBoundCannotBeGreater);
      return;
    }

    const filterData: TotalQuantityFilter = {
      filterType: FilterType.Range,
      lowerBound: lower,
      upperBound: upper
    };

    this.dialogRef.close({ totalQuantityFilter: filterData });
  }

  private handleSingleValueFilter(): void {
    const value = String(this.quantityValue).trim();

    if (!value) {
      this.showInfoToast(ToasterMessages.EnterQuantityValueBeforeApplying);
      return;
    }

    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0) {
      this.showInfoToast(ToasterMessages.EnterValidPositiveQuantity);
      return;
    }

    const filterData: TotalQuantityFilter = {
      filterType: this.filterType,
      value: numericValue
    };

    this.dialogRef.close({ totalQuantityFilter: filterData });
  }

  private showInfoToast(message: string): void {
    this.global.ShowToastr('info', message, 'Info');
  }

  clearFilters() {
    this.quantityValue = '';
    this.quantityRange = { lowerBound: '', upperBound: '' };
    this.totalQuantityFilter = [];
    
    if (this.myText) {
      this.myText.nativeElement.value = '';
    }

    this.dialogRef.close({ 
      totalQuantityFilter: null, 
      isFilterByTotalQuantity: true 
    });
  }

  getFilterTypeLabel(): string {
    switch (this.filterType) {
      case FilterType.Equals: return 'Total Quantity Equals To';
      case FilterType.GreaterThan: return 'Total Quantity Greater Than';
      case FilterType.GreaterThanEqual: return 'Total Quantity Greater And Equal Than';
      case FilterType.LessThan: return 'Total Quantity Less Than';
      case FilterType.LessThanEqual: return 'Total Quantity Less And Equal Than';
      case FilterType.Range: return 'Total Quantity in Range';
      default: return 'Total Quantity Equals To';
    }
  }

  onFilterTypeChange() {
    // Focus the quantity input if not range
    if (this.filterType !== 'range') {
      setTimeout(() => {
        this.quantityInput?.nativeElement?.focus();
      });
    }
  }
}