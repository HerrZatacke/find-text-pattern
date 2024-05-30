import React, { useEffect, useMemo, useRef } from 'react';
import { Decoder } from 'gb-image-decoder';
import {
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import useRamStore from '../../stores/ramStore';
import useRomStore from '../../stores/romStore';
import { hexPadSimple } from '../../../tools/hexPad';
import useSettingsStore from '../../stores/settingsStore';
import { getPatchedChar } from '../../../tools/getPatchedChar';
import usePatchStore from '../../stores/patchStore';

function TileMap() {
  const { tileMap, vramTilesOffset } = useRamStore();
  const { romContent } = useRomStore();
  const { showMap, setShowMap } = useSettingsStore();
  const { patches } = usePatchStore();

  const tileMapTiles = useMemo<string[]>(() => {
    const romContentArray = new Uint8Array(romContent);
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

  const searchRef = useRef<HTMLCanvasElement>(null);
  const searchDecoder = useMemo<Decoder>(() => (new Decoder({ tilesPerLine: 32 })), []);
  useEffect(() => {
    window.requestAnimationFrame(() => {
      if (!searchRef.current || !showMap) {
        return;
      }

      searchDecoder.update({
        palette: ['#e0f8d0', '#88c070', '#346856', '#081820'],
        invertPalette: false,
        lockFrame: false,
        canvas: searchRef.current,
        tiles: tileMapTiles,
      });
    });
  }, [searchDecoder, tileMapTiles, showMap]);


  const cancel = () => {
    setShowMap(false);
  };

  return (
    <Dialog
      open={showMap}
      onClose={cancel}
    >
      <DialogTitle>Tilemap</DialogTitle>
      <DialogContent>
        <Stack direction="column" spacing={4}>
          <canvas
            width={256}
            height={256}
            ref={searchRef}
            style={{ border: '1px solid #666666' }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel}>Cancel</Button>
        <Button disabled>Apply</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TileMap;
