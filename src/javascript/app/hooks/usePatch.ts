import { useMemo } from 'react';
import { saveAs } from 'file-saver';
import type { PatchStoreState } from '../stores/patchStore';
import usePatchStore from '../stores/patchStore';
import useRomStore from '../stores/romStore';
import type { MapChar, Patch } from '../../../types/MapChar';
import { findCharByCode } from '../../tools/findChar';
import { BAD_CHAR } from '../../../constants/charMap';


export interface UsePatch extends Omit<PatchStoreState, 'clearPatches' | 'deletePatches'> {
  editChar: MapChar | null,
  downloadPatchedFile: () => void,
  romContentArray: Uint8Array,
  patchedPage: MapChar[],
  cleanPatches: () => void,
}

const getPatchedChar = (globalOffset: number, patches: Patch[], romContentArray: Uint8Array): MapChar => {
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

export const usePatch = (): UsePatch => {
  const {
    editLocation,
    setEditLocation,
    patches,
    addPatchText,
    deletePatches,
  } = usePatchStore();

  const {
    pageSize,
    romPage,
    romContent,
  } = useRomStore();

  const pageOffset = romPage * pageSize;

  const romContentArray = useMemo<Uint8Array>(() => new Uint8Array(romContent), [romContent]);

  const editChar = useMemo<MapChar | null>(() => {
    if (editLocation === null) {
      return null;
    }

    return getPatchedChar(editLocation, patches, romContentArray);
  }, [editLocation, patches, romContentArray]);

  const patchedPage = useMemo<MapChar[]>(() => {
    const pageBuffer = [...new Array(pageSize)].fill(null);
    return (
      pageBuffer.reduce((acc: MapChar[], _, index: number): MapChar[] => (
        acc.concat(getPatchedChar(pageOffset + index, patches, romContentArray))
      ), [])
    );
  }, [pageOffset, pageSize, patches, romContentArray]);

  const downloadPatchedFile = () => {
    const patched = romContentArray
      .map((code: number, location: number) => {
        const patch = patches.find((p) => location === p.location);
        return patch?.code || code;
      });

    const blob = new Blob([patched], {
      type: 'application/octet-stream',
    });

    saveAs(blob, 'patched.rom.gb');
  };

  const cleanPatches = () => {
    const toDelete = patches.filter(({ location }) => {
      const patchedChar = getPatchedChar(location, patches, romContentArray);
      const originalChar = findCharByCode(romContentArray[location]);

      return patchedChar.code === originalChar?.code;
    });

    deletePatches(toDelete.map(({ location }) => location));
  };

  return {
    editChar,
    editLocation,
    romContentArray,
    setEditLocation,
    patches,
    addPatchText,
    patchedPage,
    downloadPatchedFile,
    cleanPatches,
  };
};
