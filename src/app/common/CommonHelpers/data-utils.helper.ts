/**
 * Helper function to clean data by replacing null/undefined values with empty strings
 * @param data Array of objects to clean
 * @returns Cleaned array with null/undefined values replaced with empty strings
 */
export function cleanData<T extends Record<string, any>>(data: T[]): T[] {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return data.map(item => {
    const cleanedItem: any = { ...item };
    Object.keys(cleanedItem).forEach(key => {
      if (cleanedItem[key] === null || cleanedItem[key] === undefined || cleanedItem[key] === 'null' || cleanedItem[key] === 'undefined') {
        cleanedItem[key] = '';
      }
    });
    return cleanedItem as T;
  });
}

/**
 * Helper function to safely format cell values
 * @param value Value to format (can be string, number, boolean, null, or undefined)
 * @returns Formatted string value, empty string for null/undefined
 */
export function safeCellValue(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined || value === 'null' || value === 'undefined') {
    return '';
  }
  return String(value);
}

