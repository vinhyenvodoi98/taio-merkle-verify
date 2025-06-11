/**
 * Validates if a string matches the required format "(userId,balance)"
 * @param str - The string to validate
 * @returns boolean indicating if the string is valid
 */
export function isValidDataFormat(str: string): boolean {
  // Check if string matches the pattern "(number,number)"
  const pattern = /^\(\d+,\d+\)$/;
  if (!pattern.test(str)) return false;

  // Extract numbers and validate
  const [userId, balance] = str.slice(1, -1).split(',');
  
  // Check if both are valid integers
  const userIdNum = parseInt(userId, 10);
  const balanceNum = parseInt(balance, 10);
  
  return !isNaN(userIdNum) && !isNaN(balanceNum) &&
         Number.isInteger(userIdNum) && Number.isInteger(balanceNum) &&
         balanceNum >= 0; // Balance should be non-negative
}

/**
 * Validates an array of data items
 * @param data - Array of strings to validate
 * @returns Object containing validation result and any invalid items
 */
export function validateMerkleData(data: string[]) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return {
      isValid: false,
      error: 'Data array cannot be empty',
      invalidItems: []
    };
  }

  const invalidItems = data.filter(item => !isValidDataFormat(item));
  if (invalidItems.length > 0) {
    return {
      isValid: false,
      error: 'Invalid data format. Expected format: (userId,balance)',
      invalidItems
    };
  }

  return {
    isValid: true,
    error: null,
    invalidItems: []
  };
}

/**
 * Parses a valid data string into userId and balance
 * @param str - The string to parse (must be in format "(userId,balance)")
 * @returns Object containing userId and balance as numbers
 * @throws Error if string is not in valid format
 */
export function parseMerkleData(str: string): { userId: number; balance: number } {
  if (!isValidDataFormat(str)) {
    throw new Error('Invalid data format');
  }

  const [userId, balance] = str.slice(1, -1).split(',').map(Number);
  return { userId, balance };
}