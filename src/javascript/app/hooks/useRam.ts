import { useMemo } from 'react';
import useRamStore from '../stores/ramStore';
import useRomStore from '../stores/romStore';
import usePatchStore from '../stores/patchStore';
import { toTiles } from '../../tools/toTiles';
import { getPatchedRange } from '../../tools/getPatchedRange';
import { TILEMAP_SIZE, VRAM_SIZE } from '../../../constants/ram';

interface UseRam {
  tileMap: number[],
  vramTiles: string[],
  vramTilesOffset: number | null,
  vramMapOffset: number | null,
  vramSize: number,
  setVRAMTilesOffset: (offset: number) => void,
  setVRAMMapOffset: (vramMapOffset: number) => void,
  clear: () => void,
}

export const useRam = (): UseRam => {
  const {
    vramTilesOffset,
    vramMapOffset,
    setVRAMTilesOffset,
    setVRAMMapOffset,
    clear,
  } = useRamStore();

  const {
    romContent,
  } = useRomStore();

  const { patches } = usePatchStore();

  const vramContent = useMemo<ArrayBuffer>(() => {
    if (vramTilesOffset !== null) {
      return romContent.slice(vramTilesOffset, vramTilesOffset + VRAM_SIZE);
    }

    return new ArrayBuffer(0);
  }, [romContent, vramTilesOffset]);

  const tileMap = useMemo<number[]>(() => {
    if (vramMapOffset !== null) {
      return getPatchedRange(romContent, patches, vramMapOffset, TILEMAP_SIZE);
    }

    return [];
  }, [patches, romContent, vramMapOffset]);

  const vramTiles = useMemo<string[]>(() => (
    toTiles(new Uint8Array(vramContent))
  ), [vramContent]);

  return {
    tileMap,
    vramTiles,
    vramTilesOffset,
    vramMapOffset,
    vramSize: vramTiles.length,
    setVRAMTilesOffset,
    setVRAMMapOffset,
    clear,
  };
};
