import useRomStore from '../stores/romStore';

interface UseRom {
  romContent: ArrayBuffer,
  romSize: number,
  maxPage: number,
  pageSize: number,
  romPage: number,
  romFileName: string,

  setFile: (file: File) => void,
  unloadFile: () => void,
  setPageSize: (pageSize: number) => void,
  setRomPage: (romPage: number) => void,
  find: (rawPattern: Uint8Array) => number[],
  gotoLocation: (location: number) => void,
}

export const useRom = (): UseRom => {
  const {
    romContent,
    pageSize,
    romPage,
    romFileName,

    setRomPage: storeSetRomPage,
    setFile,
    unloadFile,
    setPageSize,
    find,
    gotoLocation,
  } = useRomStore();

  const maxPage = Math.ceil(romContent.byteLength / pageSize) - 1;

  const setRomPage = (page: number) => {
    storeSetRomPage(Math.min(Math.max(page, 0), maxPage));
  };

  return {
    maxPage,
    romSize: romContent.byteLength,
    romContent,
    pageSize,
    romPage,
    romFileName,

    setRomPage,
    setFile,
    unloadFile,
    setPageSize,
    find,
    gotoLocation,
  };
};
