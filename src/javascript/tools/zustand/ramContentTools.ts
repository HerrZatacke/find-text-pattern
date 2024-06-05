import useRamStore from '../../app/stores/ramStore';
import useRomStore from '../../app/stores/romStore';
import useNotificationsStore from '../../app/stores/notificationsStore';
import { toTilesRaw } from '../toTiles';
import { TILEMAP_SIZE, TILEMAP_SN1_OFFSET, VRAM_SIZE, VRAM_SN1_OFFSET } from '../../../constants/ram';

export const initRamContentTools = () => {
  useRamStore.subscribe((state, prevState) => {
    const fileContent = state.fileContent;

    if (!state.fileContent.byteLength || state.fileContent === prevState.fileContent) {
      return;
    }

    const {
      setVRAMTilesOffset,
      setVRAMMapOffset,
      unloadFile,
    } = state;

    const find = useRomStore.getState().find;

    const tileMap = new Uint8Array(fileContent.slice(TILEMAP_SN1_OFFSET, TILEMAP_SN1_OFFSET + TILEMAP_SIZE));
    const vramContent = fileContent.slice(VRAM_SN1_OFFSET, VRAM_SN1_OFFSET + VRAM_SIZE);
    const vramRawTiles = toTilesRaw(new Uint8Array(vramContent));

    const vramTilesOffset = find(vramRawTiles[0]);
    const mapLocations = find(tileMap);

    // ToDo: ask if multiple locations found...
    if (vramTilesOffset.length && mapLocations.length) {
      setVRAMTilesOffset(vramTilesOffset[0]);
      setVRAMMapOffset(mapLocations[0]);
    } else {
      unloadFile();
      useNotificationsStore.getState().addMessage('Could not find tiles and/or map in loaded file');
    }
  });
};
