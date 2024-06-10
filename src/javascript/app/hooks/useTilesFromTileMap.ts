import { useCallback } from 'react';
import { getPatchedRange } from '../../tools/getPatchedRange';
import { hexPadSimple } from '../../tools/hexPad';
import usePatchStore from '../stores/patchStore';

interface UseTilesFromTileMap {
  tilesFromTileMap: (
    tileMap: Uint8Array | number[],
    totalOffset: number,
    romContentArray: Uint8Array,
    useLowerVRAM: boolean,
  ) => string[],
}

export const useTilesFromTileMap = (): UseTilesFromTileMap => {
  const { patches } = usePatchStore();

  const tilesFromTileMap = useCallback((
    tileMap: Uint8Array | number[],
    globalOffset: number,
    romContentArray: Uint8Array,
    useLowerVRAM: boolean,
  ): string[] => (
    [...tileMap].map((tileIndex) => {
      const offset = (!useLowerVRAM && tileIndex < 0x80) ? tileIndex + 0x100 : tileIndex;
      const totalOffset = (offset * 0x10) + globalOffset;
      return getPatchedRange(romContentArray, patches, totalOffset, 16)
        .map(((code) => hexPadSimple(code)))
        .join(' ');
    })
  ), [patches]);

  return {
    tilesFromTileMap,
  };
};
