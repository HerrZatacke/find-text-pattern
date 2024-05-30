import React, { useEffect, useMemo, useRef } from 'react';
import { Decoder } from 'gb-image-decoder';
import chunk from 'chunk';
import { usePatch } from '../../hooks/usePatch';
import { hexPadSimple } from '../../../tools/hexPad';
import useRamStore from '../../stores/ramStore';

import './index.scss';

const toTiles = (data: Uint8Array | number[]): string[] => (
  [...chunk(data, 16)]
    .map((tile: number[]) => (
      [...tile].map((byte: number) => (
        hexPadSimple(byte, 2)
      )).join('')
    ))
);

const decoderBaseOptions = {
  palette: ['#dddddd', '#999999', '#666666', '#222222'],
  invertPalette: false,
  lockFrame: false,
};

function Visual() {
  const canvasRom = useRef<HTMLCanvasElement>(null);
  const canvasVRam = useRef<HTMLCanvasElement>(null);
  const { patchedPageArray } = usePatch();
  const { vramContent } = useRamStore();
  const romDecoder = useMemo<Decoder>(() => (new Decoder({ tilesPerLine: 32 })), []);
  const ramDecoder = useMemo<Decoder>(() => (new Decoder({ tilesPerLine: 16 })), []);

  useEffect(() => {
    if (!canvasRom.current) {
      return;
    }

    romDecoder.update({
      ...decoderBaseOptions,
      canvas: canvasRom.current,
      tiles: toTiles(patchedPageArray),
    });
  }, [patchedPageArray, romDecoder, canvasRom]);

  useEffect(() => {
    if (!canvasVRam.current) {
      return;
    }

    ramDecoder.update({
      ...decoderBaseOptions,
      canvas: canvasVRam.current,
      tiles: toTiles(new Uint8Array(vramContent)),
    });
  }, [vramContent, ramDecoder, canvasVRam]);

  return (
    <div className="visual">
      { !patchedPageArray.length ? null : (
        <div>
          <p className="visual__label">Current Page</p>
          <canvas ref={canvasRom} width={256} />
        </div>
      )}
      { !vramContent.byteLength ? null : (
        <div>
          <p className="visual__label">VRAM</p>
          <canvas ref={canvasVRam} width={128} />
        </div>
      )}
    </div>
  );
}

export default Visual;
