import { Injectable } from '@angular/core';
import { FieldMappingModel } from '../../types/CommonTypes';
import { Observable } from 'rxjs';
import { Placeholders } from '../../constants/strings.constants';

@Injectable({
  providedIn: 'root'
})

export class StringReplacementService {

  fieldMappings: FieldMappingModel | null;
  fieldMapping$: Observable<FieldMappingModel | null>;
  placeholders = Placeholders;

  constructor() {}

  replacePlaceholders(template: string, htmlFallback: string): string {
    let result = template;

    this.fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');

    if (this.fieldMappings) {
      Object.keys(this.fieldMappings).forEach((key) => {
        const placeholder = `{{${key}}}`;
        const value = this.fieldMappings?.[key as keyof FieldMappingModel] || '';
        result = result.split(placeholder).join(value || htmlFallback);
      });
    } else {
      console.error('Field mapping is null');
    }
    return result;
  }

  replaceOrFallback(template: string, htmlFallback: string): string {

    let result = this.replacePlaceholders(template, htmlFallback);

    // Fallback to HTML content for unresolved placeholders
    result = result.replace(/{{(.*?)}}/g, (match, p1) => {
      return htmlFallback || match;
    });

    return result;
  }

  replaceColDefs(data: { colHeader: string; colDef: string }[]): { colHeader: string; colDef: string }[] {

    this.fieldMappings = JSON.parse(localStorage.getItem('fieldMappings') ?? '{}');

    if (!this.fieldMappings) {
      return data; // Return unchanged data if no field mapping is provided
    }
  
    return data.map((item) => {
      const newColDef = this.fieldMappings?.[item.colHeader] !== '' ? this.fieldMappings?.[item.colHeader] : this.placeholders?.[item.colHeader];
      return {
        ...item,
        colDef: newColDef || item.colDef, // Replace colDef if mapping exists
      };
    });
  }
}
