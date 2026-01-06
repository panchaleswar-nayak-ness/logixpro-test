/**
 * Event interfaces for Event Log component
 * Used for type-safe event emissions between parent and child components
 */

/**
 * Event interface for autocomplete search column emissions
 */
export interface AutoCompleteSearchEvent {
  colName: string;
  msg: string;
  fieldName?: string;
}

/**
 * Event interface for type ahead emissions
 */
export interface TypeAheadEvent {
  colName: string;
  msg: string;
  loader: boolean;
}

/**
 * Event interface for search emissions
 */
export interface SearchEvent {
  event: any;
  msg: string;
}

/**
 * Event interface for search on enter emissions
 */
export interface SearchOnEnterEvent {
  fieldName: string;
  value: string;
}

