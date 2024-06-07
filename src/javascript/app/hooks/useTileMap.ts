import { useMemo } from 'react';
import { saveAs } from 'file-saver';
import useTileMapsStore from '../stores/tileMapsStore';
import type { TileMap } from '../stores/tileMapsStore';

interface UseTileMap {
  activeMapItem: TileMap | null,
  tilesOffset: number | null,
  mapOffset: number | null,
  downloadTileMaps: () => void,
}

export const useTileMap = (): UseTileMap => {
  const { tileMaps, activeMap } = useTileMapsStore();
  const activeMapItem = useMemo<TileMap | null>(() => (
    tileMaps.find(({ id }) => id === activeMap) || null
  ), [activeMap, tileMaps]);

  const tilesOffset = activeMapItem?.vramOffset || null;
  const mapOffset = activeMapItem?.internalMapping[0] || null;

  const downloadTileMaps = () => {
    const tileMapsJson = JSON.stringify({ tileMaps }, null, 2);

    const blob = new Blob([tileMapsJson], {
      type: 'application/json',
    });

    saveAs(blob, 'tileMaps.json');
  };

  return {
    activeMapItem,
    tilesOffset,
    mapOffset,
    downloadTileMaps,
  };
};
