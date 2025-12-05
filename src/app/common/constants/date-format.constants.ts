// Date format constants for the application

// Date formats for import/export operations (e.g., audit file field mapping)
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

// Angular formatDate format constants
export const ANGULAR_DATE_FORMAT = {
    YYYY_MM_DD: 'yyyy-MM-dd',
    LOCALE_EN: 'en'
} as const;

