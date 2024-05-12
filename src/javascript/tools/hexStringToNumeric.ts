import { stringToHexTuples } from './stringToHexTuples';

export const hexStringToNumeric = (value: string): Uint8Array => {
  const tuples = stringToHexTuples(value);

  if (!tuples.length) {
    return new Uint8Array([]);
  }

  return new Uint8Array(tuples.map((hex) => parseInt(hex, 16)));
};
