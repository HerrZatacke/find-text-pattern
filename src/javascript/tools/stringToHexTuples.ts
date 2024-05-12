export const hexRegEx = /[^0-9a-f]/gi;
export const splitRegEx = /.{1,2}/g;

export const stringToHexTuples = (value: string): string[] => {
  const split = value.split(' ');
  const clean = split.map((part): string[] => {
    const tupleParts = part.replace(hexRegEx, '').match(splitRegEx);
    return tupleParts?.length ? tupleParts.map((tuplePart) => tuplePart.padStart(2, '0')) : [];
  });

  return clean.flat(1);
};
