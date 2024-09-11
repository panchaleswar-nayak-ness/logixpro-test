import { Component, OnInit } from '@angular/core';

interface Filter {
  alias: string;
  field: string;
  startingCharacters: string;
  endingCharacters: string;
}

@Component({
  selector: 'app-impref-induction-filter',
  templateUrl: './impref-induction-filter.component.html',
  styleUrls: ['./impref-induction-filter.component.scss']
})
export class ImprefInductionFilterComponent implements OnInit {

  filters: Filter[] = [];

  constructor() { }

  ngOnInit(): void {
    // Initial data (you can load this dynamically if needed)
    this.filters = [
      { alias: 'Tote_A', field: 'Item Code', startingCharacters: 'ABC', endingCharacters: 'XYZ' },
      { alias: 'Tote_B', field: 'Serial Number', startingCharacters: '123', endingCharacters: '789' },
      { alias: 'Tote_C', field: 'Batch Number', startingCharacters: 'A1B2', endingCharacters: 'Z9X8' }
    ];
  }

  // Add a new empty filter
  addFilter(): void {
    this.filters.push({ alias: '', field: '', startingCharacters: '', endingCharacters: '' });
  }

  // Save the filter at the specified index
  saveFilter(filter: Filter): void {
    // Logic to save the filter (e.g., backend API call)
    console.log('Saving filter:', filter);
  }

  // Remove the filter at the specified index
  removeFilter(filter: Filter): void {
    const index = this.filters.indexOf(filter);
    if (index !== -1) {
      this.filters.splice(index, 1);
    }
  }

  // Handle form submission
  onSubmit(): void {
    // Logic to process the submitted filters (e.g., send data to the server)
    console.log('Submitted filters:', this.filters);
  }
}
