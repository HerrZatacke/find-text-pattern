import type { ValidateResult } from 'react-hook-form';

export const validateHexDigit = (min: number, max: number) => (value: string): ValidateResult => {
  const numeric = parseInt(value, 16);

  const hexRe = /[^0-9a-f]/gi;

  if (isNaN(numeric) || value.match(hexRe)) {
    return 'Not a valid number';
  }

  if (numeric >= max || numeric < min) {
    return 'Address is outside of valid range';
  }

  return true;
};
