import { findCharByValue } from './findChar';
import { intlSplit } from './intlSplit';

export const stringToNumeric = (text: string): Uint8Array => {
  const chars = intlSplit(text);
  return new Uint8Array(chars.reduce((acc: number[], char: string) => {
    const code = findCharByValue(char)?.code;
    if (code === undefined) {
      throw new Error(`char "${char}" not found in charMap`);
    }

    return acc.concat(code);
  }, []));
};
