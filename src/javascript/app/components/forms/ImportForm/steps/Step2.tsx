/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import type { UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';
import { Button, ButtonGroup, DialogContentText, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import type { FuzzySearchResult } from '../../../../../workers/fuzzySearch.worker';
import type { ImportFormData } from '../types';
import useImportStore from '../../../../stores/importStore';
import { getPatchedRange } from '../../../../../tools/getPatchedRange';
import { hexPadSimple } from '../../../../../tools/hexPad';
import usePatchStore from '../../../../stores/patchStore';
import { useDataContext } from '../../../../hooks/useDataContext';
import TilesDisplay from '../../../content/TilesDisplay';

interface Props {
  tileMapOffsetField: UseFormRegisterReturn<'tileMapOffset'>
  busy: boolean,
  findClosest: (term: Uint8Array) => Promise<FuzzySearchResult>,
  form: UseFormReturn<ImportFormData>
}

function Step2({ tileMapOffsetField, busy, findClosest, form }: Props) {
  const { tileMap, fileName } = useImportStore();
  const { patches } = usePatchStore();
  const { romContentArray } = useDataContext();

  const {
    setValue,
    watch,
    formState: {
      errors,
    },
  } = form;

  const vramOffsetFieldValue = watch('vramOffset');
  const vramOffset = vramOffsetFieldValue === '' || !!errors.vramOffset ? null : parseInt(vramOffsetFieldValue, 16);

  const snapshotTileMapTiles = useMemo<string[]>(() => {
    if (!tileMap || !vramOffset) {
      return [];
    }

    return (
      [...tileMap].map((tileIndex) => {
        const offset = tileIndex < 0x80 ? tileIndex + 0x100 : tileIndex;
        const totalOffset = (offset * 0x10) + vramOffset;
        return getPatchedRange(romContentArray, patches, totalOffset, 16)
          .map(((code) => hexPadSimple(code)))
          .join(' ');
      })
    );
  }, [patches, romContentArray, tileMap, vramOffset]);

  return (
    <Stack direction="column" useFlexGap spacing={2}>
      <DialogContentText>
        { `How should the snapshot TileMap from "${fileName}" be matched against currently loaded ROM?` }
      </DialogContentText>
      <Stack direction="row" useFlexGap spacing={4} justifyContent="space-between" alignItems="center">
        <ButtonGroup orientation="vertical">
          <Button
            size="large"
            disabled={busy || !tileMap}
            onClick={async () => {
              if (!tileMap) {
                return;
              }

              setValue('tileMapOffset', '', { shouldTouch: true, shouldValidate: true });
              const { pos } = await findClosest(tileMap);
              setValue('tileMapOffset', pos.toString(16), { shouldTouch: true, shouldValidate: true });
            }}
          >
            <Stack direction="column" useFlexGap spacing={1}>
              <Typography variant="body2">
                Search for whole tilemap
              </Typography>
              <TilesDisplay
                zoom={1}
                tiles={snapshotTileMapTiles}
                tilesPerLine={32}
              />
            </Stack>
          </Button>

          <Button
            size="large"
            disabled={busy || !tileMap}
            onClick={async () => {
              if (!tileMap) {
                return;
              }

              setValue('tileMapOffset', '', { shouldTouch: true, shouldValidate: true });
              const { pos } = await findClosest(tileMap.subarray(0, 20));
              setValue('tileMapOffset', pos.toString(16), { shouldTouch: true, shouldValidate: true });
            }}
          >
            <Stack direction="column" useFlexGap spacing={1}>
              <Typography variant="body2">
                Search for first line of TileMap
              </Typography>
              <TilesDisplay
                zoom={1}
                tiles={snapshotTileMapTiles.slice(0, 20)}
                tilesPerLine={20}
              />
            </Stack>
          </Button>
        </ButtonGroup>

      </Stack>
      <TextField
        {...tileMapOffsetField}
        margin="dense"
        label="TileMap Offset"
        fullWidth
        variant="standard"
        error={Boolean(!busy && errors.tileMapOffset)}
        helperText={!busy && errors.tileMapOffset?.message}
        InputProps={{
          startAdornment: <InputAdornment position="start">0x</InputAdornment>,
        }}
      />
    </Stack>
  );
}

export default Step2;
