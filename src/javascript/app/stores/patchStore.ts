import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Patch } from '../../../types/MapChar';

export interface PatchStoreState {
  patches: Patch[],
  upsertPatch: (patch: Patch) => void,
  deletePatch: (location: number) => void,
  clearPatches: () => void,
}

const usePatchStore = create(
  persist<PatchStoreState>(
    (set, getState) => ({
      currentFound: 0,
      patches: [],

      upsertPatch: (patch: Patch) => {
        const { patches } = getState();
        set({
          patches: [...patches.filter((p) => p.location !== patch.location), patch],
        });
      },

      deletePatch: (location: number) => {
        const { patches } = getState();
        set({
          patches: patches.filter((patch) => patch.location !== location),
        });
      },

      clearPatches: () => {
        set({
          patches: [],
        });
      },
    }),
    {
      name: 'find-text-pattern-patch',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default usePatchStore;
