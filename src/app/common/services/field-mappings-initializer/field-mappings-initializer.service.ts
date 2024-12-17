import { FieldMappingService } from '../field-mapping/field-mapping.service'; 

export function initializeFieldMappings(fieldMappingService: FieldMappingService): () => Promise<void> {
  return () =>
    new Promise((resolve, reject) => {
      console.log("initializeFieldMappings: invoked.");
      fieldMappingService.loadFieldMappings();
      const subscription = fieldMappingService.getFieldMappings().subscribe({
        next: (data) => {
          if (data) {
            resolve();
            subscription.unsubscribe(); // Cleanup subscription after data is loaded
          }
        },
        error: (error) => {
          console.error('Error loading field mappings:', error);
          reject(error);
        },
      });
    });
}
