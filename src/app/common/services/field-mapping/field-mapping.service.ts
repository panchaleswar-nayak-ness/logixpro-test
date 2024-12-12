import { Injectable } from '@angular/core';
import { FieldMappingModel } from '../../types/CommonTypes';
import { AdminApiService } from '../admin-api/admin-api.service';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class FieldMappingService {
  private fieldMappingSubject = new BehaviorSubject<FieldMappingModel | null>(null);

  constructor(private adminApiService: AdminApiService) {
    this.loadFieldMappings(); // Automatically loads when the service is created
  }
  

  public loadFieldMappings(): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('FieldMappingService: Fetching field mappings during app initialization');
        const response: any = await firstValueFrom(this.adminApiService.ColumnAlias());
        if (response?.data) {
          const lowercaseData = this.convertKeysToLowerCase(response.data);
          // Store the data in localStorage as a JSON string
          localStorage.setItem('fieldMappings', JSON.stringify(response.data));
        
          localStorage.setItem('fieldMappingsSelect', JSON.stringify(lowercaseData));

          console.log('FieldMappingService: Mappings loaded successfully');
          resolve();
        } else {
          console.error('FieldMappingService: Error fetching mappings', response?.responseMessage);
          reject('Error fetching mappings');
        }
      } catch (error) {
        console.error('FieldMappingService: API error', error);
        reject(error);
      }
    });
  }


  convertKeysToLowerCase(obj) {
      const newObj = {};
      for (const [key, value] of Object.entries(obj)) {
          newObj[key.toLowerCase()] = value;
      }
      return newObj;
  }
  
  getFieldMappings(): Observable<FieldMappingModel | null> {
    return this.fieldMappingSubject.asObservable();
  }

  getFieldMapping(): FieldMappingModel | null {
    return this.fieldMappingSubject.value;
  }
}
