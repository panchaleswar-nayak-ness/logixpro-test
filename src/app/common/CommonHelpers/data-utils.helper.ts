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

/**
 * Converts camelCase or PascalCase strings to Title Case with spaces
 * @param str String to convert (e.g., 'orderNumber', 'StatusDate')
 * @returns Converted string (e.g., 'Order Number', 'Status Date')
 * @example
 * convertCamelCaseToTitleCase('orderNumber') // Returns: 'Order Number'
 * convertCamelCaseToTitleCase('cartId') // Returns: 'Cart Id'
 */
export function convertCamelCaseToTitleCase(str: string): string {
  if (!str) return '';

  return str
    // Step 1: Add space before each uppercase letter, Example: 'orderNumber' → ' order Number'
    .replace(/([A-Z])/g, ' $1')
    // Step 2: Capitalize the first character of the result, Example: ' order Number' → ' Order Number' 
    .replace(/^./, str => str.toUpperCase())
    // Step 3: Remove leading/trailing whitespace, Example: ' Order Number' → 'Order Number'
    .trim();
}
