import React from 'react';
import './index.scss';
import { useVisual } from '../../hooks/useVisual';

function Visual() {
  const {
    showROMVisual,
    showRAMVisual,
    canvasRomRef,
    canvasVRamRef,
    canvasROMWidth,
    vramClick,
  } = useVisual();

  return (
    <div className="visual">
      { showROMVisual && (
        <div>
          <p className="visual__label">Current Page</p>
          <canvas ref={canvasRomRef} width={canvasROMWidth} />
        </div>
      )}
      { showRAMVisual && (
        <div>
          <p className="visual__label">VRAM</p>
          <canvas
            ref={canvasVRamRef}
            width={128}
            onClick={vramClick}
          />
        </div>
      )}
    </div>
  );
}

export default Visual;
