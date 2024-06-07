import { useEffect, useState } from 'react';
import { Decoder, ExportFrameMode } from 'gb-image-decoder';
import useRamStore from '../stores/ramStore';
import usePatchStore from '../stores/patchStore';
import useSettingsStore, { CharRender } from '../stores/settingsStore';
import { getPatchedRange } from '../../tools/getPatchedRange';
import { hexPadSimple } from '../../tools/hexPad';
import { decoderBaseOptions } from '../../../constants/decoderBaseOptions';
import { useDataContext } from './useDataContext';

interface UseCharMapImageURI {
  charMapImageURI: string | null,
}

export const useCharMapImageURI = (): UseCharMapImageURI => {
  const [charMapImageURI, setCharMapImageURI] = useState<string | null>(null);

  const { vramTilesOffset, vramMapOffset } = useRamStore();
  const { romContentArray } = useDataContext();
  const { patches } = usePatchStore();
  const { setCharStyle } = useSettingsStore();

  useEffect(() => {
    if (vramTilesOffset === null) {
      setCharMapImageURI(null);
      return;
    }

    const tiles = Array(256)
      .fill('')
      .map((_, index: number) => {
        const mapOffset = index < 0x80 ? index + 0x100 : index;
        const totalOffset = (mapOffset * 0x10) + vramTilesOffset;
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
  }, [patches, romContentArray, vramTilesOffset]);

  useEffect(() => {
    if (vramTilesOffset === null || vramMapOffset === null) {
      setCharStyle(CharRender.HEX);
    }
  }, [setCharStyle, vramMapOffset, vramTilesOffset]);

  return { charMapImageURI };
};
