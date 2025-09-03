import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminApiService } from '../../../../common/services/admin-api/admin-api.service';
import { GlobalService } from '../../../../common/services/global.service';
import { AuditTransferFileFormData, AuditTransferFileDialogData } from '../../../../common/interface/audit-file-field-mapping-manager/import-type-config.interface';
import { ToasterType, ToasterMessages, ToasterTitle } from '../../../../common/constants/strings.constants';

@Component({
  selector: 'app-audit-transfer-file',
  templateUrl: './audit-transfer-file.component.html',
  styleUrls: [],
})
export class AuditTransferFileComponent {
  auditTransferForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AuditTransferFileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuditTransferFileDialogData,
    private adminApiService: AdminApiService,
    private global: GlobalService
  ) {
    this.auditTransferForm = this.fb.group({
      backupFilePath: ['', Validators.required],
      importFilePath: ['', Validators.required],
      transactionType: [
        { value: 'Audit', disabled: true },
        Validators.required,
      ],
      extensionImportFile: ['aud', Validators.required],
      active: [false],
    });
  }

  onSave() {
    if (this.auditTransferForm.valid) {
      const formValue: AuditTransferFileFormData = this.auditTransferForm.getRawValue(); // Use getRawValue() to include disabled controls
      
      this.adminApiService.UpdateImportType(formValue).subscribe({
        next: (response) => {
          // Success - close dialog with the response
          this.dialogRef.close(response);
        },
        error: (error) => {
          this.global.ShowToastr(ToasterType.Error, ToasterMessages.SomethingWentWrong, ToasterTitle.Error);
        }
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onBackupFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      // Only file name is available in browsers
      this.auditTransferForm.get('backupFilePath')?.setValue(input.files[0].name);
    }
  }

  onImportFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.auditTransferForm.get('importFilePath')?.setValue(input.files[0].name);
    }
  }
}
