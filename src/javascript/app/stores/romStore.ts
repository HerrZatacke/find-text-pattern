import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { compress, decompress } from '../../tools/gzip';

/* eslint-disable no-bitwise */
const VALID_ROM_SIZES = [
  0x10000 << 0,
  0x10000 << 1,
  0x10000 << 2,
  0x10000 << 3,
  0x10000 << 4,
  0x10000 << 5,
  0x10000 << 6,
  0x10000 << 7,
];
/* eslint-enable no-bitwise */

export interface RomStoreState {
  romContent: ArrayBuffer,
  romSize: number,
  maxPage: number,
  pageSize: number,
  romPage: number,

  setFile: (file: File) => void,
  unloadFile: () => void,
  setPageSize: (pageSize: number) => void,
  setRomPage: (romPage: number) => void,
  cleanRomPage: () => void,
  find: (rawPattern: Uint8Array) => number[],
  gotoLocation: (location: number) => void,
}

const useRomStore = create(
  persist<RomStoreState>(
    (set, getState) => ({
      romContent: new ArrayBuffer(0),
      romSize: 0,
      maxPage: 0,
      pageSize: 0x200,
      romPage: 0,

      setFile: async (file: File) => {
        if (!file) {
          return;
        }

        const romContent = await file.arrayBuffer();

        if (VALID_ROM_SIZES.includes(romContent.byteLength)) {
          const { pageSize } = getState();

          set({
            romContent,
            romSize: romContent.byteLength,
            romPage: 0,
            maxPage: Math.ceil(romContent.byteLength / pageSize) - 1,
          });
        }
      },

      unloadFile: () => {
        set({
          romContent: new ArrayBuffer(0),
          romSize: 0,
          romPage: 0,
          maxPage: 0,
        });
      },

      setPageSize: (pageSize: number) => {
        if (!pageSize) {
          return;
        }

        const { romSize } = getState();
        set({
          pageSize,
          romPage: 0,
          maxPage: Math.ceil(romSize / pageSize) - 1,
        });
      },

      setRomPage: (romPage: number) => {
        set({
          romPage,
        });
      },

      cleanRomPage: () => {
        const { romPage, maxPage } = getState();
        set({
          romPage: Math.min(Math.max(romPage, 0), maxPage),
        });
      },

      find: (rawPattern: Uint8Array) => {
        const needle = rawPattern.join(',');
        const { romContent, gotoLocation } = getState();
        const contentArray = new Uint8Array(romContent);

        const locations = contentArray.reduce((acc: number[], value: number, index: number) => {
          if (value === rawPattern[0]) {
            const romSlice = new Uint8Array(romContent.slice(index, index + rawPattern.length));
            if (romSlice.join(',') === needle) {
              return acc.concat(index);
            }
          }

          return acc;
        }, []);

        if (locations[0]) {
          gotoLocation(locations[0]);
        }

        return locations;
      },
      gotoLocation: (location: number) => {
        const { pageSize, setRomPage } = getState();
        setRomPage(Math.floor(location / pageSize));

        window.setTimeout(() => {
          const hl = document.querySelectorAll('.render-char__highlight-current');

          const visibleNode = ([...hl] as HTMLElement[]).find((domNode) => (
            domNode.getBoundingClientRect().width &&
            domNode.getBoundingClientRect().height
          ));

          visibleNode?.scrollIntoView({
            behavior: 'instant',
            block: 'center',
            inline: 'start',
          });
        }, 100);
      },
    }),
    {
      name: 'find-text-pattern-rom',
      // storage: createJSONStorage(() => sessionStorage),
      serialize: async (value) => {
        const romContent = await compress(value.state.romContent);
        return JSON.stringify({
          ...value,
          state: {
            ...value.state,
            romContent,
          },
        });
      },
      deserialize: async (value: string) => {
        const parsed = JSON.parse(value);
        parsed.state.romContent = await decompress(new Uint8Array(parsed.state.romContent));
        return parsed;
      },
    },
  ),
);

export default useRomStore;
