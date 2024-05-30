import type { MapChar, Patch } from '../../types/MapChar';
import { findCharByCode } from './findChar';
import { BAD_CHAR } from '../../constants/charMap';

export const getPatchedChar = (globalOffset: number, patches: Patch[], romContentArray: Uint8Array): MapChar => {
  const patch = patches.find(({ location }) => location === globalOffset);
  let char = findCharByCode(patch?.code || romContentArray[globalOffset]);

  if (char && patch) {
    char = {
      ...char,
      patched: true,
    };
  }

  return char || BAD_CHAR;
};
