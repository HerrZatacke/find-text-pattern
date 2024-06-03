import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCompressedJSONStorage } from '../../tools/zustand/createCompressedStorage';

export interface RamStoreState {
  fileContent: ArrayBuffer,
  setRamFile: (file: File) => void,
  vramTilesOffset: number,
  setVRAMTilesOffset: (offset: number) => void,
  unloadFile: () => void,
}

const useRamStore = create(
  persist<RamStoreState>(
    (set) => ({
      fileContent: new ArrayBuffer(0),
      vramTilesOffset: 0,

      setVRAMTilesOffset: (vramTilesOffset: number) => {
        set({ vramTilesOffset });
      },

      setRamFile: async (file: File) => {
        const fileContent = await file.arrayBuffer();
        set({
          fileContent,
          vramTilesOffset: 0,
        });
      },

      unloadFile: () => {
        set({
          fileContent: new ArrayBuffer(0),
          vramTilesOffset: 0,
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
