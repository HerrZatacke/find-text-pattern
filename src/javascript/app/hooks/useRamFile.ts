import type { ChangeEvent } from 'react';
import useNotificationsStore from '../stores/notificationsStore';
import useTileMapsStore from '../stores/tileMapsStore';
import {
  TILEMAP_SIZE,
  TILEMAP_SN1_OFFSET,
  VRAM_SIZE,
  VRAM_SIZE_REDUCED,
  VRAM_SN1_OFFSET,
  VRAM_SN1_OFFSET_REDUCED,
} from '../../../constants/ram';
import { useFuzzySearch } from './useFuzzySearch';
import { useDataContext } from './useDataContext';


interface UseRamFile {
  hasVRAMFile: boolean,
  onChangeRamFile: (ev: ChangeEvent<HTMLInputElement>) => void,
}

export const useRamFile = (): UseRamFile => {
  const { vramSize } = useDataContext();

  const { addMessage } = useNotificationsStore();

  const hasVRAMFile = vramSize > 0;

  const { findClosest } = useFuzzySearch();

  const { addTileMap } = useTileMapsStore();

  const onChangeRamFile = async (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target;

    if (!target.files) {
      return;
    }

    const file = [...target.files].find((searchfile) => (
      searchfile.name.match(/\.(?<extension>sn[0-9]{1}$)/gi)
    ));

    if (!file) {
      addMessage({ text: 'Invalid file - must be a .snX gamestate from BGB emulator.', type: 'error' });
    } else {
      const fileContent = await file.arrayBuffer();

      const tileMap = new Uint8Array(fileContent.slice(TILEMAP_SN1_OFFSET, TILEMAP_SN1_OFFSET + TILEMAP_SIZE));
      const vramContent = new Uint8Array(fileContent.slice(VRAM_SN1_OFFSET, VRAM_SN1_OFFSET + VRAM_SIZE));
      const vramContentReduced = new Uint8Array(
        fileContent.slice(VRAM_SN1_OFFSET_REDUCED, VRAM_SN1_OFFSET_REDUCED + VRAM_SIZE_REDUCED),
      );

      const [
        tileMapResult,
        vramTilesResult,
        vramTilesResultReduced,
      ] = await Promise.all([
        findClosest(tileMap, 'tileMap'),
        findClosest(vramContent, 'vramTiles'),
        findClosest(vramContentReduced, 'vramTilesOff'),
      ]);

      if (vramTilesResult.pos && tileMapResult.pos) {
        const internalMapping = Array(32 * 32)
          .fill('')
          .map((_, index: number) => (
            tileMapResult.pos + index
          ));

        addTileMap({
          title: `${file.name} | VRAM (full) score:${vramTilesResult.score} | Tilemap score:${tileMapResult.score}`,
          internalMapping,
          vramOffset: vramTilesResult.pos,
          width: 32,
          height: 32,
        });

        addTileMap({
          title: `${file.name} | VRAM (reduced) score:${vramTilesResult.score} | Tilemap score:${tileMapResult.score}`,
          internalMapping,
          vramOffset: vramTilesResultReduced.pos - (VRAM_SIZE - VRAM_SIZE_REDUCED),
          width: 32,
          height: 32,
        });

        addMessage({ text: `File parsed successfully | VRAM score:${vramTilesResult.score} | Tilemap score:${tileMapResult.score}`, type: 'success' });
      } else {
        addMessage({ text: 'Could not find tiles and/or map in loaded file', type: 'error' });
      }
    }

    target.value = '';
  };

  return {
    hasVRAMFile,
    onChangeRamFile,
  };
};
