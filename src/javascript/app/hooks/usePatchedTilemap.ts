import { useMemo } from 'react';
import { useRam } from './useRam';
import { useRom } from './useRom';
import usePatchStore from '../stores/patchStore';
import { hexPadSimple } from '../../tools/hexPad';
import { getPatchedRange } from '../../tools/getPatchedRange';

interface UsePatchedTilemap {
  vramTilesOffset: number | null,
  vramMapOffset: number | null,
  gotoLocation: (location: number) => void,
  tileMapTiles: string[],
}

export const usePatchedTilemap = (): UsePatchedTilemap => {
  const { tileMap, vramTilesOffset, vramMapOffset } = useRam();
  const { romContent, gotoLocation } = useRom();
  const { patches } = usePatchStore();

  const tileMapTiles = useMemo<string[]>(() => {
    if (vramTilesOffset === null) {
      return [];
    }

    return (
      tileMap.map((tileIndex) => {
        const mapOffset = tileIndex < 0x80 ? tileIndex + 0x100 : tileIndex;
        const totalOffset = (mapOffset * 0x10) + vramTilesOffset;
        return getPatchedRange(romContent, patches, totalOffset, 16)
          .map(((code) => hexPadSimple(code)))
          .join(' ');
      })
    );
  }, [patches, romContent, tileMap, vramTilesOffset]);

  return {
    vramTilesOffset,
    vramMapOffset,
    tileMapTiles,
    gotoLocation,
  };
};
