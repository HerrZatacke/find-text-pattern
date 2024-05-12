import { findCharByCode } from './findChar';
import { hexPad } from './hexPad';

export const numericToString = (values: Uint8Array): string => (
  values.reduce((acc: string, code: number): string => {
    const char = findCharByCode(code)?.value;
    if (char === undefined) {
      throw new Error(`char "${hexPad(code)}" not found in charMap`);
    }

    return `${acc}${char}`;
  }, '')
);
