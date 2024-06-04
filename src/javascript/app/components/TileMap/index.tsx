import React, { useMemo } from 'react';
import {
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { useRam } from '../../hooks/useRam';
import { useRom } from '../../hooks/useRom';
import { hexPad, hexPadSimple } from '../../../tools/hexPad';
import useSettingsStore from '../../stores/settingsStore';
import { getPatchedChar } from '../../../tools/getPatchedChar';
import usePatchStore from '../../stores/patchStore';
import TilesDisplay from '../TilesDisplay';

function TileMap() {
  const { tileMap, vramTilesOffset, vramMapOffset } = useRam();
  const { romContent, gotoLocation } = useRom();
  const { showMap, setShowMap } = useSettingsStore();
  const { patches } = usePatchStore();

  const tileMapTiles = useMemo<string[]>(() => {
    const romContentArray = new Uint8Array(romContent);
    if (vramTilesOffset === null) {
      return [];
    }

    return (
      tileMap.map((tileIndex) => {
        const mapOffset = tileIndex < 0x80 ? tileIndex + 0x100 : tileIndex;
        const totalOffset = (mapOffset * 0x10) + vramTilesOffset;
        const rc = Array(16)
          .fill(0)
          .map((_, offset) => {
            const patchedChar = getPatchedChar(totalOffset + offset, patches, romContentArray);
            return hexPadSimple(patchedChar.code);
          });

        return rc.join(' ');
      })
    );
  }, [patches, romContent, tileMap, vramTilesOffset]);

  const close = () => {
    setShowMap(false);
  };

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
