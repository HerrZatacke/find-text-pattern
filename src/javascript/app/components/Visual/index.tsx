import React, { useEffect, useMemo, useRef } from 'react';
import { Decoder } from 'gb-image-decoder';
import { usePatch } from '../../hooks/usePatch';
import useRamStore from '../../stores/ramStore';

import './index.scss';
import useGridStore from '../../stores/gridStore';
import { toTiles } from '../../../tools/toTiles';

const decoderBaseOptions = {
  palette: ['#dddddd', '#999999', '#666666', '#222222'],
  invertPalette: false,
  lockFrame: false,
};

function Visual() {
  const canvasRom = useRef<HTMLCanvasElement>(null);
  const canvasVRam = useRef<HTMLCanvasElement>(null);
  const { patchedPageArray } = usePatch();
  const { vramTiles } = useRamStore();

  const { gridRows, gridCols } = useGridStore();

  const romDecoder = useMemo<Decoder>(() => (new Decoder({ tilesPerLine: gridRows * gridCols })), [gridRows, gridCols]);
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
      tiles: vramTiles,
    });
  }, [vramTiles, ramDecoder, canvasVRam]);

  return (
    <div className="visual">
      { !patchedPageArray.length ? null : (
        <div>
          <p className="visual__label">Current Page</p>
          <canvas ref={canvasRom} width={gridRows * gridCols * 8} />
        </div>
      )}
      { !vramTiles.length ? null : (
        <div>
          <p className="visual__label">VRAM</p>
          <canvas ref={canvasVRam} width={128} />
        </div>
      )}
    </div>
  );
}

export default Visual;
