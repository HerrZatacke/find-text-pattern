import { useMemo } from 'react';
import type { MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataContext } from './useDataContext';
import { toTiles } from '../../tools/toTiles';
import usePatternStore from '../stores/patternStore';

interface UseVisual {
  showROMVisual: boolean,
  showRAMVisual: boolean,
  showSearchVisual: boolean,
  searchTiles: string[],
  romTiles: string[],
  vramTiles: string[],
  vramClick: (ev: MouseEvent<HTMLButtonElement>) => void,
}

export const useVisual = (): UseVisual => {
  const { vramTiles, vramSize, patchedPageArray } = useDataContext();
  const { setHex, cleanHex, rawPattern } = usePatternStore();

  const searchTiles = useMemo<string[]>(() => toTiles(new Uint8Array(rawPattern)), [rawPattern]);
  const romTiles = useMemo<string[]>(() => toTiles(patchedPageArray), [patchedPageArray]);

  const navigateTo = useNavigate();

  const vramClick = (ev: MouseEvent<HTMLButtonElement>) => {
    const x = Math.floor((ev.nativeEvent.offsetX - 1) / 8);
    const y = Math.floor(ev.nativeEvent.offsetY / 8);
    const tileIndex = (y * 16) + x;
    setHex(vramTiles[tileIndex]);
    cleanHex();
    navigateTo('/romview');
  };

  return {
    showROMVisual: Boolean(patchedPageArray.length),
    showRAMVisual: Boolean(vramSize),
    showSearchVisual: Boolean(rawPattern.byteLength),
    romTiles,
    searchTiles,
    vramTiles,
    vramClick,
  };
};
