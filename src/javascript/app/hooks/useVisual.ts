import { useEffect, useMemo, useRef } from 'react';
import type { MouseEvent, RefObject } from 'react';
import { Decoder } from 'gb-image-decoder';
import { usePatch } from './usePatch';
import useRamStore from '../stores/ramStore';
import useGridStore from '../stores/gridStore';
import { toTiles } from '../../tools/toTiles';
import usePatternStore from '../stores/patternStore';

const decoderBaseOptions = {
  palette: ['#dddddd', '#999999', '#666666', '#222222'],
  invertPalette: false,
  lockFrame: false,
};

interface UseVisual {
  showROMVisual: boolean,
  showRAMVisual: boolean,
  showSearchVisual: boolean,
  searchRef: RefObject<HTMLCanvasElement>,
  canvasRomRef: RefObject<HTMLCanvasElement>,
  canvasVRamRef: RefObject<HTMLCanvasElement>,
  canvasROMWidth: number,
  vramClick: (ev: MouseEvent<HTMLCanvasElement>) => void,
}

export const useVisual = (): UseVisual => {
  const searchRef = useRef<HTMLCanvasElement>(null);
  const canvasRomRef = useRef<HTMLCanvasElement>(null);
  const canvasVRamRef = useRef<HTMLCanvasElement>(null);
  const { patchedPageArray } = usePatch();
  const { vramTiles } = useRamStore();

  const { setHex, cleanHex, rawPattern } = usePatternStore();

  const { gridRows, gridCols } = useGridStore();

  const searchDecoder = useMemo<Decoder>(() => (new Decoder({ tilesPerLine: 1 })), []);
  const romDecoder = useMemo<Decoder>(() => (new Decoder({ tilesPerLine: gridRows * gridCols })), [gridRows, gridCols]);
  const ramDecoder = useMemo<Decoder>(() => (new Decoder({ tilesPerLine: 16 })), []);

  useEffect(() => {
    if (!searchRef.current) {
      return;
    }

    searchDecoder.update({
      ...decoderBaseOptions,
      canvas: searchRef.current,
      tiles: toTiles(rawPattern),
    });
  }, [rawPattern, searchDecoder, searchRef]);

  useEffect(() => {
    if (!canvasRomRef.current) {
      return;
    }

    romDecoder.update({
      ...decoderBaseOptions,
      canvas: canvasRomRef.current,
      tiles: toTiles(patchedPageArray),
    });
  }, [patchedPageArray, romDecoder, canvasRomRef]);

  useEffect(() => {
    if (!canvasVRamRef.current) {
      return;
    }

    ramDecoder.update({
      ...decoderBaseOptions,
      canvas: canvasVRamRef.current,
      tiles: vramTiles,
    });
  }, [vramTiles, ramDecoder, canvasVRamRef]);

  const vramClick = (ev: MouseEvent<HTMLCanvasElement>) => {
    const x = Math.floor((ev.nativeEvent.offsetX - 1) / 8);
    const y = Math.floor(ev.nativeEvent.offsetY / 8);
    const tileIndex = (y * 16) + x;
    setHex(vramTiles[tileIndex]);
    cleanHex();
  };

  const canvasROMWidth = gridRows * gridCols * 8;

  return {
    showROMVisual: Boolean(patchedPageArray.length),
    showRAMVisual: Boolean(vramTiles.length),
    showSearchVisual: Boolean(rawPattern.length),
    searchRef,
    canvasRomRef,
    canvasVRamRef,
    canvasROMWidth,
    vramClick,
  };
};
