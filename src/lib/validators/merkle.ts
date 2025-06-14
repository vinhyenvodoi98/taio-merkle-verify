interface ValidationResult {
  isValid: boolean;
  error: string | null;
  invalidItems?: string[];
  duplicateUserIds?: string[];
}

/**
 * Validates if a string matches the required format "(userId,balance)"
 * @param str - The string to validate
 * @returns boolean indicating if the string is valid
 */
export function isValidDataFormat(data: string): boolean {
  const pattern = /^\([^,]+,\d+\)$/;
  return pattern.test(data);
}

/**
 * Checks for duplicate user IDs in the data array
 * @param data - Array of valid data strings
 * @returns Array of duplicate user IDs
 */
function findDuplicateUserIds(data: string[]): string[] {
  const userIds = new Set<string>();
  const duplicateUserIds = new Set<string>();
  
  for (const item of data) {
    const { userId } = parseMerkleData(item);
    if (userIds.has(userId)) {
      duplicateUserIds.add(userId);
    }
    userIds.add(userId);
  }

  return Array.from(duplicateUserIds);
}

/**
 * Validates an array of data items
 * @param data - Array of strings to validate
 * @returns Object containing validation result and any invalid items
 */
export function validateMerkleData(data: string[]): ValidationResult {
  if (!Array.isArray(data)) {
    return {
      isValid: false,
      error: 'Data must be an array',
    };
  }

  const invalidItems = data.filter(item => !isValidDataFormat(item));

  if (invalidItems.length > 0) {
    return {
      isValid: false,
      error: 'Invalid data format. Expected format: (userId,balance)',
      invalidItems,
    };
  }

  // Check for duplicate user IDs
  const duplicateUserIds = findDuplicateUserIds(data);
  if (duplicateUserIds.length > 0) {
    return {
      isValid: false,
      error: 'Duplicate user IDs found',
      duplicateUserIds,
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Parses a valid data string into userId and balance
 * @param str - The string to parse (must be in format "(userId,balance)")
 * @returns Object containing userId and balance as numbers
 * @throws Error if string is not in valid format
 */
export function parseMerkleData(data: string): { userId: string; balance: string } {
  const match = data.match(/^\(([^,]+),(\d+)\)$/);
  if (!match) {
    throw new Error('Invalid data format');
  }
  return {
    userId: match[1],
    balance: match[2],
  };
}