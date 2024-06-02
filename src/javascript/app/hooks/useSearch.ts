import { useRom } from './useRom';
import usePatternStore from '../stores/patternStore';
import useSearchStore from '../stores/searchStore';

interface UseSearch {
  found: number[],
  foundCount: number,
  findInRom: () => void,
  currentFound: number,
  setCurrentFound: (index: number) => void,
  clearSearch: () => void,
}

export const useSearch = (): UseSearch => {

  const {
    found,
    currentFound,
    setCurrentFound: storeSetCurrentFound,
    setFound,
  } = useSearchStore();

  const { gotoLocation, find } = useRom();

  const { rawPattern } = usePatternStore();

  const findInRom = () => {
    setFound(find(rawPattern));
  };

  const setCurrentFound = (index: number) => {
    const maxIndex = found.length - 1;
    const gotoIndex = Math.min(Math.max(index, 0), maxIndex);
    storeSetCurrentFound(gotoIndex);
    gotoLocation(found[gotoIndex]);
  };

  const clearSearch = () => {
    setFound([]);
  };

  return {
    found,
    foundCount: found.length,
    currentFound,
    setCurrentFound,
    findInRom,
    clearSearch,
  };
};
