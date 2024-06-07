import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, Typography } from '@mui/material';
import TilesDisplay from '../../content/TilesDisplay';
import Visual from '../../content/Visual';
import { usePatchedTilemap } from '../../../hooks/usePatchedTilemap';
import { hexPad } from '../../../../tools/hexPad';

function Tilemap() {

  const {
    vramTilesOffset,
    vramMapOffset,
    tileMapTiles,
    gotoLocation,
  } = usePatchedTilemap();

  const navigateTo = useNavigate();

  const goto = (location: number) => {
    navigateTo('/romview');
    gotoLocation(location);
  };

  return (
    <div className="grid__container">
      <div className="grid__col grid__col--6">
        <TilesDisplay
          tiles={tileMapTiles}
          tilesPerLine={32}
        />
      </div>
      <div className="grid__col grid__col--6 grid__col--content-end">
        <Stack direction="column" useFlexGap spacing={1}>
          <Visual showVRAM />
          { vramTilesOffset !== null && (
            <Typography variant="body2">
              { `VRAM Tiles start at 0x${hexPad(vramTilesOffset, 6)} (${vramTilesOffset})`}
              <Button
                onClick={() => goto(vramTilesOffset)}
              >
                Jump
              </Button>
            </Typography>
          ) }
          { vramMapOffset !== null && (
            <Typography variant="body2">
              { `TileMap starts at 0x${hexPad(vramMapOffset, 6)} (${vramMapOffset})`}
              <Button
                onClick={() => goto(vramMapOffset)}
              >
                Jump
              </Button>
            </Typography>
          ) }
        </Stack>
      </div>
    </div>
  );
}

export default Tilemap;
