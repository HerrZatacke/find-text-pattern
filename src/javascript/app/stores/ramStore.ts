import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCompressedJSONStorage } from '../../tools/zustand/createCompressedStorage';

export interface RamStoreState {
  fileContent: ArrayBuffer,
  setRamFile: (file: File) => void,
  vramTilesOffset: number | null,
  setVRAMTilesOffset: (vramTilesOffset: number) => void,
  vramMapOffset: number | null,
  setVRAMMapOffset: (vramMapOffset: number) => void,
  unloadFile: () => void,
}

const useRamStore = create(
  persist<RamStoreState>(
    (set) => ({
      fileContent: new ArrayBuffer(0),
      vramTilesOffset: null,
      vramMapOffset: null,

      setVRAMTilesOffset: (vramTilesOffset: number) => {
        set({ vramTilesOffset });
      },

      setVRAMMapOffset: (vramMapOffset: number) => {
        set({ vramMapOffset });
      },

      setRamFile: async (file: File) => {
        const fileContent = await file.arrayBuffer();
        set({
          fileContent,
          vramTilesOffset: null,
          vramMapOffset: null,
        });
      },

      unloadFile: () => {
        set({
          fileContent: new ArrayBuffer(0),
        });
      },
    }),
    {
      name: 'find-text-pattern-ram',
      storage: createCompressedJSONStorage(() => localStorage, { arrayBufferFields: ['fileContent'] }),
    },
  ),
);

export default useRamStore;
