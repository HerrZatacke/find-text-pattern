import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { compressString, decompressString } from '../../tools/gzip';
import { toTiles } from '../../tools/toTiles';

const VRAM_SN1_OFFSET = 0x2465;
const TILEMAP_SN1_OFFSET = 0x3C65;
const VRAM_SIZE = 0x1800;

export interface RamStoreState {
  tileMap: number[],
  vramTiles: string[],
  vramSize: number,
  vramTilesOffset: number, // Position of tiles in ROM copied to VRAM
  setRamFile: (file: File) => void,
  unloadFile: () => void,
}

const useRamStore = create(
  persist<RamStoreState>(
    (set) => ({
      tileMap: [],
      vramTiles: [],
      vramSize: 0,
      vramTilesOffset: 0,

      setRamFile: async (file: File) => {
        const sn1FileContent = await file.arrayBuffer();
        const vramContent = sn1FileContent.slice(VRAM_SN1_OFFSET, VRAM_SN1_OFFSET + VRAM_SIZE);
        const tileMap = [...new Uint8Array(sn1FileContent.slice(TILEMAP_SN1_OFFSET, TILEMAP_SN1_OFFSET + 1024))];
        const vramTiles = toTiles(new Uint8Array(vramContent));

        set({
          vramTiles,
          vramSize: vramTiles.length,
          tileMap,
          vramTilesOffset: 0x59800,
        });
      },

      unloadFile: () => {
        set({
          vramTiles: [],
          vramSize: 0,
          tileMap: [],
          vramTilesOffset: 0,
        });
      },
    }),
    {
      name: 'find-text-pattern-ram',
      // storage: createJSONStorage(() => sessionStorage),
      serialize: async (value) => {
        const vramTiles = await compressString(value.state.vramTiles.join('\n'));
        return JSON.stringify({
          ...value,
          state: {
            ...value.state,
            vramTiles,
          },
        });
      },
      deserialize: async (value: string) => {
        const parsed = JSON.parse(value);
        parsed.state.vramTiles = (await decompressString(new Uint8Array(parsed.state.vramTiles))).split('\n');
        return parsed;
      },
    },
  ),
);

export default useRamStore;
