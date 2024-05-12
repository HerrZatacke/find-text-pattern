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
  pageSize: string,
  romPage: string,
  setFile: (file: File | null) => void,
  unloadFile: () => void,
  setPageSize: (pageSize: string) => void,
  setRomPage: (romPage: string) => void,
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
      pageSize: (0x200).toString(10),
      romPage: '0',
      found: [],

      setFile: async (file: File | null) => {
        if (!file) {
          return;
        }

        const romContent = await file.arrayBuffer();

        if (VALID_ROM_SIZES.includes(romContent.byteLength)) {
          const { pageSize } = getState();

          set({
            romContent,
            romSize: romContent.byteLength,
            romPage: '0',
            maxPage: Math.ceil(romContent.byteLength / parseInt(pageSize, 10)) - 1,
          });
        }
      },

      unloadFile: () => {
        set({
          romContent: new ArrayBuffer(0),
          romSize: 0,
          romPage: '0',
          maxPage: 0,
        });
      },

      setPageSize: (pageSize: string) => {
        if (!pageSize) {
          return;
        }

        const { romSize } = getState();
        set({
          pageSize,
          romPage: '0',
          maxPage: Math.ceil(romSize / parseInt(pageSize, 10)) - 1,
        });
      },

      setRomPage: (romPage: string) => {
        set({
          romPage,
        });
      },

      cleanRomPage: () => {
        const { romPage, maxPage } = getState();
        set({
          romPage: Math.min(Math.max(parseInt(romPage, 10) || 0, 0), maxPage).toString(10),
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
        setRomPage(Math.floor(location / parseInt(pageSize, 10)).toString());

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
