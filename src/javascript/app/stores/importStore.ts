import { create } from 'zustand';

export interface ImportState {
  tileMap: Uint8Array | null,
  vramContent: Uint8Array | null,
  fileName: string | null,
  setTileMap: (tileMap: Uint8Array) => void,
  setVRAMContent: (vramContent: Uint8Array) => void,
  setFileName: (fileName: string) => void,
  reset: () => void,
}

const useImportStore = create<ImportState>(
  (set) => ({
    tileMap: null,
    vramContent: null,
    fileName: null,

    setTileMap: (tileMap: Uint8Array) => {
      set(() => ({
        tileMap,
      }));
    },

    setVRAMContent: (vramContent: Uint8Array) => {
      set(() => ({
        vramContent,
      }));
    },

    setFileName: (fileName: string) => {
      set(() => ({
        fileName,
      }));
    },

    reset: () => {
      set({
        tileMap: null,
        vramContent: null,
        fileName: null,
      });
    },
  }),
);

export default useImportStore;
