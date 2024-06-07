import useRomStore from '../stores/romStore';

interface UseRom {
  romSize: number,
  maxPage: number,
}

export const useRom = (): UseRom => {
  const {
    romContent,
    pageSize,
  } = useRomStore();

  const maxPage = Math.ceil(romContent.byteLength / pageSize) - 1;

  return {
    maxPage,
    romSize: romContent.byteLength,
  };
};
