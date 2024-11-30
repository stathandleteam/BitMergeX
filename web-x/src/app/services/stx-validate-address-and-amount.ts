import { validateStacksAddress } from '@stacks/transactions';

/**
 * Validates a Stacks (STX) blockchain address
 * @param address - The STX address to validate
 * @returns Boolean indicating if the address is valid
 */
export function validateStxAddress(address: string): boolean {
  try {
    // Use the official Stacks address validation
    return validateStacksAddress(address);
  } catch (error) {
    return false;
  }
}

/**
 * Validates the STX token transfer amount
 * @param amount - The amount of STX to transfer
 * @param options - Optional validation parameters
 * @returns Boolean indicating if the amount is valid
 */
export function validateStxAmount(
  amount: number | bigint, 
  options: {
    minAmount?: number;
    maxAmount?: number;
  } = {}
): boolean {
  // Convert to bigint for precise decimal handling
  const amountBigInt = typeof amount === 'number' 
    ? BigInt(Math.round(amount * 1_000_000)) 
    : amount;

  // Basic amount validations
  if (amountBigInt <= 0n) {
    return false;
  }

  // Optional min amount check
  if (options.minAmount !== undefined) {
    const minAmountBigInt = BigInt(Math.round(options.minAmount * 1_000_000));
    if (amountBigInt < minAmountBigInt) {
      return false;
    }
  }

  // Optional max amount check
  if (options.maxAmount !== undefined) {
    const maxAmountBigInt = BigInt(Math.round(options.maxAmount * 1_000_000));
    if (amountBigInt > maxAmountBigInt) {
      return false;
    }
  }

  return true;
}

/**
 * Comprehensive validation for STX token transfer
 * @param address - The recipient STX address
 * @param amount - The amount of STX to transfer
 * @param options - Optional validation parameters
 * @returns Boolean indicating if the transfer is valid
 */
export function validateStxTransfer(
  address: string, 
  amount: number | bigint,
  options: {
    minAmount?: number;
    maxAmount?: number;
  } = {}
): boolean {
  return validateStxAddress(address) && validateStxAmount(amount, options);
}