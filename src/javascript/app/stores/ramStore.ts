import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCompressedJSONStorage } from '../../tools/zustand/createCompressedStorage';

export interface RamStoreState {
  fileContent: ArrayBuffer,
  setRamFile: (file: File) => void,
  unloadFile: () => void,
}

const useRamStore = create(
  persist<RamStoreState>(
    (set) => ({
      fileContent: new ArrayBuffer(0),
      vramTilesOffset: 0,

      setRamFile: async (file: File) => {
        const fileContent = await file.arrayBuffer();
        // const vramContent = fileContent.slice(VRAM_SN1_OFFSET, VRAM_SN1_OFFSET + VRAM_SIZE);
        // const tileMap = [...new Uint8Array(fileContent.slice(TILEMAP_SN1_OFFSET, TILEMAP_SN1_OFFSET + 1024))];
        // const vramTiles = toTiles(new Uint8Array(vramContent));

        set({
          fileContent,
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
