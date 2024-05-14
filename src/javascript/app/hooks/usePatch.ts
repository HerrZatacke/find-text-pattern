import { saveAs } from 'file-saver';
import type { PatchStoreState } from '../stores/patchStore';
import usePatchStore from '../stores/patchStore';
import useRomStore from '../stores/romStore';
import type { MapChar } from '../../../types/MapChar';
import { findCharByCode } from '../../tools/findChar';


export interface UsePatch extends Omit<PatchStoreState, 'clearPatches'> {
  editChar: MapChar | null,
  downloadPatchedFile: () => void,
  romContentArray: Uint8Array,
}

export const usePatch = (): UsePatch => {
  const {
    editLocation,
    setEditLocation,
    patches,
    addPatchText,
  } = usePatchStore();

  const { romContent } = useRomStore();

  const romContentArray = new Uint8Array(romContent);

  const editChar = editLocation !== null ? findCharByCode(romContentArray[editLocation]) : null;

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

  return {
    editChar,
    editLocation,
    romContentArray,
    setEditLocation,
    patches,
    addPatchText,
    downloadPatchedFile,
  };
};
