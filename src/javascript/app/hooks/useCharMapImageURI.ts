import { useEffect, useState } from 'react';
import { Decoder, ExportFrameMode } from 'gb-image-decoder';
import usePatchStore from '../stores/patchStore';
import useSettingsStore, { CharRender } from '../stores/settingsStore';
import { getPatchedRange } from '../../tools/getPatchedRange';
import { hexPadSimple } from '../../tools/hexPad';
import { decoderBaseOptions } from '../../../constants/decoderBaseOptions';
import { useDataContext } from './useDataContext';
import { useTileMap } from './useTileMap';

interface UseCharMapImageURI {
  charMapImageURI: string | null,
}

export const useCharMapImageURI = (): UseCharMapImageURI => {
  const [charMapImageURI, setCharMapImageURI] = useState<string | null>(null);

  const { tilesOffset, mapOffset } = useTileMap();
  const { romContentArray } = useDataContext();
  const { patches } = usePatchStore();
  const { setCharStyle } = useSettingsStore();

  useEffect(() => {
    if (tilesOffset === null) {
      setCharMapImageURI(null);
      return;
    }

    const tiles = Array(256)
      .fill('')
      .map((_, index: number) => {
        const pageOffset = index < 0x80 ? index + 0x100 : index;
        const totalOffset = (pageOffset * 0x10) + tilesOffset;
        return getPatchedRange(romContentArray, patches, totalOffset, 16)
          .map(((code) => hexPadSimple(code)))
          .join(' ');
      });

    const decoder = new Decoder({ tilesPerLine: 16 });

    decoder.update({
      ...decoderBaseOptions,
      canvas: null,
      tiles,
    });

    const canvas = decoder.getScaledCanvas(1, ExportFrameMode.FRAMEMODE_KEEP);

    canvas.toBlob((blob) => {
      if (blob) {
        setCharMapImageURI(URL.createObjectURL(blob));
      }
    });
  }, [patches, romContentArray, tilesOffset]);

  useEffect(() => {
    if (tilesOffset === null || mapOffset === null) {
      setCharStyle(CharRender.HEX);
    }
  }, [setCharStyle, mapOffset, tilesOffset]);

  return { charMapImageURI };
};
