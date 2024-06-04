import type { Patch } from '../../types/MapChar';
import { getPatchedChar } from './getPatchedChar';

export const getPatchedRange = (
  romContent: ArrayBuffer,
  patches: Patch[],
  sliceStart: number,
  sliceLength: number,
): number[] => {
  if (!sliceLength) {
    return [];
  }

  const romContentArray = new Uint8Array(romContent);

  return Array(sliceLength)
    .fill(0)
    .map((_, offset) => {
      const patchedChar = getPatchedChar(sliceStart + offset, patches, romContentArray);
      return patchedChar.code;
    });
};
