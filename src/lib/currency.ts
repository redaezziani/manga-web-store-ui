/**
 * Currency utilities for Moroccan Dirham formatting
 */

export const CURRENCY = {
  symbol: 'درهم',
  code: 'MAD',
  name: 'Moroccan Dirham',
  nameAr: 'الدرهم المغربي'
} as const;

/**
 * Format a number as Moroccan Dirham currency
 * @param amount - The amount to format
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  options?: {
    showSymbol?: boolean;
    decimalPlaces?: number;
    locale?: string;
  }
): string {
  const {
    showSymbol = true,
    decimalPlaces = 2,
    locale = 'ar-MA'
  } = options || {};

  const formattedAmount = amount.toFixed(decimalPlaces);
  
  if (showSymbol) {
    return `${formattedAmount} ${CURRENCY.symbol}`;
  }
  
  return formattedAmount;
}

/**
 * Format currency for display in Arabic interface
 */
export function formatCurrencyAr(amount: number): string {
  return formatCurrency(amount, { showSymbol: true, locale: 'ar-MA' });
}

/**
 * Parse currency string to number (removes currency symbol)
 */
export function parseCurrency(currencyString: string): number {
  return parseFloat(currencyString.replace(CURRENCY.symbol, '').trim());
}

/**
 * Calculate discount amount
 */
export function calculateDiscount(price: number, discountPercent: number): number {
  return (price * discountPercent) / 100;
}

/**
 * Calculate final price after discount
 */
export function calculateFinalPrice(price: number, discountPercent: number): number {
  const discountAmount = calculateDiscount(price, discountPercent);
  return price - discountAmount;
}
