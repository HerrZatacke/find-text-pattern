import React from 'react';
import {
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { hexPad } from '../../../tools/hexPad';
import useSettingsStore from '../../stores/settingsStore';
import TilesDisplay from '../TilesDisplay';
import { usePatchedTilemap } from '../../hooks/usePatchedTilemap';

function TileMap() {
  const { showMap, setShowMap } = useSettingsStore();

  const close = () => {
    setShowMap(false);
  };

  const {
    vramTilesOffset,
    vramMapOffset,
    tileMapTiles,
    gotoLocation,
  } = usePatchedTilemap();

  return (
    <Dialog
      open={showMap}
      onClose={close}
    >
      <DialogTitle>Tilemap</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={1}>
          <TilesDisplay
            zoom={2}
            tiles={tileMapTiles}
            tilesPerLine={32}
          />
          { vramTilesOffset && (
            <Typography variant="body2">
              { `VRAM Tiles start at 0x${hexPad(vramTilesOffset, 6)} (${vramTilesOffset})`}
              <Button
                onClick={() => gotoLocation(vramTilesOffset)}
              >
                Jump
              </Button>
            </Typography>
          ) }
          { vramMapOffset && (
            <Typography variant="body2">
              { `VRAM Map starts at 0x${hexPad(vramMapOffset, 6)} (${vramMapOffset})`}
              <Button
                onClick={() => gotoLocation(vramMapOffset)}
              >
                Jump
              </Button>
            </Typography>
          ) }
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={close}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TileMap;
