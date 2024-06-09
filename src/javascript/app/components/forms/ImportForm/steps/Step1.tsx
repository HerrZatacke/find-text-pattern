/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import type { UseFormRegisterReturn, UseFormReturn } from 'react-hook-form';
import { Button, ButtonGroup, DialogContentText, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import DoubleArrow from '@mui/icons-material/DoubleArrow';
import TilesDisplay from '../../../content/TilesDisplay';
import useImportStore from '../../../../stores/importStore';
import { useDataContext } from '../../../../hooks/useDataContext';
import { toTiles } from '../../../../../tools/toTiles';
import { VRAM_SIZE } from '../../../../../../constants/ram';
import type { FuzzySearchResult } from '../../../../../workers/fuzzySearch.worker';
import type { ImportFormData, VRAMButton } from '../types';


interface Props {
  vramOffsetField: UseFormRegisterReturn<'vramOffset'>
  busy: boolean,
  findClosest: (term: Uint8Array) => Promise<FuzzySearchResult>,
  form: UseFormReturn<ImportFormData>
}

function Step1({
  vramOffsetField,
  busy,
  findClosest,
  form,
}: Props) {
  const { vramContent, fileName } = useImportStore();
  const { romContentArray } = useDataContext();

  const vramButtons = useMemo<VRAMButton[]>(() => (
    vramContent?.length === 0x1800 ? [
      {
        title: '0x8000 - 0x87FF',
        vramPadding: 0,
        data: vramContent.subarray(0, 0x0800),
        tiles: toTiles(vramContent.subarray(0, 0x0800)),
      },
      {
        title: '0x8800 - 0x8FFF',
        vramPadding: 0x0800,
        data: vramContent.subarray(0x0800, 0x1000),
        tiles: toTiles(vramContent.subarray(0x0800, 0x1000)),
      },
      {
        title: '0x9000 - 0x97FF',
        vramPadding: 0x1000,
        data: vramContent.subarray(0x1000, 0x1800),
        tiles: toTiles(vramContent.subarray(0x1000, 0x1800)),
      },
    ] : []
  ), [vramContent]);

  const {
    setValue,
    watch,
    formState: {
      errors,
    },
  } = form;

  const vramOffsetFieldValue = watch('vramOffset');
  const vramOffset = vramOffsetFieldValue === '' || !!errors.vramOffset ? null : parseInt(vramOffsetFieldValue, 16);

  const romContentVRAMTiles = useMemo<string[]>(() => {
    if (vramOffset !== null) {
      const romContentVRAMContent = romContentArray.slice(vramOffset, vramOffset + VRAM_SIZE);
      return toTiles(new Uint8Array(romContentVRAMContent));
    }

    return [];
  }, [romContentArray, vramOffset]);

  return (
    <Stack direction="column" useFlexGap spacing={2}>
      <DialogContentText>
        { `Select which part of the snapshot VRAM from "${fileName}" should be matched against currently loaded ROM?` }
      </DialogContentText>
      <Stack direction="row" useFlexGap spacing={4} justifyContent="space-between" alignItems="center">
        <ButtonGroup orientation="vertical">
          {
            vramButtons.map(({ tiles, title, data, vramPadding }, index) => (
              <Button
                key={index}
                size="large"
                disabled={busy}
                onClick={async () => {
                  setValue('vramOffset', '', { shouldTouch: true, shouldValidate: true });
                  const { pos } = await findClosest(data);
                  setValue('vramOffset', (pos - vramPadding).toString(16), { shouldTouch: true, shouldValidate: true });
                  // trigger('vramOffset');
                }}
              >
                <Stack direction="column" useFlexGap spacing={1}>
                  <Typography variant="body2">
                    {title}
                  </Typography>
                  <TilesDisplay
                    zoom={1}
                    tiles={tiles}
                    tilesPerLine={16}
                  />
                </Stack>
              </Button>
            ))
          }
        </ButtonGroup>
        <DoubleArrow />
        {
          romContentVRAMTiles.length ? (
            <TilesDisplay
              zoom={2}
              tiles={romContentVRAMTiles}
              tilesPerLine={16}
            />
          ) : (
            <Typography
              className="import-form__vram-preview"
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
      <TextField
        {...vramOffsetField}
        margin="dense"
        label="VRAM Offset"
        fullWidth
        variant="standard"
        error={Boolean(!busy && errors.vramOffset)}
        helperText={!busy && errors.vramOffset?.message}
        InputProps={{
          startAdornment: <InputAdornment position="start">0x</InputAdornment>,
        }}
      />
    </Stack>
  );
}

export default Step1;
