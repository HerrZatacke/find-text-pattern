import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createRandomId } from '../hooks/useRandomId';

export const NEW_TILEMAP = 'NEW_TILEMAP';

export interface PartialTileMap {
  title: string,
  width: number,
  height: number,
  internalMapping: number[],
  // internalVRAM: number[], // could be used for varying vram tiles
  vramOffset: number,
}

export interface TileMap extends PartialTileMap {
  id: string,
}

export interface TileMapsStoreState {
  tileMaps: TileMap[],
  activeMap: string | null,
  setActiveMap: (activeMap: string) => void,
  addTileMap: (tileMap: PartialTileMap) => void,
  updateTileMap: (tileMap: TileMap) => void,
  deleteTileMap: (tileMapId: string) => void,
}

const useTileMapsStore = create(
  persist<TileMapsStoreState>(
    (set, getState) => ({
      tileMaps: [],
      activeMap: null,

      setActiveMap: (activeMap: string) => {
        set({ activeMap });
      },

      addTileMap: (tileMap: PartialTileMap) => {
        const { tileMaps } = getState();

        const newTilemap: TileMap = {
          ...tileMap,
          id: createRandomId(),
        };

        set({
          tileMaps: [...tileMaps, newTilemap],
        });
      },

      updateTileMap: (updateTileMap: TileMap) => {
        const { tileMaps } = getState();
        const updateTileMaps = tileMaps.map((tileMap): TileMap => (
          tileMap.id === updateTileMap.id ? updateTileMap : tileMap
        ));

        set({
          tileMaps: updateTileMaps,
        });
      },

      deleteTileMap: (tileMapId: string) => {
        const { tileMaps } = getState();

        const filteredTileMaps = tileMaps.filter(({ id }) => (
          id !== tileMapId
        ));

        set({
          tileMaps: filteredTileMaps,
        });
      },

    }),
    {
      name: 'find-text-pattern-tilemaps',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useTileMapsStore;
