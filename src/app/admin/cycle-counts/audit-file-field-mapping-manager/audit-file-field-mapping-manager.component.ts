import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FIELD_MAPPINGS, PickProFields } from 'src/app/common/constants/audit-file-field-mapping/audit-file-field-mapping.constants';
import { DATE_FORMATS } from 'src/app/common/constants/date-format.constants';
import { ApiFuntions } from 'src/app/common/services/ApiFuntions';
import { InventoryCompareConfigPayload, InventoryCompareField } from 'src/app/common/interface/audit-file-field-mapping-manager/inventory-compare.interface';
import { InventoryCompareConfigResponse } from 'src/app/common/interface/audit-file-field-mapping-manager/inventory-compare-response.interface';
import { GlobalService } from 'src/app/common/services/global.service';
import { ToasterType, ToasterTitle, ToasterMessages, importFieldMappingDialogSizes } from 'src/app/common/constants/strings.constants';
import { AuditTransferFileComponent } from '../dialogs/audit-transfer-file/audit-transfer-file.component';
import { FieldMappingTransformer } from './utils/field-mapping-transformer.util';

export interface FieldMapping {
  pickProField: string;
  startPosition: number | null;
  fieldLength: number | null;
  endPosition: number | null;
  padField: boolean;
  fieldType: string;
  importFormat: string | null;
}

@Component({
  selector: 'app-audit-file-field-mapping',
  templateUrl: './audit-file-field-mapping-manager.component.html',
  styleUrls: ['./audit-file-field-mapping-manager.component.scss']
})
export class AuditFileFieldMappingComponent implements OnInit {

    displayedColumns: string[] = [
    'pickProField',
    'startPosition', 
    'fieldLength',
    'endPosition',
    'padField',
    'fieldType',
    'importFormat'
    ];

    fieldMappingForm: FormGroup;
    fieldMappings: FieldMapping[] = JSON.parse(JSON.stringify(FIELD_MAPPINGS));

    dateFormats: string[] = DATE_FORMATS;

    // Expose enum to template
    PickProFields = PickProFields;

  constructor(
    public router: Router,
    private apiFunctions: ApiFuntions,
    private global: GlobalService,
    private fb: FormBuilder
  ) {
    this.fieldMappingForm = this.fb.group({
      fieldMappings: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // Initialize form with field mappings
    this.initializeFormArray();
    // Load configuration from API
    this.loadConfigurationFromAPI();
  }

  /**
   * Get the FormArray for field mappings
   */
  get fieldMappingsFormArray(): FormArray {
    return this.fieldMappingForm.get('fieldMappings') as FormArray;
  }

  /**
   * Initialize the FormArray with field mappings
   */
  private initializeFormArray(): void {
    const formArray = this.fieldMappingsFormArray;
    
    this.fieldMappings.forEach((mapping, index) => {
      const formGroup = this.createFieldMappingFormGroup(mapping);
      formArray.push(formGroup);
    });
  }

  /**
   * Create a FormGroup for a single field mapping
   */
  private createFieldMappingFormGroup(mapping: FieldMapping): FormGroup {
    const isRequired = this.isFieldItemNumberAndHostQtyRequired(mapping.pickProField);
    
    const formGroup = this.fb.group({
      pickProField: [mapping.pickProField],
      startPosition: [
        mapping.startPosition, 
        isRequired ? [Validators.required, Validators.min(1)] : [Validators.min(1)]
      ],
      fieldLength: [
        mapping.fieldLength, 
        isRequired ? [Validators.required, Validators.min(1)] : [Validators.min(1)]
      ],
      endPosition: [{ value: mapping.endPosition, disabled: true }],
      padField: [mapping.padField],
      fieldType: [{ value: mapping.fieldType, disabled: true }],
      importFormat: [mapping.importFormat]
    });

    // Subscribe to startPosition and fieldLength changes to auto-calculate endPosition
    const startPositionControl = formGroup.get('startPosition');
    const fieldLengthControl = formGroup.get('fieldLength');
    const endPositionControl = formGroup.get('endPosition');

    if (startPositionControl && fieldLengthControl && endPositionControl) {
      [startPositionControl, fieldLengthControl].forEach(control => {
        control.valueChanges.subscribe(() => {
          this.calculateEndPositionReactive(formGroup);
        });
      });
    }

    return formGroup;
  }

  /**
   * Calculate end position for reactive form
   */
  private calculateEndPositionReactive(formGroup: FormGroup): void {
    const startPosition = formGroup.get('startPosition')?.value;
    const fieldLength = formGroup.get('fieldLength')?.value;
    const endPositionControl = formGroup.get('endPosition');

    if (endPositionControl) {
      if (startPosition && fieldLength && startPosition > 0 && fieldLength > 0) {
        endPositionControl.setValue(startPosition + fieldLength - 1);
      } else {
        endPositionControl.setValue(null);
      }
    }
  }

  private loadConfigurationFromAPI(): void {
    this.apiFunctions.getInventoryCompareConfig().subscribe({
      next: (response) => {
        if (this.hasValidResponse(response)) {
          this.processApiResponse(response);
        }
        // If no data, keep the default fieldMappings from constants
      },
      error: (error) => {
        this.global.ShowToastr(ToasterType.Error, ToasterMessages.NoRecordFound, ToasterTitle.Error);
      }
    });
  }

  private hasValidResponse(response: InventoryCompareConfigResponse): boolean {
    return response && response.value && response.value.fields && response.value.fields.length > 0;
  }

  private processApiResponse(response: InventoryCompareConfigResponse): void {
    const apiFieldMap = this.createApiFieldMap(response.value.fields);
    this.updateFormArrayWithApiData(apiFieldMap);
  }

  private createApiFieldMap(fields: InventoryCompareField[]): Map<string, InventoryCompareField> {
    return FieldMappingTransformer.createApiFieldMap(fields);
  }

  private updateFormArrayWithApiData(apiFieldMap: Map<string, InventoryCompareField>): void {
    const formArray = this.fieldMappingsFormArray;
    
    formArray.controls.forEach((control, index: number) => {
      const formGroup = control as FormGroup;
      const pickProField = formGroup.get('pickProField')?.value;
      const apiField = apiFieldMap.get(pickProField);
      
      if (apiField) {
        this.applyApiFieldDataToForm(formGroup, apiField);
      }
      this.postProcessFieldMappingForm(formGroup);
    });
  }

  private applyApiFieldDataToForm(formGroup: FormGroup, apiField: InventoryCompareField): void {
    formGroup.patchValue({
      startPosition: apiField.startPosition || null,
      fieldLength: apiField.fieldLength || null,
      padField: apiField.trimLeft || false,
      fieldType: apiField.dataType || formGroup.get('fieldType')?.value
    });
  }

  private postProcessFieldMappingForm(formGroup: FormGroup): void {
    this.calculateEndPositionReactive(formGroup);
    this.setDefaultImportFormatForm(formGroup);
  }

  private setDefaultImportFormatForm(formGroup: FormGroup): void {
    const pickProField = formGroup.get('pickProField')?.value;
    const importFormat = formGroup.get('importFormat')?.value;
    
    if (pickProField === PickProFields.ExpirationDate && !importFormat) {
      formGroup.patchValue({ importFormat: this.dateFormats[0] });
    }
  }

    transferFilePathSetup(): void {
        // Validate required fields before proceeding
        if (!this.validateRequiredFields()) {
            return;
        }

        // Transform data for API
        const payload = FieldMappingTransformer.transformFormDataToApiPayload(this.fieldMappingsFormArray);
        
        // Call the API
        this.apiFunctions.updateInventoryCompareConfig(payload).subscribe({
            next: (response) => {
                if (response && response.isSuccess) {
                    this.global.ShowToastr(ToasterType.Success, ToasterMessages.ConfigurationUpdateSuccess, ToasterTitle.Success);
                    // Show the audit transfer file dialog
                    this.showAuditTransferFileDialog();
                } else {
                    this.global.ShowToastr(ToasterType.Error, ToasterMessages.ConfigurationUpdateFailed, ToasterTitle.Error);
                }
            },
            error: (error) => {
                this.global.ShowToastr(ToasterType.Error, ToasterMessages.ConfigurationUpdateFailed, ToasterTitle.Error);
                console.error('Error updating inventory compare config:', error);
            }
        });
    }

    /**
     * Shows the audit transfer file dialog
     */
    private showAuditTransferFileDialog(): void {
        this.global.OpenDialog(AuditTransferFileComponent, {
            width: importFieldMappingDialogSizes.CCDiscrepancies.width,
            height: 'auto',
            disableClose: true,
            data: {}
        });
    }

    private validateRequiredFields(): boolean {
        const formArray = this.fieldMappingsFormArray;
        const requiredFields = [PickProFields.ItemNumber, PickProFields.HostQuantity];
        
        for (const fieldName of requiredFields) {
            const formGroup = formArray.controls.find((control) => 
                (control as FormGroup).get('pickProField')?.value === fieldName
            ) as FormGroup;
            
            if (!formGroup) continue;
            
            const startPosition = formGroup.get('startPosition');
            const fieldLength = formGroup.get('fieldLength');
            
            if (!startPosition?.value || !fieldLength?.value) {
                this.global.ShowToastr(
                    ToasterType.Error, 
                    ToasterMessages.FieldRequiresBothStartPositionAndFieldLength(fieldName), 
                    ToasterTitle.Error
                );
                return false;
            }
            
            // Also check if the form controls are valid (min validation, etc.)
            if (startPosition?.invalid || fieldLength?.invalid) {
                this.global.ShowToastr(
                    ToasterType.Error, 
                    ToasterMessages.FieldHasInvalidValues(fieldName), 
                    ToasterTitle.Error
                );
                return false;
            }
        }
        
        return true;
    }



    // Legacy method - kept for backward compatibility if needed
    // The reactive form version is calculateEndPositionReactive
    calculateEndPosition(element: FieldMapping): void {
        if (element.startPosition && element.fieldLength) {
        element.endPosition = element.startPosition + element.fieldLength - 1;
        } else {
        element.endPosition = null;
        }
    }
    /** 
     * Moves any leading spaces in `value` to the end of the string,
     * preserving total length.
     */
    private padLeftToRight(value: string): string {
        return FieldMappingTransformer.padLeftToRight(value);
    }

    /**
     * trackBy function for FormGroups to optimize ngFor rendering
     */
    trackByPickProField(index: number, formGroup: FormGroup): string {
        return formGroup.get('pickProField')?.value || index.toString();
    }

    /**
     * Checks if a field is required based on its pickProField value
     * @param pickProField The field name to check
     * @returns True if the field is required, false otherwise
     */
    isFieldItemNumberAndHostQtyRequired(pickProField: string): boolean {
        return pickProField === PickProFields.ItemNumber || pickProField === PickProFields.HostQuantity;
    }
}
