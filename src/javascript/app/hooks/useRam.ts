import { useMemo } from 'react';
import useRamStore from '../stores/ramStore';
import { toTiles } from '../../tools/toTiles';

const VRAM_SN1_OFFSET = 0x2465;
const TILEMAP_SN1_OFFSET = 0x3C65;
const VRAM_SIZE = 0x1800;

interface UseRam {
  tileMap: number[],
  vramTiles: string[],
  vramTilesOffset: number,
  setRamFile: (file: File) => void,
  unloadFile: () => void,
  vramSize: number,
}

export const useRam = (): UseRam => {
  const { fileContent, setRamFile, unloadFile } = useRamStore();

  const vramContent = useMemo<ArrayBuffer>(() => (
    fileContent.slice(VRAM_SN1_OFFSET, VRAM_SN1_OFFSET + VRAM_SIZE)
  ), [fileContent]);

  const tileMap = useMemo<number[]>(() => (
    [...new Uint8Array(fileContent.slice(TILEMAP_SN1_OFFSET, TILEMAP_SN1_OFFSET + 1024))]
  ), [fileContent]);

  const vramTiles = useMemo<string[]>(() => (
    toTiles(new Uint8Array(vramContent))
  ), [vramContent]);

  const vramTilesOffset = fileContent.byteLength > 0x59800 ? 0x59800 : 0;

  return {
    tileMap,
    vramTiles,
    vramSize: vramTiles.length,
    vramTilesOffset,
    setRamFile,
    unloadFile,
  };
};
