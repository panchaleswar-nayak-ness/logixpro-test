export interface ImportTypeConfig {
  importTypeName: string;
  importPath?: string;
  archivePath?: string;
  fileExtension?: string;
  isActive: boolean;
}

export interface ImportTypeConfigRequest {
  importTypeName: string;
  importPath?: string;
  archivePath?: string;
  fileExtension?: string;
  isActive: boolean;
}

export interface AuditTransferFileFormData {
  backupFilePath: string;
  importFilePath: string;
  transactionType: string;
  extensionImportFile: string;
  active: boolean;
}

export interface AuditTransferFileDialogData {
  // This interface represents the data passed to the AuditTransferFileComponent dialog
  // Currently empty as the dialog is opened with no data, but can be extended in the future
} 