import { Injectable } from '@angular/core';
import {PickToteFilterpreferences } from '../constants/strings.constants';

@Injectable({
  providedIn: 'root'
})
export class PickToteManagerService {
  constructor() {}
  // This method updates the preference for applying a numeric filter on the "Pick Tote" UI feature.
  // It stores the preference directly in the browser's local storage so that it persists across sessions.
   SetPickToteFilterNumeric(value: boolean): boolean {
    // Save the preference directly without user-specific settings
    localStorage.setItem(
      PickToteFilterpreferences.preferences,
      JSON.stringify(value)
    );
    return value;
  }
}
