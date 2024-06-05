import React from 'react';
import { useVisual } from '../../../hooks/useVisual';

import './index.scss';
import TilesDisplay from '../TilesDisplay';

interface Props {
  showVRAM?: boolean
}

function Visual({ showVRAM }: Props) {
  const {
    showSearchVisual,
    showROMVisual,
    showRAMVisual,
    searchTiles,
    romTiles,
    vramTiles,
    vramClick,
  } = useVisual();

  return (
    <div className="visual">
      { showSearchVisual && (
        <div className="visual__current-search">
          <p className="visual__label">Current Search</p>
          <TilesDisplay
            zoom={12}
            tiles={searchTiles}
            tilesPerLine={1}
          />
        </div>
      )}
      { showROMVisual && (
        <div>
          <p className="visual__label">Current Page</p>
          <TilesDisplay
            tiles={romTiles}
            tilesPerLine={16}
          />
        </div>
      )}
      { showRAMVisual && showVRAM && (
        <div>
          <p className="visual__label">VRAM</p>
          <TilesDisplay
            tiles={vramTiles}
            tilesPerLine={16}
            onClick={vramClick}
          />
        </div>
      )}
    </div>
  );
}

export default Visual;
