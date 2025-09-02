import { FormArray, FormGroup } from '@angular/forms';
import { PickProFields } from 'src/app/common/constants/audit-file-field-mapping/audit-file-field-mapping.constants';
import { 
  InventoryCompareConfigPayload, 
  InventoryCompareField 
} from 'src/app/common/interface/audit-file-field-mapping-manager/inventory-compare.interface';

/**
 * Utility class for transforming field mapping data between different formats
 */
export class FieldMappingTransformer {

  /**
   * Transform form data to API payload format
   */
  static transformFormDataToApiPayload(formArray: FormArray): InventoryCompareConfigPayload {
    // Lookup map for fieldId values based on PickPro Field
    const fieldMap: Record<string, string> = {
      [PickProFields.ExpirationDate]: 'InventoryCompare_NewExpDate',
      [PickProFields.LotNumber]: 'InventoryCompare_NewLotNumber',
      [PickProFields.SerialNumber]: 'InventoryCompare_NewSerialNumber',
      [PickProFields.Warehouse]: 'InventoryCompare_NewWarehouse',
      [PickProFields.ItemNumber]: 'InventoryCompare_NewItemNumber',
      [PickProFields.HostQuantity]: 'InventoryCompare_NewHostQuantity',
    };

    const fields: InventoryCompareField[] = formArray.controls.map((control, index: number) => {
      const formGroup = control as FormGroup;
      const formValue = formGroup.value;
      // Use lookup map with fallback to lowercase
      const fieldId = fieldMap[formValue.pickProField] ?? formValue.pickProField.toLowerCase();

      return {
        fieldId: fieldId,
        fieldName: formValue.pickProField,
        fieldIndex: index + 1,
        startPosition: formValue.startPosition || 0,
        fieldLength: formValue.fieldLength || 0,
        trimLeft: formValue.padField,
        trimRight: false, // Default value as specified
        dataType: formValue.fieldType
      };
    });

    return { fields };
  }

  /**
   * Create a map of API fields for easier lookup during form updates
   */
  static createApiFieldMap(fields: InventoryCompareField[]): Map<string, InventoryCompareField> {
    const apiFieldMap = new Map();
    fields.forEach((field: InventoryCompareField) => {
      apiFieldMap.set(field.fieldName, field);
    });
    return apiFieldMap;
  }

  /**
   * Utility method for padding text (moves leading spaces to the end)
   */
  static padLeftToRight(value: string): string {
    const leading = (value.match(/^ */) || [''])[0].length;
    return value.trimStart().padEnd(value.length);
  }
}
