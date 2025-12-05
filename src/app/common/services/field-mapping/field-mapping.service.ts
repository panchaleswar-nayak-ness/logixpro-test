import { Injectable } from '@angular/core';
import { FieldMappingAlias, FieldMappingModel } from '../../types/CommonTypes';
import { AdminApiService } from '../admin-api/admin-api.service';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { AuthService } from '../../init/auth.service';

@Injectable({
  providedIn: 'root',
})

export class FieldMappingService {
  private fieldMappingSubject = new BehaviorSubject<FieldMappingAlias | null>(null);
   private readonly storageKey = 'fieldMappings';
  constructor(private adminApiService: AdminApiService,
    private readonly authService: AuthService
  ) {
    if(!this.authService.isConfigUser() && this.authService.IsloggedIn()){
      this.loadFieldMappings();
    }
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

  getFieldMapping(): FieldMappingAlias | null {
    return this.fieldMappingSubject.value;
  }

 getFieldMappingAlias(): FieldMappingAlias | null {
  const data = localStorage.getItem(this.storageKey);
  if (!data) {
    return null
  }
  return JSON.parse(data) as FieldMappingAlias;
}


}
