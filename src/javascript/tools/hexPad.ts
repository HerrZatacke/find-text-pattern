export const hexPadSimple = (code: number, padTo = 2): string => (
  code.toString(16).toUpperCase().padStart(padTo, '0')
);

export const hexPad = (code: number, padTo = 2): string => (
  `0x${hexPadSimple(code, padTo)}`
);
