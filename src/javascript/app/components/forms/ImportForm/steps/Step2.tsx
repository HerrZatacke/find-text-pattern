/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo, useState } from 'react';
import type { UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';
import {
  Button,
  ButtonGroup,
  DialogContentText,
  FormControlLabel,
  InputAdornment, Slider,
  Stack, Switch,
  TextField,
  Typography,
} from '@mui/material';
import DoubleArrow from '@mui/icons-material/DoubleArrow';
import type { FuzzySearchResult } from '../../../../../workers/fuzzySearch.worker';
import type { ImportFormData } from '../types';
import type { ScreenCutOut } from '../../../../../tools/cropTileMap';
import useImportStore from '../../../../stores/importStore';
import TilesDisplay from '../../../content/TilesDisplay';
import { useDataContext } from '../../../../hooks/useDataContext';
import { useTilesFromTileMap } from '../../../../hooks/useTilesFromTileMap';
import { cropTileMap } from '../../../../../tools/cropTileMap';
import { numericToHexString } from '../../../../../tools/numericToHexString';

interface SliderData {
  min: number,
  max: number,
  key: keyof ScreenCutOut,
}

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

  const [screenCutOut, setScreenCutOut] = useState<ScreenCutOut>({
    xOffset: 0,
    yOffset: 0,
    width: 32,
    height: 18,
  });

  const screenCutOutSliders: SliderData[] = [
    { min: 0, max: 31, key: 'xOffset' },
    { min: 0, max: 31, key: 'yOffset' },
    { min: 1, max: 32, key: 'width' },
    { min: 1, max: 32, key: 'height' },
  ];

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

  const croppedTilemap = useMemo<number[]>(() => (
    tileMap ? cropTileMap(tileMap, screenCutOut) : []
  ), [screenCutOut, tileMap]);

  const snapshotTileMapTiles = useMemo<string[]>(() => {
    if (!tileMap || vramOffset === null) {
      return [];
    }

    return tilesFromTileMap(croppedTilemap, vramOffset, romContentArray, useLowerVRAM);
  }, [croppedTilemap, romContentArray, tileMap, tilesFromTileMap, useLowerVRAM, vramOffset]);

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
        <Stack direction="column" useFlexGap spacing={2}>
          {
            screenCutOutSliders.map(({ min, max, key }) => (
              <Slider
                key={key}
                min={min}
                max={max}
                step={1}
                value={screenCutOut[key]}
                disabled={busy || !tileMap}
                onChange={(_, value) => {
                  setScreenCutOut((currentValue) => ({
                    ...currentValue,
                    [key]: value as number,
                  }));
                }}
              />
            ))
          }
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
                  Search for TileMap
                </Typography>
                <TilesDisplay
                  zoom={1}
                  tiles={snapshotTileMapTiles}
                  tilesPerLine={screenCutOut.width}
                />
              </Stack>
            </Button>
          </ButtonGroup>
          {
            tileMap ? (
              <pre className="import-form__tiny-hextext">
                { numericToHexString(croppedTilemap, screenCutOut.width) }
              </pre>
            ) : null
          }
        </Stack>
        <DoubleArrow />
        {
          romContentTileMap.length ? (
            <TilesDisplay
              zoom={1}
              tiles={romContentTileMap}
              tilesPerLine={screenCutOut.width}
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
        control={(
          <Switch
            {...tileMapUseLowerVRAMField}
            disabled={busy || !tileMap}
          />
        )}
        label="Use lower part of VRAM for tiles"
        labelPlacement="end"
      />
      <TextField
        {...tileMapOffsetField}
        margin="dense"
        disabled={busy || !tileMap}
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
