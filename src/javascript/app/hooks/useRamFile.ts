import type { ChangeEvent } from 'react';
import useNotificationsStore from '../stores/notificationsStore';
import {
  TILEMAP_SIZE,
  TILEMAP_SN1_OFFSET,
  VRAM_SIZE,
  VRAM_SN1_OFFSET,
} from '../../../constants/ram';
import useImportStore from '../stores/importStore';


interface UseRamFile {
  onChangeRamFile: (ev: ChangeEvent<HTMLInputElement>) => void,
}

export const useRamFile = (): UseRamFile => {
  const { addMessage } = useNotificationsStore();
  const { setTileMap, setVRAMContent, setFileName } = useImportStore();

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

      setTileMap(tileMap);
      setVRAMContent(vramContent);
      setFileName(file.name);
    }

    target.value = '';
  };

  return {
    onChangeRamFile,
  };
};
