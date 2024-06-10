/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import type { UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';
import {
  Button,
  ButtonGroup,
  DialogContentText,
  FormControlLabel,
  InputAdornment,
  Stack, Switch,
  TextField,
  Typography,
} from '@mui/material';
import DoubleArrow from '@mui/icons-material/DoubleArrow';
import type { FuzzySearchResult } from '../../../../../workers/fuzzySearch.worker';
import type { ImportFormData } from '../types';
import useImportStore from '../../../../stores/importStore';
import { useDataContext } from '../../../../hooks/useDataContext';
import TilesDisplay from '../../../content/TilesDisplay';
import { useTilesFromTileMap } from '../../../../hooks/useTilesFromTileMap';

interface Props {
  tileMapOffsetField: UseFormRegisterReturn<'tileMapOffset'>,
  tileMapUseLowerVRAMField: UseFormRegisterReturn<'tileMapUseLowerVRAM'>,
  busy: boolean,
  findClosest: (term: Uint8Array) => Promise<FuzzySearchResult>,
  form: UseFormReturn<ImportFormData>,
}

function Step2({
  tileMapOffsetField,
  tileMapUseLowerVRAMField,
  busy,
  findClosest,
  form,
}: Props) {
  const { tileMap, fileName } = useImportStore();
  const { romContentArray } = useDataContext();
  const { tilesFromTileMap } = useTilesFromTileMap();

  const {
    setValue,
    watch,
    formState: {
      errors,
    },
  } = form;

  const vramOffsetFieldValue = watch('vramOffset');
  const vramOffset = vramOffsetFieldValue === '' || !!errors.vramOffset ? null : parseInt(vramOffsetFieldValue, 16);

  const tileMapOffsetFieldValue = watch('tileMapOffset');
  const tileMapOffset = tileMapOffsetFieldValue === '' || !!errors.tileMapOffset ? null : parseInt(tileMapOffsetFieldValue, 16);

  const useLowerVRAM = watch('tileMapUseLowerVRAM');

  const snapshotTileMapTiles = useMemo<string[]>(() => {
    if (!tileMap || vramOffset === null) {
      return [];
    }

    return tilesFromTileMap(tileMap, vramOffset, romContentArray, useLowerVRAM);
  }, [romContentArray, tileMap, tilesFromTileMap, useLowerVRAM, vramOffset]);

  const romContentTileMap = useMemo<string[]>(() => {
    if (tileMapOffset === null || vramOffset === null) {
      return [];
    }

    // For a preview mapping the addresses are loaded directly from the rom based on tileMapOffset
    // ToDo: maybe create a function to create such an initial mapping for further editing?
    const previewMapping = Array(32 * 32)
      .fill('')
      .map((_, index: number) => (romContentArray[tileMapOffset + index]));

    return tilesFromTileMap(previewMapping, vramOffset, romContentArray, useLowerVRAM);
  }, [romContentArray, tileMapOffset, tilesFromTileMap, useLowerVRAM, vramOffset]);

  return (
    <Stack direction="column" useFlexGap spacing={2}>
      <DialogContentText>
        { `How should the snapshot TileMap from "${fileName}" be matched against currently loaded ROM?` }
      </DialogContentText>
      <Stack direction="row" useFlexGap spacing={4} justifyContent="center" alignItems="center">
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
        <DoubleArrow />
        {
          romContentTileMap.length ? (
            <TilesDisplay
              zoom={1}
              tiles={romContentTileMap}
              tilesPerLine={32}
            />
          ) : (
            <Typography
              className="import-form__tilemap-preview"
              variant="body2"
              align="center"
            >
              {
                busy ?
                  'Searching ROM...' :
                  'Try to find the VRAM offset by searching for one of the options to the left.'
              }
            </Typography>
          )
        }
      </Stack>
      <FormControlLabel
        control={<Switch {...tileMapUseLowerVRAMField} />}
        label="Use lower part of VRAM for tiles"
        labelPlacement="end"
      />
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
