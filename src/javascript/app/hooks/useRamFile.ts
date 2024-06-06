import type { ChangeEvent } from 'react';
import { useRam } from './useRam';
import { useRom } from './useRom';
import useNotificationsStore from '../stores/notificationsStore';
import { TILEMAP_SIZE, TILEMAP_SN1_OFFSET, VRAM_SIZE, VRAM_SN1_OFFSET } from '../../../constants/ram';
import { toTilesRaw } from '../../tools/toTiles';

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

  const { find } = useRom();

  const { addMessage } = useNotificationsStore();

  const hasVRAMFile = vramSize > 0;

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
      const vramContent = fileContent.slice(VRAM_SN1_OFFSET, VRAM_SN1_OFFSET + VRAM_SIZE);
      const vramRawTiles = toTilesRaw(new Uint8Array(vramContent));

      const vramTilesOffset = find(vramRawTiles[0]);
      const mapLocations = find(tileMap);

      // ToDo: ask if multiple locations found...
      if (vramTilesOffset.length && mapLocations.length) {
        setVRAMTilesOffset(vramTilesOffset[0]);
        setVRAMMapOffset(mapLocations[0]);
        addMessage({ text: 'File parsed successfully', type: 'success' });
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
