import type { Patch } from '../../types/MapChar';
import { getPatchedChar } from './getPatchedChar';

export const getPatchedRange = (
  romContentArray: Uint8Array,
  patches: Patch[],
  sliceStart: number,
  sliceLength: number,
): number[] => {
  if (!sliceLength) {
    return [];
  }

  return Array(sliceLength)
    .fill(0)
    .map((_, offset) => {
      const patchedChar = getPatchedChar(sliceStart + offset, patches, romContentArray);
      return patchedChar.code;
    });
};
