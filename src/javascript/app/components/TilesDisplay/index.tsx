import React, { useEffect, useMemo, useRef } from 'react';
import type { CSSPropertiesVars, MouseEvent } from 'react';
import { Decoder } from 'gb-image-decoder';
import { ButtonBase } from '@mui/material';
import { decoderBaseOptions } from '../../../../constants/decoderBaseOptions';

import './index.scss';

interface Props {
  tiles: string[],
  tilesPerLine: number,
  onClick?: (ev: MouseEvent<HTMLButtonElement>) => void,
  zoom?: number,
}

function TilesDisplay({ tiles, tilesPerLine, onClick, zoom }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const decoder = useMemo<Decoder>(() => (
    new Decoder({ tilesPerLine })
  ), [tilesPerLine]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    // possibly update the canvas content after width has
    // been changed, which would cause it to become empty
    window.requestAnimationFrame(() => {
      decoder.update({
        ...decoderBaseOptions,
        canvas: canvasRef.current,
        tiles,
      });
    });
  }, [tiles, decoder, canvasRef]);

  const styles: CSSPropertiesVars = {
    '--canvas-width': `${tilesPerLine * 8 * (zoom || 1)}px`,
  };

  const canvas = (
    <canvas
      ref={canvasRef}
      width={tilesPerLine * 8}
      className="tiles-display__canvas"
    />
  );

  return onClick ? (
    <ButtonBase
      type="button"
      onClick={onClick}
      className="tiles-display"
      style={styles}
    >
      { canvas }
    </ButtonBase>
  ) : (
    <div
      className="tiles-display"
      style={styles}
    >
      { canvas }
    </div>
  );
}

export default TilesDisplay;
