import { useNavigate } from 'react-router-dom';
import useRomStore from '../stores/romStore';
import usePatternStore from '../stores/patternStore';
import useSearchStore from '../stores/searchStore';

interface UseSearch {
  found: number[],
  foundCount: number,
  searchLength: number,
  findInRom: () => void,
  currentFound: number,
  setCurrentFound: (index: number) => void,
  clearSearch: () => void,
}

export const useSearch = (): UseSearch => {
  const navigateTo = useNavigate();

  const {
    found,
    currentFound,
    searchLength,
    setCurrentFound: storeSetCurrentFound,
    setFound,
  } = useSearchStore();

  const { gotoLocation, find } = useRomStore();

  const { rawPattern } = usePatternStore();

  const findInRom = () => {
    setFound(find(new Uint8Array(rawPattern)), rawPattern.byteLength);
    navigateTo('/romview');
  };

  const setCurrentFound = (index: number) => {
    const maxIndex = found.length - 1;
    const gotoIndex = Math.min(Math.max(index, 0), maxIndex);
    storeSetCurrentFound(gotoIndex);
    navigateTo('/romview');
    gotoLocation(found[gotoIndex]);
  };

  const clearSearch = () => {
    setFound([], 0);
  };

  return {
    found,
    foundCount: found.length,
    currentFound,
    searchLength,
    setCurrentFound,
    findInRom,
    clearSearch,
  };
};
