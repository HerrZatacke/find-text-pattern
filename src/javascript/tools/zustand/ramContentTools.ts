import useRamStore from '../../app/stores/ramStore';
import useRomStore from '../../app/stores/romStore';
import useSearchStore from '../../app/stores/searchStore';
import { toTilesRaw } from '../toTiles';
import usePatternStore from '../../app/stores/patternStore';
import { TILEMAP_SN1_OFFSET, VRAM_SIZE, VRAM_SN1_OFFSET } from '../../../constants/ram';

export const initRamContentTools = () => {
  useRamStore.subscribe((state, prevState) => {
    const fileContent = state.fileContent;

    if (!state.fileContent.byteLength || state.fileContent === prevState.fileContent) {
      return;
    }

    const find = useRomStore.getState().find;

    const tileMap = new Uint8Array(fileContent.slice(TILEMAP_SN1_OFFSET, TILEMAP_SN1_OFFSET + 1024));
    const vramContent = fileContent.slice(VRAM_SN1_OFFSET, VRAM_SN1_OFFSET + VRAM_SIZE);
    const vramRawTiles = toTilesRaw(new Uint8Array(vramContent));

    const vramTilesOffset = find(vramRawTiles[0]);

    // ToDo: ask if multiple locations found...
    if (vramTilesOffset.length) {
      state.setVRAMTilesOffset(vramTilesOffset[0]);
    }

    const locations = find(tileMap);

    if (locations.length) {
      usePatternStore.getState().setRawPattern(tileMap);
      useSearchStore.getState().setFound(locations);
    }
  });
};
