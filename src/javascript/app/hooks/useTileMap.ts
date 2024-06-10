import { useMemo } from 'react';
import type { ChangeEvent } from 'react';
import { saveAs } from 'file-saver';
import useTileMapsStore from '../stores/tileMapsStore';
import type { TileMap } from '../stores/tileMapsStore';

interface UseTileMap {
  activeMapItem: TileMap | null,
  tilesOffset: number | null,
  useLowerVRAM: boolean,
  mapOffset: number | null,
  downloadTileMaps: () => void,
  onChangeTileMapFile: (ev: ChangeEvent<HTMLInputElement>) => Promise<void>,
}

export const useTileMap = (): UseTileMap => {
  const { tileMaps, activeMap, addTileMap } = useTileMapsStore();
  const activeMapItem = useMemo<TileMap | null>(() => (
    tileMaps.find(({ id }) => id === activeMap) || null
  ), [activeMap, tileMaps]);

  const tilesOffset = activeMapItem?.vramOffset || null;
  const mapOffset = activeMapItem?.internalMapping[0] || null;
  const useLowerVRAM = activeMapItem?.useLowerVRAM || false;

  const downloadTileMaps = () => {
    const tileMapsJson = JSON.stringify({ tileMaps }, null, 2);

    const blob = new Blob([tileMapsJson], {
      type: 'application/json',
    });

    saveAs(blob, 'tileMaps.json');
  };

  const onChangeTileMapFile = async (ev: ChangeEvent<HTMLInputElement>) => {
    const target = ev.target;

    if (!target.files || !target.files[0]) {
      return;
    }

    const file = target.files[0];
    const textDecoder = new TextDecoder();

    const rawText = textDecoder.decode(await file.arrayBuffer());
    try {
      const { tileMaps: importTileMaps } = JSON.parse(rawText || '{}');
      (importTileMaps as TileMap[]).forEach(addTileMap);
    } catch (error) {
      console.error(error);
      /* noop */
    }

    target.value = '';
  };


  return {
    activeMapItem,
    tilesOffset,
    mapOffset,
    useLowerVRAM,
    downloadTileMaps,
    onChangeTileMapFile,
  };
};
