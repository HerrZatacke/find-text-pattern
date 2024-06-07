import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createCompressedJSONStorage } from '../../tools/zustand/createCompressedStorage';

export interface RomStoreState {
  romContent: ArrayBuffer,
  pageSize: number,
  romPage: number,
  romFileName: string,

  setFile: (file: File) => void,
  unloadFile: () => void,
  setPageSize: (pageSize: number) => void,
  setRomPage: (romPage: number) => void,
  find: (rawPattern: Uint8Array | number[]) => number[],
  gotoLocation: (location: number) => void,
}

const useRomStore = create(
  persist<RomStoreState>(
    (set, getState) => ({
      romContent: new ArrayBuffer(0),
      pageSize: 0x200,
      romPage: 0,
      romFileName: '',

      setFile: async (file: File) => {
        if (!file) {
          return;
        }

        const romContent = await file.arrayBuffer();

        set({
          romContent,
          romPage: 0,
          romFileName: file.name,
        });
      },

      unloadFile: () => {
        set({
          romContent: new ArrayBuffer(0),
          romPage: 0,
          romFileName: '',
        });
      },

      setPageSize: (pageSize: number) => {
        if (!pageSize) {
          return;
        }

        set({
          pageSize,
          romPage: 0,
        });
      },

      setRomPage: (romPage: number) => {
        const { romContent, pageSize } = getState();
        const maxPage = Math.ceil(romContent.byteLength / pageSize) - 1;
        set({
          romPage: Math.min(Math.max(romPage, 0), maxPage),
        });
      },

      find: (rawPattern: Uint8Array | number[]) => {
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
      storage: createCompressedJSONStorage(() => localStorage, { arrayBufferFields: ['romContent'] }),
    },
  ),
);

export default useRomStore;
