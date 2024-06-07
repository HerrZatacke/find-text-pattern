import { useNavigate } from 'react-router-dom';
import useRomStore from '../stores/romStore';
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
  const navigateTo = useNavigate();

  const {
    found,
    currentFound,
    setCurrentFound: storeSetCurrentFound,
    setFound,
  } = useSearchStore();

  const { gotoLocation, find } = useRomStore();

  const { rawPattern } = usePatternStore();

  const findInRom = () => {
    setFound(find(new Uint8Array(rawPattern)));
    navigateTo('/romview');
  };

  const setCurrentFound = (index: number) => {
    const maxIndex = found.length - 1;
    const gotoIndex = Math.min(Math.max(index, 0), maxIndex);
    storeSetCurrentFound(gotoIndex);
    gotoLocation(found[gotoIndex]);
    navigateTo('/romview');
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
