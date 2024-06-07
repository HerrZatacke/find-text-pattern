import type { Context, PropsWithChildren } from 'react';
import React, { createContext, useMemo } from 'react';
import type { MapChar } from '../../../../../types/MapChar';
import { TILEMAP_SIZE, VRAM_SIZE } from '../../../../../constants/ram';
import useRomStore from '../../../stores/romStore';
import usePatchStore from '../../../stores/patchStore';
import { getPatchedChar } from '../../../../tools/getPatchedChar';
import { getPatchedRange } from '../../../../tools/getPatchedRange';
import { toTiles } from '../../../../tools/toTiles';
import { hexPadSimple } from '../../../../tools/hexPad';
import { useTileMap } from '../../../hooks/useTileMap';

export interface GlobalData {
  romContentArray: Uint8Array,
  patchedPage: MapChar[],
  patchedPageArray: number[],
  tileMap: number[],
  tileMapTiles: string[],
  vramTiles: string[],
  vramSize: number,
}

const defaultValue = {
  romContentArray: new Uint8Array([]),
  patchedPage: [],
  patchedPageArray: [],
  tileMap: [],
  tileMapTiles: [],
  vramTiles: [],
  vramSize: 0,
};

export const dataContext: Context<GlobalData> = createContext<GlobalData>(defaultValue);

function DataProvider({ children }: PropsWithChildren) {
  const { romContent, pageSize, romPage } = useRomStore();
  const { patches } = usePatchStore();
  const { tilesOffset, mapOffset } = useTileMap();

  const pageOffset = romPage * pageSize;

  const romContentArray = useMemo<Uint8Array>(() => new Uint8Array(romContent), [romContent]);

  const currentPageSize = useMemo<number>(() => {
    const bytesToEnd = romContentArray.length - pageOffset;
    if (bytesToEnd >= pageSize) { // not on last page
      return pageSize;
    }

    // last pagesize is remaining number of bytes and should not become negative by error
    return Math.max(0, bytesToEnd);
  }, [pageOffset, pageSize, romContentArray]);

  const patchedPage = useMemo<MapChar[]>(() => {
    const pageBuffer = [...new Array(currentPageSize)].fill(null);
    return (
      pageBuffer.reduce((acc: MapChar[], _, index: number): MapChar[] => (
        acc.concat(getPatchedChar(pageOffset + index, patches, romContentArray))
      ), [])
    );
  }, [pageOffset, currentPageSize, patches, romContentArray]);

  const patchedPageArray = useMemo<number[]>(() => (
    patchedPage.map((mapChar: MapChar): number => (mapChar.code))
  ), [patchedPage]);


  const vramContent = useMemo<Uint8Array>(() => {
    if (tilesOffset !== null) {
      return romContentArray.slice(tilesOffset, tilesOffset + VRAM_SIZE);
    }

    return new Uint8Array([]);
  }, [romContentArray, tilesOffset]);

  const tileMap = useMemo<number[]>(() => {
    if (mapOffset !== null) {
      return getPatchedRange(romContentArray, patches, mapOffset, TILEMAP_SIZE);
    }

    return [];
  }, [patches, romContentArray, mapOffset]);

  const vramTiles = useMemo<string[]>(() => (
    toTiles(new Uint8Array(vramContent))
  ), [vramContent]);

  const tileMapTiles = useMemo<string[]>(() => {
    if (tilesOffset === null) {
      return [];
    }

    return (
      tileMap.map((tileIndex) => {
        const mapOffset = tileIndex < 0x80 ? tileIndex + 0x100 : tileIndex;
        const totalOffset = (mapOffset * 0x10) + tilesOffset;
        return getPatchedRange(romContentArray, patches, totalOffset, 16)
          .map(((code) => hexPadSimple(code)))
          .join(' ');
      })
    );
  }, [patches, romContentArray, tileMap, tilesOffset]);

  const value = useMemo<GlobalData>(() => ({
    romContentArray,
    patchedPage,
    patchedPageArray,
    tileMap,
    tileMapTiles,
    vramTiles,
    vramSize: vramTiles.length,
  }), [patchedPage, patchedPageArray, romContentArray, tileMap, tileMapTiles, vramTiles]);

  return (
    <dataContext.Provider value={value}>
      {children}
    </dataContext.Provider>
  );
}

export default DataProvider;
