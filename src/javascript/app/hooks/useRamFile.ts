import type { ChangeEvent } from 'react';
import { useRam } from './useRam';
import useNotificationsStore from '../stores/notificationsStore';
import { TILEMAP_SIZE, TILEMAP_SN1_OFFSET, VRAM_SIZE, VRAM_SN1_OFFSET } from '../../../constants/ram';
import { useFuzzySearch } from './useFuzzySearch';


interface UseRamFile {
  hasVRAMFile: boolean,
  clear: () => void,
  onChangeRamFile: (ev: ChangeEvent<HTMLInputElement>) => void,
}

export const useRamFile = (): UseRamFile => {
  const {
    vramSize,
    setVRAMTilesOffset,
    setVRAMMapOffset,
    clear,
  } = useRam();


  const { addMessage } = useNotificationsStore();

  const hasVRAMFile = vramSize > 0;

  const { findClosest } = useFuzzySearch();

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

      const [
        tileMapResult,
        vramTilesResult,
      ] = await Promise.all([
        findClosest(tileMap, 'tileMap'),
        findClosest(vramContent, 'vramTiles'),
      ]);

      if (vramTilesResult.pos && tileMapResult.pos) {
        setVRAMTilesOffset(vramTilesResult.pos);
        setVRAMMapOffset(tileMapResult.pos);
        addMessage({ text: `File parsed successfully | VRAM score:${vramTilesResult.score} | Tilemap score:${tileMapResult.score} `, type: 'success' });
      } else {
        addMessage({ text: 'Could not find tiles and/or map in loaded file', type: 'error' });
      }
    }

    target.value = '';
  };

  return {
    hasVRAMFile,
    onChangeRamFile,
    clear,
  };
};
