import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CartManagementGridDefaults } from 'src/app/common/constants/numbers.constants';
import { KeyboardKeys } from 'src/app/common/constants/strings.constants';

@Component({
  selector: 'app-cart-search',
  templateUrl: './cart-search.component.html',
  styleUrls: ['./cart-search.component.scss']
})
export class CartSearchComponent implements OnDestroy {
  @Input() searchTerm: string = '';
  @Output() searchChange = new EventEmitter<{searchTerm: string, column: string}>();

  selectedColumn: string = '';
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription;

  constructor() {
    // Debounce search input to avoid too many API calls
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(CartManagementGridDefaults.SearchDebounceTime),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.searchChange.emit({searchTerm: value, column: this.selectedColumn});
      });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.searchSubject.complete();
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.searchSubject.next(value);
  }

  onSearchKeyUp(event: KeyboardEvent): void {
    if (event.key === KeyboardKeys.Enter) {
      const input = event.target as HTMLInputElement;
      const value = input.value;
      this.searchChange.emit({searchTerm: value, column: this.selectedColumn});
    }
  }

  onColumnChange(event: MatSelectChange): void {
    this.searchTerm = "";
    this.selectedColumn = event.value;
    this.searchChange.emit({searchTerm: this.searchTerm, column: this.selectedColumn});
  }

  isSearchDisabled(){
    return this.selectedColumn == "";
  }
}
