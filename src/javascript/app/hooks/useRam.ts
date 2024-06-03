import { useMemo } from 'react';
import useRamStore from '../stores/ramStore';
import { toTiles } from '../../tools/toTiles';
import { TILEMAP_SN1_OFFSET, VRAM_SIZE, VRAM_SN1_OFFSET } from '../../../constants/ram';

interface UseRam {
  tileMap: number[],
  vramTiles: string[],
  vramTilesOffset: number,
  setRamFile: (file: File) => void,
  setVRAMTilesOffset: (offset: number) => void,
  unloadFile: () => void,
  vramSize: number,
}

export const useRam = (): UseRam => {
  const {
    fileContent,
    vramTilesOffset,
    setRamFile,
    unloadFile,
    setVRAMTilesOffset,
  } = useRamStore();

  const vramContent = useMemo<ArrayBuffer>(() => (
    fileContent.slice(VRAM_SN1_OFFSET, VRAM_SN1_OFFSET + VRAM_SIZE)
  ), [fileContent]);

  const tileMap = useMemo<number[]>(() => (
    [...new Uint8Array(fileContent.slice(TILEMAP_SN1_OFFSET, TILEMAP_SN1_OFFSET + 1024))]
  ), [fileContent]);

  const vramTiles = useMemo<string[]>(() => (
    toTiles(new Uint8Array(vramContent))
  ), [vramContent]);

  return {
    tileMap,
    vramTiles,
    vramSize: vramTiles.length,
    vramTilesOffset,
    setRamFile,
    setVRAMTilesOffset,
    unloadFile,
  };
};
