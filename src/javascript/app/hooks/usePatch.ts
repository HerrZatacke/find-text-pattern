import { saveAs } from 'file-saver';
import type { PatchStoreState } from '../stores/patchStore';
import usePatchStore from '../stores/patchStore';
import useRomStore from '../stores/romStore';
import type { Patch } from '../../../types/MapChar';


export interface UsePatch extends Omit<PatchStoreState, 'clearPatches'> {
  downloadPatchedFile: () => void,
}

export const usePatch = (): UsePatch => {
  const {
    patches,
    upsertPatch: storeUpsertPatch,
    deletePatch,
  } = usePatchStore();

  const { romContent } = useRomStore();

  const upsertPatch = (patch: Patch) => {
    const romCharCode = new Uint8Array(romContent)[patch.location];
    if (romCharCode === patch.code) {
      deletePatch(patch.location);
    } else {
      storeUpsertPatch(patch);
    }
  };

  const downloadPatchedFile = () => {
    const patched = new Uint8Array(romContent)
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
    patches,
    upsertPatch,
    deletePatch,
    downloadPatchedFile,
  };
};
