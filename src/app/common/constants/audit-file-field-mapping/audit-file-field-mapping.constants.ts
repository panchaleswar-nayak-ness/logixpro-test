import { FieldMapping } from "src/app/admin/cycle-counts/audit-file-field-mapping-manager/audit-file-field-mapping-manager.component";

export enum PickProFields {
    ExpirationDate = 'Expiration Date',
    LotNumber = 'Lot Number',
    SerialNumber = 'Serial Number',
    Warehouse = 'Warehouse',
    ItemNumber = 'Item Number',
    HostQuantity = 'Host Quantity'
}

export const FIELD_MAPPINGS: FieldMapping[] = [
    {
        pickProField: PickProFields.ExpirationDate,
        startPosition: null,
        fieldLength: null,
        endPosition: null,
        padField: false,
        fieldType: 'Date',
        importFormat: null
    },
    {
        pickProField: PickProFields.LotNumber,
        startPosition: null,
        fieldLength: null,
        endPosition: null,
        padField: false,
        fieldType: 'Text',
        importFormat: null
    },
    {
        pickProField: PickProFields.SerialNumber,
        startPosition: null,
        fieldLength: null,
        endPosition: null,
        padField: false,
        fieldType: 'Text',
        importFormat: null
    },
    {
        pickProField: PickProFields.Warehouse,
        startPosition: null,
        fieldLength: null,
        endPosition: null,
        padField: false,
        fieldType: 'Text',
        importFormat: null
    },
    {
        pickProField: PickProFields.ItemNumber,
        startPosition: null,
        fieldLength: null,
        endPosition: null,
        padField: false,
        fieldType: 'Text',
        importFormat: null
    },
    {
        pickProField: PickProFields.HostQuantity,
        startPosition: null,
        fieldLength: null,
        endPosition: null,
        padField: false,
        fieldType: 'Number',
        importFormat: null
    }
];

export const DATE_FORMATS: string[] = [
    'DD/MM/YYYY',
    'MM/DD/YYYY',
    'DD/MM/YY',
    'MM/DD/YY',
    'YYYY/DD/MM',
    'YYYY/MM/DD',
    'YY/DD/MM',
    'YY/MM/DD'
]; 