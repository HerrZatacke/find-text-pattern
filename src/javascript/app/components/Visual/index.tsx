import React from 'react';
import { useVisual } from '../../hooks/useVisual';

import './index.scss';

function Visual() {
  const {
    showSearchVisual,
    showROMVisual,
    showRAMVisual,
    searchRef,
    canvasRomRef,
    canvasVRamRef,
    canvasROMWidth,
    vramClick,
  } = useVisual();

  return (
    <div className="visual">
      { showSearchVisual && (
        <div>
          <p className="visual__label">Current Search</p>
          <canvas
            ref={searchRef}
            className="visual__search"
            width={8}
          />
        </div>
      )}
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
