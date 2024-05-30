import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Patch } from '../../../types/MapChar';
import { intlSplit } from '../../tools/intlSplit';
import { findCharByValue } from '../../tools/findChar';
import { sortBy } from '../../tools/sortBy';

export interface PatchStoreState {
  editLocation: number | null,
  setEditLocation: (editLocation: number | null) => void,
  patches: Patch[],
  addPatchText: (text: string) => void
  deletePatches: (locations: number[]) => void,
  clearPatches: () => void,
}

const usePatchStore = create(
  persist<PatchStoreState>(
    (set, getState) => ({
      editLocation: null,
      currentFound: 0,
      patches: [],

      setEditLocation: (editLocation: number | null) => {
        set({
          editLocation,
        });
      },

      addPatchText: (text: string) => {
        const { patches, editLocation } = getState();

        if (editLocation === null) {
          return;
        }

        const tokens = intlSplit(text);

        const newPatches = tokens.map((token: string, index: number): Patch => {
          const char = findCharByValue(token);
          if (!char) {
            throw new Error(`could not find char for "${token}"`);
          }

          return {
            location: editLocation + index,
            code: char.code,
          };
        });

        const newLocations = newPatches.map(({ location }) => location);

        const filteredPatches = patches.filter(({ location }) => !newLocations.includes(location));

        set({
          patches: sortBy<Patch>('location')([...filteredPatches, ...newPatches]),
          editLocation: null,
        });
      },

      deletePatches: (locations: number[]) => {
        const { patches } = getState();
        set({
          patches: patches.filter((patch) => !locations.includes(patch.location)),
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
