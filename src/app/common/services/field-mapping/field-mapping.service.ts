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
          this.fieldMappingSubject.next(response.data);

          // Store the updated fieldMappings object in localStorage
          localStorage.setItem('fieldMappings', JSON.stringify(response.data));

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

  getFieldMappings(): Observable<FieldMappingModel | null> {
    return this.fieldMappingSubject.asObservable();
  }

  getFieldMapping(): FieldMappingModel | null {
    return this.fieldMappingSubject.value;
  }
}
