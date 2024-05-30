import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { compress, decompress } from '../../tools/gzip';

const VRAM_SN1_OFFSET = 0x2465;
const VRAM_SIZE = 0x1800;

export interface RamStoreState {
  vramContent: ArrayBuffer,
  setRamFile: (file: File) => void,
  unloadFile: () => void,
}

const useRamStore = create(
  persist<RamStoreState>(
    (set) => ({
      vramContent: new ArrayBuffer(0),

      setRamFile: async (file: File) => {
        const sn1FileContent = await file.arrayBuffer();

        const vramContent = sn1FileContent.slice(VRAM_SN1_OFFSET, VRAM_SN1_OFFSET + VRAM_SIZE);

        set({
          vramContent,
        });
      },

      unloadFile: () => {
        set({
          vramContent: new ArrayBuffer(0),
        });
      },
    }),
    {
      name: 'find-text-pattern-ram',
      // storage: createJSONStorage(() => sessionStorage),
      serialize: async (value) => {
        const vramContent = await compress(value.state.vramContent);
        return JSON.stringify({
          ...value,
          state: {
            ...value.state,
            vramContent,
          },
        });
      },
      deserialize: async (value: string) => {
        const parsed = JSON.parse(value);
        parsed.state.vramContent = await decompress(new Uint8Array(parsed.state.vramContent));
        return parsed;
      },
    },
  ),
);

export default useRamStore;
