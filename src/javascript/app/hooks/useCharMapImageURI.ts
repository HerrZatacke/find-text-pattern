import { useEffect, useMemo, useState } from 'react';
import { Decoder, ExportFrameMode } from 'gb-image-decoder';
import useSettingsStore, { CharRender } from '../stores/settingsStore';
import { decoderBaseOptions } from '../../../constants/decoderBaseOptions';
import { useDataContext } from './useDataContext';
import { useTileMap } from './useTileMap';
import { useTilesFromTileMap } from './useTilesFromTileMap';

interface UseCharMapImageURI {
  charMapImageURI: string | null,
}

const charMapTileMap = Array(256)
  .fill('')
  .map((_, index: number) => index);

export const useCharMapImageURI = (): UseCharMapImageURI => {
  const [charMapImageURI, setCharMapImageURI] = useState<string | null>(null);

  const { tilesOffset, mapOffset, useLowerVRAM } = useTileMap();
  const { romContentArray } = useDataContext();
  const { setCharStyle } = useSettingsStore();
  const { tilesFromTileMap } = useTilesFromTileMap();

  const charMapTiles = useMemo<string[]>(() => {
    if (tilesOffset === null) {
      return [];
    }

    return tilesFromTileMap(charMapTileMap, tilesOffset, romContentArray, useLowerVRAM);
  }, [romContentArray, tilesFromTileMap, tilesOffset, useLowerVRAM]);

  useEffect(() => {
    if (!charMapTiles.length) {
      setCharMapImageURI(null);
      return;
    }

    const decoder = new Decoder({ tilesPerLine: 16 });

    decoder.update({
      ...decoderBaseOptions,
      canvas: null,
      tiles: charMapTiles,
    });

    const canvas = decoder.getScaledCanvas(1, ExportFrameMode.FRAMEMODE_KEEP);

    canvas.toBlob((blob) => {
      if (blob) {
        setCharMapImageURI(URL.createObjectURL(blob));
      }
    });
  }, [charMapTiles, romContentArray, tilesFromTileMap, tilesOffset]);

  useEffect(() => {
    if (tilesOffset === null || mapOffset === null) {
      setCharStyle(CharRender.HEX);
    }
  }, [setCharStyle, mapOffset, tilesOffset]);

  return { charMapImageURI };
};
