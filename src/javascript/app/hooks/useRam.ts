import { useMemo } from 'react';
import useRamStore from '../stores/ramStore';
import { toTiles } from '../../tools/toTiles';
import { TILEMAP_SIZE, TILEMAP_SN1_OFFSET, VRAM_SIZE, VRAM_SN1_OFFSET } from '../../../constants/ram';
import useRomStore from '../stores/romStore';

interface UseRam {
  tileMap: number[],
  vramTiles: string[],
  vramTilesOffset: number | null,
  vramMapOffset: number | null,
  vramSize: number,
  setRamFile: (file: File) => void,
  unloadFile: () => void,
  setVRAMTilesOffset: (offset: number) => void,
  setVRAMMapOffset: (vramMapOffset: number) => void,
}

export const useRam = (): UseRam => {
  const {
    fileContent,
    vramTilesOffset,
    vramMapOffset,
    setRamFile,
    unloadFile,
    setVRAMTilesOffset,
    setVRAMMapOffset,
  } = useRamStore();

  const {
    romContent,
  } = useRomStore();

  const vramContent = useMemo<ArrayBuffer>(() => {
    if (vramTilesOffset !== null) {
      return romContent.slice(vramTilesOffset, vramTilesOffset + VRAM_SIZE);
    }

    return (
      fileContent.slice(VRAM_SN1_OFFSET, VRAM_SN1_OFFSET + VRAM_SIZE)
    );
  }, [fileContent, romContent, vramTilesOffset]);

  const tileMap = useMemo<number[]>(() => {
    if (vramMapOffset !== null) {
      return (
        [...new Uint8Array(romContent.slice(vramMapOffset, vramMapOffset + TILEMAP_SIZE))]
      );
    }

    return (
      [...new Uint8Array(fileContent.slice(TILEMAP_SN1_OFFSET, TILEMAP_SN1_OFFSET + TILEMAP_SIZE))]
    );
  }, [fileContent, romContent, vramMapOffset]);

  const vramTiles = useMemo<string[]>(() => (
    toTiles(new Uint8Array(vramContent))
  ), [vramContent]);

  return {
    tileMap,
    vramTiles,
    vramTilesOffset,
    vramMapOffset,
    vramSize: vramTiles.length,
    setRamFile,
    unloadFile,
    setVRAMTilesOffset,
    setVRAMMapOffset,
  };
};
