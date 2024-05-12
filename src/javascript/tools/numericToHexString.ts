import { hexPadSimple } from './hexPad';

export const numericToHexString = (values: Uint8Array, columns: number): string => (
  values.reduce((acc: string, char: number, index: number) => {
    const separator = index % columns ? ' ' : '\n';
    return (
      `${acc}${separator}${hexPadSimple(char)}`
    );
  }, '').trim()
);
