import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface RamStoreState {
  vramTilesOffset: number | null,
  setVRAMTilesOffset: (vramTilesOffset: number) => void,
  vramMapOffset: number | null,
  setVRAMMapOffset: (vramMapOffset: number) => void,
  clear: () => void,
}

const useRamStore = create(
  persist<RamStoreState>(
    (set) => ({
      vramTilesOffset: null,
      vramMapOffset: null,

      setVRAMTilesOffset: (vramTilesOffset: number) => {
        set({ vramTilesOffset });
      },

      setVRAMMapOffset: (vramMapOffset: number) => {
        set({ vramMapOffset });
      },

      clear: () => {
        set({
          vramTilesOffset: null,
          vramMapOffset: null,
        });
      },
    }),
    {
      name: 'find-text-pattern-ram',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useRamStore;
