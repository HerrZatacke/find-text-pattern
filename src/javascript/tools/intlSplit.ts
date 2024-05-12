
export const intlSplit = (value: string): string[] => {
  const iterator = new Intl.Segmenter('en', { granularity: 'grapheme' }).segment(value);
  return Array.from(iterator, ({ segment }) => segment);
};
