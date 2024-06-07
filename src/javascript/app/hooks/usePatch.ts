import { useMemo } from 'react';
import { saveAs } from 'file-saver';
import type { PatchStoreState } from '../stores/patchStore';
import usePatchStore from '../stores/patchStore';
import useRomStore from '../stores/romStore';
import type { MapChar } from '../../../types/MapChar';
import { findCharByCode } from '../../tools/findChar';
import { getPatchedChar } from '../../tools/getPatchedChar';
import { useDataContext } from './useDataContext';

export interface UsePatch extends Omit<PatchStoreState, 'clearPatches' | 'deletePatches'> {
  editChar: MapChar | null,
  downloadPatchedFile: () => void,
  cleanPatches: () => void,
}

export const usePatch = (): UsePatch => {
  const {
    editLocation,
    setEditLocation,
    patches,
    addPatchText,
    deletePatches,
  } = usePatchStore();

  const {
    romFileName,
  } = useRomStore();

  const { romContentArray } = useDataContext();

  const editChar = useMemo<MapChar | null>(() => {
    if (editLocation === null) {
      return null;
    }

    return getPatchedChar(editLocation, patches, romContentArray);
  }, [editLocation, patches, romContentArray]);

  const downloadPatchedFile = () => {
    const patched = romContentArray
      .map((code: number, location: number) => {
        const patch = patches.find((p) => location === p.location);
        return patch?.code || code;
      });

    const blob = new Blob([patched], {
      type: 'application/octet-stream',
    });

    saveAs(blob, `patched.${romFileName}`);
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
    setEditLocation,
    patches,
    addPatchText,
    downloadPatchedFile,
    cleanPatches,
  };
};
